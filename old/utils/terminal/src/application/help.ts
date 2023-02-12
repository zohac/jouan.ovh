import { ApplicationInterface } from '../interface'
import { Terminal } from '../terminal'
import { Application } from '../utils'

export class Help extends Application implements ApplicationInterface {
  COMMAND_NAME: string = 'help'
  description: string = 'Affiche les commandes disponible.'

  terminal: Terminal

  constructor(terminal: Terminal, description: string | null = null) {
    super()
    this.terminal = terminal

    if (description) {
      this.description = description
    }
  }

  execute(): HTMLDivElement {
    const newElement = this.HTMLElementService.createElement('div') as HTMLDivElement
    const ulElement = this.HTMLElementService.createElement('ul')

    for (const application of this.terminal.applications) {
      const liElement = this.HTMLElementService.createElement('li')

      const code = this.HTMLElementService.createElement('code', { content: application.COMMAND_NAME })
      liElement.append(code)
      liElement.append(` - ${application.description}`)
      ulElement.append(liElement)
    }
    newElement.append(ulElement)
    this.terminal.content.insertBefore(newElement, this.terminal.form)

    return newElement
  }
}
