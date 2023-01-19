import { openDb } from "../dbConfig.js";

export async function convData(req, res) {
    const id_estacionamento = req.query.id_estacionamento
    openDb().then(async db => {
        db.all('select * from convenio where id_estacionamento is ?', [id_estacionamento]).then((r) => {
            res.send(r)
        })

    })
}
export async function addConv(req, res) {
    const data = req.body
    openDb().then(async db => {
        console.log(data)
        db.run('insert into convenio (id_estacionamento, empresa_convenio, desconto) values (?,?,?)', [data.id_estacionamento, data.empresa_convenio, data.desconto]).then((r) => {
            res.send(r)
        })

    })
}