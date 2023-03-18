import { IProgram } from "~/components/terminal/interfaces/IProgram";

export interface IProgramManager {
  add(program: IProgram): void;

  remove(key: string): void;

  get(key: string): IProgram;
}
