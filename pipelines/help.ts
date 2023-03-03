import { Context, MiddlewareNextAction } from "@/commons/Pipeline"
import { sendTextMessage } from "@/services/MessengerAPI";

import { Redis } from '@upstash/redis'


const redis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
})

export const helpCommand = async (ctx: Context, next: MiddlewareNextAction) => {
    
    if (ctx.message?.text.toString().startsWith("#help")) {
        const count = await redis.get('count') as number;
        const instructionText = "Available commands:\n\n"
            + "#order - get default order XMA\n\n"
            + "#menu - get item menu\n\n"
            + "#order <order-id> - to get a specific order\n\n"
            + "#create_order - to create new order (WIP)\r\n"
            + "#help - message will display this help"
            + `count = ${count}`

        await sendTextMessage(ctx.page_scope_id, instructionText)
        await redis.set('count', count+1);
        
        
        ctx.should_end = true;
    }
    if (!ctx.should_end) await next()
}