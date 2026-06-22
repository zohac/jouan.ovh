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

type TerminalLauncher = () => void;

const launcher = ref<TerminalLauncher | null>(null);

export function useTerminal() {
  return {
    /** Enregistre le lanceur réel (appelé par le header au montage). */
    register(fn: TerminalLauncher) {
      launcher.value = fn;
    },
    /** Ouvre un terminal si un lanceur est disponible ; no-op sinon. */
    open() {
      launcher.value?.();
    },
  };
}
