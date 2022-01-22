import { ApplicationInterface } from '../interface';
import { Terminal } from '../terminal';
import { Application } from '../utils';

export class Help extends Application implements ApplicationInterface {

  COMMAND_NAME: string = 'help';
  description: string = 'Affiche les commandes disponible.';

  terminal: Terminal;

  constructor(terminal: Terminal, description: string | null = null) {
    super();
    this.terminal = terminal;

    if (description) {
      this.description = description;
    }
  }

  execute(): HTMLDivElement | null {
    let newElement = null;

    for (const application of this.terminal.applications) {
      newElement = this.createNewLine(`${application.COMMAND_NAME} - ${application.description}`);

      this.terminal.content.insertBefore(newElement, this.terminal.form);
    }

    return newElement;
  }
}
