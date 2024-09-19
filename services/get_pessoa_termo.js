export async function getPessoaTermo (request, reply){
        const client = await this.client
        if(!request.query.t){
            return reply.status(404).send("informe um termo")
        }
        let termo = request.query.t

        let { rows } = await client.query(`
            SELECT * FROM pessoas WHERE document @@ websearch_to_tsquery('pessoa', $1) limit 50`, 
            [termo]
        )
        return reply.status(200).send(rows)
}