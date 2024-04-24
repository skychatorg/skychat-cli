import { Box, Text, useApp, useInput } from 'ink';
import React from 'react';
import { BANNER_HEIGHT, BANNER_HORIZONTAL_PADDING } from '../constant.js';
import { useClientState } from '../hook/client.js';

export const AppBanner = () => {
    const state = useClientState();
    const { exit } = useApp();

    useInput((input: string) => {
        if (input === 'q') {
            exit();
            process.exit();
        }
    });

    return (
        <Box
            height={BANNER_HEIGHT}
            paddingLeft={BANNER_HORIZONTAL_PADDING}
            paddingRight={BANNER_HORIZONTAL_PADDING}
            justifyContent="space-between"
        >
            <Text>{state.user.username}</Text>
            <Text>exit [q]</Text>
        </Box>
    );
};
