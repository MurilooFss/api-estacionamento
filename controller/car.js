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
        console.log(req.session)

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
        db.run('update carros set marca=?, modelo=?, cor=?, placa=?, tamanho=?, tipo=?, telefone=? where id_carro=?', [carUpdate.marca, carUpdate.modelo, carUpdate.cor, carUpdate.placa, carUpdate.tamanho, carUpdate.tipo, carUpdate.telefone, carUpdate.id_carro])
    }).then(() => res.json('status ok'))

}
export async function deleteCar(req, res) {
    let carId = req.query.id_carro
    openDb().then(db => {
        db.run('delete from carros where id_carro is ?', [carId])
    }).then(() => res.json('status removido'))

}


export async function calculeTime(req, res) {
    console.log(req.body)
    openDb().then(async (db) => {
        const date = new Date().getTime()
        const id_carro = Number(req.body.id_carro)
        let lavagem = req.body.lavagem
        let hInterna = req.body.hInterna
        const convenio = Number(req.body.convenio)
        const desconto = Number(req.body.desconto)
        let car = await db.get('select * from carros where id_carro is ?', [id_carro])
        console.log(req.body)

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
            else if (tempoTotalHora < 5.01 && estacionamento.hora4_carro_p != null) {
                valorTotal = (estacionamento.hora4_carro_p) + estacionamento.hora1_carro_p * (tempoTotalHora - 4)
            }
            else {
                valorTotal = estacionamento.hora1_carro_p * tempoTotalHora
            }
        }
        else if (car.tamanho == 2) {

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
            else if (tempoTotalHora < 5.01 && estacionamento.hora4_carro_g != null) {
                valorTotal = (estacionamento.hora4_carro_g) + estacionamento.hora1_carro_g * (tempoTotalHora - 4)
            }
            else {

                valorTotal = (estacionamento.hora1_carro_g * tempoTotalHora)
            }
        } else {

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
            else if (tempoTotalHora < 5.01 && estacionamento.hora4_moto != null) {
                valorTotal = (estacionamento.hora4_moto) + estacionamento.hora1_moto * (tempoTotalHora - 4)
            }
            else {

                valorTotal = (estacionamento.hora1_moto * tempoTotalHora / 4)
            }
        }

        if (lavagem == 1) {
            valorTotal = valorTotal + Number(estacionamento.valor_lava_rapido)
        }
        if (hInterna == 1) {
            hInterna = 1
            valorTotal = valorTotal + estacionamento.higi_interna
        } else {
            hInterna = 0
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
            marca: car.marca,
            modelo: car.modelo,
            placa: car.placa,
            hora_entrada: car.hora_entrada,
            valor_total: valorTotal,
            hora_saida: date,
            finalizado: 1,
            lava_rapido: lavagem,
            higi_interna: hInterna,
            id_convenio: convenio,
            desconto: desconto,
            pagamento: Number(req.body.pagamento),
            tempo_total: tempoTotalHora
        }
        db.run('update carros set hora_saida=?, lava_rapido=?, higi_interna=?, id_convenio=?, desconto=?, pagamento=?, valor_total=?, tempo_total=? where id_carro=?', [carUpdate.hora_saida, carUpdate.lavagem, carUpdate.hInterna, carUpdate.id_convenio, carUpdate.desconto, carUpdate.pagamento, carUpdate.valor_total, carUpdate.tempo_total, carUpdate.id_carro])
        res.send(carUpdate)

    })
}

export async function finishTime(req, res) {
    const id_carro = req.body.id_carro
    openDb().then(async (db) => {
        db.run('update carros set finalizado = 1 where id_carro is ?', [id_carro])
        res.json('finalizado')
    })

}

export async function getHistory(req, res) {
    openDb().then(async (db) => {
        //console.log(req.query.id_estacionamento)
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        //console.log(date, day, month, year)
        db.all('select * from carros where id_estacionamento is ? and finalizado is 1 order by hora_saida desc', [req.query.id_estacionamento]).then((r) => {
            let result = r
            //console.log(result)
            const cars = []
            for (const iterator of result) {
                const dt = new Date(Number(iterator.hora_saida))
                const d = dt.getDate()
                const m = dt.getMonth()
                const y = dt.getFullYear()
                //console.log(iterator.hora_saida)
                //console.log(Number(iterator.hora_saida))
                //console.log(dt, d)
                if (d == day && m == month && y == year) {
                    //console.log('push')
                    cars.push(iterator)

                }
            }
            res.send(cars)
        })

    })
}
export async function getDetails(req, res) {
    openDb().then(async (db) => {
        console.log('detalhes')
        db.get('select * from carros where id_carro is ?', [req.query.id_carro]).then((r) => {
            res.send(r)
        })

    })
}
export async function reOpen(req, res) {
    openDb().then(async (db) => {
        console.log('reOpen')
        db.run('update carros set finalizado = 0 where id_carro is ?', [req.body.id_carro])
    })
}