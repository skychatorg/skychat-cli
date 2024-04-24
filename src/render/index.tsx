import { render } from 'ink';
import React from 'react';
import { SkyChatClient } from 'skychat';
import { App } from './App.js';
import { initialize } from './hook/client.js';

function getProps() {
    return {
        width: process.stdout.columns,
        height: process.stdout.rows,
    };
}

export function renderApp(client: SkyChatClient) {
    initialize(client);

    const { rerender } = render(<App {...getProps()} />, {
        patchConsole: false,
    });

    process.stdout.on('resize', () => {
        rerender(<App {...getProps()} />);
    });
}
