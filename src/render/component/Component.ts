import blessed from 'blessed';
import { Page } from '../page/Page';

export abstract class Component<T extends blessed.Widgets.BlessedElement> {
    protected readonly page: Page;

    protected readonly element: T;

    constructor(page: Page, element: T) {
        this.page = page;
        this.element = element;

        this.bind();
    }

    getElement(): T {
        return this.element;
    }

    protected bind(): void {}

    protected update(): void {}

    protected render(): void {
        this.page.render();
    }

    updateAndRender() {
        this.update();
        this.render();
    }
}
