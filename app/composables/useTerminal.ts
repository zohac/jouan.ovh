import { ref } from "vue";

// Lanceur partagé de l'easter-egg terminal.
//
// Le `TerminalManagerComponent` (qui expose `createNewTerminal()`) est monté dans
// le `HeaderComponent` ; il n'existe pas d'API globale d'ouverture. Ce registre
// minimal expose cette ouverture aux autres parties du site (ex. le hero d'accueil
// story 3.1) sans dupliquer le gestionnaire ni dépendre d'Epic 8.
//
// Le header enregistre son lanceur au montage (`register`), les appelants
// déclenchent l'ouverture (`open`). Tant qu'aucun lanceur n'est enregistré (ex.
// au prerender `nuxi generate`, avant hydratation), `open()` est un no-op sûr.
// La restylisation complète du terminal reste du périmètre d'Epic 8.

/** Contexte d'ouverture transmis à la télémétrie (story 14.3). */
export interface TerminalOpenOptions {
  /**
   * Origine de l'ouverture. Valeurs du tracking plan : `header_icon`,
   * `keyboard_shortcut`, `hero_prompt` (+ `contact_cta` pour la page contact).
   * @default "header_icon"
   */
  trigger_source?: string;
}

type TerminalLauncher = (options?: TerminalOpenOptions) => void;

const launcher = ref<TerminalLauncher | null>(null);

export function useTerminal() {
  return {
    /** Enregistre le lanceur réel (appelé par le header au montage). */
    register(fn: TerminalLauncher) {
      launcher.value = fn;
    },
    /**
     * Désenregistre le lanceur au démontage. Ne nullifie que si le lanceur
     * courant est bien `fn` (évite d'effacer un enregistrement plus récent).
     */
    unregister(fn: TerminalLauncher) {
      if (launcher.value === fn) {
        launcher.value = null;
      }
    },
    /** Ouvre un terminal si un lanceur est disponible ; no-op sinon. */
    open(options?: TerminalOpenOptions) {
      launcher.value?.(options);
    },
  };
}
