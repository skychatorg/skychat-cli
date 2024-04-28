import blessed from 'blessed';
import { SkyChatClient } from 'skychat';
import { Page } from './Page.js';
import { SCREEN_TITLE } from '../../constants.js';
import { MessageList } from '../component/MessageList.js';
import { RoomList } from '../component/RoomList.js';
import { UserList } from '../component/UserList.js';
import { MessageInput } from '../component/MessageInput.js';

export class ChatPage extends Page {
    public static readonly MESSAGE_INPUT_SIZE: number = 3;

    public static readonly SIDEBAR_WIDTH: number = 24;

    private readonly screen: blessed.Widgets.Screen;

    private readonly messageList: MessageList;
    private readonly roomList: RoomList;
    private readonly userList: UserList;
    private readonly messageInput: MessageInput;

    constructor(client: SkyChatClient) {
        super(client);

        this.screen = blessed.screen({ title: SCREEN_TITLE });

        this.messageList = new MessageList(this, {
            width: `100%-${ChatPage.SIDEBAR_WIDTH}`,
            height: `100%-${ChatPage.MESSAGE_INPUT_SIZE}`,
        });
        this.roomList = new RoomList(this, {
            top: 0,
            left: `100%-${ChatPage.SIDEBAR_WIDTH}`,
            width: ChatPage.SIDEBAR_WIDTH,
            height: '50%',
        });
        this.userList = new UserList(this, {
            bottom: 0,
            left: `100%-${ChatPage.SIDEBAR_WIDTH}`,
            width: ChatPage.SIDEBAR_WIDTH,
            height: '50%',
        });
        this.messageInput = new MessageInput(this, {
            bottom: 0,
            left: 0,
            width: `100%-${ChatPage.SIDEBAR_WIDTH}-2`,
            height: ChatPage.MESSAGE_INPUT_SIZE,
        });

        this.screen.append(this.messageList.getElement());
        this.screen.append(this.roomList.getElement());
        this.screen.append(this.userList.getElement());
        this.screen.append(this.messageInput.getElement());

        this.screen.key(['escape', 'C-c'], () => process.exit(0));

        this.messageInput.getElement().focus();
    }

    render(): void {
        this.screen.render();
    }

    destroy(): void {
        this.screen.destroy();
    }
}
