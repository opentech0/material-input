import { debounce } from '@opentech0/js-helpers';

class MaterialInput extends HTMLElement {

  constructor() { // eslint-disable-line no-useless-constructor
    super(); // always call super() first in the ctor. This also calls the extended class' ctor.
  }

  connectedCallback() {
    let value = '';
    // set value of material-input
    Object.defineProperty(this, 'value', {
      configurable: true,
      enumerable: true,
      get: function () {
        return value;
      },
      set: function (newValue) {
        value = !newValue ? '' : newValue;
        this._value(value);
        if (this.$input.value !== value) {
          this.$input.value = value;
        }
      }
    });

    this.hostMarginsVertical = '0.5em';

    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
            <style>
                :host{
                    display: block;
                    position: relative;
                    background: transparent;
                    margin-top: ${this.hostMarginsVertical};
                    margin-bottom: ${this.hostMarginsVertical};
                }
                .material-input__container{
                    width: inherit;
                    display: block;
                    position: relative;
                }
                .material-input__input{
                    box-sizing: border-box;
                    position: relative;
                    background-color: transparent;
                    font-size: var(--material-input-text-font-size, 1em);
										font-family: var(--material-input-text-font-family, inherit);
										letter-spacing: var(--material-input-text-letter-spacing, inherit);
										font-weight: var(--material-input-text-font-weight, inherit);
                    color: var(--material-input-text-color, black);
                    padding: var(--material-input-text-padding, 1.4em 1em .6em 0px);
                    display: block;
                    border-radius: 0;
                    width: 100%;
                    border: none;
                    border-bottom: var(--material-input-line-height, 1px) solid var(--material-input-border-color, rgb(206,212,218));
                    box-shadow: none;
                }
                /* Prevent iOS from zooming in on input fields */
                @supports (-webkit-touch-callout: none) {
                  .material-input__input {
                    font-size: initial !important;
                  }
                }
                .material-input__container.invalid .material-input__input{
                    border-bottom-color: var(--material-input-invalid-color, rgb(224,49,49));
                }
                .material-input__container.valid .material-input__input{
                    border-bottom-color: var(--material-input-valid-color, rgb(47,158,68));
                }
                .material-input__input:focus{
                    outline: none;
                }
                /* placeholder and placeholder fade on focus */
                .material-input__input::-webkit-input-placeholder {
										font-family: var(--material-input-text-font-family, inherit);
										letter-spacing: var(--material-input-text-letter-spacing, inherit);
										font-weight: var(--material-input-text-font-weight, inherit);
                    color: var(--material-input-placeholder-color, rgb(134,142,150));
                    opacity: 1;
                }
                .material-input__input:focus::-webkit-input-placeholder {
                    opacity: .5;
                    transition: opacity .35s ease;
                }
                .material-input__input::-moz-placeholder {
										font-family: var(--material-input-text-font-family, inherit);
										letter-spacing: var(--material-input-text-letter-spacing, inherit);
										font-weight: var(--material-input-text-font-weight, inherit);
                    color: var(--material-input-placeholder-color, rgb(134,142,150));
                    opacity: 1;
                }
                .material-input__input:focus::-moz-placeholder {
                    opacity: .5;
                    transition: opacity .35s ease;
                }
                .material-input__input:-ms-input-placeholder {
										font-family: var(--material-input-text-font-family, inherit);
										letter-spacing: var(--material-input-text-letter-spacing, inherit);
										font-weight: var(--material-input-text-font-weight, inherit);
                    color: var(--material-input-placeholder-color, rgb(134,142,150));
                    opacity: 1;
                }
                .material-input__input:-ms-input-placeholder {
                    opacity: .5;
                    transition: opacity .35s ease;
                }
                /* Labels */
                .material-input__label{
                    color: var(--material-input-placeholder-color, rgb(134,142,150));
                    font-size: inherit;
                    pointer-events: none;
                    position: absolute;
                    left: var(--material-input-placeholder-left, 0px);
                    top: var(--material-input-placeholder-top, 1.42em);
                    display: flex;
                    align-items: start;
                    gap: 5px;
                    transition: 0.2s ease all;
                }
                .material-input__label svg{
                  pointer-events: all;
                  cursor: pointer;
                  opacity: 1;
                  transition: 0.1s all;
                }
                .material-input__label svg path {
                  stroke: var(--material-input--svg-stroke, #3e36c7);
                }
                .material-input__container.no-animation .material-input__label,
                .material-input__container.label-always-floats .material-input__label{
                    transition: 0s ease all;
                }
                .material-input__container.is-empty .material-input__input[placeholder] ~ .material-input__label{
                    color: var(--material-input-text-color, black);
                }
                /* active state */
                .material-input__input:focus ~ .material-input__label,
                .material-input__container:not(.is-empty) .material-input__label,
                .material-input__container.label-always-floats .material-input__label{
                    top: .6em;
                    font-size: .75em;
                }
                .material-input__input:focus ~ .material-input__label svg,
                .material-input__container:not(.is-empty) .material-input__label svg,
                .material-input__container.label-always-floats .material-input__label svg{
                    opacity: 0;
                }
                .material-input__input:focus ~ .material-input__label,
                .material-input__container.is-empty .material-input__input[placeholder]:focus ~ .material-input__label{
                    color: var(--material-input-highlight-color, rgb(54,79,199));
                }
                .material-input__invalid-icon,
                .material-input__valid-icon,
                .material-input__invalid-text {
                  display: none;
                }
                .material-input__valid-icon {
                  position: absolute;
                  right: 0;
                  top: 50%;
                }

                .material-input__invalid-icon {
                  position: absolute;
                  right: 0;
                  top: calc(50% - 8px);
                }
                /* errror state */
                .material-input__container.invalid.label-always-floats .material-input__label,
                .material-input__container.invalid .material-input__input:focus ~ .material-input__label,
                .material-input__container.is-empty.invalid .material-input__input[placeholder]:focus ~ .material-input__label,
                .material-input__container.is-empty.invalid .material-input__input[placeholder] ~ .material-input__label{
                    color: var(--material-input-invalid-color, rgb(224,49,49));
                }
                .material-input__container.invalid  .material-input__invalid-text,
                .material-input__container.invalid  .material-input__invalid-icon {
                    display: block;
                    color: var(--material-input-invalid-color, rgb(224,49,49));
                }
                .material-input__container.invalid .material-input__bar {
                    display: none;
                }
                /* valid state */
                .material-input__container.valid.label-always-floats .material-input__label,
                .material-input__container.valid .material-input__input:focus ~ .material-input__label,
                .material-input__container.is-empty.valid .material-input__input[placeholder]:focus ~ .material-input__label,
                .material-input__container.is-empty.valid .material-input__input[placeholder] ~ .material-input__label{
                    color: var(--material-input-valid-color, rgb(47,158,68));
                }
                .material-input__container.valid .material-input__valid-icon {
                    display: block;
                }
                /* Help text */
                .material-input__help-text {
                  display: none;
                  max-width: var(--help-text--max-width, 300px);
                  padding: var(--help-text--padding, 12px);
                  background: #ffffff;
                  border-radius: var(--help-text--border-radius, 8px);
                  position: absolute;
                  z-index: 1;
                  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
                  left: var(--help-text--left, 49px);
                  bottom: var(--help-text--bottom, 40px);
                  font-weight: var(--help-text--font-weight, 400);
                  font-size: var(--help-text--font-size, 0.75rem);
                  line-height: var(--help-text--line-height, 1.5);
                  color: var(--help-text--color, #000);
                }

                .material-input__container.invalid .material-input__help-text {
                  bottom: var(--help-text--invalid-bottom, 56px);
                }

                .material-input__help-text::after {
                  content: '';
                  position: absolute;
                  width: var(--help-text-after--width, 12px);
                  height: var(--help-text-after--height, 12px);
                  bottom: var(--help-text-after--bottom, -6px);
                  left: var(--help-text-after--left, 14px);
                  background: #FFFFFF;
                  border-radius: 1px;
                  transform: rotate(45deg);
                }

                .material-input__input:focus ~ .material-input__help-text,
                .material-input__container:not(.is-empty) .material-input__help-text,
                .material-input__container.label-always-floats .material-input__help-text{
                    display: none;
                }

                /* bar */
                .material-input__bar{
                    display:block;
                    width:100%;
                }
                .material-input__bar::before, .material-input__bar::after {
                    content:'';
                    height: var(--material-input-highlight-line-height, 2px);
                    width:0;
                    bottom:0;
                    position:absolute;
                    background: var(--material-input-highlight-color, rgb(54,79,199));
                    transition:0.2s ease all;
                }
                .material-input__container.invalid .material-input__bar::before,
                .material-input__container.invalid .material-input__bar::after{
                    background: var(--material-input-invalid-color, rgb(224,49,49));
                }
                .material-input__container.valid .material-input__bar::before,
                .material-input__container.valid .material-input__bar::after{
                    background: var(--material-input-valid-color, rgb(47,158,68));
                }
                .material-input__bar::before {
                    left:50%;
                }
                .material-input__bar::after {
                    right:50%;
                }
                .material-input__input:focus ~ .material-input__bar:before, .material-input__input:focus ~ .material-input__bar:after{
                    width:50%;
                }
                .material-input__message{
                    font-size: 70%;
                    color: var(--material-input-invalid-color, rgb(224,49,49));
                    padding: .3rem 0 .5rem 10px;
                }
                .material-input__message:empty{
                    display: none;
                }
            </style>
            <div class="material-input__container no-animation${this.value === '' ? ' is-empty' : ''}">
                <input class="material-input__input" tabindex="-1" part="input" />
                <label class="material-input__label" part="label"></label>
                <div class="material-input__bar" part="bar"></div>
                <div class="material-input__message" part="message"></div>
                <div class="material-input__help-text" part="help-text"></div>
                <div class="material-input__valid-icon" part="valid-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3701_119054)"><path d="M4.99998 8L6.99998 10L11 6M14.6666 8C14.6666 11.6819 11.6819 14.6667 7.99998 14.6667C4.31808 14.6667 1.33331 11.6819 1.33331 8C1.33331 4.3181 4.31808 1.33334 7.99998 1.33334C11.6819 1.33334 14.6666 4.3181 14.6666 8Z" stroke="#3A9C17" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_3701_119054"><rect width="16" height="16" fill="white"/></clipPath></defs></svg></div>
                <div class="material-input__invalid-icon" part="invalid-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3701_119079)"><path d="M7.99998 5.33333V8M7.99998 10.6667H8.00665M14.6666 8C14.6666 11.6819 11.6819 14.6667 7.99998 14.6667C4.31808 14.6667 1.33331 11.6819 1.33331 8C1.33331 4.3181 4.31808 1.33333 7.99998 1.33333C11.6819 1.33333 14.6666 4.3181 14.6666 8Z" stroke="#F04438" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_3701_119079"><rect width="16" height="16" fill="white"/></clipPath></defs></svg></div>
                <div class="material-input__invalid-text" part="invalid-text""></span>
            </div>
        `;
    this.attributesExceptions = [
      'name',
      'id',
      'style',
      'label',
      'tabindex',
      'placeholder',
      'autofocus',
      'autocomplete',
      'autovalidate'
    ];

    if (this.hasAttribute('input-exist')) {
      this.$hiddenInput = this.parentNode.querySelector(`input[name=${this.getAttribute('name')}], textarea[name=${this.getAttribute('name')}]`);
      this.$hiddenInput.classList.add('material-input__hidden-input');
      this.$hiddenInput.setAttribute('tabindex', '-1');
      //@formatter:off
			this.$hiddenInput.style.cssText = this._getHiddenInputCss();
			//@formatter:on

      // add hidden input
      this.after(this.$hiddenInput.parentNode.classList.contains('wpcf7-form-control-wrap') ? this.$hiddenInput.parentNode : this.$hiddenInput);
    } else {
      // add hidden input
      this.insertAdjacentHTML(
        'afterend',
        //@formatter:off
				`<input tabindex="-1" class="material-input__hidden-input" style="${this._getHiddenInputCss()}" name="${this.getAttribute(
					//@formatter:on
          'name')}"/>`
      );
      this.$hiddenInput = this.parentNode.querySelector(`.material-input__hidden-input[name=${this.getAttribute('name')}]`);
    }

    // On resize, recalculate the position of hidden input.
    window.addEventListener('resize', debounce(() => this.$hiddenInput.style.cssText = this._getHiddenInputCss(), 300));

    // set tab index to make element focussable
    this.setAttribute('tabindex', '0');
    // elements
    this.$container = this.shadowRoot.querySelector('.material-input__container');
    this.$input = this.$container.querySelector('.material-input__input');
    this.$label = this.$container.querySelector('.material-input__label');
    this.$message = this.$container.querySelector('.material-input__message');
    this.$helpText = this.$container.querySelector('.material-input__help-text');
    this.$invalidText = this.$container.querySelector('.material-input__invalid-text');
    this.$form = this._getParentForm(this);
    //
    this.validity = this.hasAttribute('valid') ? true : this.hasAttribute('invalid') ? false : undefined;
    // add events
    this._addEvents();
    // transfer attribtues to input & hiddenInput
    this._transferAttributes();
    // set value, label, etc.
    this._setValue(this.getAttribute('value'));
    this.$input.value = this.value;
    this._setLabel(this.getAttribute('label'));
    this._setPlaceholder(this.getAttribute('placeholder'));
    this._setValid(this.validity);
    this._setMessage(this.getAttribute('message'));
    this._setHelpText(this.getAttribute('help-text'));
    this._setInvalidText(this.getAttribute('invalid-text'));
    this._showHelpText();
    // remove no-animation loading class
    setTimeout(() => {
      this.$container.classList.remove('no-animation');
    }, 100);
  }

  /**
   * when an attribute is changed
   */
  attributeChangedCallback(attrName, oldVal, newVal) {
    // define callbacks
    const callbacks = {
      'value': this._setValue,
      'label': this._setLabel,
      'placeholder': this._setPlaceholder,
      'name': this._setName,
      'message': this._setMessage,
      'help-text': this._setHelpText,
      'invalid-text': this._setInvalidText
    };
    // call callback if it exists
    if (callbacks.hasOwnProperty(attrName)) {
      callbacks[attrName].call(this, newVal, oldVal);
    } else {
      // if other attributes are updated, transfer updates to hidden input field
      this._transferAttribute(attrName, newVal, this.attributesExceptions);
    }
  }

  /**
   * set the custom validity of the input
   */
  setCustomValidity(msg) {
    this.$input.setCustomValidity(msg);
    this.$hiddenInput.setCustomValidity(msg);
  }

  /**
   * Generate hidden input CSS.
   *
   * @returns {string}
   * @private
   */
  _getHiddenInputCss() {
    //@formatter:off
		return `pointer-events: none; margin:0; border: 0; height: 0; opacity: 0; display: none; position: absolute; top: ${this.offsetTop + this.offsetHeight}px; left: ${this.offsetLeft}px;`;
		//@formatter:on
  }

  /**
   * add events for all items
   */
  _addEvents() {
    // on focuse pass to input
    this.addEventListener('focus', (e) => {
      this.$input.focus();
    });
    // set validation status when hiddenInput is invalid
    this.$hiddenInput.addEventListener('invalid', () => {
      this._setValid(false);
    });
    // submit on enters
    this.$input.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        if (this.$form.checkValidity()) {
          this.$form.submit();
        } else if (this.$form.querySelector('[type="submit"]') !== null) {
          // needed to trigger validation
          this.$form.querySelector('[type="submit"]').click();
        }
      }
    });
    // pass on value when user enters content
    this.$input.addEventListener('input', () => {
      this._setValue(this.$input.value);
    });
    // pass in value and validate when user exits input field
    this.$input.addEventListener('blur', () => {
      this._setValue(this.$input.value);
      if (this.hasAttribute('autovalidate') && String(this.getAttribute('autovalidate')) !== 'false') {
        // check if is valid
        this._checkValidity();
      }
    });
    // if autovalidate is set to true, validate on key event
    if (this.hasAttribute('autovalidate') && String(this.getAttribute('autovalidate')) !== 'false') {
      this.$input.addEventListener('input', () => {
        // check if is valid
        this._checkValidity();
      });
    } else {
      this.$input.addEventListener('input', () => {
        // check if is valid
        if (this.$container.classList.contains('invalid') && this.$input.value !== '' && this.$input.validity.valid === true) {
          this._setValid(true);
        }
      });
    }
  }

  /**
   * get parent form
   */
  _getParentForm(current) {
    current = current.parentElement;
    // return form
    if (current.constructor === HTMLFormElement) return current;
    // return false on body
    if (current.constructor === HTMLBodyElement) return false;
    // dig one level deeper
    return this._getParentForm(current);
  }

  /**
   * check validity
   */
  _checkValidity() {
    if (this.$input.value !== '' && (
      this.$input.validity.valid === true || this.$input.validity.valid === false
    )) {
      this._setValid(this.$input.validity.valid);
    } else {
      this._setValid(undefined);
    }
  }

  /**
   * set value
   */
  _setValue(newValue) {
    this.value = newValue;
  }

  /**
   * set message
   */
  _setMessage(msg) {
    this.$message.innerHTML = msg;
  }

  /**
   * set help Text
   */
  _setHelpText(msg) {
    this.$helpText.innerHTML = msg;
  }

  /**
   * set help Text
   */
  _setInvalidText(msg) {
    this.$invalidText.innerHTML = msg;
  }

  /**
   * set name
   */
  _setName(newName) {
    this.$hiddenInput.setAttribute('name', newName);
  }

  /**
   * set field to valid or invalid
   */
  _setValid(validity = undefined) {
    // valid is not set
    if (validity === undefined) {
      this.valid = undefined;
      this.$container.classList.remove('valid');
      this.$container.classList.remove('invalid');
    }
    // valid is true
    if (validity === true) {
      this.valid = true;
      this.$container.classList.add('valid');
      this.$container.classList.remove('invalid');
    }
    // valid is false
    if (validity === false) {
      this.valid = false;
      this.$container.classList.add('invalid');
      this.$container.classList.remove('valid');
    }
  }

  /**
   * transfer attributes to input
   */
  _transferAttributes() {
    for (const key of Object.keys(this.attributes)) {
      if (this.attributes.hasOwnProperty(key)) {
        this._transferAttribute(this.attributes[key].name, this.attributes[key].value, this.attributesExceptions);
      }
    }
  }

  /**
   * transfer attribute to input
   */
  _transferAttribute(attrName, val, attributesExceptions) {
    if (attributesExceptions.indexOf(attrName) === -1) {
      this.$hiddenInput.setAttribute(attrName, val);
      this.$input.setAttribute(attrName, val);
    }
  }

  /**
   * update value and toggle is-empty class
   */
  _value(val) {
    // set value of hidden input for form submission
    this.$hiddenInput.value = val;
    this.setAttribute('value', val);
    // set state depending on value
    this._toggle(this.$container, 'is-empty', val === '');
  }

  /**
   * add label to material-input
   */
  _setLabel(label) {
    if (label !== undefined && label !== null) {
      if (this.getAttribute('help-text')) {
        this.$label.innerHTML = '<span>' + label + '</span>' + '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_4803_197240)"><path d="M6.06 6.00004C6.21674 5.55449 6.5261 5.17878 6.93331 4.93946C7.34051 4.70015 7.81927 4.61267 8.28479 4.69252C8.75031 4.77236 9.17255 5.01439 9.47672 5.37573C9.78089 5.73706 9.94737 6.19439 9.94667 6.66671C9.94667 8.00004 7.94667 8.66671 7.94667 8.66671M8 11.3334H8.00667M14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33334 11.6819 1.33334 8.00004C1.33334 4.31814 4.3181 1.33337 8 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004Z" stroke="#9A814C" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_4803_197240"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>';
      }
      else {
        this.$label.innerHTML = label;
      }
      return label;
    }
    this.$label.innerHTML = '';
  }

  /**
   * set placeholder and add label-always-floats class
   */
  _setPlaceholder(placeholder) {
    if (placeholder !== null && placeholder !== undefined) {
      this.$input.setAttribute('placeholder', placeholder);
      this.$container.classList.add('label-always-floats');
      return;
    }
    this.$input.removeAttribute('placeholder');
    this.$container.classList.remove('label-always-floats');
  }

  /**
   * since classList.toggle with a second param is not supported in IE11 and below
   */
  _toggle(el, cls, condition) {
    if (condition === true) {
      el.classList.add(cls);
    } else {
      el.classList.remove(cls);
    }
  }

  /**
   * since classList.toggle with a second param is not supported in IE11 and below
   */
  _showHelpText() {
    const el = this.$label.querySelector('svg');
    const helpText = this.$helpText;
    const input = this.$input;

    if(!el) {
      return;
    }

    //Show hidden DIV on hover
    el.addEventListener('mouseover', function handleMouseOver() {
      input.disabled = true;
      helpText.style.display = 'block';
    });

    //Hide DIV on mouse out
    el.addEventListener('mouseout', function handleMouseOut() {
      input.disabled = false;
      helpText.style.display = 'none';
    });

    el.addEventListener("touchstart", function handleMouseOver() {
      input.disabled = true;
      helpText.style.display = 'block';
    });
    el.addEventListener("touchend", function handleMouseOut() {
      input.disabled = false;
      helpText.style.display = 'none';
    });

  }
}

document.addEventListener('DOMContentLoaded', () => {
  customElements.define('material-input', MaterialInput);
});