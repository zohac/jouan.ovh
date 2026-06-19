import { UAParser } from "ua-parser-js";
import type { IProgram } from "~/components/terminal/interfaces";
import { escapeHtml } from "~/utils/functions";

const parser = new UAParser();

// Les valeurs issues du user-agent sont contrôlées par le client : on les échappe
// systématiquement avant de les injecter dans la sortie rendue via v-html.
const safe = (value: string | undefined, fallback = "Inconnu"): string => escapeHtml(value || fallback);

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
  <li>Navigateur: ${safe(browser.name)} ${safe(browser.version, "")}</li>
  <li>Moteur de rendu: ${safe(engine.name)} ${safe(engine.version, "")}</li>
  <li>Système d'exploitation: ${safe(os.name)} ${safe(os.version, "")}</li>
  <li>Architecture CPU: ${safe(cpu.architecture)}</li>
  <li>Type d'appareil: ${safe(device.type)}</li>
  <li>Marque d'appareil: ${safe(device.vendor)}</li>
  <li>Modèle d'appareil: ${safe(device.model)}</li>
</ul>`;
  },
};

export default systemInfo;
