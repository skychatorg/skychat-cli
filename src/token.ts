import { AuthToken } from 'skychat/build/server';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import os from 'os';

const CACHE_DIR = path.join(os.homedir(), '.skychat');

const TOKEN_FILENAME = 'token.json';

function getTokenPath() {
    return path.join(CACHE_DIR, TOKEN_FILENAME);
}

export async function saveToken(authToken: AuthToken | null) {
    if (!authToken) {
        return;
    }

    await fsExtra.ensureDir(CACHE_DIR);
    await fs.promises.writeFile(getTokenPath(), JSON.stringify(authToken));
}

export async function loadToken(): Promise<AuthToken | null> {
    try {
        const token = await fs.promises.readFile(getTokenPath(), 'utf-8');
        return JSON.parse(token) as AuthToken;
    } catch (e) {
        return null;
    }
}
