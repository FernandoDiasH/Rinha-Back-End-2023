import { fastifyPostgres } from "@fastify/postgres"

export default async function dbConector (fastify, options) {
    const dbUser = process.env.DB_USER
    const dbHost = process.env.DB_HOST
    const dbPassword = process.env.DB_PASSWORD
    const dbDatabase = process.env.DB_DATABASE
    const dbPort = process.env.DB_PORT
    console.log(dbUser);
    fastify.register(
        fastifyPostgres, 
        {
            connectionString: `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`
        }
    )
}
