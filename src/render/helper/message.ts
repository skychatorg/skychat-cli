import blessed from 'blessed';
import beautifyUrl from 'beautify-url';
import { SanitizedMessage } from 'skychat/build/server';

const USERNAME_MAX_LEN = 16;

const LINK_REGEXP: RegExp =
    /(^|[ \n]|<br>)((http|https):\/\/[\w?=&./-;#~%+@,[\]:!-]+(?![\w\s?&./;#~%"=+@,[\]:!-]*>))/gi;

function replaceRisiBankStickers(message: string) {
    return message.replace(
        /https:\/\/risibank.fr\/cache\/medias\/(\d+)\/(\d+)\/(\d+)\/(\d+)\/(\w+)\.(jpg|jpeg|gif|png)/g,
        '',
    );
}

function replaceLinks(text: string) {
    return text.replace(LINK_REGEXP, (_match, p1, fullHref) => `${p1}{underline}${beautifyUrl(fullHref)}{/underline}`);
}

export function renderMessage(element: blessed.Widgets.BoxElement, message: SanitizedMessage, last: boolean) {
    const width = element.width as number; // TODO: Why is the cast necessary here?!
    const margin = 6; // Account for scrollbar and horizontal padding

    const firstColWidth = USERNAME_MAX_LEN + 4;
    const secondColWidth = width - firstColWidth - margin;

    // Format message content
    let formattedContent = blessed.escape(message.content);
    formattedContent = replaceRisiBankStickers(formattedContent);
    formattedContent = replaceLinks(formattedContent);

    // Compute how many lines will the message take
    const chunks: string[] = [];
    for (const line of formattedContent.split('\n')) {
        for (let i = 0; i < line.length; i += secondColWidth) {
            chunks.push(line.substring(i, i + secondColWidth));
        }
    }

    // Show all usernames with same length
    let truncatedUsername = message.user.username;
    if (truncatedUsername.length > USERNAME_MAX_LEN) {
        truncatedUsername = truncatedUsername.substring(0, USERNAME_MAX_LEN - 2) + '..';
    }
    const username = ' ' + truncatedUsername.padStart(USERNAME_MAX_LEN);

    // Pad each content additional line with username length
    const chunkedContent: string = chunks
        .map((val: string, index: number) => {
            if (index === 0) {
                return val;
            }
            return ' '.repeat(firstColWidth) + val;
        })
        .join('\n');

    // Color
    const color = last ? '{#555555-bg}' : '';

    return `{/}${color}${username} | ${chunkedContent}`;
}
