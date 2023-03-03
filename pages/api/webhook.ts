// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MessagingEvent, PageEntry } from '@/commons/MessengerInterfaces'
import { Context, Pipeline } from '@/commons/Pipeline'
import { greetCommand } from '@/pipelines/greet'
import { helpCommand } from '@/pipelines/help'
import { markSeen } from '@/services/MessengerAPI'

import type { NextApiRequest, NextApiResponse } from 'next'

const PAGE_ID =  process.env.PAGE_ID
const VERIFY_TOKEN = process.env.VERIFY_TOKEN

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'GET':
            verifySubscription(req, res)
            break
        case 'POST':
            webhook(req, res)
            break
    }
}

const verifySubscription = (req: NextApiRequest, res: NextApiResponse) => {
    const mode = req.query['hub.mode']?.toString() ?? ''
    const verify_token = req.query['hub.verify_token']?.toString()
    const challenge = req.query['hub.challenge']?.toString()

    if (mode === '') res.status(200).send('Invalid action');

    if (mode === 'subscribe' &&
        verify_token === VERIFY_TOKEN) {
        res.status(200).send(challenge)
    } else {
        res.status(403).end()
    }
}

const webhook = (req: NextApiRequest, res: NextApiResponse) => {
    const data = req.body;
    console.log('received message from webhook')
    if (data.object === 'page') {
        data.entry.forEach((pageEntry: PageEntry) => {
            const pageID = pageEntry.id
            const timestamp = pageEntry.time

            pageEntry.messaging.forEach(async (event: MessagingEvent) => {
                if (event.message) {
                    await processMessageEvent(event)
                } else if (event.optin) {
                    // do something
                } else if (event.delivery) {
                    // do something
                } else if (event.postback) {
                    // do something
                } else if (event.read) {
                    // do something
                } else if (event.account_linking) {
                    // do something
                } else {
                    // log error
                }
            })
        });
    }

    res.status(200).end()
}

const processMessageEvent = async (event: MessagingEvent) => {
    const pageScopeID = event.sender.id
    const message = event.message
    const isEcho = message.is_echo
    const messageId = message.mid
    const appId = message.app_id
    const metadata = message.metadata
    const quickReply = message.quick_reply

    // only handle message from user not page
    if (pageScopeID != PAGE_ID) {
        let ctx: Context = {
            page_scope_id: pageScopeID,
            message: message,
            should_end: false
        }

        const pipeline = Pipeline()
        pipeline.push(helpCommand)
        pipeline.push(greetCommand)

        if(message.text) {
            await pipeline.execute(ctx)
        }
    }

    if (isEcho) {
        // handle echo
        return
    }

    if (quickReply) {
        // handle quick reply
        return
    }

    await markSeen(pageScopeID)
}