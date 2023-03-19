import { defineComponent, getCurrentInstance, useSlots, computed, useSSRContext } from "vue";
import _sfc_main$1 from "./ContentSlot.7fe97cf2.js";
import "./utils.4e00ab78.js";
import "ufo";
import "./entry.28f2a879.js";
import "ofetch";
import "hookable";
import "unctx";
import "@unhead/vue";
import "@unhead/vue/polyfill";
import "vue-router";
import "h3";
import "destr";
import "defu";
import "vue/server-renderer";
import "cookie-es";
const _sfc_main = /* @__PURE__ */ defineComponent({
  name: "Markdown",
  extends: _sfc_main$1,
  setup(props) {
    const { parent } = getCurrentInstance();
    const { between, default: fallbackSlot } = useSlots();
    const tags = computed(() => {
      if (typeof props.unwrap === "string") {
        return props.unwrap.split(" ");
      }
      return ["*"];
    });
    return {
      fallbackSlot,
      tags,
      between,
      parent
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/content/dist/runtime/components/Markdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
