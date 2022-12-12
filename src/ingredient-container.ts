import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('ingredient-container')
export class IngredientContainer extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property({ reflect: true, type: Number })
  container : number = 0;

  /**
   * The number of times the button has been clicked.
   */
  @property({ reflect: true, type: Number })
  grose = 0;

  /**
   * The number of times the button has been clicked.
   */
  @property({ reflect: true, type: Number })
  net = 0;

  /**
   * Ingredient type (coco or sugar)
   */
  @property({ reflect: true, type: String })
  type : string = 'Coco';

  @state()
  minimise : boolean = false

  /**
   * Process changes to ingredient type
   *
   * @param e
   */
  private _ingredientChange (e : Event) : void {
    const input = e.target as HTMLSelectElement;
    this.type = (input.value === 'coco')
        ? 'Coco'
        : 'Sugar';

    if (this.net > 0) {
        this.dispatchEvent(new Event('change'));
    }
  }

  /**
   * Process changes to container weight
   *
   * @param e
   */
  private _containerChange (e : Event) : void {
    const input = e.target as HTMLInputElement;
    this.container = parseFloat(input.value);

    this._calculate();
  }

  /**
   * Process changes to grose weight
   *
   * @param e
   */
  private _groseChange (e : Event) : void {
    const input = e.target as HTMLInputElement;
    this.grose = parseFloat(input.value);

    this._calculate();
  }

  /**
   * Calculate net weight and dispatch change event if appropriate
   */
  private _calculate() : void {
    this.net = (this.grose - this.container);
    const oldMin = this.minimise;

    if (this.net < 0) {
        this.net = 0;
    }

    if (this.net > 0 && this.type !== '') {
        this.dispatchEvent(new Event('change'));
        this.minimise = true;
    } else {
        this.minimise = false;
    }

    if (this.minimise !== oldMin) {
        this.requestUpdate();
    }
  }

  private _delete(_e: Event) : void {
    console.log('delete-container')
    this.dispatchEvent(new Event('deletecontainer'));
  }



  render() {
    return html`
      <div class="ingredient-container">
        <p>
            <strong>${this.type}:</strong> ${this.net}g
        </p>
        <ul class="${(this.minimise) ? 'minimise' : ''}">
            <li>
                <label for="ingredient">Ingredient</label>
                <select id="ingredient" @change=${this._ingredientChange}>
                    <option value="Coco" ?selected=${this.type === 'Coco'}>Coco</option>
                    <option value="Sugar" ?selected=${this.type === 'Sugar'}>Sugar</option>
                </select>
            </li>
            <li>
                <label for="container">Container weight</label>
                <input id="container" type="number" .value="${this.container}" min="0" step="0.1" @change=${this._containerChange} />
            </li>
            <li>
                <label for="grose">Grose weight</label>
                <input id="grose" type="number" value="${this.grose}" min="0" step="0.1" @change=${this._groseChange} title="Total weight of container and ingridents" />
            </li>
        </ul>
        <button id="delete" @click=${this._delete}>Delete</button>
      </div>
    `
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    ul {
        // display: none;
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    ul.minimise {
        display: none;
    }

    .ingredient-container:hover ul.minimise,
    .ingredient-container:focus-within ul.minimise {
        display: block;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'ingredient-container': IngredientContainer
  }
}
