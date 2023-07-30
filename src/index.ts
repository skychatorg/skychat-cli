#!/usr/bin/env node

const SkyChatCLI = require('../lib/SkyChatCLI').SkyChatCLI;

const [ , , HOST, USER, PASS] = process.argv;

(async () => {
    await new SkyChatCLI(`wss://${HOST}/ws`)
        .connect({ username: USER, password: PASS })
})();
