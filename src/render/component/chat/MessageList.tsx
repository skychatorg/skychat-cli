import React, { useEffect, useState } from 'react';
import { SanitizedMessage } from 'skychat/build/server/index.js';
import { renderMessage } from '../../helper/message.js';
import { useClient } from '../../hook/client.js';

export type Props = {
    width: number;
};

export const MessageList = ({ width }: Props) => {
    const client = useClient();

    const [messages, setMessages] = useState<SanitizedMessage[]>([]);

    function onMessage(message: SanitizedMessage) {
        setMessages([...messages, message]);
    }

    function onMessages(oldMessages: SanitizedMessage[]) {
        setMessages([...oldMessages, ...messages]);
    }

    function onMessageEdit(message: SanitizedMessage) {
        const index = messages.findIndex((m) => m.id === message.id);
        if (index === -1) {
            return;
        }
        setMessages([...messages.slice(0, index), message, ...messages.slice(index + 1)]);
    }

    useEffect(() => {
        client.on('message', onMessage);
        client.on('messages', onMessages);
        client.on('message-edit', onMessageEdit);

        return () => {
            client.off('message', onMessage);
            client.off('messages', onMessages);
            client.off('message-edit', onMessageEdit);
        };
    }, []);

    return <>{messages.map((message) => renderMessage(width, message))}</>;
};
