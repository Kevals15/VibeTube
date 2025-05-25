import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) // Usage of whitelisting urls from this origin

app.use(express.json({ limit: "16kb" }))//convert data into json
app.use(express.urlencoded({ limit: "16kb", extended: true })) //for taking data from url
app.use(express.static('public')) // All assests are puting inside public folder it served static folder 
app.use(cookieParser())
export { app }