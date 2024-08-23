import { Request, Response } from 'express'
import ollama, { ChatResponse, Message } from 'ollama'

import {
	CLIENT,
	Credentials,
	MetaEventCustomer,
	MetaEventMessage,
} from '@/schema'
import {
	COMMON,
	HTTP_HEADERS_KEYS,
	HTTP_HEADERS_VALUES,
	HTTP_REQUEST_METHODS,
	HTTP_REQUEST_RESPONSE_CODES,
	LLM_MODEL,
	META_API_EVENTS,
	META_REQUEST_QUERIES,
	OLLAMA_CONTEXT_CONFIGURATION,
	OLLAMA_ROLES,
	SYSTEM_FEATURES,
} from '@/constants'
import { isValidVerifyRequest } from '@/tools/validations'

export const verifyWebhook = async (
	request: Request,
	response: Response,
	credentials: Credentials
): Promise<Response> => {
	const { query } = request

	if (!isValidVerifyRequest(query, credentials)) {
		return response.sendStatus(
			HTTP_REQUEST_RESPONSE_CODES.FORBIDDEN
		)
	}

	const challenge: string = String(
		query[META_REQUEST_QUERIES.HUB__CHALLENGE]
	)

	return response.status(HTTP_REQUEST_RESPONSE_CODES.OK).send(challenge)
}

export const chat = async (message: MetaEventMessage): Promise<string> => {
	const user_message: Message = {
		role: OLLAMA_ROLES.USER,
		content: message.text,
	}

	const response: ChatResponse = await ollama.chat({
		model: LLM_MODEL,
		messages: [
			...OLLAMA_CONTEXT_CONFIGURATION[SYSTEM_FEATURES.CHAT][
				OLLAMA_ROLES.ASSISTANT
			],
			user_message,
		],
	})

	return String(response?.message?.content)
}

export const triggerMetaEvent = (
	recipient: MetaEventCustomer,
	event: META_API_EVENTS
): void => {
	// https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions/
	if (!recipient || recipient.id.length < COMMON.ONE) return

	const messenger_host: string = `${String(process.env.META_GRAPH_HOST)}/me`
	const messenger_token: string = String(process.env.MESSENGER_TOKEN)
	const uri: string = `${messenger_host}/messages?access_token=${messenger_token}`

	fetch(uri, {
		method: HTTP_REQUEST_METHODS.POST,
		headers: {
			[HTTP_HEADERS_KEYS.CONTENT_TYPE]:
				HTTP_HEADERS_VALUES.APPLICATION_JSON,
		},
		body: JSON.stringify({
			recipient: { id: recipient.id },
			sender_action: event,
		}),
	}).then(() =>
		console.info(
			`[${recipient.id}] NOTIFY ${event} EVENT TO ${CLIENT.MESSENGER}`
		)
	)
}

export const sendAnswerToMeta = (
	recipient: MetaEventCustomer,
	answer: string
): void => {
	if (!recipient || recipient.id.length < COMMON.ONE) return

	const messenger_host: string = `${String(process.env.META_GRAPH_HOST)}/me`
	const messenger_token: string = String(process.env.MESSENGER_TOKEN)
	const uri: string = `${messenger_host}/messages?access_token=${messenger_token}`

	fetch(uri, {
		method: HTTP_REQUEST_METHODS.POST,
		headers: {
			[HTTP_HEADERS_KEYS.CONTENT_TYPE]:
				HTTP_HEADERS_VALUES.APPLICATION_JSON,
		},
		body: JSON.stringify({
			recipient: { id: recipient.id },
			message: { text: answer },
		}),
	}).then(() =>
		console.info(
			`[${recipient.id}] MESSAGE ANSWERED THROUGH ${CLIENT.MESSENGER}`
		)
	)
}
