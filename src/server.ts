import express, { Express } from 'express'
import cors from 'cors'
import body_parser from 'body-parser'
import 'dotenv/config'
import { router } from '@/router'

const name: string = String(process.env.NAME)
const host: string = String(process.env.HOST)
const port: string = String(process.env.PORT)

const app: Express = express()

app.use(body_parser.json())
app.use(cors())
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(router)

app.listen(port, () => {
	console.log(`${name} @ ${host}:${port}`)
})
