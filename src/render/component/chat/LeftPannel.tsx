import { Box } from 'ink';
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '../helper/ScrollArea.js';
import { MessageList } from './MessageList.js';

export const LeftPannel = () => {
    const ref = useRef<any | null>(null);

    const [width, setWidth] = React.useState<number>(0);
    const [height, setHeight] = React.useState<number>(0);

    useEffect(() => {
        setWidth(ref.current?.width ?? 0);
        setHeight(ref.current?.height ?? 0);
    }, []);

    return (
        <Box width="100%" flexDirection="column">
            <Box ref={ref} flexDirection="column" paddingBottom={1}>
                <ScrollArea height={height}>
                    <MessageList width={width} />
                </ScrollArea>
            </Box>
        </Box>
    );
};
