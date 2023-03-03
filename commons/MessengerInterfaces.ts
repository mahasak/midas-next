export interface PageEntry {
    id: string;
    time: string;
    messaging: []
}

export interface IncomingMessage {
    is_echo: boolean;
    app_id: string;
    metadata: string;
    mid: string;
    text: string;
    attachments: MessageAttachment;
    quick_reply: MessageQuick_Reply;
}

export interface MessagingEvent {
    message: IncomingMessage;
    delivery: MessagingDelivery;
    postback: MessagingPostback;
    read: {
        watermark: number;
        seq?: number;
    }
    optin: {
        ref: string;
        user_ref: string;
    };
    account_linking: {
        status: 'linked' | 'unlinked',
        authorization_code: string;
    };
    sender: {
        id: string;
    }
    recipient: {
        id: string;
    };
    timestamp: string;
}

export interface MessengerAPIPayload {
    recipient: MessagesRecipient;
    sender_action?: string;
    message?: MessagePayload;
}

interface MessagePayload {
    text: string;
}

export interface MessagesSender {
    id: string;
}
export interface MessagesRecipient {
    id: string;
}
export interface MessageAttachment {
    type: string;
    payload: string;
}
export interface MessageQuick_Reply {
    payload: string;
}
export interface Message {
    mid: string;
    text: string;
    attachments: Array<MessageAttachment>;
    quick_reply: MessageQuick_Reply;
}

export interface MessagingReferral {
    source: string;
    type: string;
    ref: string;
    referer_uri: string;
}
export interface MessagingPostback {
    title: string;
    payload: string;
    referral: MessagingReferral;
}
export interface MessagingPostback {
    title: string;
    payload: string;
    referral: MessagingReferral;
}

export interface MessagingDelivery {
    mids: string[];
    watermark: number;
    seq?: number;
}