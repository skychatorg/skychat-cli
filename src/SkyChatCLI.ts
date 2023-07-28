import blessed from 'blessed';
import { SkyChatClient } from 'skychat';
import { SanitizedMessage } from 'skychat/build/server';


export class SkyChatCLI {

    public static readonly MESSAGE_INPUT_SIZE: number = 3;

    private client: SkyChatClient;

    private cliScreen: blessed.Widgets.Screen;
    private cliMessageBox: blessed.Widgets.BoxElement;
    private cliMessageInput: blessed.Widgets.TextboxElement;

    constructor(url: string, ) {
        this.client = new SkyChatClient(url);
        this.cliScreen = blessed.screen({
            title: 'SkyChat CLI',
        });
        this.cliMessageBox = blessed.box({
            top: 0,
            left: 0,
            width: '100%',
            height: `100%-${SkyChatCLI.MESSAGE_INPUT_SIZE}`,
            scrollable: true,
            alwaysScroll: true,
            mouse: true,
            border: {
                type: 'line'
            },
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'cyan'
                },
            },
            style: {
                fg: 'white',
                bg: 'black',
                border: {
                    fg: '#f0f0f0'
                },
                scrollbar: {
                    bg: 'blue'
                },
            },
        });
        this.cliMessageInput = blessed.textbox({
          bottom: 0,
          left: 1,
          height: SkyChatCLI.MESSAGE_INPUT_SIZE,
          width: '100%-2',
          keys: true,
          mouse: true,
          inputOnFocus: true,
          border: {
            type: 'line'
          }
        });
        this.cliScreen.append(this.cliMessageBox);
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
        this.cliScreen.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));
        this.cliMessageInput.key(['escape', 'q', 'C-c'], (ch, key) => (process.exit(0)));
        this.cliMessageInput.key('enter', this.sendMessage.bind(this));
    }

    connect(credentials?: { username: string, password: string }): Promise<void> {
        const isDataReceived = () => {
            return this.client.state.rooms.length > 0 && !!this.client.state.currentRoom;
        };

        return new Promise(resolve => {
            const continueWhenReady = () => {
                if (! isDataReceived()) {
                    return;
                }

                // If yes, join first room
                this.client.join(this.client.state.rooms[0].id);

                // If credentials are provided, login
                if (credentials?.username && credentials?.password) {
                    this.client.once('set-user', resolve);
                    this.client.login(credentials.username, credentials.password);
                } else {
                    // Otherwise, nothing to do anymore
                    resolve();
                }
            }
    
            this.client.connect();
            this.client.once('room-list', continueWhenReady);
            this.client.once('join-room', continueWhenReady);
        });
    }


    printMessage(message: SanitizedMessage) {
        this.cliMessageBox.pushLine(`[${message.user.username}] ${message.content}`);
        this.cliMessageBox.scrollTo(this.cliMessageBox.getScrollHeight());
        this.cliScreen.render();
    }

    sendMessage() {
        const message = this.cliMessageInput.getValue();
        this.cliMessageInput.clearValue();
        this.cliScreen.render();
        this.client.sendMessage(message);
    }
}
