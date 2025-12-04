import minimist from 'minimist';
import os from 'os';
import path from 'path';
import { ENV_PREFIX } from './constants.js';
import { SkyChatOption, SkyChatOptions } from './types.js';

function getDefaultOptions(): SkyChatOptions {
    return {
        [SkyChatOption.Protocol]: 'wss',
        [SkyChatOption.Host]: 'localhost',
        [SkyChatOption.User]: '',
        [SkyChatOption.Password]: '',
        [SkyChatOption.TokenDir]: path.join(os.homedir(), '.skychat'),
    };
}

/**
 * Convert an option key to its corresponding environment variable name (all uppercase A-Z are replaced with _a-z).
 * e.g. 'tokenDir' -> 'SKYCHAT_TOKEN_DIR'
 */
function optionKeyToEnvVar(key: SkyChatOption): string {
    return ENV_PREFIX + key
        .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
        .toUpperCase();
}

/**
 * Get a partial SkyChatOptions object from environment variables.
 */
function getEnvOptions(): Partial<SkyChatOptions> {
    const options: Partial<SkyChatOptions> = {};

    for (const key of Object.values(SkyChatOption)) {
        const envVar = optionKeyToEnvVar(key);
        if (process.env[envVar]) {
            options[key] = process.env[envVar];
        }
    }
    
    return options;
}

/**
 * Get a partial SkyChatOptions object from CLI arguments.
 */
function getCliOptions(): Partial<SkyChatOptions> {
    const { h, u, p, t } = minimist(process.argv.slice(2));
    return Object.fromEntries(
        [
            [SkyChatOption.Host, h],
            [SkyChatOption.User, u],
            [SkyChatOption.Password, p],
            [SkyChatOption.TokenDir, t],
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
