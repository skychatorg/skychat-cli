import { SkyChatClient } from 'skychat';

export abstract class Page {
    protected readonly _client: SkyChatClient;

    constructor(client: SkyChatClient) {
        this._client = client;
    }

    get client(): SkyChatClient {
        return this._client;
    }

    render(): void {}
    destroy(): void {}
}
