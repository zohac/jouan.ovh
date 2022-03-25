import { ApplicationInterface } from "../interface";
import { Window } from "../utils";

export class About extends Window implements ApplicationInterface {
  COMMAND_NAME: string = 'about';
  description: string = 'about me';

  constructor() {
    super();

    this.simulator.classList.add('hidden');
    // document.removeEventListener('keydown', document);
  }

  openAbout() {
    this.simulator.classList.remove('hidden');
    this.displayFront();
  }

  execute(): HTMLDivElement | null {
    this.openAbout();

    return null;
  }
}
