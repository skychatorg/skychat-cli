import { SkyChatClient } from 'skychat';
import { getOptions } from './options.js';
import { SkyChatCLI } from './render/SkyChatCLI.js';
import { loadToken } from './token.js';
import { SkyChatOption, SkyChatOptions } from './types.js';

export function getEndPointUrl(protocol: string, host: string): string {
    return `${protocol}://${host}/ws`;
}

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
    // Wait for the client to connect
    await new Promise<void>((resolve) => {
        client.connect();
        client.once('update', resolve);
    });

    if (options[SkyChatOption.User] && options[SkyChatOption.Password]) {
        client.login(options[SkyChatOption.User], options[SkyChatOption.Password]);
        return;
    }

    const token = await loadToken();
    if (token) {
        client.authenticate({
            token,
        });
        return;
    }

    client.authAsGuest();
}
