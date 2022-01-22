import { OptionInterface } from '../interface';
import { HTMLElementService } from '../utils';

export abstract class Application {
  HTMLElementService: HTMLElementService;

  constructor() {
    this.HTMLElementService = new HTMLElementService();
  }

  createNewLine(content: string, option: OptionInterface | null = null): HTMLDivElement {
    const newLine = this.HTMLElementService.createDiv(option);
    console.log(`${content}`);
    const newLineContent = document.createTextNode(`${content}`);
    newLine.append(newLineContent);

    return newLine;
  }
}
