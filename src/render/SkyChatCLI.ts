import { SkyChatClient } from 'skychat';
import { Page } from './page/Page.js';
import { LogInPage } from './page/LogInPage.js';
import { ChatPage } from './page/ChatPage.js';
import { saveToken } from '../token.js';

enum CurrentPage {
    login = 'login',
    chat = 'chat',
}

export class SkyChatCLI {
    private readonly client: SkyChatClient;

    private currentPage: Page;

    constructor(client: SkyChatClient) {
        this.client = client;

        this.currentPage = new LogInPage(client);
        this.render();

        this._bind();
    }

    private _bind(): void {
        this.client.on('join-room', this.onJoinRoom.bind(this));
        this.client.on('auth-token', saveToken);
    }

    private onJoinRoom(roomId: number | null): void {
        if (roomId === null) {
            this.setPage(CurrentPage.login);
        } else {
            this.setPage(CurrentPage.chat);
        }
    }

    private setPage(page: CurrentPage): void {
        this.currentPage.destroy();

        switch (page) {
            case CurrentPage.login:
                this.currentPage = new LogInPage(this.client);
                break;
            case CurrentPage.chat:
                this.currentPage = new ChatPage(this.client);
                break;
        }

        this.render();
    }

    render(): void {
        this.currentPage.render();
    }

    destroy(): void {
        this.currentPage.destroy();
    }
}
