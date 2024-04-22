import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants';
import { Component } from './Component';
import { Page } from '../page/Page';

export class MessageInput extends Component<blessed.Widgets.TextboxElement> {
    constructor(page: Page, options: Partial<blessed.Widgets.TextboxOptions>) {
        super(
            page,
            blessed.textbox({
                ...BOX_DEFAULT_OPTIONS,
                keys: true,
                inputOnFocus: true,
                border: {
                    type: 'line',
                },
                ...options,
            }),
        );
    }

    bind() {
        this.element.key('enter', this.onKeyEnter.bind(this));
    }

    focus() {
        this.element.focus();
    }

    onKeyEnter() {
        // Retrieve message and clear input
        const message = this.element.getValue();
        this.element.clearValue();
        this.page.render();
        this.focus();

        // Send message
        this.page.client.sendMessage(message);
    }
}
