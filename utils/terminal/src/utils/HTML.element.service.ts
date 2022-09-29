import { OptionInterface } from '../interface'

type ElementName = 'button' | 'div' | 'input' | 'form' | 'label' | 'span' | 'code' | 'ul' | 'li'

export class HTMLElementService {
  createElement(elementName: ElementName, option: OptionInterface | null = null): HTMLElement {
    const element = document.createElement(elementName)

    if (option) {
      this.setOptions(element, option)

      if (option.content) {
        const textElement = document.createTextNode(`${option.content}`)
        element.append(textElement)
      }
    }

    return element
  }

  setOptions(HTMLElement: HTMLElement, option: OptionInterface): void {
    if (option.id) {
      HTMLElement.setAttribute('id', option.id)
    }
    if (option.classes) {
      this.setClasses(HTMLElement, option.classes)
    }
    if (option.attributes) {
      this.setAttributes(HTMLElement, option.attributes)
    }
    if (option.styles) {
      this.setStyles(HTMLElement, option.styles)
    }
  }

  private setAttributes(HTMLElement: HTMLElement, attributes: { [key: string]: string }): void {
    for (const key in attributes) {
      HTMLElement.setAttribute(key, attributes[key])
    }
  }

  private setClasses(HTMLElement: HTMLElement, classes: string[]): void {
    for (const key in classes) {
      HTMLElement.classList.add(classes[key])
    }
  }

  private setStyles(HTMLElement: HTMLElement, styles: { [key: string]: string }): void {
    for (const key in styles) {
      HTMLElement.style.setProperty(key, styles[key])
    }
  }
}
