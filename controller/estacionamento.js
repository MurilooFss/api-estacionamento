import { openDb } from "../dbConfig.js";

export async function getUser(req, res) {
    const email = req.query.email

    const password = req.query.password
    openDb().then(async db => {
        db.all('select * from user where email is ?', [email]).then(usr => {
            const user = usr[0]
            let resultado
            if (user == undefined) {

                resultado = false
                res.json(resultado)
            } else {
                if (user.senha != password) {
                    resultado = false
                    res.json(resultado)
                } else {
                    resultado = user
                    res.json(resultado)
                }

            }

        })
            .catch(e => { console.log(e) })
    })

}

export async function estacionamentoData(req, res) {
    const id_estacionamento = req.query.id_estacionamento
    openDb().then(async db => {
        db.get('select * from estacionamento where id_estacionamento is ?', [id_estacionamento]).then((r) => {
            res.send(r)
        })

    })


}
export async function alterEstacionamentoData(req, res) {
    const id_estacionamento = req.body.id_estacionamento
    const d = req.body

    for (const key in d) {
        if (d[key] == '') {
            d[key] = null
        }
    }


    openDb().then(async db => {
        db.run('update estacionamento set vagas = ?, hora1_carro_p = ?, hora2_carro_p = ?, hora3_carro_p = ?, hora4_carro_p = ?, hora1_carro_g = ?, hora2_carro_g = ?, hora3_carro_g = ?, hora4_carro_g = ?, hora1_moto = ?, hora2_moto = ?, hora3_moto = ?, hora4_moto = ?, valor_lava_rapido = ?, valor_higi_interna = ? where id_estacionamento is ? ', [d.vagas, d.hora1_carro_p, d.hora2_carro_p, d.hora3_carro_p, d.hora4_carro_p, d.hora1_carro_g, d.hora2_carro_g, d.hora3_carro_g, d.hora4_carro_g, d.hora1_moto, d.hora2_moto, d.hora3_moto, d.hora4_moto, d.valor_lava_rapido, d.valor_higi_interna, id_estacionamento]).then((r) => {
            res.sendStatus(200)
        })

    })


}