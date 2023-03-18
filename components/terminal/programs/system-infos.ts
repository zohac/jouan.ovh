import UAParser from "ua-parser-js";
import { IProgram } from "~/components/terminal/interfaces";

const parser = new UAParser();

const systemInfo: IProgram = {
  command: "system-info",
  description: "Affiche des informations sur le système de l'utilisateur.",
  run(): string {
    const browser = parser.getBrowser();
    const cpu = parser.getCPU();
    const device = parser.getDevice();
    const engine = parser.getEngine();
    const os = parser.getOS();

    return `
<ul>
  <li>Navigateur: ${browser.name} ${browser.version}</li>
  <li>Moteur de rendu: ${engine.name} ${engine.version}</li>
  <li>Système d'exploitation: ${os.name} ${os.version}</li>
  <li>Architecture CPU: ${cpu.architecture}</li>
  <li>Type d'appareil: ${device.type || "Inconnu"}</li>
  <li>Marque d'appareil: ${device.vendor || "Inconnu"}</li>
  <li>Modèle d'appareil: ${device.model || "Inconnu"}</li>
</ul>`;
  },
};

export default systemInfo;
