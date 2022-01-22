export interface TerminalInterface {
  height: string;
  width: string;

  httpHost: string;
  userName: string;

  terminalId: string;
  simulator: HTMLDivElement;
  header: HTMLDivElement;
  closeButton: HTMLDivElement;
  content: HTMLDivElement;

  move(terminal: TerminalInterface): TerminalInterface;

  close(terminal: TerminalInterface): TerminalInterface;

  addEventListener(terminal: TerminalInterface): TerminalInterface;

  openTerminalOnKeyPress(event: KeyboardEvent, terminal: TerminalInterface): TerminalInterface;
}
