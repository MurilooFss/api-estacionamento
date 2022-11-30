import { openDb } from "../dbConfig.js";

export async function getCars(req, res) {
    openDb().then(async (db) => {
        db.all('select * from carros where finalizado is 0').then(cars => res.json(cars))

    })
}

export async function getCar(req, res) {
    openDb().then(async (db) => {

        const id = req.query.id_carro

        db.all('select * from carros where id_carro is ?', [id]).then(cars => res.json(cars))

    })
}
export async function insertCar(req, res) {
    let car = req.body
    openDb().then(db => {
        db.run('insert into carros(id_estacionamento, marca, modelo, cor, placa, tamanho, tipo, hora_entrada, finalizado) values(?,?,?,?,?,?,?,?,?)', [car.id_estacionamento, car.marca, car.modelo, car.cor, car.placa, car.tamanho, car.tipo, car.hora_entrada, car.finalizado])
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
