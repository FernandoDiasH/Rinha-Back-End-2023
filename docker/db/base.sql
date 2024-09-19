-- CREATE USER docker;
-- CREATE DATABASE docker;
-- GRANT ALL PRIVILEGES ON DATABASE docker TO docker;


-- Pessoa = {
--     apelido: "obrigatório, único, string de até 32 caracteres.",
--     nome: "obrigatório, string de até 100 caracteres.",
--     nascimento: "obrigatório, string para data no formato AAAA-MM-DD (ano, mês, dia).",
--     stack: "opcional, vetor de string com cada elemento sendo obrigatório e de até 32 caracteres."
-- }

-- cria os dicionarios para pesquisa
CREATE TEXT SEARCH DICTIONARY public.dict_simple_ptbr (
    TEMPLATE = pg_catalog.simple,
    STOPWORDS = portuguese,
    Accept = false
);

CREATE TEXT SEARCH DICTIONARY dict_thesaurus_ptbr (
  TEMPLATE = thesaurus, 
  DictFile = brazilian, 
  Dictionary = pg_catalog.portuguese_stem
);

CREATE TEXT SEARCH DICTIONARY dict_ispell_ptbr (
  TEMPLATE = ispell,
  DictFile = brazilian,
  AffFile = brazilian,
  StopWords = portuguese
);

CREATE TEXT SEARCH DICTIONARY dict_snowball_ptbr (
  TEMPLATE = snowball,
  Language = portuguese,
  StopWords = portuguese
);

-- extensions
CREATE EXTENSION unaccent;

-- cria o text search
CREATE TEXT SEARCH CONFIGURATION pessoa (copy=pg_catalog.portuguese);
ALTER TEXT SEARCH CONFIGURATION pessoa ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part
    WITH unaccent, dict_thesaurus_ptbr, portuguese_stem, dict_simple_ptbr, dict_ispell_ptbr, dict_snowball_ptbr;

    
CREATE TABLE pessoas (
    id TEXT UNIQUE NOT NULL,
    apelido VARCHAR(32) UNIQUE NOT NULL,
    nome VARCHAR(100) UNIQUE NOT NULL,
    nascimento DATE NOT NULL,
    stack VARCHAR(32)[],
    document TSVECTOR
);
CREATE INDEX idx_pessoas_document ON pessoas USING GIN(document);

-- procedures 
CREATE OR REPLACE FUNCTION update_pessoas_document() RETURNS trigger AS 
$$
BEGIN
  new.document := 
    setweight(to_tsvector('pessoa', unaccent(coalesce(new.nome, ''))), 'A') ||
    setweight(to_tsvector('pessoa', unaccent(coalesce(new.apelido, ''))), 'A') ||
    setweight(to_tsvector('pessoa', unaccent(coalesce(new.nascimento::text, ''))), 'B') || 
    setweight(to_tsvector('pessoa', unaccent(coalesce(new.stack::text, ''))), 'B') ;
  RETURN new;
END
$$ LANGUAGE plpgsql;
CREATE TRIGGER tg_update_pessoas_document BEFORE INSERT OR UPDATE ON pessoas FOR EACH ROW EXECUTE PROCEDURE update_pessoas_document();


-- functions 

CREATE OR REPLACE FUNCTION pessoa_tsquery(word text) RETURNS tsquery AS 
$$
BEGIN
  RETURN plainto_tsquery('pessoa', unaccent(trim(word)));
END
$$ LANGUAGE plpgsql;


-- data
INSERT INTO pessoas (id, nome, apelido, nascimento, stack) VALUES 
(gen_random_uuid(),'Fernando', 'badfer', '2000-08-11', '{node, js}'),
(gen_random_uuid (), 'Teste', 'teste12', '2000-12-11', null);
