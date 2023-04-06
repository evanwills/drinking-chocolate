import { LitElement, TemplateResult } from 'lit';
import type { Tingredient } from './vite-env.d';
import './ingredient-container';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class DrinkingChocolate extends LitElement {
    /**
     * Copy for the read the docs hint.
     */
    ratio: number;
    /**
     * The number of times the button has been clicked.
     */
    coco: number;
    /**
     * The number of times the button has been clicked.
     */
    sugar: number;
    containers: Tingredient[];
    private _id;
    private _calcRatio;
    /**
     * Increment the coco proportion of the ration by 0.1%
     *
     * > NOTE: On mobile it's very hard to control the range slider
     * >       accurately. The button this event handler is triggerd
     * >       by helps users fine tune the ratio on mobile
     */
    private _increaseCoco;
    /**
     * Increment the suger proportion of the ration by 0.1%
     *
     * > NOTE: On mobile it's very hard to control the range slider
     * >       accurately. The button this event handler is triggerd
     * >       by helps users fine tune the ratio on mobile
     */
    private _increaseSugar;
    private _containerChange;
    private _deleteContainer;
    private _addContainer;
    private _renderRatio;
    private _requiredCoco;
    private _requiredSugar;
    private _getRequiredInner;
    private _getRequiredCoco;
    private _getRequiredSugar;
    render(): TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'drinking-chocolate': DrinkingChocolate;
    }
}
