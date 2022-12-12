import { LitElement, css, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Tingredient } from './vite-env.d';
import { IngredientContainer } from './ingredient-container';

import './ingredient-container';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('drinking-chocolate')
export class DrinkingChocolate extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property({ reflect: true, type: Number })
  ratio : number = 0.40;


  /**
   * The number of times the button has been clicked.
   */
  @property({ reflect: true, type: Number })
  coco = 0;

  /**
   * The number of times the button has been clicked.
   */
  @property({ reflect: true, type: Number })
  sugar = 0;

  @state()
  containers : Tingredient[] = [];

  private _id : number = 0;

  private _calcRatio (e : Event) : void {
    const input = e.target as HTMLSelectElement;
    this.ratio = (
      Math.round(
        (parseFloat(input.value) / 100) * 1000
      ) / 1000
    );
  }

  private _containerChange (e : Event) : void {
    const input = e.target as Tingredient;
    const tmp : Tingredient = {
      type: input.type,
      net: parseFloat(input.net),
      id: input.id
    }
    console.log('tmp:', tmp);

    let updated = false;
    for (let a = 0; a < this.containers.length; a += 1) {
      if (this.containers[a].id === tmp.id) {
        this.containers[a] = tmp;
        updated = true;
        break;
      }
    }

    if (updated === false) {
      this.containers.push(tmp);
    }

    let coco = 0;
    let sugar = 0;

    for (let a = 0; a < this.containers.length; a += 1) {
      if (this.containers[a].type === 'Coco') {
        coco += this.containers[a].net;
      } else {
        console.log('container[' + a + ']', this.containers[a])
        sugar += this.containers[a].net;
      }
    }

    this.coco = coco;
    this.sugar = sugar;

    console.log('container changed')
    console.log('coco:', coco)
    console.log('sugar:', sugar)
    console.log('ratio:', this.ratio)
    this.requestUpdate();
  }

  private _deleteContainer (e : Event) : void {
    const input = e.target as IngredientContainer;

    console.log('inside _deleteContainer()')
    this.containers = this.containers.filter(
      (item: Tingredient) : boolean => (item.id !== input.id)
    )
    this.requestUpdate();
  }

  private _addContainer (_e : Event) : void {
    this._id += 1;
    this.containers.push({
      id: 'box-' + this._id,
      type: '',
      net: 0
    });
    console.log('_addContainer()')
    this.requestUpdate();
  }

  private _renderRatio () : TemplateResult {
    const coco = Math.round(this.ratio * 10000) / 100

    return html`(Coco) ${coco} : ${(100 - coco)} (Sugar)`;
  }

  private _requiredCoco() : number {
    return Math.round((this.sugar / (100 * (1 - this.ratio))) * (100 * this.ratio))
  }

  private _requiredSugar() : number {
    return Math.round((this.coco / (100 * this.ratio)) * (100 * (1 - this.ratio)))
  }


  render() {
    return html`
      <h1>Drinking chocolate calculator</h1>
      <div class="ratio-wrap">
        <label for="ratio" class="ratio-label">Coco to sugar ratio</label>
        <input type="range" id="ratio" value="${this.ratio * 100}" name="ratio" min="20" max="80" step="0.1" @change=${this._calcRatio} />
        <span class="ratio-str">${this._renderRatio()}</span>
      </div>
      ${(this.coco > 0 || this.sugar > 0)
        ? html`
          <table>
            <thead>
              <tr>
                <th>Coco</th>
                <th>Sugar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="actual"><span class="sr-only">Actual:</span> ${this.coco}g</td>
                <td class="required"><span class="sr-only">Required:</span> ${this._requiredSugar()}g</td>
              </tr>
              <tr>
                <td class="required"><span class="sr-only">Required:</span> ${this._requiredCoco()}g</td>
                <td class="actual"><span class="sr-only">Actual:</span> ${this.sugar}g</td>
              </tr>
            </tbody>
          </table>`
        : ''
      }
      <ul>
        ${this.containers.map((box : Tingredient) : TemplateResult => html`
        <li>
          <ingredient-container id="${box.id}" container="66" @change=${this._containerChange} @deletecontainer=${this._deleteContainer}></ingredient-container>
        </li>
        `)}
      </ul>
      <button id="add-container" @click=${this._addContainer}>Add container</button>
    `
  }

  static styles = css`
    :host {
      margin: 1rem auto;
      padding:
    }
    h1 {
      font-size: 1.5rem;
    }
    ul {
      margin: 2rem 0;
      list-style-type: none;
    }
    table {
      border-collapse: collapse;
      margin: 2rem auto 0;
    }
    td, th {
      border-left: 0.05rem solid #fff;
      border-top: 0.05rem solid #fff;
      padding: 0.5rem 1rem;
    }
    th {
      border-top: none;
    }
    thead th:first-child {
      border-left: none;
    }
    tbody td:first-child {
      border-left: none;
    }
    tbody td {
      text-align: right;
    }
    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
    .ratio-wrap {

      text-align: center;
    }
    .ratio-str, .ratio-label {
      display: block;
    }
    .actual {
      color: #0f0
    }
    .required {
      color: #ff8f00;
    }
    .sr-only {
      border: 0;
      clip: rect(0, 0, 0, 0);
      clip-path: inset(100%);
      height: 1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'drinking-chocolate': DrinkingChocolate
  }
}
