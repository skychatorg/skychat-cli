import blessed from 'blessed';
import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';
import { SkyChatClient } from 'skychat';
import { AuthToken } from 'skychat/build/server';
import { SCREEN_TITLE } from '../constants.js';
import { SkyChatOption, SkyChatOptions } from '../types.js';
import { ChatPage } from './page/ChatPage.js';
import { LogInPage } from './page/LogInPage.js';
import { Page } from './page/Page.js';

enum CurrentPage {
    login = 'login',
    chat = 'chat',
}

export class SkyChatCLI {
    private static readonly TOKEN_FILENAME = 'token.json';

    private readonly client: SkyChatClient;

    private screen: blessed.Widgets.Screen;

    private currentPage: Page;

    private options: SkyChatOptions;

    constructor(client: SkyChatClient, options: SkyChatOptions) {
        this.client = client;
        this.screen = blessed.screen({ title: SCREEN_TITLE });
        this.options = options;
        this.currentPage = new LogInPage(client, this.screen);

        this._bind();
    }

    private _bind(): void {
        this.client.on('join-room', this.onJoinRoom.bind(this));
        this.client.on('auth-token', this.saveToken.bind(this));

        this.screen.key(['escape', 'C-c'], () => process.exit(0));
    }

    private getTokenPath(): string {
        return path.join(this.options[SkyChatOption.TokenDir], SkyChatCLI.TOKEN_FILENAME);
    }

    private onJoinRoom(roomId: number | null): void {
        if (roomId === null) {
            this.setPage(CurrentPage.login);
        } else {
            this.setPage(CurrentPage.chat);
        }
    }

    private setPage(page: CurrentPage): void {
        this.screen.destroy();
        this.screen = blessed.screen({ title: SCREEN_TITLE });

        this.screen.key(['escape', 'C-c'], () => process.exit(0));

        switch (page) {
            case CurrentPage.login:
                this.currentPage = new LogInPage(this.client, this.screen);
                break;
            case CurrentPage.chat:
                this.currentPage = new ChatPage(this.client, this.screen);
                break;
        }

        this.render();
    }

    private async saveToken(authToken: AuthToken | null) {
        this.screen.log('Saving auth token to disk...');
        if (!authToken) {
            return;
        }
    
        await fsExtra.ensureDir(this.options[SkyChatOption.TokenDir]);
        await fs.promises.writeFile(this.getTokenPath(), JSON.stringify(authToken));
    }

    private async loadToken(): Promise<AuthToken | null> {
        this.screen.log('Loading auth token from disk...');
        try {
            const token = await fs.promises.readFile(this.getTokenPath(), 'utf-8');
            return JSON.parse(token) as AuthToken;
        } catch (e) {
            return null;
        }
    }

    async autoConnect() {
        // Wait for the client to connect
        await new Promise<void>((resolve) => {
            this.client.connect();
            this.client.once('update', resolve);
        });

        // If user/password provided, use them
        if (this.options[SkyChatOption.User] && this.options[SkyChatOption.Password]) {
            this.screen.log('Using provided username and password to log in...');
            this.client.login(this.options[SkyChatOption.User], this.options[SkyChatOption.Password]);
            return;
        }

        // Try to load token from disk
        const token = await this.loadToken();
        this.screen.log('Loaded auth token from disk: ' + JSON.stringify(token));
        if (token) {
            this.client.authenticate({
                token,
            });
            return;
        }

        this.screen.log('No auth token found on disk, logging in as guest...');
        this.client.authAsGuest();
    }


    render(): void {
        this.currentPage.render();
    }
}
