import { SkyChatClient } from 'skychat';
import { getOptions } from './options.js';
import { connect, getEndPointUrl } from './skychat.js';
import { loadToken } from './token.js';
import { SkyChatOption, SkyChatOptions } from './types.js';
import { renderApp } from './render/index.js';

export async function main() {
    const options = getOptions();

    // Build the endpoint URL & initialize the SkyChatCLI
    const url = getEndPointUrl(options[SkyChatOption.Protocol], options[SkyChatOption.Host]);
    const client = new SkyChatClient(url);

    await autoConnect(client, options);

    renderApp(client);
}

async function autoConnect(client: SkyChatClient, options: SkyChatOptions) {
    if (options[SkyChatOption.User] && options[SkyChatOption.Password]) {
        await connect(client, {
            mode: 'credentials',
            user: options[SkyChatOption.User],
            password: options[SkyChatOption.Password],
        });
        return;
    }

    const token = await loadToken();
    if (token) {
        await connect(client, {
            mode: 'token',
            token,
        });
        return;
    }

    await connect(client, {
        mode: 'guest',
    });
}
