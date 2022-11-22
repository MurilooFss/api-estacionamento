const express = require('express')
const app = express()
const cors = require('cors')
const port = '3000'

app.listen(port, () => console.log(`Server iniciado na porta ${port}`))

app.use(cors())
app.use(express.json())

let cars = [{
    id: "",
    marca: "",
    modelo: "",
    cor: "",
    placa: "",
    horaEntrada: "",
    tipoCobranca: "",
    tamanhoCarro: ""
}]

app.route('/').get((req, res) => {
    res.send(cars)
})
app.route('/:id').get((req, res) => {
    const carId = req.params.id

    const car = cars.find(car => Number(car.id) === Number(carId))

    if (!car) {
        return res.json('Car not Found')
    }

    res.json(car)


})
app.route('/').post((req, res) => {
    const lastId = Number(cars[cars.length - 1].id)
    cars.push({
        id: lastId + 1,
        marca: req.body.marca,
        modelo: req.body.modelo,
        cor: req.body.cor,
        placa: req.body.placa,
        horaEntrada: req.body.horaEntrada,
        tipoCobranca: req.body.tipoCobranca,
        tamanhoCarro: req.body.tamanhoCarro
    })
    res.json('Carro Cadastrado')

})
app.route('/:id').put((req, res) => {
    const carId = req.params.id

    const car = cars.find(carUp => Number(carUp.id) === Number(carId))

    if (!car) {
        return res.json('Car not found!')
    }

    const updatedCar = {
        ...car,
        marca: req.body.marca,
        modelo: req.body.modelo,
        cor: req.body.cor,
        placa: req.body.placa,
        horaEntrada: req.body.horaEntrada,
        tipoCobranca: req.body.tipoCobranca,
        tamanhoCarro: req.body.tamanhoCarro
    }

    cars = cars.map(car => {
        if (Number(car.id) === Number(carId)) {
            car = updatedCar
        }
        return car
    })
    res.json("Updated car")
})
app.route('/:id').delete((req, res) => {
    const carId = req.params.id
    const car = cars.find(carUp => Number(carUp.id) === Number(carId))

    if (!car) {
        return res.json('Car not found!')
    }
    cars = cars.filter(car => Number(car.id) !== Number(carId))
    res.json('Deleted Car')
})

