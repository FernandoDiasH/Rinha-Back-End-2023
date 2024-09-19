import { addPessoa, schemaCreatePessoa } from "./services/add_pessoa.js"
import { getPessoaId } from "./services/get_pessoa.js"
import { getPessoaTermo } from "./services/get_pessoa_termo.js"
import { contagemPessoas } from "./services/contagem_pessoas.js"
import { helloWorld } from "./services/hello-world.js"

export default async function routes(fastify, options) {
    fastify.decorate('client', fastify.pg.connect())
    
    
    fastify.get('/', helloWorld)
    fastify.post("/pessoas", schemaCreatePessoa, addPessoa)
    fastify.get("/pessoas/:id", getPessoaId)
    fastify.get("/pessoas", getPessoaTermo)
    fastify.get("/contagem-pessoas", contagemPessoas)
}