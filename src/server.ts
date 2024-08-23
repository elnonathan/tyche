import express, { Express, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import body_parser from 'body-parser'

import 'dotenv/config'

import { router } from '@/router'
import { BufferedRequest } from '@/schema'

const name: string = String(process.env.NAME)
const host: string = String(process.env.HOST)
const port: string = String(process.env.PORT)

const app: Express = express()

app.use(
	// INJECT THE BUFFER AND ENCODING FOR HMAC VALIDATION (FOR META API)
	body_parser.json({
		verify: (
			request: BufferedRequest,
			_: Response,
			buffer: Buffer,
			encoding: string
		): void => {
			request.buffer = buffer
			request.encoding = encoding
		},
	})
)

app.use(cors())
app.use(helmet())
app.use(body_parser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(router)

app.listen(port, () => {
	console.log(`${name} @ ${host}:${port}`)
})
