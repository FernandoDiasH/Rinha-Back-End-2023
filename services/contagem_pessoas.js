export async function contagemPessoas (request, reply){
        const client = await this.client
        let {rows} = await client.query("SELECT count(*) FROM pessoas")
        return reply.status(200).send(rows[0].count)
}