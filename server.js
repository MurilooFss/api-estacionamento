import { getCars, insertCar, getCar, updateCar, calculeTime, deleteCar, finishTime, getHistory, getDetails, reOpen } from "./controller/car.js"

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

app.route('/ativos').put(calculeTime)
app.route('/ativos/finish').put(finishTime)

app.route('/user').get(getUser)

app.route('/historico').get(getHistory)
app.route('/historico/detalhes').get(getDetails)
app.route('/historico/detalhes').put(reOpen)