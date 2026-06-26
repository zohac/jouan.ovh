import type { IProgram, IProgramManager } from "../interfaces";
import { about, clear, contact, helloWorld, help, newTerminal, projets, skills, systemInfo } from "./";

class ProgramManager implements IProgramManager {
  public programs: { [key: string]: IProgram } = {};

  add(program: IProgram): IProgramManager {
    if (this.programs[program.command]) {
      const error = `Un programme avec la clé ${program.command} existe déjà`;

      console.error(error);
      throw new Error(error);
    }

    this.programs[program.command] = program;

    return this;
  }

  remove(key: string): IProgramManager {
    if (!this.programs[key]) {
      const error = `Aucun programme trouvé avec la clé ${key}`;

      console.error(error);
      throw new Error(error);
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- clé dynamique par conception (registre de programmes)
    delete this.programs[key];

    return this;
  }

  get(key: string) {
    return this.programs[key];
  }
}

const programManager = new ProgramManager();
programManager.add(help);
programManager.add(helloWorld);
programManager.add(newTerminal);
programManager.add(systemInfo);
programManager.add(about);
programManager.add(skills);
programManager.add(projets);
programManager.add(contact);
programManager.add(clear);

export default programManager;
