export async function getPessoaId (request, reply){
    const client = await this.client
    let uuid = request.params.id
    let { rows } = await client.query("SELECT * FROM pessoas where id = $1", [uuid])
    if(rows.length > 0){
        return reply.status(200).send(rows[0])
    }
    return reply.status(404).send()
}