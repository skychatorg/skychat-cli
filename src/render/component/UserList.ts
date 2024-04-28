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
        this.page.client.on('connected-list', this.updateAndRender.bind(this));
    }

    update() {
        this.element.setItems(
            this.page.client.state.connectedList.map((connectedUser) => {
                const star = connectedUser.deadSinceTime ? '~' : ' ';
                return `${star} ${connectedUser.user.username}`;
            }),
        );
    }
}
