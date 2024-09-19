import Fastify from "fastify";
import routes from "./route.js";
import dbConector from './services/db_services.js'
import fastifyPlugin from "fastify-plugin";

const createServer = () => {
    const server = Fastify({
        logger:false
    })
    
    server.register(fastifyPlugin(dbConector))
    server.register(fastifyPlugin(routes))
    
    server.setErrorHandler((error, request, reply)=>{
        if(error.validation){
            return reply.status(400).send(error.validation[0].message)
        }
        console.log(error.message)
        return reply.status(422).send(error.message)
    })
    
    server.listen({port:3000, host:"0.0.0.0"}, err => {
        if(err){
            console.log(err)
            return
        }
        console.log("Servidor rodando na porta 3000")
    })
}

try {
    createServer()
} catch (error) {
    console.log(error)
    process.exit(1)
}
