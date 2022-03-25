import { ApplicationInterface, OptionInterface, TerminalInterface, TerminalOptionInterface } from './interface';
import { Window } from './utils';

export class Terminal extends Window {
  applications: ApplicationInterface[] = [];
  appName: string[] = [];

  welcomeMessage: string = 'Bienvenue, pour voir les commandes disponible commencez par taper "help"'
  scheme: string[] = [];
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
        classes: ["text-shell-green"]
      });
      this.content.insertBefore(newLine, this.form);
    });
  }

  createPrefix(option: OptionInterface | null = null): HTMLDivElement {
    const spanTextGreen = this.HTMLElementService.createElement('span', {
      content: `${this.userName}@${this.httpHost}`,
      classes: ["text-shell-green"]
    });
    const spanTextBleu = this.HTMLElementService.createElement('span', {
      content: '~',
      classes: ["text-shell-blue"]
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

  addDynamicApplication(appName: string): Terminal {
    this.appName.push(appName);

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
    let response: HTMLDivElement | null = this.HTMLElementService.createElement('div') as HTMLDivElement;
    response.append(`command not found: ${command}`);

    const application = this.getApplication(command);
    response = application.execute();

    return response;
  }

  private getApplication(command: string | null): ApplicationInterface {
    const application = this.applications.find((app) => app.COMMAND_NAME === command);
    if ("undefined" === typeof application) {
      throw new Error(`The application can't be found : ${command}`);
    }

    return application;
  }

  // async executeDynamicCommand(command: string): Promise<HTMLDivElement | null> {
  //   let response: HTMLDivElement | null = this.HTMLElementService.createDiv();
  //   response.append(`command not found: ${command}`);
  //
  //   const application = await this.getDynamicApplication(command);
  //   response = application.execute();
  //
  //   return response;
  // }
  //
  // private async getDynamicApplication(command: string): Promise<ApplicationInterface> {
  //   const applicationName = this.appName.find((app) => app === command);
  //   if ("undefined" === typeof applicationName) {
  //     throw new Error(`The application can't be found : ${command}`);
  //   }
  //
  //   const applicationImport = await import(`./application/${applicationName}`);
  //   const capitalizedAppName = StringHelper.uppercaseFirstLetter(command);
  //
  //   return new applicationImport[capitalizedAppName]() as ApplicationInterface;
  // }
}
