import blessed from 'blessed';
import slugify from 'slugify';
import { BOX_DEFAULT_OPTIONS } from '../../constants';
import { Component } from './Component';
import { Page } from '../page/Page';

export class RoomList implements Component {
    private readonly page: Page;

    private readonly element: blessed.Widgets.ListElement;

    constructor(page: Page, options: Partial<blessed.Widgets.ListOptions<blessed.Widgets.ListElementStyle>>) {
        this.page = page;

        this.element = blessed.list({
            ...BOX_DEFAULT_OPTIONS,
            mouse: true,
            scrollable: true,
            alwaysScroll: false,
            ...options,
        });

        this._bind();
        this.render();
    }

    getElement() {
        return this.element;
    }

    _bind() {
        this.page.client.on('room-list', this.render.bind(this));
        this.page.client.on('join-room', this.render.bind(this));

        this.element.on('select', this.onSelect.bind(this));
    }

    onSelect(_item: blessed.Widgets.BlessedElement, index: number) {
        this.page.client.join(this.page.client.state.rooms[index].id);
    }

    render() {
        this.element.setItems(
            this.page.client.state.rooms.map((room) => {
                // If room is current room, add a star
                const star = room.id === this.page.client.state.currentRoomId ? '*' : ' ';
                return `${star} ${slugify(room.name)}`;
            }),
        );
        this.page.render();
    }
}
