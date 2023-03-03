import { MessengerAPIPayload } from '@/commons/MessengerInterfaces';
import fetch from 'node-fetch';
const PAGE_ID =  process.env.PAGE_ID
const ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

type MessengerAPIResponse = {
    recipient_id?: string;
    message_id?: string;
}

const callSendAPI = async (payload: MessengerAPIPayload) => {
    try {
        const res = await fetch('https://graph.facebook.com/v14.0/' + PAGE_ID + '/messages?access_token=' + ACCESS_TOKEN, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }

        })

        const data = await res.json() as MessengerAPIResponse
        const recipientId = data.recipient_id ?? ''
        const messageId = data.message_id ?? ''

        if (res.ok) {
            // log success
        } else {
            // log error
        }
    } catch (error) {
        // log error
    }
}

export const markSeen = async (psid: string) => {
    const messageData: MessengerAPIPayload = {
        recipient: {
            id: psid
        },
        sender_action: "mark_seen"
    }

    await callSendAPI(messageData)
}