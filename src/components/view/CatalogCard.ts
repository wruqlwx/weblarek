import { ProductCard } from './ProductCard';
import { IEvents } from '../base/Events';

export class CatalogCard extends ProductCard {
    constructor(
        container: HTMLElement, 
        events: IEvents,
        onClick?: () => void,
        onAction?: () => void
    ) {
        super(container, events, onClick, onAction);
    }
}