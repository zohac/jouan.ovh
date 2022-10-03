import { TerminalInterface } from '../interface'
import { HTMLElementService } from '../utils'

export class Window implements TerminalInterface {
  static WINDOWS: TerminalInterface[] = []
  HTMLElementService: HTMLElementService

  height: string = '400px'
  width: string = '50vw'
  zIndex: number = 1000

  httpHost: string = 'jouan.ovh'
  userName: string = 'anon.'

  terminalId: string = 'terminal-simulator'
  simulator: HTMLDivElement
  header: HTMLDivElement
  closeButton: HTMLDivElement
  content: HTMLDivElement
  counter: number

  constructor() {
    Window.WINDOWS.push(this)
    this.counter = Window.WINDOWS.length

    this.HTMLElementService = new HTMLElementService()

    this.calculateZ_index()

    this.simulator = this.HTMLElementService.createElement('div', {
      id: `${this.terminalId}-${this.counter}`,
      classes: ['terminal', 'resizable'],
      attributes: {
        'data-http-host': `${this.httpHost}`,
        'data-username': `${this.userName}`,
        'aria-label': 'terminal simulator',
      },
      styles: {
        width: this.width,
        height: this.height,
        position: 'absolute',
        right: `${50 * this.counter}px`,
        top: `${50 * this.counter}px`,
        zIndex: `${this.zIndex}`,
      },
    }) as HTMLDivElement

    this.header = this.HTMLElementService.createElement('div', {
      id: `${this.terminalId}-header-${this.counter}`,
      classes: ['terminal-header'],
    }) as HTMLDivElement

    this.closeButton = this.HTMLElementService.createElement('div', {
      id: `${this.terminalId}-close-${this.counter}`,
      classes: ['terminal-close'],
    }) as HTMLDivElement

    this.content = this.HTMLElementService.createElement('div', {
      id: `${this.terminalId}-content-${this.counter}`,
      classes: ['terminal-content'],
    }) as HTMLDivElement

    this.init()
  }

  init(): Window {
    const emptyDiv = this.HTMLElementService.createElement('div')
    const hostDiv = this.HTMLElementService.createElement('div')
    const topLeft = this.HTMLElementService.createElement('div', {
      classes: ['resizer', 'top-left'],
    })
    const topRight = this.HTMLElementService.createElement('div', {
      classes: ['resizer', 'top-right'],
    })
    const bottomLeft = this.HTMLElementService.createElement('div', {
      classes: ['resizer', 'bottom-left'],
    })
    const bottomRight = this.HTMLElementService.createElement('div', {
      classes: ['resizer', 'bottom-right'],
    })
    const resizers = this.HTMLElementService.createElement('div', {
      classes: ['resizers'],
    })
    const resizable = this.HTMLElementService.createElement('div', {
      classes: ['resizable'],
    })

    resizers.append(topLeft, topRight, bottomLeft, bottomRight)
    resizable.append(resizers)

    hostDiv.append(`${this.httpHost}`)

    this.header.append(emptyDiv)
    this.header.append(hostDiv)
    this.header.append(this.closeButton)

    this.simulator.append(this.header)
    this.simulator.append(this.content)
    this.simulator.append(resizers)
    resizable.append(this.simulator)

    this.move()
    this.addEventListener()

    return this
  }

  calculateZ_index(): TerminalInterface {
    if (0 < Window.WINDOWS.length) {
      const zIndexes: number[] = []
      Window.WINDOWS.forEach((element) => zIndexes.push(element.zIndex))
      const zIndexMax = Math.max(...zIndexes)
      this.zIndex = zIndexMax + 1
    }

    return this
  }

  displayFront(): TerminalInterface {
    this.calculateZ_index()
    this.simulator.style.zIndex = this.zIndex.toString()

    return this
  }

  addEventListener(): TerminalInterface {
    const terminal = this
    terminal.closeButton.addEventListener('click', () => {
      terminal.close()
    })
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.altKey && (event.key === 't' || event.key === 'r')) {
        // case sensitive
        terminal.open()
      }
    })
    terminal.simulator.addEventListener('click', () => {
      terminal.displayFront()
    })

    return terminal
  }

  render(): HTMLElement {
    return this.simulator
  }

  open(): TerminalInterface {
    this.simulator.classList.remove('hidden')
    this.simulator.hidden = false

    return this
  }

  close(): TerminalInterface {
    this.simulator.classList.add('hidden')
    this.simulator.hidden = true
    return this
  }

  move(): TerminalInterface {
    const terminal = this
    let pos1: number = 0
    let pos2: number = 0
    let pos3: number = 0
    let pos4: number = 0

    /* the header is where you move the DIV from: */
    terminal.header.onmousedown = dragMouseDown

    function dragMouseDown(event: MouseEvent) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      pos3 = event.clientX
      pos4 = event.clientY
      document.onmouseup = closeDragElement
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag
    }

    function elementDrag(event: MouseEvent) {
      event.preventDefault()
      // calculate the new cursor position:
      pos1 = pos3 - event.clientX
      pos2 = pos4 - event.clientY
      pos3 = event.clientX
      pos4 = event.clientY
      // set the element's new position:

      let newTopPosition = terminal.simulator.offsetTop - pos2
      let newLeftPosition = terminal.simulator.offsetLeft - pos1
      const offsetTopPosition = window.innerHeight - (terminal.simulator.offsetHeight + terminal.simulator.offsetTop)
      const offsetRightPosition = window.innerWidth - (terminal.simulator.offsetWidth + terminal.simulator.offsetLeft)

      if (0 > offsetTopPosition) {
        newTopPosition = window.innerHeight - terminal.simulator.offsetHeight
      }
      terminal.simulator.style.top = 0 > newTopPosition ? '0px' : `${newTopPosition}px`

      if (0 > offsetRightPosition) {
        newLeftPosition = window.innerWidth - terminal.simulator.offsetWidth
      }
      terminal.simulator.style.left = 0 > newLeftPosition ? '0px' : `${newLeftPosition}px`
    }

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null
      document.onmousemove = null
    }

    return terminal
  }

  setHeight(height: string) {
    this.simulator.style.setProperty('height', height)
  }
}
