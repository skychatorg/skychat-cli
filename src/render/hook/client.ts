import { useState } from 'react';
import { SkyChatClient, SkyChatClientState } from 'skychat';

let _client: SkyChatClient;

export function initialize(client: SkyChatClient) {
    _client = client;
}

export function useClient() {
    return _client;
}

export function useClientState() {
    const [state, setClient] = useState<SkyChatClientState>(_client.state);

    function waitForNextUpdate() {
        _client.once('update', () => {
            setClient(_client.state);

            // TODO: Without this, the CLI app sometimes freezes
            setTimeout(() => {
                waitForNextUpdate();
            }, 1);
        });
    }
    waitForNextUpdate();

    return state;
}
