import type { IProgram } from "~/components/terminal/interfaces/IProgram";

export interface IProgramManager {
  add(program: IProgram): IProgramManager;

  remove(key: string): IProgramManager;

  get(key: string): IProgram | undefined;
}
