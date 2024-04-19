import blessed from 'blessed';
import { SkyChatClient } from 'skychat';
import { AuthToken, SanitizedMessage } from 'skychat/build/server';
import { saveToken } from './token';

type ConnectCredentials = {
    mode: 'credentials';
    user: string;
    password: string;
};

type ConnectToken = {
    mode: 'token';
    token: AuthToken;
};

type ConnectGuest = {
    mode: 'guest';
};

export class SkyChatCLI {
    public static readonly MESSAGE_INPUT_SIZE: number = 3;

    public static readonly SIDEBAR_WIDTH: number = 24;

    public static readonly BOX_DEFAULT_OPTIONS: blessed.Widgets.BoxOptions = {
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
            ch: ' ',
            track: {
                bg: 'cyan',
            },
        },
        border: {
            type: 'line',
        },
        style: {
            fg: 'white',
            bg: 'black',
            border: {
                fg: '#f0f0f0',
            },
            scrollbar: {
                bg: 'blue',
            },
        },
    };

    private client: SkyChatClient;

    private cliScreen: blessed.Widgets.Screen;
    private cliRoomListBox: blessed.Widgets.ListElement;
    private cliUserListBox: blessed.Widgets.ListElement;
    private cliMessageBox: blessed.Widgets.BoxElement;
    private cliMessageInput: blessed.Widgets.TextboxElement;

    constructor(url: string) {
        this.client = new SkyChatClient(url);
        this.cliScreen = blessed.screen({
            title: 'SkyChat CLI',
        });
        this.cliMessageBox = blessed.box({
            top: 0,
            left: 0,
            width: `100%-${SkyChatCLI.SIDEBAR_WIDTH}`,
            height: `100%-${SkyChatCLI.MESSAGE_INPUT_SIZE}`,
            mouse: true,
            ...SkyChatCLI.BOX_DEFAULT_OPTIONS,
        });
        this.cliRoomListBox = blessed.list({
            top: 0,
            left: `100%-${SkyChatCLI.SIDEBAR_WIDTH}`,
            width: SkyChatCLI.SIDEBAR_WIDTH,
            height: '50%',
            mouse: true,
            interactive: false,
            ...SkyChatCLI.BOX_DEFAULT_OPTIONS,
        });
        this.cliUserListBox = blessed.list({
            bottom: 0,
            left: `100%-${SkyChatCLI.SIDEBAR_WIDTH}`,
            width: SkyChatCLI.SIDEBAR_WIDTH,
            height: '50%',
            mouse: true,
            ...SkyChatCLI.BOX_DEFAULT_OPTIONS,
        });
        this.cliMessageInput = blessed.textbox({
            bottom: 0,
            left: 0,
            width: `100%-${SkyChatCLI.SIDEBAR_WIDTH}-2`,
            height: SkyChatCLI.MESSAGE_INPUT_SIZE,
            keys: true,
            mouse: true,
            inputOnFocus: true,
            border: {
                type: 'line',
            },
        });
        this.cliScreen.append(this.cliMessageBox);
        this.cliScreen.append(this.cliRoomListBox);
        this.cliScreen.append(this.cliUserListBox);
        this.cliScreen.append(this.cliMessageInput);
        this._bind();
    }

    _bind() {
        this.client.on('message', (message: SanitizedMessage) => {
            this.printMessage(message);
        });
        this.client.on('messages', (messages: SanitizedMessage[]) => {
            messages.forEach(this.printMessage.bind(this));
        });
        this.client.on('room-list', this.renderRoomList.bind(this));
        this.client.on('join-room', this.renderRoomList.bind(this));
        this.client.on('connected-list', this.renderUserList.bind(this));
        this.client.on('auth-token', saveToken);

        // Exit on ctrl+c, esc, or q
        this.cliScreen.key(['escape', 'C-c'], () => process.exit(0));
        this.cliMessageInput.key(['escape', 'C-c'], () => process.exit(0));

        // Submit message on enter
        this.cliMessageInput.key('enter', this.sendMessage.bind(this));

        // On select room
        this.cliRoomListBox.on('select', (_item, index) => {
            this.client.join(this.client.state.rooms[index].id);
        });
    }

    connect(
        credentials: ConnectCredentials | ConnectToken | ConnectGuest,
    ): Promise<void> {
        return new Promise((resolve) => {
            const isAllDataReceived = () => {
                return (
                    this.client.state.rooms.length > 0 &&
                    this.client.state.currentRoomId === null
                );
            };

            const continueWhenReady = () => {
                if (!isAllDataReceived()) {
                    return;
                }

                // If yes, join first room
                const availableRoom = this.client.state.rooms.find(
                    (room) => !room.isPrivate && !room.plugins.roomprotect,
                );
                if (!availableRoom) {
                    throw new Error('No available room to join');
                }
                this.client.join(availableRoom.id);

                // If credentials are provided, login
                if (credentials.mode === 'credentials') {
                    this.client.once('set-user', resolve);
                    this.client.login(credentials.user, credentials.password);
                } else if (credentials.mode === 'token') {
                    this.client.setToken(credentials.token, availableRoom.id);
                } else {
                    resolve();
                }
            };

            this.client.connect();
            this.client.once('room-list', continueWhenReady);
            this.client.once('join-room', continueWhenReady);
        });
    }

    printMessage(message: SanitizedMessage) {
        this.cliMessageBox.pushLine(
            `[${message.user.username}] ${message.content}`,
        );
        this.cliMessageBox.scrollTo(this.cliMessageBox.getScrollHeight());
        this.cliScreen.render();
    }

    sendMessage() {
        // Retrieve message and clear input
        const message = this.cliMessageInput.getValue();
        this.cliMessageInput.clearValue();
        this.cliScreen.render();

        // Send message
        this.client.sendMessage(message);
    }

    renderRoomList() {
        this.cliRoomListBox.setItems(
            this.client.state.rooms.map((room) => {
                // If room is current room, add a star
                const star =
                    room.id === this.client.state.currentRoomId ? '*' : ' ';
                return `${star} ${room.name}`;
            }),
        );
        this.cliScreen.render();
    }

    renderUserList() {
        this.cliUserListBox.setItems(
            this.client.state.connectedList.map((connectedUser) => {
                const star = connectedUser.deadSinceTime ? '~' : ' ';
                return `${star} ${connectedUser.user.username}`;
            }),
        );
        this.cliScreen.render();
    }
}
