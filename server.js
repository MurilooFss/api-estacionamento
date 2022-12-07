import { getCars, insertCar, getCar, updateCar, deleteCar, finishTime } from "./controller/car.js"

import { getUser } from "./controller/estacionamento.js"

import express from 'express'
const app = express()
import cors from 'cors'
const port = '3000'

app.listen(port, () => console.log(`Server iniciado na porta ${port}`))

app.use(cors())
app.use(express.json())


app.route('/ativos').get(getCars)


app.route('/ativos/search').get(getCar)
app.route('/').post(insertCar)
app.route('/').put(updateCar)
app.route('/').delete(deleteCar)

app.route('/ativos').post(finishTime)

app.route('/user').get(getUser)


