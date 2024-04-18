#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SkyChatCLI = require('../lib/SkyChatCLI').SkyChatCLI;

const [, , HOST, USER, PASS] = process.argv;

export async function main() {
    const skyChatCli = new SkyChatCLI(`wss://${HOST}/ws`);

    await skyChatCli.connect({
        username: USER,
        password: PASS,
    });
}
