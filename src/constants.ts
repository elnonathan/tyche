import { Message } from 'ollama'

export enum META_REQUEST_QUERIES {
	HUB__MODE = 'hub.mode',
	HUB__VERIFY_TOKEN = 'hub.verify_token',
	HUB__CHALLENGE = 'hub.challenge',
}

export enum META_REQUEST_HEADERS {
	X_HUB__SIGNATURE = 'x-hub-signature',
}

export enum META_REQUEST_BODY {
	OBJECT = 'object',
}

export enum META_BUFFERED_REQUEST_EVENT_PROPERTIES {
	SENDER = 'sender',
}

export const META_REQUEST_QUERY_VALUES = {
	[META_REQUEST_QUERIES.HUB__MODE]: 'subscribe',
} as const

export const META_REQUEST_BODY_VALUES = {
	[META_REQUEST_BODY.OBJECT]: 'page',
} as const

export enum HTTP_REQUEST_METHODS {
	GET = 'GET',
	POST = 'POST',
}

export enum HTTP_REQUEST_RESPONSE_CODES {
	FORBIDDEN = 403,
	BAD_REQUEST = 400,
	OK = 200,
}

export enum HTTP_HEADERS_KEYS {
	ACCEPT = 'Accept',
	CONTENT_TYPE = 'Content-Type',
	AUTHORIZATION = 'Authorization',
}

export enum HTTP_HEADERS_VALUES {
	APPLICATION_JSON = 'application/json',
	APPLICATION_YAML = 'application/x-yaml',
}

export enum META_API_EVENTS {
	MARK_SEEN = 'mark_seen',
	TYPING_ON = 'typing_on',
	TYPING_OFF = 'typing_off',
}

export enum CRYPTO {
	ENCODING = 'hex',
}

export enum COMMON {
	EQUALS = '=',
	COMMA = ',',
	ZERO = 0,
	ONE = 1,
}

export const LLM_MODEL: string = 'tyche' as const

export enum OLLAMA_ROLES {
	// USUALLY THE FIRST MESSAGE, SETS THE TONE AND BOUNDARIES OF THE CONVERSATION
	SYSTEM = 'system',
	// MESSAGES SENT TO OLLAMA BY THE USER
	USER = 'user',
	// MESSAGES SENT TO THE USER BY OLLAMA (ALSO CAN BE USED TO SIMULATE PREVIOUS OLLAMA MESSAGES TO GUIDE THE CONVERSATION)
	ASSISTANT = 'assistant',
}

export enum SYSTEM_FEATURES {
	CHAT,
}

export type CONTEXT = {
	[key in SYSTEM_FEATURES]: {
		[OLLAMA_ROLES.SYSTEM]?: Message
		[OLLAMA_ROLES.ASSISTANT]: Message[]
		[OLLAMA_ROLES.USER]?: Message[]
	}
}

export const OLLAMA_CONTEXT_CONFIGURATION: CONTEXT = {
	[SYSTEM_FEATURES.CHAT]: {
		[OLLAMA_ROLES.ASSISTANT]: [
			{
				role: OLLAMA_ROLES.ASSISTANT,
				content: 'Ella te proporcionaría una liga de google meet',
			},
			{
				role: OLLAMA_ROLES.ASSISTANT,
				content: 'En tu primer sesión ella escucharía tu situación y juntos determinarían si ella es la especialista adecuada para ti',
			},
			{
				role: OLLAMA_ROLES.ASSISTANT,
				content: 'Ella te explicaría la forma de trabajo, es decir, haría un encuadre de cómo sería tu proceso terapéutico',
			},
			{
				role: OLLAMA_ROLES.ASSISTANT,
				content: 'El enfoque con el que ella trabaja es Psicoanálisis, por lo que no seria un proceso breve y no hay un número determinado de sesiones',
			},
			{
				role: OLLAMA_ROLES.ASSISTANT,
				content: 'El propósito de la psicoterapia psicoanalítica es entender de donde viene tu malestar, y en algunos casos tiene relación con eventos muy arraigados',
			},
			{
				role: OLLAMA_ROLES.ASSISTANT,
				content: 'Es importante que te encuentres en un lugar donde tengas privacidad, y donde puedas expresarte sin preocupación. Esto para que tu sesión sea lo mas cómoda posible',
			},
		],
	},
} as const
