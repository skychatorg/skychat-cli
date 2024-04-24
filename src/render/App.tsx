import { Box } from 'ink';
import React, { useState } from 'react';
import { ChatPage } from './page/ChatPage.js';

export type Props = {
    width: number;
    height: number;
};

export function App(props: Props) {
    const { width, height } = props;

    const [page] = useState<'chat'>('chat');

    return (
        <Box width={width} height={height}>
            {page === 'chat' && <ChatPage />}
        </Box>
    );
}
