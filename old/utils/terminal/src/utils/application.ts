import { OptionInterface } from '../interface'
import { HTMLElementService } from '../utils'

export abstract class Application {
  HTMLElementService: HTMLElementService

  constructor() {
    this.HTMLElementService = new HTMLElementService()
  }

  createNewLine(content: string, option: OptionInterface | null = null): HTMLDivElement {
    const newLine = this.HTMLElementService.createElement('div', option) as HTMLDivElement
    const newLineContent = document.createTextNode(`${content}`)
    newLine.append(newLineContent)

    return newLine
  }
}
