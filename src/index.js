import connectDb from "./db/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";
dotenv.config({
    path: './.env'
})

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(` Server listening at port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`DB CONNECTION FAILED ${err}`);
    })