import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Card extends Component<object> {
    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
    }
}