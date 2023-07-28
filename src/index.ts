import blessed from 'blessed';
import { SkyChatCLI } from './SkyChatCLI';


const [ , , HOST, USER, PASS] = process.argv;
const URL = `wss://${HOST}/ws`;

(async () => {
    console.log(URL);
    console.log('_______________');
    await new SkyChatCLI(URL)
        .connect({ username: USER, password: PASS })
})();
