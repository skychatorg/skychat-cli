import blessed from 'blessed';

export interface Component {
    getElement(): blessed.Widgets.BlessedElement;
}
