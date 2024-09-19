import { randomUUID } from 'crypto';
import { formatISO } from 'date-fns';

/**
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
export const schemaCreatePessoa = {
    schema:{
        body:{
            type:"object",
            required: ["apelido", "nome", "nascimento"],
            properties:{
                apelido:{type:'string'},
                nome:{type:"string"},
                nascimento:{type:"string", nullable: false},
                stack:{type:"array", items:{type:"string"}}
            } 
        }
    }
}

export async function addPessoa (request, reply){
    const client = await this.client
    let { apelido, nome, nascimento, stack  } = request.body
    let uuid = randomUUID()
    let validaStack = []

    let validaApelido = apelido && apelido.length < 32 && nome.trim().length > 0 && /[^0-9]+$/.test(nome)
    let validaNome = nome && nome.length < 100 && nome.trim().length > 0 && /[^0-9]+$/.test(nome)
    
    if(!validaApelido || !validaNome || !nascimento){
        return reply.status(422).send('campos invalidos')
    }

    let {rows} = await client.query("SELECT id FROM pessoas WHERE nome = $1 OR apelido = $2", [nome, apelido] )
    
    if(rows.length > 0){
        return reply.status(422).send('pessoa cadastrada')
    }

    let validaNascimento = formatISO(nascimento, {representation:'date'})

    if(!validaNascimento ){
        return reply.status(400).send('data de nascimento invalida')
    }

    if(Array.isArray(stack)){
        console.log(stack)
        validaStack = stack.filter(linguagem => !isNaN(linguagem) || linguagem.length > 32)
    }

    if(validaStack.length > 0){
        return reply.status(400).send('linguagem precisa conter apenas string')
    }

    try {
        client.query(
            "INSERT INTO pessoas (id, apelido, nome, nascimento, stack) VALUES ($1, $2, $3, $4, $5)",
            [uuid, apelido, nome, validaNascimento, stack]
        )

        return reply
            .header('location', "/pessoas/" + uuid)
            .status(201)
            .send(request.body)   
    } catch (error) {
        return reply.status(422).send()
    }
}