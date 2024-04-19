import { SkyChatCLI } from './SkyChatCLI';
import { getOptions } from './options';
import { loadToken } from './token';
import { SkyChatOption } from './types';

export async function main() {
    const options = getOptions();

    // Build the endpoint URL & initialize the SkyChatCLI
    const endpointUrl = `${options[SkyChatOption.Protocol]}://${options[SkyChatOption.Host]}/ws`;
    const skyChatCli = new SkyChatCLI(endpointUrl);

    // Choose whether to log in as guest, as user with username & password, or as user with token
    if (options[SkyChatOption.User] && options[SkyChatOption.Password]) {
        return skyChatCli.connect({
            mode: 'credentials',
            user: options[SkyChatOption.User],
            password: options[SkyChatOption.Password],
        });
    }

    const token = await loadToken();
    if (token) {
        return skyChatCli.connect({
            mode: 'token',
            token,
        });
    }
    return skyChatCli.connect({
        mode: 'guest',
    });
}
