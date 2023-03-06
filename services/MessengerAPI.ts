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
        console.log('sending message API')
        const res = await fetch('https://graph.facebook.com/v15.0/' + PAGE_ID + '/messages?access_token=' + ACCESS_TOKEN, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }

        })

        const data = await res.json() as MessengerAPIResponse
        const recipientId = data.recipient_id ?? ''
        const messageId = data.message_id ?? ''
        console.log('called send message API')
        console.log(data)
        if (res.ok) {
            // log success
            console.log("success")
        } else {
            // log error
            console.log("error")
            console.log(res.body)
        }
    } catch (error) {
        // log error
        console.log("exception")
        console.log(error)
    }
}

export const sendTextMessage = async (recipientId: string, messageText: string) => {
    console.log('send text message API')
    const messageData: MessengerAPIPayload = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    }

    await callSendAPI(messageData)
}

export const markSeen = async (psid: string) => {
    console.log('mark seen message API')
    const messageData: MessengerAPIPayload = {
        recipient: {
            id: psid
        },
        sender_action: "mark_seen"
    }

    await callSendAPI(messageData)
}