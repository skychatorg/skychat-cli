import { Box, DOMElement, measureElement, useInput } from 'ink';
import React from 'react';

export type Props = {
    height: number;
    children: React.ReactNode;
};

export function ScrollArea({ height, children }: Props) {
    const [innerHeight, setInnerHeight] = React.useState<number>(0);
    const [scrollTop, setScrollTop] = React.useState<number>(0);

    const innerRef = React.useRef<DOMElement>(null);

    function scrollDown() {
        const newScrollTop = Math.min(innerHeight - height, scrollTop + 1);
        setScrollTop(newScrollTop);
    }

    function scrollUp() {
        const newScrollTop = Math.max(0, scrollTop - 1);
        setScrollTop(newScrollTop);
    }

    React.useEffect(() => {
        if (!innerRef.current) {
            return;
        }
        const dimensions = measureElement(innerRef.current);

        setInnerHeight(dimensions.height);
    }, []);

    useInput((_input, key) => {
        if (key.downArrow) {
            scrollDown();
        }

        if (key.upArrow) {
            scrollUp();
        }
    });

    return (
        <Box height={height} flexDirection="column" overflow="hidden">
            <Box ref={innerRef} flexShrink={0} flexDirection="column" marginTop={-scrollTop}>
                {children}
            </Box>
        </Box>
    );
}
