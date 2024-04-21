import blessed from 'blessed';

/**
 * Prefix used to filter environment variables.
 */
export const ENV_PREFIX = 'SKYCHAT_';

/**
 * CLI screen title
 */
export const SCREEN_TITLE = 'SkyChat CLI';

/**
 * Default display for blessed boxes
 */
export const BOX_DEFAULT_OPTIONS: blessed.Widgets.BoxOptions = {
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'cyan',
        },
    },
    border: {
        type: 'line',
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
        scrollbar: {
            bg: 'blue',
        },
    },
};
