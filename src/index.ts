import { SkyChatClient } from 'skychat';
import { SanitizedMessage } from 'skychat/build/server';

const [ , , HOST, USER, PASS] = process.argv;
const URL = `wss://${HOST}/ws`;

console.log(URL);
const client = new SkyChatClient(URL);


function connect(): Promise<void> {
    return new Promise(resolve => {
        client.connect();

        function continueIfLoadingComplete() {
            if (client.state.rooms.length === 0 || !!client.state.currentRoom) {
                return;
            }
            client.join(0);
            if (USER && PASS) {
                client.once('set-user', () => {
                    resolve();
                });
                client.login(USER, PASS);
            } else {
                resolve();
            }
        }

        client.once('room-list', continueIfLoadingComplete);
        client.once('join-room', continueIfLoadingComplete);
    });
}

function bind() {
    client.on('message', (message: SanitizedMessage) => {
        printMessage(message);
    });
    client.on('messages', (messages: SanitizedMessage[]) => {
        messages.forEach(printMessage);
    });
}

function printMessage(message: SanitizedMessage) {
    console.log(`[${message.user.username}] ${message.content}`);
}

(async () => {
    bind();
    await connect();
    console.log('_____________________');
})();
