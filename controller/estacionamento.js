import { openDb } from "../dbConfig.js";

export async function getUser(req, res) {
    const email = req.query.email

    const password = req.query.senha
    openDb().then(db => {
        db.all('select * from user where email is ?', [email]).then(usr => {
            const user = usr[0]
            let resultado
            if (user == undefined) {

                resultado = false
                console.log(resultado)
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