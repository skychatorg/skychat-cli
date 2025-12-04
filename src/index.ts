import { SkyChatClient } from 'skychat';
import { getOptions } from './options.js';
import { SkyChatCLI } from './render/SkyChatCLI.js';
import { SkyChatOption } from './types.js';

export function getEndPointUrl(protocol: string, host: string): string {
    return `${protocol}://${host}/api/ws`;
}

export async function main() {
    const options = getOptions();

    // Build the endpoint URL & initialize the SkyChatCLI
    const url = getEndPointUrl(options[SkyChatOption.Protocol], options[SkyChatOption.Host]);
    const client = new SkyChatClient(url, {
        autoMessageAck: true,
    });

    const skyChatCli = new SkyChatCLI(client, options);
    await skyChatCli.autoConnect();
    skyChatCli.render();
}
