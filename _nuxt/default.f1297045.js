import { _ as __nuxt_component_0, a as __nuxt_component_1 } from "./HeaderComponent.714b8248.js";
import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "./entry.28f2a879.js";
import "./nuxt-link.ffc48f31.js";
import "ufo";
import "hookable";
import "ua-parser-js";
import "./functions.bbda7c35.js";
import "ofetch";
import "unctx";
import "@unhead/vue";
import "@unhead/vue/polyfill";
import "vue-router";
import "h3";
import "destr";
import "defu";
const default_vue_vue_type_style_index_0_scoped_b19b4e4c_lang = "";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_HeaderComponent = __nuxt_component_0;
  const _component_FooterComponent = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "init",
    role: "img",
    title: ""
  }, _attrs))} data-v-b19b4e4c>`);
  _push(ssrRenderComponent(_component_HeaderComponent, null, null, _parent));
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_FooterComponent, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-b19b4e4c"]]);
export {
  _default as default
};
