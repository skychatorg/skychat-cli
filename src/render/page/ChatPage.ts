import blessed from 'blessed';
import { SkyChatClient } from 'skychat';
import { CHAT_MESSAGE_INPUT_HEIGHT, CHAT_PLAYER_HEIGHT, CHAT_SIDEBAR_WIDTH } from '../../constants.js';
import { MessageInput } from '../component/MessageInput.js';
import { MessageList } from '../component/MessageList.js';
import { Player } from '../component/Player.js';
import { RoomList } from '../component/RoomList.js';
import { UserList } from '../component/UserList.js';
import { Page } from './Page.js';

export class ChatPage extends Page {
    private readonly player: Player;
    private readonly messageList: MessageList;
    private readonly roomList: RoomList;
    private readonly userList: UserList;
    private readonly messageInput: MessageInput;

    constructor(client: SkyChatClient, screen: blessed.Widgets.Screen) {
        super(client, screen);

        this.player = new Player(this, {
            width: `100%-${CHAT_SIDEBAR_WIDTH}`,
            height: CHAT_PLAYER_HEIGHT,
        });
        this.messageList = new MessageList(this, {
            width: `100%-${CHAT_SIDEBAR_WIDTH}`,
            height: `100%-${CHAT_MESSAGE_INPUT_HEIGHT}`,
        });
        this.messageInput = new MessageInput(this, {
            bottom: 0,
            left: 0,
            width: `100%-${CHAT_SIDEBAR_WIDTH}-2`,
            height: CHAT_MESSAGE_INPUT_HEIGHT,
        });
        this.roomList = new RoomList(this, {
            top: 0,
            left: `100%-${CHAT_SIDEBAR_WIDTH}`,
            width: CHAT_SIDEBAR_WIDTH,
            height: '50%',
        });
        this.userList = new UserList(this, {
            bottom: 0,
            left: `100%-${CHAT_SIDEBAR_WIDTH}`,
            width: CHAT_SIDEBAR_WIDTH,
            height: '50%',
        });

        this.screen.append(this.messageList.getElement());
        this.screen.append(this.player.getElement());
        this.screen.append(this.messageInput.getElement());
        this.screen.append(this.roomList.getElement());
        this.screen.append(this.userList.getElement());

        this.messageInput.getElement().focus();
        this.resize();

        this.client.on('player-sync', this.resize.bind(this));
    }

    resize(): void {
        // Resize player vs message list according to whether the player is active
        const currentMedia = this.client.state.player.current;
        if (!currentMedia) {
            this.player.getElement().hide();
            this.messageList.getElement().height = `100%-${CHAT_MESSAGE_INPUT_HEIGHT}`;
            this.messageList.getElement().top = 0;
        } else {
            this.player.getElement().show();
            this.messageList.getElement().height = `100%-${CHAT_MESSAGE_INPUT_HEIGHT + CHAT_PLAYER_HEIGHT}`;
            this.messageList.getElement().top = CHAT_PLAYER_HEIGHT;
        }
        this.render();
    }

    render(): void {
        this.screen.render();
    }
}
