import { HTMLElementService } from '../utils';
import { TerminalInterface } from '../interface'

export class Window implements TerminalInterface {
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

  constructor() {
    this.HTMLElementService = new HTMLElementService();

    this.simulator = this.HTMLElementService.createDiv({
      id: this.terminalId,
      classes: ['terminal'],
      attributes: {
        'data-http-host': `${this.httpHost}`,
        'data-username': `${this.userName}`,
      },
      styles: {
        width: this.width,
        height: this.height,
        position: 'absolute',
        right: '25px',
        top: '25px',
      },
    });

    this.header = this.HTMLElementService.createDiv({
      id: `${this.terminalId}-header`,
      classes: ['terminal-header'],
    });

    this.closeButton = this.HTMLElementService.createDiv({
      id: `${this.terminalId}-close`,
      classes: ['terminal-close'],
    });

    this.content = this.HTMLElementService.createDiv({
      id: `${this.terminalId}-content`,
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

    this.content.style.maxHeight = this.height;

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
      terminal.open(event);
    });
    // terminal.header.addEventListener('click', () => {
    //   terminal.simulator.style.zIndex = terminal.displayFront();
    // });

    return terminal;
  }

  render(): HTMLElement {
    return this.simulator;
  }

  open(event: Event): TerminalInterface {
    const hidden = (terminal: TerminalInterface) => {
      terminal.simulator.hidden = false;
    }

    if (event.type === 'keydown') {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.ctrlKey && keyboardEvent.altKey && (keyboardEvent.key === 't' || keyboardEvent.key === 'r')) {  // case sensitive
        hidden(this);
      }
    }
    if (event.type === 'click') {
      hidden(this);
    }

    return this;
  }

  close(): TerminalInterface {
    // terminal.simulator.hidden = true;
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
      terminal.simulator.style.top = (terminal.simulator.offsetTop - pos2) + 'px';
      terminal.simulator.style.left = (terminal.simulator.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }

    return terminal;
  }
}
