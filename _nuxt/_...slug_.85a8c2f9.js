import _sfc_main$1 from "./ContentDoc.468f9330.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./entry.28f2a879.js";
import "hookable";
import "destr";
import "ufo";
import "@unhead/vue";
import "./ContentRenderer.3c4a7e92.js";
import "./ContentRendererMarkdown.7ac769af.js";
import "scule";
import "property-information";
import "ofetch";
import "unctx";
import "@unhead/vue/polyfill";
import "vue-router";
import "h3";
import "defu";
import "./ContentQuery.d9b32f31.js";
import "ohash";
import "./utils.4e00ab78.js";
import "cookie-es";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ContentDoc = _sfc_main$1;
  _push(`<main${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_ContentDoc, null, null, _parent));
  _push(`</main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  ____slug_ as default
};
