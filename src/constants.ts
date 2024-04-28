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
 * Chat sidebar width
 */
export const CHAT_SIDEBAR_WIDTH = 32;
export const CHAT_MESSAGE_INPUT_HEIGHT = 3;
export const CHAT_PLAYER_HEIGHT = 1;
export const CHAT_PLAYER_PROGRESSBAR_WIDTH = 20;

/**
 * Default display for blessed boxes
 */
export const BOX_DEFAULT_OPTIONS: blessed.Widgets.BoxOptions = {
    mouse: true,
    scrollable: true,
    alwaysScroll: false,
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
