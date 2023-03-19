import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent } from "vue/server-renderer";
import { useSSRContext, mergeProps, computed, defineComponent, ref, onMounted, h } from "vue";
import { _ as _export_sfc, c as useNuxtApp, p as parseSize, g as getFileExtension } from "./entry.28f2a879.js";
import "destr";
import { useHead } from "@unhead/vue";
import "hookable";
import "defu";
const _sfc_main$3 = {
  name: "MainComponent"
};
const MainComponent_vue_vue_type_style_index_0_scoped_06682405_lang = "";
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<main${ssrRenderAttrs(_attrs)} data-v-06682405>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MainComponent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-06682405"]]);
const ZCardBody_vue_vue_type_style_index_0_scoped_349bedfa_lang = "";
const _sfc_main$2 = {
  name: "ZCardBody"
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "content" }, _attrs))} data-v-349bedfa>`);
  ssrRenderSlot(_ctx.$slots, "title", {}, null, _push, _parent);
  ssrRenderSlot(_ctx.$slots, "body", {}, null, _push, _parent);
  _push(`</section>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/card/ZCardBody.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ZCardBody = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-349bedfa"]]);
const _sfc_main$1 = {
  name: "ZCardComponent"
};
const ZCardComponent_vue_vue_type_style_index_0_scoped_c90f45d0_lang = "";
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<article${ssrRenderAttrs(_attrs)} data-v-c90f45d0>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</article>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/card/ZCardComponent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ZCardComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-c90f45d0"]]);
const useImage = () => {
  return useNuxtApp().$img;
};
const baseImageProps = {
  src: { type: String, required: true },
  format: { type: String, default: void 0 },
  quality: { type: [Number, String], default: void 0 },
  background: { type: String, default: void 0 },
  fit: { type: String, default: void 0 },
  modifiers: { type: Object, default: void 0 },
  preset: { type: String, default: void 0 },
  provider: { type: String, default: void 0 },
  sizes: { type: [Object, String], default: void 0 },
  preload: { type: Boolean, default: void 0 },
  width: { type: [String, Number], default: void 0 },
  height: { type: [String, Number], default: void 0 },
  alt: { type: String, default: void 0 },
  referrerpolicy: { type: String, default: void 0 },
  usemap: { type: String, default: void 0 },
  longdesc: { type: String, default: void 0 },
  ismap: { type: Boolean, default: void 0 },
  loading: { type: String, default: void 0 },
  crossorigin: {
    type: [Boolean, String],
    default: void 0,
    validator: (val) => ["anonymous", "use-credentials", "", true, false].includes(val)
  },
  decoding: {
    type: String,
    default: void 0,
    validator: (val) => ["async", "auto", "sync"].includes(val)
  }
};
const useBaseImage = (props) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
    };
  });
  const attrs = computed(() => {
    return {
      width: parseSize(props.width),
      height: parseSize(props.height),
      alt: props.alt,
      referrerpolicy: props.referrerpolicy,
      usemap: props.usemap,
      longdesc: props.longdesc,
      ismap: props.ismap,
      crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
      loading: props.loading,
      decoding: props.decoding
    };
  });
  const modifiers = computed(() => {
    return {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return {
    options,
    attrs,
    modifiers
  };
};
const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null }
};
const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "NuxtPicture",
  props: pictureProps,
  emits: ["load"],
  setup: (props, ctx) => {
    var _a, _b, _c;
    const $img = useImage();
    const _base = useBaseImage(props);
    const isTransparent = computed(() => ["png", "webp", "gif"].includes(originalFormat.value));
    const originalFormat = computed(() => getFileExtension(props.src));
    const format = computed(() => props.format || originalFormat.value === "svg" ? "svg" : "webp");
    const legacyFormat = computed(() => {
      if (props.legacyFormat) {
        return props.legacyFormat;
      }
      const formats = {
        webp: isTransparent.value ? "png" : "jpeg",
        svg: "png"
      };
      return formats[format.value] || originalFormat.value;
    });
    const sources = computed(() => {
      if (format.value === "svg") {
        return [{ srcset: props.src }];
      }
      const formats = legacyFormat.value !== format.value ? [legacyFormat.value, format.value] : [format.value];
      return formats.map((format2) => {
        const { srcset, sizes, src } = $img.getSizes(props.src, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          modifiers: { ..._base.modifiers.value, format: format2 }
        });
        return { src, type: `image/${format2}`, sizes, srcset };
      });
    });
    if (props.preload) {
      const srcKey = ((_a = sources.value) == null ? void 0 : _a[1]) ? 1 : 0;
      const link = { rel: "preload", as: "image", imagesrcset: sources.value[srcKey].srcset };
      if ((_c = (_b = sources.value) == null ? void 0 : _b[srcKey]) == null ? void 0 : _c.sizes) {
        link.imagesizes = sources.value[srcKey].sizes;
      }
      useHead({ link: [link] });
    }
    const imgAttrs = { ...props.imgAttrs, "data-nuxt-pic": "" };
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key];
      }
    }
    const imgEl = ref();
    onMounted(() => {
      imgEl.value.onload = (event) => {
        ctx.emit("load", event);
      };
    });
    return () => {
      var _a2;
      return h("picture", { key: sources.value[0].src }, [
        ...((_a2 = sources.value) == null ? void 0 : _a2[1]) ? [h("source", {
          type: sources.value[1].type,
          sizes: sources.value[1].sizes,
          srcset: sources.value[1].srcset
        })] : [],
        h("img", {
          ref: imgEl,
          ..._base.attrs.value,
          ...imgAttrs,
          src: sources.value[0].src,
          sizes: sources.value[0].sizes,
          srcset: sources.value[0].srcset
        })
      ]);
    };
  }
});
const _sfc_main = {
  name: "ZCardHeader",
  props: {
    img: {
      type: Object,
      required: true
    }
  }
};
const ZCardHeader_vue_vue_type_style_index_0_scoped_59473551_lang = "";
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_picture = __nuxt_component_0;
  _push(`<header${ssrRenderAttrs(_attrs)} data-v-59473551>`);
  _push(ssrRenderComponent(_component_nuxt_picture, {
    src: $props.img.src,
    "img-attrs": $props.img.attr
  }, null, _parent));
  _push(`</header>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/card/ZCardHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ZCardHeader = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-59473551"]]);
export {
  ZCardComponent as Z,
  __nuxt_component_0$1 as _,
  ZCardBody as a,
  baseImageProps as b,
  ZCardHeader as c
};
