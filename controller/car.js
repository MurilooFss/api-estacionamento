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
        const id_estacionamento = req.body.id_estacionamento
        const id_carro = req.body.id_carro
        const estacionamento = await db.get('select * from estacionamento where id_estacionamento is ?', [id_estacionamento])
        // const valorHora1 = hora1.valor_hora_1
        // const hora2 = await db.get('select valor_hora_2 from estacionamento where id_estacionamento is ?', [id_estacionamento])
        // const valorHora2 = hora1.valor_hora_2
        // const hora3 = await db.get('select valor_hora_3 from estacionamento where id_estacionamento is ?', [id_estacionamento])
        // const valorHora3 = hora3.valor_hora_1
        let car = await db.get('select * from carros where id_carro is ?', [id_carro])
        // res.json(car)
        const sec = (date / 1000.0) - (Number(car.hora_entrada) / 1000.0)
        let tempoTotalHora = (Math.round((sec / 60 / 60) * 100) / 100)
        let valorTotal
        console.log(car.tamanho)
        if (car.tamanho == 1) {
            console.log(car.tamanho)
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
                console.log('aqui')
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
                console.log('aqui')
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
                console.log('aqui moto')
                valorTotal = (estacionamento.hora1_moto * tempoTotalHora / 4)
            }
        }

        console.log(valorTotal)
        res.json(tempoTotalHora)

    })
}