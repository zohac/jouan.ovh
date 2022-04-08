import { ApplicationInterface, OptionInterface, TerminalInterface, TerminalOptionInterface } from './interface';
import { Window } from './utils';

export class Terminal extends Window {
  applications: ApplicationInterface[] = [];
  appName: string[] = [];

  welcomeMessage: string = 'Bienvenue, pour voir les commandes disponible commencez par taper "help"'
  scheme: string[] = [];
  historic: string[] = [];
  lastHistoricIndex: number = 0;
  form: HTMLFormElement;
  input: HTMLInputElement;

  constructor(option: TerminalOptionInterface | null = null) {
    super();

    if (option) {
      this.scheme = option.scheme ?? [];
    }

    this.form  = this.HTMLElementService.createElement('form', {
      id: `${this.terminalId}-form-${this.counter}`,
      classes: ["terminal-form"],
      attributes: {
        autocomplete: "off"
      }
    }) as HTMLFormElement;

    this.input = this.HTMLElementService.createElement('input', {
      id: `${this.terminalId}-input-${this.counter}`,
      classes: ["terminal-content-input"],
      attributes: {
        type: "text"
      }
    }) as HTMLInputElement;

    const label = this.HTMLElementService.createElement('label', {
      classes: ["terminal-content-label"],
      attributes: { for: `${this.input.getAttribute("id")}` }
    });

    const prefixLine = this.createPrefix();
    label.append(prefixLine);

    this.form.append(label);
    this.form.append(this.input);
    this.content.append(this.form);

    this.drawScheme();

    const welcomeMessage = this.createNewLine({ content: this.welcomeMessage });
    this.content.insertBefore(welcomeMessage, this.form);

    this.addEventListenerOnTerminal();
  }

  drawScheme() {
    this.scheme.forEach(item => {
      const newLine = this.createNewLine({
        content: item,
        classes: ["text-green"]
      });
      this.content.insertBefore(newLine, this.form);
    });
  }

  createPrefix(option: OptionInterface | null = null): HTMLDivElement {
    const spanTextGreen = this.HTMLElementService.createElement('span', {
      content: `${this.userName}@${this.httpHost}`,
      classes: ["text-green"]
    });
    const spanTextBleu = this.HTMLElementService.createElement('span', {
      content: '~',
      classes: ["text-blue"]
    });

    const prefixLine = this.HTMLElementService.createElement('div', option) as HTMLDivElement;
    prefixLine.append(spanTextGreen);
    prefixLine.append(":");
    prefixLine.append(spanTextBleu);
    prefixLine.append("$");

    return prefixLine;
  }

  createNewLine(option: OptionInterface | null = null): HTMLDivElement {
    return this.HTMLElementService.createElement('div', option) as HTMLDivElement;
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
    document.addEventListener('keydown', (event) => {
      if ('ArrowUp' === event.code) {
        terminal.displayFront();
        terminal.input.focus();
        terminal.input.value = terminal.historic[terminal.lastHistoricIndex];
        terminal.lastHistoricIndex = terminal.lastHistoricIndex - 1;

        if (0 > terminal.lastHistoricIndex) {
          this.lastHistoricIndex = this.historic.length - 1;
        }
      }
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
    this.historic.push(`${command}`);
    this.lastHistoricIndex = this.historic.length - 1;

    let response: HTMLDivElement | null = this.HTMLElementService.createElement('div') as HTMLDivElement;
    response.append(this.createNewLine({
      content: `The application can't be found : ${command}`,
      classes: ['text-red'],
    }));

    const application = this.applications.find((app) => app.COMMAND_NAME === command);
    if (application) {
      response = application.execute();
    }

    return response;
  }
}
