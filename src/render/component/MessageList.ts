import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants';
import { Component } from './Component';
import { SanitizedMessage } from 'skychat/build/server';
import { Page } from '../page/Page';
import { renderMessage } from '../helper/message';

export class MessageList extends Component<blessed.Widgets.BoxElement> {
    static readonly USERNAME_MAX_LEN: number = 16;

    protected readonly messages: SanitizedMessage[] = [];

    constructor(page: Page, options: Partial<blessed.Widgets.BoxOptions>) {
        super(
            page,
            blessed.box({
                ...BOX_DEFAULT_OPTIONS,
                ...options,
            }),
        );

        this.update();
    }

    bind() {
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
        this.updateAndRender();
    }

    addMessage(message: SanitizedMessage) {
        this.messages.push(message);
        this.updateAndRender();
    }

    messageToLine(message: SanitizedMessage) {
        // Show all usernames with same length
        const username = message.user.username
            .substring(0, MessageList.USERNAME_MAX_LEN)
            .padStart(MessageList.USERNAME_MAX_LEN);

        // Pad each content additional line with username length
        const content: string = message.content
            .split('\n')
            .map((val: string, index: number) => {
                if (index === 0) {
                    return val;
                }
                return ' '.repeat(MessageList.USERNAME_MAX_LEN + 3) + val;
            })
            .join('\n');

        return `${username} > ${content}`;
    }

    update() {
        this.element.setContent(this.messages.map((m) => renderMessage(this.element, m)).join('\n'));
        if (this.messages.length > 0) {
            this.element.scrollTo(this.element.getScrollHeight());
        }
    }
}
