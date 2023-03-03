// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

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
            processMessage(req, res)
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
        res.status(403);
    }
}

const processMessage = (req: NextApiRequest, res: NextApiResponse) => {
    console.log('test')
}
