import { OptionInterface } from '../interface';

export class HTMLElementService {
  createForm(option: OptionInterface | null = null): HTMLFormElement {
    const formElement = document.createElement('form');
    if (option) {
      this.setOptions(formElement, option);
    }

    return formElement;
  }

  createLabel(option: OptionInterface | null = null): HTMLLabelElement {
    const labelElement = document.createElement('label');
    if (option) {
      this.setOptions(labelElement, option);
    }

    return labelElement;
  }

  createInput(option: OptionInterface | null = null): HTMLInputElement {
    const inputElement = document.createElement('input');
    if (option) {
      this.setOptions(inputElement, option);
    }

    return inputElement;
  }

  createDiv(option: OptionInterface | null = null): HTMLDivElement {
    const divElement = document.createElement('div');
    if (option) {
      this.setOptions(divElement, option);
    }

    return divElement;
  }

  createSpan(content: string, option: OptionInterface | null = null): HTMLSpanElement {
    const spanElement = document.createElement('span');
    if (option) {
      this.setOptions(spanElement, option);
    }
    spanElement.append(content);

    return spanElement;
  }

  setOptions(HTMLElement: HTMLElement, option: OptionInterface): void {
    if (option.id) {
      HTMLElement.setAttribute('id', option.id);
    }
    if (option.classes) {
      this.setClasses(HTMLElement, option.classes);
    }
    if (option.attributes) {
      this.setAttributes(HTMLElement, option.attributes);
    }
    if (option.styles) {
      this.setStyles(HTMLElement, option.styles);
    }
  }

  private setAttributes(HTMLElement: HTMLElement, attributes: { [key: string]: string }): void {
      for (const key in attributes) {
        HTMLElement.setAttribute(key, attributes[key]);
      }
  }

  private setClasses(HTMLElement: HTMLElement, classes: string[]): void {
    for (const key in classes) {
      HTMLElement.classList.add(classes[key]);
    }
  }

  private setStyles(HTMLElement: HTMLElement, styles: { [key: string]: string }): void {
    for (const key in styles) {
      HTMLElement.style.setProperty(key, styles[key]);
    }
  }
}
