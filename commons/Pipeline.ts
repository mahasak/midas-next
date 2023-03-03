import NodeCache from "node-cache";
import { IncomingMessage } from "./MessengerInterfaces";

export type Context = {
    cache: NodeCache;
    message: IncomingMessage;
    page_scope_id: string;
    order_id?: string;
    cart?: ProductItem[];
    should_end: boolean;
}
type CurrencyAmount = {
    amount: number;
    currency: string;
}

type ProductItem = {
    external_id: string;
    name: string;
    quantity: number;
    description: string;
    currency_amount: CurrencyAmount;
}

type Middleware = (Cctx: Context, next: () => Promise<void>) => {};
export type MiddlewareNextAction = () => Promise<void>;

export function Pipeline() {
    const stack: Middleware[] = []

    const push = (...middlewares: Middleware[]) => {
        stack.push(...middlewares)
    }

    const execute = async (context: Context) => {
        let prevIndex = -1

        const runner = async (index: number) => {
            if (index === prevIndex) {
                throw new Error('next() called multiple times')
            }

            prevIndex = index

            const middleware: Middleware = stack[index]

            if (middleware) {
                await middleware(context, () => {
                    return runner(index + 1);
                })
            }
        }

        await runner(0)
    }

    return { push, execute }
}
