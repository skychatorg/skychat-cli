import blessed from 'blessed';
import { BOX_DEFAULT_OPTIONS, CHAT_PLAYER_HEIGHT, CHAT_PLAYER_PROGRESSBAR_WIDTH } from '../../constants.js';
import { Page } from '../page/Page.js';
import { Component } from './Component.js';

export class Player extends Component<blessed.Widgets.BoxElement> {
    private readonly progressBar: blessed.Widgets.ProgressBarElement;
    private readonly infoText: blessed.Widgets.TextElement;

    private readonly tickInterval: NodeJS.Timeout;

    constructor(page: Page, options: Partial<blessed.Widgets.BoxOptions>) {
        super(
            page,
            blessed.box({
                ...BOX_DEFAULT_OPTIONS,
                ...options,
                border: undefined,
            }),
        );

        this.infoText = blessed.text({
            content: 'No media playing',
            width: `100%-${CHAT_PLAYER_PROGRESSBAR_WIDTH}`,
            height: CHAT_PLAYER_HEIGHT,
        });

        this.progressBar = blessed.progressbar({
            orientation: 'horizontal',
            filled: 0,
            height: CHAT_PLAYER_HEIGHT,
            right: 0,
            width: CHAT_PLAYER_PROGRESSBAR_WIDTH,
            style: {
                bar: { bg: 'blue' },
                filled: { bg: 'blue' },
            },
        });

        this.element.append(this.infoText);
        this.element.append(this.progressBar);

        this.bind();

        this.tickInterval = setInterval(this.updateAndRender.bind(this), 1000);
    }

    protected bind(): void {
        this.page.client.on('player-sync', this.updateAndRender.bind(this));
    }

    update() {
        const currentMedia = this.page.client.state.player.current;
        if (!currentMedia) {
            this.progressBar.setProgress(0);
            this.infoText.setContent('No media playing');
            return;
        }
        const startTime = currentMedia.video.startTime ?? 0;
        const duration = currentMedia.video.duration ?? 0;
        const currentTime = Date.now() - startTime;
        const progress = (currentTime / duration) * 100;
        const remaining = Math.max(0, Math.floor((duration - currentTime) / 1000));
        this.progressBar.setProgress(progress);
        this.progressBar.setContent(` ${remaining}s`);
        this.infoText.setContent(`\n${'~'.repeat(4)} ${currentMedia.video.type} / ${currentMedia.video.title}`);
    }

    destroy() {
        clearInterval(this.tickInterval);
        super.destroy();
    }
}
