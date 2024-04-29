import { SkyChatClient } from 'skychat';
import { getOptions } from './options.js';
import { SkyChatCLI } from './render/SkyChatCLI.js';
import { connect, getEndPointUrl } from './skychat.js';
import { loadToken } from './token.js';
import { SkyChatOption, SkyChatOptions } from './types.js';

export async function main() {
    const options = getOptions();

    // Build the endpoint URL & initialize the SkyChatCLI
    const url = getEndPointUrl(options[SkyChatOption.Protocol], options[SkyChatOption.Host]);
    const client = new SkyChatClient(url, {
        autoMessageAck: true,
    });

    await autoConnect(client, options);

    const skyChatCli = new SkyChatCLI(client);
    skyChatCli.render();
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
