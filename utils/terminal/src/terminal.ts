import { ApplicationInterface, OptionInterface, TerminalInterface, TerminalOptionInterface } from "./interface";
import { Window } from "./utils";

export class Terminal extends Window {
  applications: ApplicationInterface[] = [];

  welcomeMessage: string = 'Bienvenue, pour voir les commandes disponible commencez par taper "help"'
  scheme: string[] = [];
  form: HTMLFormElement;
  input: HTMLInputElement;

  constructor(option: TerminalOptionInterface | null = null) {
    super();

    if (option) {
      this.scheme = option.scheme ?? [];
    }

    this.form = this.HTMLElementService.createForm({
      id: `${this.terminalId}-form-${this.counter}`,
      classes: ["terminal-form"],
      attributes: {
        autocomplete: "off"
      }
    });

    this.input = this.HTMLElementService.createInput({
      id: `${this.terminalId}-input-${this.counter}`,
      classes: ["terminal-content-input"],
      attributes: {
        type: "text"
      }
    });

    const label = this.HTMLElementService.createLabel({
      classes: ["terminal-content-label"],
      attributes: { for: `${this.input.getAttribute("id")}` }
    });

    const prefixLine = this.createPrefix();
    label.append(prefixLine);

    this.form.append(label);
    this.form.append(this.input);
    this.content.append(this.form);

    this.drawScheme();

    const welcomeMessage = this.createNewLine(this.welcomeMessage);
    this.content.insertBefore(welcomeMessage, this.form);

    this.addEventListenerOnTerminal();
  }

  drawScheme() {
    this.scheme.forEach(item => {
      const newLine = this.createNewLine(item, {
        classes: ["text-shell-green"]
      });
      this.content.insertBefore(newLine, this.form);
    });
  }

  createPrefix(option: OptionInterface | null = null): HTMLDivElement {
    const spanTextGreen = this.HTMLElementService.createSpan(`${this.userName}@${this.httpHost}`, {
      classes: ["text-shell-green"]
    });
    const spanTextBleu = this.HTMLElementService.createSpan("~", {
      classes: ["text-shell-blue"]
    });

    const prefixLine = this.HTMLElementService.createDiv(option);
    prefixLine.append(spanTextGreen);
    prefixLine.append(":");
    prefixLine.append(spanTextBleu);
    prefixLine.append("$");

    return prefixLine;
  }

  createNewLine(content: string, option: OptionInterface | null = null): HTMLDivElement {
    const newLine = this.HTMLElementService.createDiv(option);
    const newLineContent = document.createTextNode(`${content}`);
    newLine.append(newLineContent);

    return newLine;
  }

  createNewLineWithPrefix(content: string, option: OptionInterface | null = null): HTMLDivElement {
    const prefixLine = this.createPrefix(option);
    prefixLine.append(` ${content}`);

    return prefixLine;
  }

  open(): Terminal {
    super.open();
    this.input.focus();

    return this;
  }

  addApplication(application: ApplicationInterface): Terminal {
    this.applications.push(application);

    return this;
  }

  addEventListenerOnTerminal(): TerminalInterface {
    const terminal = this;
    terminal.form.addEventListener('submit', (event) => {
      terminal.terminalFormSubmit(event);
    });
    terminal.content.addEventListener('click', () => {
      terminal.input.focus();
    });

    return terminal;
  }

  terminalFormSubmit(event: Event): Terminal {
    event.preventDefault();

    let inputValue: string | null = null;

    if ('value' in this.input) {
      inputValue = this.input.value;
      this.input.value = '';
    }

    const newElement = this.createNewLineWithPrefix(`${inputValue}`);
    this.content.insertBefore(newElement, this.form);

    const response = this.executeCommand(inputValue);
    if (response) {
      this.content.insertBefore(response, this.form);
    }

    this.content.scrollTop = this.content.scrollHeight;

    return this;
  }

  executeCommand(command: string | null): HTMLDivElement | null {
    let response: HTMLDivElement | null = this.HTMLElementService.createDiv();
    response.append(`command not found: ${command}`);

    for (const obCmd of this.applications) {
      if (obCmd.COMMAND_NAME === command  ) {
        response = obCmd.execute();
      }
    }

    return response;
  }
}
