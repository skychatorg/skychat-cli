import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants';
import { Component } from './Component';
import { Page } from '../page/Page';
import { renderRoom } from '../helper/room';

export class RoomList extends Component<blessed.Widgets.ListElement> {
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

    getElement() {
        return this.element;
    }

    bind() {
        this.page.client.on('room-list', this.updateAndRender.bind(this));
        this.page.client.on('join-room', this.updateAndRender.bind(this));

        this.element.on('select', this.onSelect.bind(this));
    }

    onSelect(_item: blessed.Widgets.BlessedElement, index: number) {
        this.page.client.join(this.page.client.state.rooms[index].id);
    }

    update() {
        const { rooms, currentRoom } = this.page.client.state;
        const items = rooms.map((room) => renderRoom(this.page.client, room));
        this.element.setItems(items);
        if (currentRoom) {
            this.element.select(rooms.findIndex((room) => room.id === currentRoom.id));
        }
    }
}
