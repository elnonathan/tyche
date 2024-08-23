import { Request } from 'express'
import { MetaEvent } from '@/schema'

export const getMetaEvent = ({ body }: Request): MetaEvent => {
	const [entry] = body?.entry || []
	const [event] = entry?.messaging || []
	return event
}
