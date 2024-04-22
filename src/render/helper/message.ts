import blessed from 'blessed';
import { SanitizedMessage } from 'skychat/build/server';

const USERNAME_MAX_LEN = 16;

export function renderMessage(element: blessed.Widgets.BoxElement, message: SanitizedMessage) {
    const width = element.width as number; // TODO: Why is the cast necessary here?!
    const margin = 8;

    const firstColWidth = USERNAME_MAX_LEN + 3;
    const secondColWidth = width - firstColWidth - margin;

    // Compute how many lines will the message take
    const chunks: string[] = [];
    for (const line of message.content.split('\n')) {
        for (let i = 0; i < line.length; i += secondColWidth) {
            chunks.push(line.substring(i, i + secondColWidth));
        }
    }

    // Show all usernames with same length
    let truncatedUsername = message.user.username;
    if (truncatedUsername.length > USERNAME_MAX_LEN) {
        truncatedUsername = truncatedUsername.substring(0, USERNAME_MAX_LEN - 2) + '..';
    }
    const username = truncatedUsername.padStart(USERNAME_MAX_LEN);

    // Pad each content additional line with username length
    const content: string = chunks
        .map((val: string, index: number) => {
            if (index === 0) {
                return val;
            }
            return ' '.repeat(USERNAME_MAX_LEN) + '   ' + val;
        })
        .join('\n');

    return `${username} | ${content}`;
}
