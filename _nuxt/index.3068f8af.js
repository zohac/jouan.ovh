import { Z as ZCardComponent, a as ZCardBody, c as ZCardHeader, _ as __nuxt_component_0 } from "./ZCardHeader.ed42f5d7.js";
import _sfc_main$1 from "./ContentList.0cb42b9b.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link.ffc48f31.js";
import { reactive, resolveComponent, withCtx, openBlock, createBlock, createCommentVNode, createVNode, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { g as getRandomUrl } from "./functions.bbda7c35.js";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "./entry.28f2a879.js";
import "destr";
import "@unhead/vue";
import "hookable";
import "defu";
import "./ContentQuery.d9b32f31.js";
import "ohash";
import "ufo";
import "./utils.4e00ab78.js";
import "cookie-es";
import "ofetch";
import "unctx";
import "@unhead/vue/polyfill";
import "vue-router";
import "h3";
const IMG_BLOG_URLS = [
  "/images/00010-1600x896.png",
  "/images/00011-1600x896.png",
  "/images/00012-1600x896.png",
  "/images/00013-1600x896.png",
  "/images/00014-1600x896.png",
  "/images/00015-1600x896.png",
  "/images/00016-1600x896.png",
  "/images/00017-1600x896.png"
];
const _sfc_main = {
  name: "Blog",
  components: { ZCardComponent, ZCardBody, ZCardHeader },
  setup() {
    const img = reactive({
      src: getRandomUrl(IMG_BLOG_URLS),
      attr: {
        loading: "eager",
        decoding: "async"
      }
    });
    return {
      img
    };
  }
};
const index_vue_vue_type_style_index_0_scoped_f1f8ad94_lang = "";
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_MainComponent = __nuxt_component_0;
  const _component_ContentList = _sfc_main$1;
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_ZCardComponent = resolveComponent("ZCardComponent");
  const _component_ZCardHeader = resolveComponent("ZCardHeader");
  const _component_ZCardBody = resolveComponent("ZCardBody");
  _push(ssrRenderComponent(_component_MainComponent, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<ul data-v-f1f8ad94${_scopeId}>`);
        _push2(ssrRenderComponent(_component_ContentList, { path: "/blog" }, {
          default: withCtx(({ list }, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<!--[-->`);
              ssrRenderList(list, (article) => {
                _push3(`<li data-v-f1f8ad94${_scopeId2}>`);
                _push3(ssrRenderComponent(_component_NuxtLink, {
                  to: article._path
                }, {
                  default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      if (article.image) {
                        _push4(`<img${ssrRenderAttr("src", article.image.src)}${ssrRenderAttr("alt", article.image.alt)} data-v-f1f8ad94${_scopeId3}>`);
                      } else {
                        _push4(`<!---->`);
                      }
                      _push4(`<h2 data-v-f1f8ad94${_scopeId3}>${ssrInterpolate(article.title)}</h2><p data-v-f1f8ad94${_scopeId3}>${ssrInterpolate(article.description)}</p>`);
                    } else {
                      return [
                        article.image ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: article.image.src,
                          alt: article.image.alt
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                        createVNode("h2", null, toDisplayString(article.title), 1),
                        createVNode("p", null, toDisplayString(article.description), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                _push3(`</li>`);
              });
              _push3(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(list, (article) => {
                  return openBlock(), createBlock("li", {
                    key: article._path
                  }, [
                    createVNode(_component_NuxtLink, {
                      to: article._path
                    }, {
                      default: withCtx(() => [
                        article.image ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: article.image.src,
                          alt: article.image.alt
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                        createVNode("h2", null, toDisplayString(article.title), 1),
                        createVNode("p", null, toDisplayString(article.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ]);
                }), 128))
              ];
            }
          }),
          "not-found": withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_ZCardComponent, { class: "container-w50" }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent(_component_ZCardHeader, { img: $setup.img }, null, _parent4, _scopeId3));
                    _push4(ssrRenderComponent(_component_ZCardBody, null, {
                      title: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`<h1 data-v-f1f8ad94${_scopeId4}>Oups, il n&#39;y a pas encore d&#39;articles sur mon blog pour le moment.</h1>`);
                        } else {
                          return [
                            createVNode("h1", null, "Oups, il n'y a pas encore d'articles sur mon blog pour le moment.")
                          ];
                        }
                      }),
                      body: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`<p data-v-f1f8ad94${_scopeId4}> Mais ne vous inquiétez pas, je travaille actuellement sur de nouveaux contenus passionnants pour partager mes connaissances en développement web et mobile. Restez connecté(e) et n&#39;hésitez pas à revenir bientôt pour découvrir mes prochaines publications. </p>`);
                        } else {
                          return [
                            createVNode("p", null, " Mais ne vous inquiétez pas, je travaille actuellement sur de nouveaux contenus passionnants pour partager mes connaissances en développement web et mobile. Restez connecté(e) et n'hésitez pas à revenir bientôt pour découvrir mes prochaines publications. ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode(_component_ZCardHeader, { img: $setup.img }, null, 8, ["img"]),
                      createVNode(_component_ZCardBody, null, {
                        title: withCtx(() => [
                          createVNode("h1", null, "Oups, il n'y a pas encore d'articles sur mon blog pour le moment.")
                        ]),
                        body: withCtx(() => [
                          createVNode("p", null, " Mais ne vous inquiétez pas, je travaille actuellement sur de nouveaux contenus passionnants pour partager mes connaissances en développement web et mobile. Restez connecté(e) et n'hésitez pas à revenir bientôt pour découvrir mes prochaines publications. ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_ZCardComponent, { class: "container-w50" }, {
                  default: withCtx(() => [
                    createVNode(_component_ZCardHeader, { img: $setup.img }, null, 8, ["img"]),
                    createVNode(_component_ZCardBody, null, {
                      title: withCtx(() => [
                        createVNode("h1", null, "Oups, il n'y a pas encore d'articles sur mon blog pour le moment.")
                      ]),
                      body: withCtx(() => [
                        createVNode("p", null, " Mais ne vous inquiétez pas, je travaille actuellement sur de nouveaux contenus passionnants pour partager mes connaissances en développement web et mobile. Restez connecté(e) et n'hésitez pas à revenir bientôt pour découvrir mes prochaines publications. ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</ul>`);
      } else {
        return [
          createVNode("ul", null, [
            createVNode(_component_ContentList, { path: "/blog" }, {
              default: withCtx(({ list }) => [
                (openBlock(true), createBlock(Fragment, null, renderList(list, (article) => {
                  return openBlock(), createBlock("li", {
                    key: article._path
                  }, [
                    createVNode(_component_NuxtLink, {
                      to: article._path
                    }, {
                      default: withCtx(() => [
                        article.image ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: article.image.src,
                          alt: article.image.alt
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                        createVNode("h2", null, toDisplayString(article.title), 1),
                        createVNode("p", null, toDisplayString(article.description), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"])
                  ]);
                }), 128))
              ]),
              "not-found": withCtx(() => [
                createVNode(_component_ZCardComponent, { class: "container-w50" }, {
                  default: withCtx(() => [
                    createVNode(_component_ZCardHeader, { img: $setup.img }, null, 8, ["img"]),
                    createVNode(_component_ZCardBody, null, {
                      title: withCtx(() => [
                        createVNode("h1", null, "Oups, il n'y a pas encore d'articles sur mon blog pour le moment.")
                      ]),
                      body: withCtx(() => [
                        createVNode("p", null, " Mais ne vous inquiétez pas, je travaille actuellement sur de nouveaux contenus passionnants pour partager mes connaissances en développement web et mobile. Restez connecté(e) et n'hésitez pas à revenir bientôt pour découvrir mes prochaines publications. ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-f1f8ad94"]]);
export {
  index as default
};
