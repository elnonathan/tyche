import { Request, Response } from 'express'

export enum CLIENT {
	MESSENGER = 'messenger',
}

export interface BufferedRequest extends Request {
	buffer?: Buffer
	encoding?: string
}

export type Credentials = {
	verify: string
	secret: string
}

export type Controller = {
	name: CLIENT
	verify: (request: Request, response: Response) => Promise<Response>
	consume: (request: BufferedRequest, response: Response) => Promise<void>
}

export interface MetaEventCustomer {
	id: string
}

export interface MetaEventRecipient {
	id: string
}

export interface MetaEventMessageAttachment {
	type: string
	payload: {
		url: string
	}
}

export interface MetaEventMessage {
	mid: string
	text: string
	attachments?: MetaEventMessageAttachment[]
}

interface MetaEventRead {
	watermark: number
	seq: number
}

export interface MetaEvent {
	sender: MetaEventCustomer
	recipient: MetaEventRecipient
	message?: MetaEventMessage
	read?: MetaEventRead
}
