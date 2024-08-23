import { ParsedQs } from 'qs'
import * as crypto from 'crypto'
import { CharacterEncoding, Hmac } from 'crypto'
import { BufferedRequest, Credentials } from '@/schema'
import {
	COMMON,
	CRYPTO,
	HTTP_REQUEST_RESPONSE_CODES,
	META_BUFFERED_REQUEST_EVENT_PROPERTIES,
	META_REQUEST_BODY,
	META_REQUEST_BODY_VALUES,
	META_REQUEST_HEADERS,
	META_REQUEST_QUERIES,
	META_REQUEST_QUERY_VALUES,
} from '@/constants'

const isSubscribeRequest = (query: ParsedQs): boolean =>
	String(query[META_REQUEST_QUERIES.HUB__MODE]) ===
	String(META_REQUEST_QUERY_VALUES[META_REQUEST_QUERIES.HUB__MODE])

const isValidVerifyToken = (
	query: ParsedQs,
	credentials: Credentials
): boolean =>
	String(query[META_REQUEST_QUERIES.HUB__VERIFY_TOKEN]) ===
	credentials.verify

export const isSecureRequest = (
	request: BufferedRequest,
	credentials: Credentials
): boolean => {
	const { headers, encoding, buffer } = request
	const [algorithm, signature] = String(
		headers[META_REQUEST_HEADERS.X_HUB__SIGNATURE]
	).split(COMMON.EQUALS)

	const { secret } = credentials
	const character_encoding: CharacterEncoding =
		encoding as CharacterEncoding

	const hmac: Hmac = crypto.createHmac(String(algorithm), secret)
	hmac.update(String(buffer), character_encoding)
	const hash: string = hmac.digest(CRYPTO.ENCODING)

	// IF NEVER MATCHES PLEASE CHECK TOKEN AND SECRET ARE CORRECTLY SET
	return signature === hash
}

export const isPageRequest = ({ body }: BufferedRequest): boolean =>
	String(body[META_REQUEST_BODY.OBJECT]) ===
	META_REQUEST_BODY_VALUES[META_REQUEST_BODY.OBJECT]

export const hasEventSender = ({ body }: BufferedRequest): boolean => {
	const [entry] = body?.entry || []
	const [event] = entry.messaging || []
	return !!event[META_BUFFERED_REQUEST_EVENT_PROPERTIES.SENDER]
}

export const isValidVerifyRequest = (
	query: ParsedQs,
	credentials: Credentials
): boolean =>
	isSubscribeRequest(query) && isValidVerifyToken(query, credentials)

export const getConsumeRequestErrorCode = (
	request: BufferedRequest,
	credentials: Credentials
): HTTP_REQUEST_RESPONSE_CODES | null => {
	if (!isSecureRequest(request, credentials)) {
		return HTTP_REQUEST_RESPONSE_CODES.FORBIDDEN
	} else if (!isPageRequest(request) || !hasEventSender(request)) {
		return HTTP_REQUEST_RESPONSE_CODES.BAD_REQUEST
	}

	return null
}
