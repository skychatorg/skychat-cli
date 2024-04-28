import blessed from 'blessed';
import { SkyChatClient } from 'skychat';

export abstract class Page {
    public readonly client: SkyChatClient;
    protected readonly screen: blessed.Widgets.Screen;

    constructor(client: SkyChatClient, screen: blessed.Widgets.Screen) {
        this.client = client;
        this.screen = screen;
    }

    render(): void {}
}
