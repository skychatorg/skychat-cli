import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants';
import { Component } from './Component';
import { SanitizedMessage } from 'skychat/build/server';
import { Page } from '../page/Page';

export class MessageList implements Component {
    private readonly page: Page;

    private readonly element: blessed.Widgets.BoxElement;

    private readonly messages: SanitizedMessage[] = [];

    constructor(page: Page, options: Partial<blessed.Widgets.BoxOptions>) {
        this.page = page;

        this.element = blessed.box({
            ...BOX_DEFAULT_OPTIONS,
            mouse: true,
            ...options,
        });

        this._bind();
    }

    getElement() {
        return this.element;
    }

    private _bind() {
        this.page.client.on('message', this.addMessage.bind(this));
        this.page.client.on('messages', (messages: SanitizedMessage[]) => {
            messages.forEach(this.addMessage.bind(this));
        });
        this.page.client.on('message-edit', this.onMessageEdit.bind(this));
    }

    onMessageEdit(message: SanitizedMessage) {
        const index = this.messages.findIndex((m) => m.id === message.id);
        if (index === -1) {
            return;
        }
        this.messages[index] = message;
        this.render();
    }

    addMessage(message: SanitizedMessage) {
        this.messages.push(message);
        this.render();
    }

    messageToLine(message: SanitizedMessage) {
        return `[${message.user.username}] ${message.content}`;
    }

    render() {
        this.element.setContent(this.messages.map(this.messageToLine).join('\n'));
        this.element.scrollTo(this.element.getScrollHeight());
        this.page.render();
    }
}
