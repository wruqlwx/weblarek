import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Gallery extends Component<object> {
    protected _container: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._container = container;
    }

    set items(items: HTMLElement[]) {
        this._container.replaceChildren(...items);
    }
}