var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { useSSRContext, ref, unref, defineComponent, onMounted, watch, mergeProps, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrRenderClass } from "vue/server-renderer";
import { _ as _export_sfc } from "./entry.28f2a879.js";
import { _ as __nuxt_component_0$2 } from "./nuxt-link.ffc48f31.js";
import UAParser from "ua-parser-js";
import { u as uniqueId } from "./functions.bbda7c35.js";
const FooterComponent_vue_vue_type_style_index_0_scoped_23c7bfdc_lang = "";
const _sfc_main$4 = {
  __name: "FooterComponent",
  __ssrInlineRender: true,
  setup(__props) {
    const currentDate = ref(new Date().getFullYear());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(_attrs)} data-v-23c7bfdc><div class="copyright" data-v-23c7bfdc> Made with <span class="text-color-red-light" data-v-23c7bfdc>♥</span> and <a href="https://nuxtjs.org/fr" data-v-23c7bfdc>Nuxtjs</a>. Copyright © ${ssrInterpolate(unref(currentDate))} Simon JOUAN </div></footer>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FooterComponent.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-23c7bfdc"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  name: "TerminalButton",
  emits: ["open-terminal"]
});
const TerminalButton_vue_vue_type_style_index_0_scoped_c9a3c006_lang = "";
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<button${ssrRenderAttrs(_attrs)} data-v-c9a3c006>Terminal</button>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/terminal/TerminalButton.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-c9a3c006"]]);
const helloWorld = {
  command: "helloWorld",
  description: "Un petit Bonjour !",
  run: function(config) {
    return `Bonjour, ${config.userName} ! Bienvenue dans le terminal.`;
  }
};
const help = {
  command: "help",
  description: "Liste les commandes disponibles.",
  run: function() {
    const commands = Object.values(programManager.programs).map((p) => `<li>${p.command} - ${p.description}</li>`).join("");
    return `<ul>${commands}</ul>`;
  }
};
const newTerminal = {
  command: "new",
  description: "Ouvre un nouveau terminal.",
  initialData: "Data dans la nouvelle fenêtre.",
  run: (_, createNewTerminal, initialData) => {
    if (createNewTerminal && initialData) {
      createNewTerminal({ initialData });
      return `Nouvelle fenêtre de terminal ouverte avec les données suivantes : ${initialData}`;
    }
    if (createNewTerminal) {
      createNewTerminal();
      return "Un nouveau terminal a été ouvert.";
    }
    return "Impossible d'ouvrir un nouveau terminal.";
  }
};
const parser = new UAParser();
const systemInfo = {
  command: "system-info",
  description: "Affiche des informations sur le système de l'utilisateur.",
  run() {
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
  }
};
const aboutData = {
  userInfo: {
    firstname: "Simon",
    lastname: "JOUAN",
    poste: "Développeur Fullstack & Testeur QA",
    experience: "3 ans",
    ville: "Valognes, France",
    telephone: "+33 6 58 96 90 20",
    email: "simon@jouan.ovh"
  },
  experiences: [
    {
      date: "02/2021 - aujourd'hui",
      entreprise: "Linkizz",
      description: "Testeur QA",
      technology: "nodejs Typesript Testcafé"
    },
    {
      date: "05/2020 - 12/2021",
      entreprise: "CINS",
      description: "Développeur Full Stack",
      technology: "PHP/MySQL HTML/CSS JS SASS Symfony-4/5 Drupal-7/8 Prestashop-1.7.* Wordpress Bootstrap Git Docker"
    },
    {
      date: "07/2007 - 05/2019",
      entreprise: "A+ Métrologie/Trescal",
      description: "Métrologue",
      technology: "Technicien métrologue multi-grandeur. Suppléant du dossier COFRAC en Électricité - magnétisme. Suppléant du laboratoire Électricité - magnétisme"
    },
    {
      date: "07/2001 - 07/2006",
      entreprise: "OPTEOR",
      description: "Régleur / Instrumentiste",
      technology: "Maintenance industrielle sur un site pétrochimique"
    }
  ],
  degrees: [
    {
      date: "2017 - 2018",
      name: "Développeur d’application - PHP / Symfony",
      school: "OpenClassrooms",
      description: "Projet Wordpress • Projet Bootstrap • Projet Mysql • Projet PHP – POO • 3 Projet Symfony"
    },
    {
      date: "1999 - 2001",
      name: "BTS CIRA",
      school: "Lycée A. de Tocqueville à Cherbourg",
      description: "Contrôle Industriel et Régulation Automatique"
    },
    {
      date: "1997 - 1999",
      name: "BAC STL PLPI",
      school: "Lycée A. de Tocqueville à Cherbourg",
      description: "Science et Technique de Laboratoire option Physique de Laboratoire et Procédé Industriel"
    }
  ],
  hobbies: ["crossfit"]
};
class About {
  constructor() {
    __publicField(this, "data", aboutData);
  }
  parseData() {
    return this.getUserInformationsTable() + this.getExperiencesTable() + this.getDegreeTable() + this.getHobbiesTable();
  }
  getUserInformationsTable() {
    return `<table class="table w-50">
  <thead>
    <tr>
      <th colspan="2">User Informations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td>${this.data.userInfo.firstname} ${this.data.userInfo.lastname}</td>
    </tr>
    <tr>
      <td>poste</td>
      <td>${this.data.userInfo.poste}</td>
    </tr>
    <tr>
      <td>experience</td>
      <td>${this.data.userInfo.experience}</td>
    </tr>
    <tr>
      <td>city</td>
      <td>${this.data.userInfo.ville}</td>
    </tr>
    <tr>
      <td>email</td>
      <td>${this.data.userInfo.email}</td>
    </tr>
  </tbody>
</table>
`;
  }
  getExperiencesTable() {
    let experiences = '<table class="table w-100">\n  <thead>\n    <tr>\n      <th colspan="4">Experiences</th>\n    </tr>\n    <tr>\n      <th>Date</th>\n      <th>Entreprise</th>\n      <th>Description</th>\n      <th>Technology</th>\n    </tr>\n  </thead>\n  <tbody>\n';
    this.data.experiences.forEach((experience) => {
      experiences += `    <tr>
      <td>${experience.date}</td>
      <td>${experience.entreprise}</td>
      <td>${experience.description}</td>
      <td>${experience.technology}</td>
    </tr>
`;
    });
    experiences += "  </tbody>\n</table>\n";
    return experiences;
  }
  getHobbiesTable() {
    if (this.data.hobbies.length === 0)
      return "";
    let hobbies = '<table class="table w-100">\n  <thead>\n    <tr>\n      <th>Hobbies</th>\n    </tr>\n  </thead>\n  <tbody>\n';
    this.data.hobbies.forEach((hobby) => {
      hobbies += `    <tr>
      <td>${hobby}</td>
    </tr>
`;
    });
    hobbies += "  </tbody>\n</table>\n";
    return hobbies;
  }
  getDegreeTable() {
    let degrees = '<table class="table w-100">\n  <thead>\n    <tr>\n      <th colspan="4">Degrees</th>\n    </tr>\n    <tr>\n      <th>Date</th>\n      <th>Name</th>\n      <th>School</th>\n      <th>Description</th>\n    </tr>\n  </thead>\n  <tbody>\n';
    this.data.degrees.forEach((degree) => {
      degrees += `    <tr>
      <td>${degree.date}</td>
      <td>${degree.name}</td>
      <td>${degree.school}</td>
      <td>${degree.description}</td>
    </tr>
`;
    });
    degrees += "  </tbody>\n</table>\n";
    return degrees;
  }
}
const about = {
  command: "about",
  description: "Voulez-vous en savoir plus sur moi ?",
  initialData: new About().parseData(),
  run: (_, createNewTerminal, initialData) => {
    if (createNewTerminal && initialData) {
      createNewTerminal({
        height: "600px",
        width: "800px",
        initialData
      });
      return "Un nouveau terminal a été ouvert.";
    }
    if (createNewTerminal) {
      createNewTerminal();
      return "Un nouveau terminal a été ouvert.";
    }
    return "Impossible d'ouvrir un nouveau terminal.";
  }
};
class ProgramManager {
  constructor() {
    __publicField(this, "programs", {});
  }
  add(program) {
    if (this.programs[program.command]) {
      const error = `Un programme avec la clé ${program.command} existe déjà`;
      console.error(error);
      throw new Error(error);
    }
    this.programs[program.command] = program;
    return this;
  }
  remove(key) {
    if (!this.programs[key]) {
      const error = `Aucun programme trouvé avec la clé ${key}`;
      console.error(error);
      throw new Error(error);
    }
    delete this.programs[key];
    return this;
  }
  get(key) {
    return this.programs[key];
  }
}
const programManager = new ProgramManager();
programManager.add(help);
programManager.add(helloWorld);
programManager.add(newTerminal);
programManager.add(systemInfo);
programManager.add(about);
let terminalDefaults = {
  width: "800px",
  height: "400px",
  userName: "anon.",
  domainName: "example.com",
  initialData: ""
};
const importedConfig = async () => {
  try {
    const importedConfig2 = await import("./terminal.config.8df310cb.js");
    terminalDefaults = importedConfig2.terminalDefaults;
  } catch (error) {
    console.warn("Aucun fichier terminal.config.ts trouvé. Utilisation des valeurs par défaut.");
  }
};
importedConfig();
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  name: "TerminalComponent",
  props: {
    id: {
      type: Number,
      required: true,
      default: 0
    },
    createNewTerminal: {
      type: Function,
      required: false,
      default: () => {
      }
    },
    terminalConfig: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const commandLines = ref([]);
    const userInput = ref("");
    const resizing = ref(false);
    const dragging = ref(false);
    const dragStartPosition = ref({ x: 0, y: 0 });
    const terminalElement = ref(null);
    const userInputRef = ref(null);
    const commandHistory = ref([]);
    const commandHistoryPosition = ref(-1);
    const defaultConfig = ref({
      width: props.terminalConfig.width || terminalDefaults.width,
      height: props.terminalConfig.height || terminalDefaults.height,
      userName: props.terminalConfig.userName || terminalDefaults.userName,
      domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
      initialData: props.terminalConfig.initialData || terminalDefaults.initialData
    });
    if (defaultConfig.value.initialData) {
      commandLines.value.push({
        text: defaultConfig.value.initialData,
        isResponse: true
      });
    }
    const focusUserInput = () => {
      if (terminalElement.value) {
        terminalElement.value.style.zIndex = (Date.now() % 2147483647).toString();
      }
      if (userInputRef.value) {
        userInputRef.value.focus();
      }
    };
    const submitInput = () => {
      const command = userInput.value.trim();
      if (command) {
        commandLines.value.push({
          text: userInput.value,
          isResponse: false
        });
        const output = runCommand(command);
        if (output instanceof HTMLElement) {
          commandLines.value.push({ text: output.outerHTML, isResponse: true });
        } else {
          commandLines.value.push({ text: output, isResponse: true });
        }
        commandHistory.value.push(userInput.value);
        commandHistoryPosition.value = -1;
        userInput.value = "";
      }
    };
    const runCommand = (command) => {
      const program = programManager.get(command);
      if (program) {
        return program.run(
          { userName: defaultConfig.value.userName },
          props.createNewTerminal,
          program.initialData
        );
      }
      return `Commande inconnue : ${command}`;
    };
    const handleHistoryNavigation = (event) => {
      if (event.key === "ArrowUp") {
        if (commandHistoryPosition.value < commandHistory.value.length - 1) {
          commandHistoryPosition.value++;
        }
      } else if (event.key === "ArrowDown") {
        if (commandHistoryPosition.value > -1) {
          commandHistoryPosition.value--;
        }
      }
      if (commandHistoryPosition.value > -1 && commandHistoryPosition.value < commandHistory.value.length) {
        userInput.value = commandHistory.value[commandHistory.value.length - 1 - commandHistoryPosition.value];
      } else {
        userInput.value = "";
      }
    };
    const handleMouseDown = (event) => {
      if (event.target instanceof HTMLElement && event.target.classList.contains("resize-handle")) {
        resizing.value = true;
      }
    };
    const handleResizeMouseMove = (event) => {
      if (resizing.value && terminalElement.value) {
        terminalElement.value.style.width = `${event.clientX - terminalElement.value.offsetLeft}px`;
        terminalElement.value.style.height = `${event.clientY - terminalElement.value.offsetTop}px`;
      }
    };
    const handleMouseUp = () => {
      resizing.value = false;
      dragging.value = false;
    };
    const handleHeaderMouseDown = (event) => {
      if (event.target instanceof HTMLElement && event.currentTarget instanceof HTMLElement && event.currentTarget.parentElement && event.target.classList.contains("terminal-header")) {
        dragging.value = true;
        dragStartPosition.value = {
          x: event.clientX - event.currentTarget.parentElement.offsetLeft,
          y: event.clientY - event.currentTarget.parentElement.offsetTop
        };
        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);
      }
    };
    const handleGlobalMouseMove = (event) => {
      if (dragging.value && terminalElement.value) {
        const terminalElementValue = terminalElement.value;
        const newLeft = Math.min(
          Math.max(0, event.clientX - dragStartPosition.value.x),
          window.innerWidth - terminalElementValue.offsetWidth
        );
        const newTop = Math.min(
          Math.max(0, event.clientY - dragStartPosition.value.y),
          window.innerHeight - terminalElementValue.offsetHeight
        );
        terminalElementValue.style.left = `${newLeft}px`;
        terminalElementValue.style.top = `${newTop}px`;
      }
    };
    const handleGlobalMouseUp = (_) => {
      if (dragging.value) {
        dragging.value = false;
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      }
    };
    const updateTerminalDimensions = () => {
      if (terminalElement.value) {
        terminalElement.value.style.width = defaultConfig.value.width;
        terminalElement.value.style.height = defaultConfig.value.height;
      }
    };
    const closeTerminal = () => {
      if (terminalElement.value) {
        terminalElement.value.style.display = "none";
      }
    };
    onMounted(() => {
      updateTerminalDimensions();
      focusUserInput();
    });
    watch(
      () => [defaultConfig.value.width, defaultConfig.value.height],
      () => {
        updateTerminalDimensions();
      }
    );
    return {
      defaultConfig,
      commandLines,
      userInput,
      terminalElement,
      userInputRef,
      submitInput,
      handleHistoryNavigation,
      handleMouseDown,
      handleResizeMouseMove,
      handleMouseUp,
      handleHeaderMouseDown,
      closeTerminal,
      focusUserInput
    };
  }
});
const TerminalComponent_vue_vue_type_style_index_0_lang = "";
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    ref: "terminalElement",
    "data-id": _ctx.id,
    class: "terminal"
  }, _attrs))}><div class="terminal-header"><div class="close-button"></div><div class="header-text">${ssrInterpolate(_ctx.defaultConfig.domainName)}</div><div></div></div><div class="terminal-body"><!--[-->`);
  ssrRenderList(_ctx.commandLines, (line, index) => {
    _push(`<div>`);
    if (line.isResponse) {
      _push(`<span>${line.text}</span>`);
    } else {
      _push(`<!--[--><span class="git-prompt">${ssrInterpolate(_ctx.defaultConfig.userName)}@${ssrInterpolate(_ctx.defaultConfig.domainName)} <span class="git-prompt-separator">:</span><span class="git-prompt-directory">~</span><span class="git-prompt-separator">$</span></span>${ssrInterpolate(line.text)}<!--]-->`);
    }
    _push(`</div>`);
  });
  _push(`<!--]--><span class="git-prompt">${ssrInterpolate(_ctx.defaultConfig.userName)}@${ssrInterpolate(_ctx.defaultConfig.domainName)} <span class="git-prompt-separator">:</span><span class="git-prompt-directory">~</span><span class="git-prompt-separator">$</span></span><input${ssrRenderAttr("value", _ctx.userInput)} type="text" class="user-input"></div><div class="resize-handle"></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/terminal/TerminalComponent.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = {
  name: "TerminalManagerComponent",
  components: {},
  setup() {
    const terminals = ref([]);
    const createNewTerminal = (terminalConfig = {}) => {
      const newTerminal2 = {
        id: uniqueId(),
        terminalConfig
      };
      terminals.value.push(newTerminal2);
    };
    return {
      terminals,
      createNewTerminal
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TerminalComponent = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}><!--[-->`);
  ssrRenderList($setup.terminals, (terminal, index) => {
    _push(`<div>`);
    _push(ssrRenderComponent(_component_TerminalComponent, {
      id: index,
      "create-new-terminal": $setup.createNewTerminal,
      "terminal-config": terminal.terminalConfig
    }, null, _parent));
    _push(`</div>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/terminal/TerminalManagerComponent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TerminalManagerComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HeaderComponent",
  __ssrInlineRender: true,
  setup(__props) {
    const terminalManager = ref(null);
    const addNewTerminal = () => {
      if (terminalManager.value) {
        terminalManager.value.createNewTerminal();
      }
    };
    const isHidden = ref(true);
    const closeMenu = () => {
      isHidden.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_TerminalButton = __nuxt_component_1;
      _push(`<header${ssrRenderAttrs(_attrs)} data-v-9023a784><button class="btn btn-small btn-dark" role="button" data-v-9023a784>&lt;sj /&gt;</button><nav id="menu" class="${ssrRenderClass({ "hidden": unref(isHidden) })}" data-v-9023a784><div id="close-menu" data-v-9023a784></div><ul data-v-9023a784><li data-v-9023a784>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        onClick: closeMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Accueil`);
          } else {
            return [
              createTextVNode("Accueil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9023a784>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/blog",
        onClick: closeMenu
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Blog`);
          } else {
            return [
              createTextVNode("Blog")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9023a784>`);
      _push(ssrRenderComponent(_component_TerminalButton, {
        onClick: closeMenu,
        onOpenTerminal: addNewTerminal
      }, null, _parent));
      _push(`</li></ul></nav>`);
      _push(ssrRenderComponent(TerminalManagerComponent, {
        ref_key: "terminalManager",
        ref: terminalManager
      }, null, _parent));
      _push(`</header>`);
    };
  }
});
const HeaderComponent_vue_vue_type_style_index_0_scoped_9023a784_lang = "";
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeaderComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9023a784"]]);
export {
  __nuxt_component_0 as _,
  __nuxt_component_1$1 as a
};
