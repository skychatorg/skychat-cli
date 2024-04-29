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
export const CHAT_PLAYER_HEIGHT = 2;
export const CHAT_PLAYER_PROGRESSBAR_WIDTH = 14;

export const CHAT_BG_COLOR = '#030303';
export const CHAT_BG_CONTRAST_COLOR = '#555555';
export const CHAT_FG_COLOR = 'white';

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
        fg: CHAT_FG_COLOR,
        bg: CHAT_BG_COLOR,
        border: {
            fg: '#f0f0f0',
        },
        scrollbar: {
            bg: 'blue',
        },
    },
};

export const LIST_DEFAULT_OPTIONS: blessed.Widgets.ListOptions<blessed.Widgets.ListElementStyle> = {
    ...BOX_DEFAULT_OPTIONS,
    style: {
        ...BOX_DEFAULT_OPTIONS.style,
        selected: {
            bg: CHAT_BG_CONTRAST_COLOR,
        },
        focus: {
            bg: CHAT_BG_CONTRAST_COLOR,
        },
    },
};
