import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS } from '../../constants.js';
import { Page } from './Page.js';
import { SkyChatClient } from 'skychat';

export class LogInPage extends Page {
    static readonly MARGIN = 5;

    constructor(client: SkyChatClient, screen: blessed.Widgets.Screen) {
        super(client, screen);

        this.screen.append(
            blessed.box({
                ...BOX_DEFAULT_OPTIONS,
                top: LogInPage.MARGIN,
                left: LogInPage.MARGIN,
                width: `100%-${LogInPage.MARGIN * 2}`,
                height: `100%-${LogInPage.MARGIN * 2}`,
            }),
        );

        // Create 'login' text
        this.screen.append(
            blessed.text({
                top: LogInPage.MARGIN,
                left: 'center',
                content: 'Login',
            }),
        );
    }

    render() {
        this.screen.render();
    }
}
