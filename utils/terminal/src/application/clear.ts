import { ApplicationInterface } from '../interface'
import { Terminal } from '../terminal'
import { Application } from '../utils'

export class Clear extends Application implements ApplicationInterface {
  COMMAND_NAME: string = 'clear'
  description: string = "Nettoie l'affichage du terminal."

  terminal: Terminal

  constructor(terminal: Terminal, description: string | null = null) {
    super()
    this.terminal = terminal

    if (description) {
      this.description = description
    }
  }

  execute(): HTMLDivElement | null {
    this.terminal.content.innerHTML = ''
    this.terminal.content.append(this.terminal.form)

    return null
  }
}
