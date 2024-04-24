import { Box, Text } from 'ink';
import React from 'react';
import { LEFT_COL_WIDTH } from '../../constant.js';

export const RightPannel = () => {
    return (
        <Box width={LEFT_COL_WIDTH} borderStyle="single">
            <Text color="green">right col</Text>
        </Box>
    );
};
