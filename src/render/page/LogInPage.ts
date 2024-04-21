import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS, SCREEN_TITLE } from '../../constants';
import { Page } from './Page';
import { SkyChatClient } from 'skychat';

export class LogInPage extends Page {
    static readonly MARGIN = 5;

    private screen: blessed.Widgets.Screen;

    constructor(client: SkyChatClient) {
        super(client);

        this.screen = blessed.screen({
            title: SCREEN_TITLE,
        });

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

    destroy() {
        this.screen.destroy();
    }
}
