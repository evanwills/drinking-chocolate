import { LitElement } from 'lit';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class IngredientContainer extends LitElement {
    /**
     * Copy for the read the docs hint.
     */
    container: number;
    /**
     * The current amount of coco
     */
    coco: number;
    /**
     * The number of times the button has been clicked.
     */
    grose: number;
    /**
     * The number of times the button has been clicked.
     */
    value: number;
    /**
     * The current amount of sugar
     */
    sugar: number;
    /**
     * Ingredient type (coco or sugar)
     */
    ingredient: string;
    minimise: boolean;
    _init: boolean;
    type: string;
    /**
     * Process changes to ingredient type
     *
     * @param e
     */
    private _ingredientChange;
    /**
     * Process changes to container weight
     *
     * @param e
     */
    private _containerChange;
    /**
     * Process changes to grose weight
     *
     * @param e
     */
    private _groseChange;
    /**
     * Calculate net weight and dispatch change event if appropriate
     */
    private _calculate;
    private _delete;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'ingredient-container': IngredientContainer;
    }
}
