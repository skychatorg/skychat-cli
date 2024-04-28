import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants.js';
import { Component } from './Component.js';
import { Page } from '../page/Page.js';

export class UserList extends Component<blessed.Widgets.ListElement> {
    constructor(page: Page, options: Partial<blessed.Widgets.ListOptions<blessed.Widgets.ListElementStyle>>) {
        super(
            page,
            blessed.list({
                ...BOX_DEFAULT_OPTIONS,
                ...options,
            }),
        );

        this.update();
    }

    bind() {
        this.page.client.on('typing-list', this.updateAndRender.bind(this));
        this.page.client.on('connected-list', this.updateAndRender.bind(this));
        this.page.client.on('connected-list-patch', this.updateAndRender.bind(this));
    }

    update() {
        const state = this.page.client.state;

        this.element.setItems(
            state.connectedList.map((connectedUser) => {
                // Typing?
                const isTyping = state.typingList.find(
                    (typingUser) => typingUser.username.toLowerCase() === connectedUser.user.username.toLowerCase(),
                );
                const typingStr = isTyping ? '…' : ' ';

                // Disconnected users
                const disconnectedStr = connectedUser.deadSinceTime ? 'x' : null;

                // Username
                const username = connectedUser.user.username;

                // Last activity
                const lastActivityMin = Math.floor(
                    (new Date().getTime() - connectedUser.lastInteractionTime * 1000) / 1000 / 60,
                );
                const afkStr = !connectedUser.deadSinceTime && lastActivityMin >= 10 ? '~' : '';

                return [typingStr, disconnectedStr, username, afkStr].filter(Boolean).join(' ');
            }),
        );
    }
}
