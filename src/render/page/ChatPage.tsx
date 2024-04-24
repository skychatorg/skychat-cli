import { Box } from 'ink';
import React from 'react';
import { AppBanner } from '../component/AppBanner.js';
import { LeftPannel } from '../component/chat/LeftPannel.js';
import { RightPannel } from '../component/chat/RightPannel.js';

export const ChatPage = () => {
    return (
        <Box flexDirection="column" padding={1}>
            <AppBanner />

            <Box height="100%">
                <LeftPannel />
                <RightPannel />
            </Box>
        </Box>
    );
};
