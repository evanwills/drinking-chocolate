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
  ratio : number = 0.45;


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

  /**
   * Increment the coco proportion of the ration by 0.1%
   * 
   * > NOTE: On mobile it's very hard to control the range slider 
   * >       accurately. The button this event handler is triggerd
   * >       by helps users fine tune the ratio on mobile
   */
  private _increaseCoco () : void {
    if (this.ratio < 1) {
      this.ratio += 0.001;
    }
  }

  /**
   * Increment the suger proportion of the ration by 0.1%
   * 
   * > NOTE: On mobile it's very hard to control the range slider 
   * >       accurately. The button this event handler is triggerd
   * >       by helps users fine tune the ratio on mobile
   */
  private _increaseSugar () : void {
    if (this.ratio > 0) {
      this.ratio -= 0.001;
    }
  }

  private _containerChange (e : Event) : void {
    const input = e.target as HTMLInputElement;
    const tmp : Tingredient = {
      id: input.id,
      net: parseFloat(input.value),
      type: input.type,
    }

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

  private _getRequiredInner(diff : number) : string {
    let prefix = '';

    if (diff > 0) {
      prefix = 'Needed';
    } else if (diff < 0) {
      prefix = 'Excess';
      diff *= -1
    }

    return (prefix !== '')
      ? prefix + ': ' + diff.toString() + 'g'
      : '';
  }

  private _getRequiredCoco() : string {
    return (this.sugar > 0)
      ? this._getRequiredInner(this._requiredCoco() - this.coco)
      : '';
  }

  private _getRequiredSugar() : string {
    return (this.coco > 0)
      ? this._getRequiredInner(this._requiredSugar() - this.sugar)
      : '';
  }


  render() {
    return html`
      <h1>Drinking chocolate calculator</h1>
      <div class="ratio-wrap">
        <button class="ratio-move ratio-move--coco-up" @click=${this._increaseCoco}>
          <span class="sr-only">Increase coco</span>
        </button>
        <span>
          <label for="ratio" class="ratio-label">Coco to sugar ratio</label>
          <input type="range" id="ratio" 
                 value="${this.ratio * 100}" 
                 name="ratio" 
                 min="20" 
                 max="80" 
                 step="0.1" 
                @input=${this._calcRatio} />
          <span class="ratio-str">${this._renderRatio()}</span>
        </span>
        <button class="ratio-move ratio-move--sugar-up" @click=${this._increaseSugar}>
          <span class="sr-only">Increase sugar</span>
        </button>
      </div>
      ${(this.coco > 0 || this.sugar > 0)
        ? html`
          <table>
            <thead>
              <tr>
                <td>&nbsp;</td>
                <th>Coco</th>
                <th>Sugar</th>
                <td>&nbsp;</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="actual">Actual</td>
                <td class="actual"><span class="sr-only">Actual:</span> ${this.coco}g</td>
                <td class="required"><span class="sr-only">Required:</span> ${this._requiredSugar()}g</td>
                <td class="required">${this._getRequiredSugar()}</td>
              </tr>
              <tr>
                <td class="required">${this._getRequiredCoco()}</td>
                <td class="required"><span class="sr-only">Required:</span> ${this._requiredCoco()}g</td>
                <td class="actual"><span class="sr-only">Actual:</span> ${this.sugar}g</td>
                <td class="actual">Actual</td>
              </tr>
            </tbody>
          </table>`
        : ''
      }
      <ul>
        ${this.containers.map((box : Tingredient) : TemplateResult => html`
        <li>
          <ingredient-container id="${box.id}" container="66" @keyup=${this._containerChange} @deletecontainer=${this._deleteContainer} .coco="${this.coco}" .sugar="${this.sugar}"></ingredient-container>
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
      list-style-type: none;
      margin: 2rem 0;
      padding: 0;
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
    thead td {
      border: none;
    }
    tbody td:first-child {
      border-left: none;
    }
    tbody td {
      text-align: right;
    }
    tbody td:nth-of-type(4) {
      text-align: left;
    }
    button {
      background-color: #1a1a1a;
      border: 1px solid transparent;
      border-radius: 0.25rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 1em;
      font-weight: 500;
      padding: 0.6em 1.2em;
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
      align-items: stretch;
      column-gap: 1rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      text-align: center;
    }
    .ratio-wrap span {
      flex-grow: 1;
    }
    .ratio-move {
      background-color: transparent;
      flex-grow: 2;
      max-width: 3.5rem;
      position: relative;
    }
    .ratio-move::before {
      text-shadow: 0 0 0.5rem rgba(200, 255, 255, 0.7);
      content: '→';
      font-size: 2rem;
      font-weight: bold;
      left: 50%;
      position: absolute;
      top: 50%;
    }
    .ratio-move--coco-up::before {
      transform: translate(-50%, -50%) rotate(270deg);
    }
    .ratio-move--sugar-up::before {
      transform: translate(-50%, -50%) rotate(90deg);
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

    #add-container {
      display: block;
      /* border: none; */
      border-radius: 0.25rem;
      box-shadow: 0 0 0.5rem -0.1rem #fff;
      width: 100%;
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
