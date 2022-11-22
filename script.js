const url = 'http://localhost:3000/'

function getCars(url) {
    axios.get(url)
        .then((response) => {
            resultGet.innerText = JSON.stringify(response.data)
        })
        .catch((e) => console.log(e))
}

function insertCars(carPost, url) {
    axios.post(url, carPost)
        .then((response) => {
            resultPost.innerText = JSON.stringify(response.data)
        })
        .catch((e) => console.log(e))
}
function updateCars(url, carUpdate, id) {
    axios.put(`${url}${id}`, carUpdate)
        .then((response) => {
            resultPut.innerText = JSON.stringify(response.data)
        })
        .catch((e) => console.log(e))
}

const carUpdate = {
    marca: "Honda",
    modelo: "City",
    cor: "Azul",
    placa: "SFD4555",
    horaEntrada: "13:55"
}

const carPost = {
    marca: "Honda",
    modelo: "Civic",
    cor: "Cinza",
    placa: "APK4D88",
    horaEntrada: "10:45"
}

// updateCars(url, carUpdate, 2)
insertCars(carPost, url)
getCars(url)