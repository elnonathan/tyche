import { Request, Response } from 'express'
import {
	BufferedRequest,
	CLIENT,
	Controller,
	Credentials,
	MetaEvent,
} from '@/schema'
import { HTTP_REQUEST_RESPONSE_CODES, META_API_EVENTS } from '@/constants'
import {
	chat,
	sendAnswerToMeta,
	triggerMetaEvent,
	verifyWebhook,
} from '@/tools/helpers'
import { getConsumeRequestErrorCode } from '@/tools/validations'
import { getMetaEvent } from '@/tools/utils'

const credentials: Credentials = {
	verify: String(process.env.MESSENGER_VERIFY),
	secret: String(process.env.MESSENGER_SECRET),
}

const name: CLIENT = CLIENT.MESSENGER

const verify = (request: Request, response: Response): Promise<Response> =>
	verifyWebhook(request, response, credentials)

const consume = async (
	request: BufferedRequest,
	response: Response
): Promise<void> => {
	const error_code: HTTP_REQUEST_RESPONSE_CODES | null =
		getConsumeRequestErrorCode(request, credentials)

	if (error_code) {
		response.sendStatus(error_code)
		return
	}

	const { message, sender }: MetaEvent = getMetaEvent(request)
	triggerMetaEvent(sender, META_API_EVENTS.MARK_SEEN)

	if (!message) {
		response.sendStatus(HTTP_REQUEST_RESPONSE_CODES.BAD_REQUEST)
		return
	}

	response.status(HTTP_REQUEST_RESPONSE_CODES.OK).send(message.text)
	triggerMetaEvent(sender, META_API_EVENTS.TYPING_ON)

	console.log('\x1b[44m', '- User:', message.text)
	const answer: string = await chat(message)
	console.log('\x1b[47m', '- Tyché:', answer, '\n')

	triggerMetaEvent(sender, META_API_EVENTS.TYPING_OFF)
	sendAnswerToMeta(sender, answer)
}

const controller: Controller = { name, verify, consume }

export default controller
