import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants.js';
import { Component } from './Component.js';
import { SanitizedMessage } from 'skychat/build/server';
import { Page } from '../page/Page.js';
import { renderMessage } from '../helper/message.js';

export class MessageList extends Component<blessed.Widgets.BoxElement> {
    protected readonly messages: SanitizedMessage[] = [];

    constructor(page: Page, options: Partial<blessed.Widgets.BoxOptions>) {
        super(
            page,
            blessed.box({
                ...BOX_DEFAULT_OPTIONS,
                ...options,
                tags: true,
            }),
        );

        this.update();
    }

    bind() {
        this.page.client.on('message', this.onMessage.bind(this));
        this.page.client.on('messages', this.onMessages.bind(this));
        this.page.client.on('message-edit', this.onMessageEdit.bind(this));
        this.element.on('resize', this.updateAndRender.bind(this));
        this.element.on('scroll', this.onScroll.bind(this));
    }

    onScroll() {
        const scrollIndex = this.element.getScroll();
        if (scrollIndex === 0 && this.messages.length > 0) {
            const lastMessageId = this.messages[0].id;
            this.page.client.sendMessage(`/messagehistory ${lastMessageId}`);
        }
    }

    onMessageEdit(message: SanitizedMessage) {
        const index = this.messages.findIndex((m) => m.id === message.id);
        if (index === -1) {
            return;
        }
        this.messages[index] = message;
        this.updateAndRender();
    }

    onMessage(message: SanitizedMessage) {
        this.messages.push(message);
        this.updateAndRender();
    }

    onMessages(messages: SanitizedMessage[]) {
        this.messages.unshift(...messages);
        this.updateAndRender();
    }

    autoScroll() {
        if (this.messages.length > 0) {
            this.element.scrollTo(this.element.getScrollHeight());
        }
    }

    update() {
        this.element.setContent(
            this.messages
                .map((message, index) => renderMessage(this.element, message, index === this.messages.length - 1))
                .join('\n'),
        );
        this.autoScroll();
    }
}
