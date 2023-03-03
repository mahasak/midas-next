import { Context, MiddlewareNextAction } from "@/commons/Pipeline"
import { sendTextMessage } from "@/services/MessengerAPI";

export const helpCommand = async (ctx: Context, next: MiddlewareNextAction) => {
    
    if (ctx.message?.text.toString().startsWith("#help")) {
        const instructionText = "Available commands:\n\n"
            + "#order - get default order XMA\n\n"
            + "#menu - get item menu\n\n"
            + "#order <order-id> - to get a specific order\n\n"
            + "#create_order - to create new order (WIP)\r\n"
            + "#help - message will display this help"

        await sendTextMessage(ctx.page_scope_id, instructionText)
        
        
        ctx.should_end = true;
    }
    if (!ctx.should_end) await next()
}