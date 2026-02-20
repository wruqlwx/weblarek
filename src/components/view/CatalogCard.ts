import { Card } from './Card';
import { IEvents } from '../base/Events';

export class CatalogCard extends Card {
    constructor(container: HTMLElement, events: IEvents) {
        console.log('CatalogCard constructor container:', container);
        super(container, events);
    }
}