import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants';
import { Component } from './Component';
import { Page } from '../page/Page';

export class UserList implements Component {
    private readonly page: Page;

    private readonly element: blessed.Widgets.ListElement;

    constructor(page: Page, options: Partial<blessed.Widgets.ListOptions<blessed.Widgets.ListElementStyle>>) {
        this.page = page;

        this.element = blessed.list({
            ...BOX_DEFAULT_OPTIONS,
            mouse: true,
            ...options,
        });

        this._bind();
        this.render();
    }

    getElement() {
        return this.element;
    }

    _bind() {
        this.page.client.on('connected-list', this.render.bind(this));
    }

    render() {
        this.element.setItems(
            this.page.client.state.connectedList.map((connectedUser) => {
                const star = connectedUser.deadSinceTime ? '~' : ' ';
                return `${star} ${connectedUser.user.username}`;
            }),
        );
        this.page.render();
    }
}
