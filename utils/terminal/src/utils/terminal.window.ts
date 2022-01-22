import { HTMLElementService } from '../utils';
import { TerminalInterface } from '../interface'

export class TerminalWindow implements TerminalInterface {
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

  init(): TerminalWindow {

    const emptyDiv = this.HTMLElementService.createDiv();
    const hostDiv = this.HTMLElementService.createDiv();
    hostDiv.append(`${this.httpHost}`);

    this.header.append(emptyDiv);
    this.header.append(hostDiv);
    this.header.append(this.closeButton);

    this.content.style.maxHeight = this.height;

    this.simulator.append(this.header);
    this.simulator.append(this.content)

    this.move(this);
    this.addEventListener(this);

    return this;
  }

  addEventListener(terminal: TerminalInterface): TerminalInterface {
    terminal.closeButton.addEventListener('click', () => {
      terminal.close(terminal);
    });
    document.addEventListener('keydown', (event) => {
      terminal.openTerminalOnKeyPress(event, terminal);
    });
    // terminal.header.addEventListener('click', () => {
    //   terminal.simulator.style.zIndex = terminal.displayFront();
    // });

    return terminal;
  }

  render(): HTMLElement {
    return this.simulator;
  }

  openTerminalOnKeyPress(event: KeyboardEvent, terminal: TerminalInterface): TerminalInterface {
    if (event.ctrlKey && event.altKey && (event.key === 't' || event.key === 'r')) {  // case sensitive
      terminal.simulator.classList.remove('hidden');
    }

    return terminal;
  }

  close(terminal: TerminalInterface): TerminalInterface {
    terminal.simulator.classList.add('hidden');

    return terminal;
  }

  move(terminal: TerminalInterface): TerminalInterface {
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
