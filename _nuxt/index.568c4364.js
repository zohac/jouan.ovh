import { Z as ZCardComponent, a as ZCardBody, c as ZCardHeader, _ as __nuxt_component_0 } from "./ZCardHeader.ed42f5d7.js";
import { reactive, resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import { Z as ZCardFooter } from "./ZCardFooter.336a4ba1.js";
import { g as getRandomUrl } from "./functions.bbda7c35.js";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./entry.28f2a879.js";
import "destr";
import "@unhead/vue";
import "hookable";
import "defu";
import "ofetch";
import "unctx";
import "@unhead/vue/polyfill";
import "vue-router";
import "h3";
import "ufo";
const PORTRAIT_URLS = [
  "/images/portrait_512x512_drip_art_1.webp",
  "/images/portrait_512x512_drip_art_2.webp",
  // '/images/portrait_512x512_drip_art_3.webp',
  "/images/portrait_512x512_drip_art_4.webp",
  // '/images/portrait_512x512_drip_art_5.webp',
  // '/images/portrait_512x512_drip_art_6.webp',
  "/images/portrait_512x512_drip_art_7.webp",
  "/images/portrait_512x512_drip_art_8.webp",
  "/images/portrait_512x512_drip_art_9.webp"
];
const _sfc_main = {
  name: "Home",
  components: { ZCardComponent, ZCardFooter, ZCardBody, ZCardHeader },
  setup() {
    const img = reactive({
      src: getRandomUrl(PORTRAIT_URLS),
      attr: {
        alt: "Portrait de Simon JOUAN",
        title: "Portrait de Simon JOUAN",
        loading: "eager",
        height: 512,
        width: 512,
        decoding: "async"
      }
    });
    return {
      img
    };
  }
};
const index_vue_vue_type_style_index_0_scoped_490649bd_lang = "";
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_MainComponent = __nuxt_component_0;
  const _component_ZCardComponent = resolveComponent("ZCardComponent");
  const _component_ZCardHeader = resolveComponent("ZCardHeader");
  const _component_ZCardBody = resolveComponent("ZCardBody");
  const _component_ZCardFooter = resolveComponent("ZCardFooter");
  _push(ssrRenderComponent(_component_MainComponent, mergeProps({ class: "home-center" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_ZCardComponent, { class: "home-card-w" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_ZCardHeader, { img: $setup.img }, null, _parent3, _scopeId2));
              _push3(ssrRenderComponent(_component_ZCardBody, null, {
                title: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(`<h1 data-v-490649bd${_scopeId3}>Simon Jouan</h1>`);
                  } else {
                    return [
                      createVNode("h1", null, "Simon Jouan")
                    ];
                  }
                }),
                body: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(`<p data-v-490649bd${_scopeId3}>Développeur Web FullStack &amp; Testeur/QA</p><p data-v-490649bd${_scopeId3}>Freelance</p>`);
                  } else {
                    return [
                      createVNode("p", null, "Développeur Web FullStack & Testeur/QA"),
                      createVNode("p", null, "Freelance")
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(ssrRenderComponent(_component_ZCardFooter, null, null, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_ZCardHeader, { img: $setup.img }, null, 8, ["img"]),
                createVNode(_component_ZCardBody, null, {
                  title: withCtx(() => [
                    createVNode("h1", null, "Simon Jouan")
                  ]),
                  body: withCtx(() => [
                    createVNode("p", null, "Développeur Web FullStack & Testeur/QA"),
                    createVNode("p", null, "Freelance")
                  ]),
                  _: 1
                }),
                createVNode(_component_ZCardFooter)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_ZCardComponent, { class: "home-card-w" }, {
            default: withCtx(() => [
              createVNode(_component_ZCardHeader, { img: $setup.img }, null, 8, ["img"]),
              createVNode(_component_ZCardBody, null, {
                title: withCtx(() => [
                  createVNode("h1", null, "Simon Jouan")
                ]),
                body: withCtx(() => [
                  createVNode("p", null, "Développeur Web FullStack & Testeur/QA"),
                  createVNode("p", null, "Freelance")
                ]),
                _: 1
              }),
              createVNode(_component_ZCardFooter)
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-490649bd"]]);
export {
  index as default
};
