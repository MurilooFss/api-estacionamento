import { openDb } from "../dbConfig.js";

export async function getCars(req, res) {
    openDb().then(async (db) => {
        const id_estacionamento = req.query.id_estacionamento
        const result = await db.all('select * from carros where finalizado is 0 and id_estacionamento is ?', [id_estacionamento])
        //console.log(result)
        const vagas = await db.get('select vagas from estacionamento where id_estacionamento is ?', [id_estacionamento])
        const estacionamento = {
            carros: result,
            vagas: vagas
        }
        res.json(estacionamento)

    })
}

export async function getCar(req, res) {
    openDb().then(async (db) => {

        const id = req.query.id_carro
        console.log(id)
        db.all('select * from carros where id_carro is ?', [id]).then(cars => res.json(cars))

    })
}
export async function insertCar(req, res) {
    let car = req.body
    openDb().then(db => {
        db.run('insert into carros(id_estacionamento, marca, modelo, cor, placa, tamanho, tipo, hora_entrada, finalizado, telefone) values(?,?,?,?,?,?,?,?,?,?)', [car.id_estacionamento, car.marca, car.modelo, car.cor, car.placa, car.tamanho, car.tipo, car.hora_entrada, car.finalizado, car.telefone])
    }).then(x => {
        res.json('cadastrado')
    })
}
export async function updateCar(req, res) {
    let carUpdate = req.body
    openDb().then(db => {
        db.run('update carros set marca=?, modelo=?, cor=?, placa=?, tamanho=?, tipo=? where id_carro=?', [carUpdate.marca, carUpdate.modelo, carUpdate.cor, carUpdate.placa, carUpdate.tamanho, carUpdate.tipo, carUpdate.id_carro])
    }).then(() => res.json('status ok'))

}
export async function deleteCar(req, res) {
    let carId = req.query.id_carro
    openDb().then(db => {
        db.run('delete from carros where id_carro is ?', [carId])
    }).then(() => res.json('status removido'))

}


export async function finishTime(req, res) {
    openDb().then(async (db) => {
        const date = new Date().getTime()
        const id_carro = req.body.id_carro
        const lavaRapido = req.body.lavagem
        const higi = req.body.hInterna
        const convenio = req.body.convenio
        const desconto = req.body.desconto
        let car = await db.get('select * from carros where id_carro is ?', [id_carro])
        const estacionamento = await db.get('select * from estacionamento where id_estacionamento is ?', [car.id_estacionamento])
        const sec = (date / 1000.0) - (Number(car.hora_entrada) / 1000.0)
        let tempoTotalHora = (Math.round((sec / 60 / 60) * 100) / 100)
        let valorTotal

        if (car.tamanho == 2) {
            if (estacionamento.hora1_carro_g == null)
                car.tamanho = 1
        }
        if (car.tamanho == 3) {
            if (estacionamento.hora1_moto == null)
                car.tamanho = 1
        }

        if (car.tamanho == 1) {

            //carro Pequeno
            if (tempoTotalHora < 0.5) {
                valorTotal = (estacionamento.hora1_carro_p / 2)
            } else if (tempoTotalHora < 1.01) {
                valorTotal = (estacionamento.hora1_carro_p)
            } else if (tempoTotalHora < 2.01) {
                valorTotal = (estacionamento.hora2_carro_p)
            }
            else if (tempoTotalHora < 3.01 && estacionamento.hora3_carro_p != null) {
                valorTotal = (estacionamento.hora3_carro_p)
            }
            else if (tempoTotalHora < 4.01 && estacionamento.hora4_carro_p != null) {
                valorTotal = (estacionamento.hora4_carro_p)
            }
            else {

                valorTotal = (estacionamento.hora1_carro_p * tempoTotalHora)
            }
        }
        else if (car.tamanho == 2) {
            console.log(car.tamanho)
            //carro grande
            if (tempoTotalHora < 0.5) {
                valorTotal = (estacionamento.hora1_carro_g / 2)
            } else if (tempoTotalHora < 1.01) {
                valorTotal = (estacionamento.hora1_carro_g)
            } else if (tempoTotalHora < 2.01) {
                valorTotal = (estacionamento.hora2_carro_g)
            }
            else if (tempoTotalHora < 3.01 && estacionamento.hora3_carro_g != null) {
                valorTotal = (estacionamento.hora3_carro_g)
            }
            else if (tempoTotalHora < 4.01 && estacionamento.hora4_carro_g != null) {
                valorTotal = (estacionamento.hora4_carro_g)
            }
            else {

                valorTotal = (estacionamento.hora1_carro_g * tempoTotalHora)
            }
        } else {
            console.log(car.tamanho)
            //moto
            if (tempoTotalHora < 0.5) {
                valorTotal = (estacionamento.hora1_moto / 2)
            } else if (tempoTotalHora < 1.01) {
                valorTotal = (estacionamento.hora1_moto)
            } else if (tempoTotalHora < 2.01) {
                valorTotal = (estacionamento.hora2_moto)
            }
            else if (tempoTotalHora < 3.01 && estacionamento.hora3_moto != null) {
                valorTotal = (estacionamento.hora3_moto)
            }
            else if (tempoTotalHora < 4.01 && estacionamento.hora4_moto != null) {
                valorTotal = (estacionamento.hora4_moto)
            }
            else {

                valorTotal = (estacionamento.hora1_moto * tempoTotalHora / 4)
            }
        }

        if (lavaRapido) {
            valorTotal = valorTotal + estacionamento.lava_rapido
        }
        if (higi) {
            valorTotal = valorTotal + estacionamento.higi_interna
        }

        if (convenio != 0) {
            const conv = await db.get('select desconto from convenio where id_estacionamento is ? and id_convenio is ?', [estacionamento.id_estacionamento, convenio])
            valorTotal = valorTotal - (valorTotal * conv.desconto)
        }
        if (desconto != 0) {
            valorTotal = valorTotal - (valorTotal * (desconto * 5 / 100))
        }
        const carUpdate = {
            id_carro: id_carro,
            hora_saida: date,
            finalizado: 1,
            lava_rapido: lavaRapido,
            higi_interna: higi,
            id_convenio: convenio,
            desconto: desconto,
            pagamento: req.body.payType,
            valor_total: valorTotal,
            tempo_total: tempoTotalHora
        }
        db.run('update carros set hora_saida=?, finalizado=?, lava_rapido=?, higi_interna=?, id_convenio=?, desconto=?, pagamento=?, valor_total=?, tempo_total=? where id_carro=?', [carUpdate.hora_saida, carUpdate.finalizado, carUpdate.lava_rapido, carUpdate.higi_interna, carUpdate.id_convenio, carUpdate.desconto, carUpdate.pagamento, carUpdate.valor_total, carUpdate.tempo_total, carUpdate.id_carro])

        res.json(carUpdate.valor_total)

    })
}