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
   * The current amount of coco
   */
  @property({ reflect: true, type: Number })
  coco : number = 0;

  /**
   * The number of times the button has been clicked.
   */
  @property({ reflect: true, type: Number })
  grose = 0;

  /**
   * The number of times the button has been clicked.
   */
  @property({ reflect: true, type: Number })
  value = 0;

  /**
   * The current amount of sugar
   */
  @property({ reflect: true, type: Number })
  sugar : number = 0;

  /**
   * Ingredient type (coco or sugar)
   */
  @property({ reflect: true, type: String })
  ingredient : string = 'Coco';

  @state()
  minimise : boolean = false;

  @state()
  _init : boolean = false;

  @state()
  type : string = 'Coco';

  /**
   * Process changes to ingredient type
   *
   * @param e
   */
  private _ingredientChange (e : Event) : void {
    const input = e.target as HTMLSelectElement;
    const oldType = this.type;
    this.type = (input.value === 'Coco')
        ? 'Coco'
        : 'Sugar';

    if (this.type !== oldType) {
      console.group('_ingredientChange()')
      console.log('oldType:', oldType);
      console.log('this.type:', this.type);
      console.groupEnd();
      this.requestUpdate();

      if (this.value > 0) {
          this.dispatchEvent(new Event('change'));
      }
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
    console.group('_calculate()');
    console.log('this.grose:', this.grose);
    console.log('isNaN(this.grose):', isNaN(this.grose));
    console.log('this.container:', this.container);
    console.log('isNaN(this.container):', isNaN(this.container));

    if (isNaN(this.container) !== true && isNaN(this.grose) !== true) {
      this.value = (this.grose - this.container);
      const oldMin = this.minimise;

      if (this.value < 0) {
        this.value = 0;
      }
      
      if (this.value > 0 && this.type !== '') {
        this.dispatchEvent(new Event('change'));
        this.minimise = true;
      } else {
        this.minimise = false;
      }
      
      if (this.minimise !== oldMin) {
        this.requestUpdate();
      }
    }
    console.groupEnd();
  }

  private _delete(_e: Event) : void {
    console.log('delete-container')
    this.dispatchEvent(new Event('deletecontainer'));
  }



  render() {
    if (this._init === false) {
      this._init = true;

      this.type = (this.coco > 0 && this.coco > this.sugar)
        ? 'Sugar'
        : 'Coco';
    }

    return html`
      <div class="ingredient-container">
        <p>
            <strong>${this.type}:</strong> ${this.value}g
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
                <input id="container" type="number" .value="${this.container}" min="0" step="0.1" @keyup=${this._containerChange} />
            </li>
            <li>
                <label for="grose">Grose weight</label>
                <input id="grose" type="number" value="${this.grose}" min="0" step="0.1" @keyup=${this._groseChange} title="Total weight of container and ingridents" />
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
      padding: 0rem;
      text-align: center;
      box-sizing: border-box;
    }

    ul {
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
    li {
      display: flex;
      justify-content: space-betweek;
      gap: 0.5rem;
      padding: 0 0 0.5rem;
    }
    label { 
      display: inline-block; 
      text-align: right;
      width: 7.75rem; 
    }
    input, select {
      flex-grow: 1;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'ingredient-container': IngredientContainer
  }
}
