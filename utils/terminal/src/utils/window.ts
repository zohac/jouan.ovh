import * as events from "events";
import { HTMLElementService } from '../utils';
import { TerminalInterface } from '../interface'

export class Window implements TerminalInterface {
  static WINDOWS: TerminalInterface[] = [];
  HTMLElementService: HTMLElementService;

  height: string = '400px';
  width: string = '50vw';

  httpHost: string = 'jouan.ovh';
  userName: string = 'anon.';

  terminalId: string = 'terminal-simulator';
  simulator: HTMLDivElement;
  header: HTMLDivElement;
  closeButton: HTMLDivElement;
  content: HTMLDivElement;
  counter: number;

  constructor() {
    Window.WINDOWS.push(this);
    this.counter = Window.WINDOWS.length;

    this.HTMLElementService = new HTMLElementService();

    this.simulator = this.HTMLElementService.createDiv({
      id: `${this.terminalId}-${this.counter}`,
      classes: ['terminal'],
      attributes: {
        'data-http-host': `${this.httpHost}`,
        'data-username': `${this.userName}`,
      },
      styles: {
        width: this.width,
        height: this.height,
        position: 'absolute',
        right: `${50 * this.counter}px`,
        top: `${50 * this.counter}px`,
      },
    });

    this.header = this.HTMLElementService.createDiv({
      id: `${this.terminalId}-header-${this.counter}`,
      classes: ['terminal-header'],
    });

    this.closeButton = this.HTMLElementService.createDiv({
      id: `${this.terminalId}-close-${this.counter}`,
      classes: ['terminal-close'],
    });

    this.content = this.HTMLElementService.createDiv({
      id: `${this.terminalId}-content-${this.counter}`,
      classes: ['terminal-content'],
    });

    this.init();
  }

  init(): Window {

    const emptyDiv = this.HTMLElementService.createDiv();
    const hostDiv = this.HTMLElementService.createDiv();
    hostDiv.append(`${this.httpHost}`);

    this.header.append(emptyDiv);
    this.header.append(hostDiv);
    this.header.append(this.closeButton);

    this.simulator.append(this.header);
    this.simulator.append(this.content)

    this.move();
    this.addEventListener();

    return this;
  }

  addEventListener(): TerminalInterface {
    const terminal = this;
    terminal.closeButton.addEventListener('click', () => {
      terminal.close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.altKey && (event.key === 't' || event.key === 'r')) {  // case sensitive
        terminal.open();
      }
    });
    // terminal.header.addEventListener('click', () => {
    //   terminal.simulator.style.zIndex = terminal.displayFront();
    // });

    return terminal;
  }

  render(): HTMLElement {
    return this.simulator;
  }

  open(): TerminalInterface {
    this.simulator.classList.remove('hidden');
    this.simulator.hidden = false;

    return this;
  }

  close(): TerminalInterface {
    this.simulator.classList.add('hidden');
    this.simulator.hidden = true;
    return this;
  }

  move(): TerminalInterface {
    const terminal = this;
    let pos1: number = 0;
    let pos2: number = 0;
    let pos3: number = 0;
    let pos4: number = 0;

    /* the header is where you move the DIV from: */
    terminal.header.onmousedown = dragMouseDown;

    function dragMouseDown(event: MouseEvent) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = event.clientX;
      pos4 = event.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(event: MouseEvent) {
      event.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
      // set the element's new position:

      let newTopPosition = terminal.simulator.offsetTop - pos2
      let newLeftPosition = terminal.simulator.offsetLeft - pos1
      const offsetTopPosition = window.innerHeight - (terminal.simulator.offsetHeight + terminal.simulator.offsetTop);
      const offsetRightPosition = window.innerWidth - (terminal.simulator.offsetWidth + terminal.simulator.offsetLeft);

      console.log('offset : ' + offsetTopPosition);

      if (0 > offsetTopPosition) {
        newTopPosition = window.innerHeight - terminal.simulator.offsetHeight;
      }
      terminal.simulator.style.top = 0 > newTopPosition ? '0px' : `${newTopPosition}px`;

      if (0 > offsetRightPosition) {
        newLeftPosition = window.innerWidth - terminal.simulator.offsetWidth;
      }
      terminal.simulator.style.left = 0 > newLeftPosition ? '0px' : `${newLeftPosition}px`;

    }

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }

    return terminal;
  }
}
