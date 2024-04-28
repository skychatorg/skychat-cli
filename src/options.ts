import minimist from 'minimist';
import { ENV_PREFIX } from './constants.js';
import { SkyChatOption, SkyChatOptions } from './types.js';

function getDefaultOptions(): SkyChatOptions {
    return {
        [SkyChatOption.Protocol]: 'wss',
        [SkyChatOption.Host]: 'localhost',
        [SkyChatOption.User]: '',
        [SkyChatOption.Password]: '',
    };
}

function getEnvOptions(): Partial<SkyChatOptions> {
    const options: Partial<SkyChatOptions> = {};

    for (const key in process.env) {
        if (!key.startsWith(ENV_PREFIX)) {
            continue;
        }

        const option = key.slice(ENV_PREFIX.length).toLowerCase() as keyof SkyChatOptions;

        options[option] = process.env[key]!;
    }

    return options;
}

function getCliOptions(): Partial<SkyChatOptions> {
    const { h, u, p } = minimist(process.argv.slice(2));
    return Object.fromEntries(
        [
            [SkyChatOption.Host, h],
            [SkyChatOption.User, u],
            [SkyChatOption.Password, p],
        ].filter(([, value]) => typeof value !== 'undefined'),
    );
}

export function getOptions(): SkyChatOptions {
    return {
        ...getDefaultOptions(),
        ...getEnvOptions(),
        ...getCliOptions(),
    };
}
