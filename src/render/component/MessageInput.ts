import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants';
import { Component } from './Component';
import { Page } from '../page/Page';

export class MessageInput implements Component {
    private readonly page: Page;

    private readonly element: blessed.Widgets.TextboxElement;

    constructor(page: Page, options: Partial<blessed.Widgets.TextboxOptions>) {
        this.page = page;

        this.element = blessed.textbox({
            ...BOX_DEFAULT_OPTIONS,
            keys: true,
            mouse: true,
            inputOnFocus: true,
            border: {
                type: 'line',
            },
            ...options,
        });
    }

    getElement() {
        return this.element;
    }

    _bind() {
        // Submit message on enter
        this.element.key('enter', this.onKeyEnter.bind(this));
    }

    onKeyEnter() {
        // Retrieve message and clear input
        const message = this.element.getValue();
        this.element.clearValue();
        this.page.render();

        // Send message
        this.page.client.sendMessage(message);
    }
}
