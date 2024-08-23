import { Router } from 'express'

import messenger from '@/clients/messenger'

export const router: Router = Router()

const resource = (client: string) => `/webhooks/${client}/webhook`

router.get(resource(messenger.name), messenger.verify)
router.post(resource(messenger.name), messenger.consume)
