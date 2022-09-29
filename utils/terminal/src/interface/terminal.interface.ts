export interface TerminalInterface {
  height: string
  width: string
  zIndex: number

  httpHost: string
  userName: string

  terminalId: string
  simulator: HTMLDivElement
  header: HTMLDivElement
  closeButton: HTMLDivElement
  content: HTMLDivElement

  move(): TerminalInterface

  close(): TerminalInterface

  addEventListener(): TerminalInterface

  open(): TerminalInterface
}
