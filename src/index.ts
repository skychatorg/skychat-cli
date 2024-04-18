import { SkyChatCLI } from './SkyChatCLI';
import { getOptions } from './options';
import { SkyChatOption } from './types';

export async function main() {
    const options = getOptions();

    const endpointUrl = `${options[SkyChatOption.Protocol]}://${options[SkyChatOption.Host]}/ws`;
    const skyChatCli = new SkyChatCLI(endpointUrl);

    await skyChatCli.connect({
        username: options[SkyChatOption.User],
        password: options[SkyChatOption.Password],
    });
}
