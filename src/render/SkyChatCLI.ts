import blessed from 'blessed';
import { SkyChatClient } from 'skychat';
import { SCREEN_TITLE } from '../constants.js';
import { saveToken } from '../token.js';
import { ChatPage } from './page/ChatPage.js';
import { LogInPage } from './page/LogInPage.js';
import { Page } from './page/Page.js';

enum CurrentPage {
    login = 'login',
    chat = 'chat',
}

export class SkyChatCLI {
    private readonly client: SkyChatClient;
    private screen: blessed.Widgets.Screen;

    private currentPage: Page;

    constructor(client: SkyChatClient) {
        this.client = client;
        this.screen = blessed.screen({ title: SCREEN_TITLE });

        this.currentPage = new LogInPage(client, this.screen);

        this._bind();
    }

    private _bind(): void {
        this.client.on('join-room', this.onJoinRoom.bind(this));
        this.client.on('auth-token', saveToken);

        this.screen.key(['escape', 'C-c'], () => process.exit(0));
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

    render(): void {
        this.currentPage.render();
    }
}
