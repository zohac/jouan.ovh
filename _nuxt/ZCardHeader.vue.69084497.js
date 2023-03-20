import{B as w,e as a,Q as d,b as x,R as k,v as C,C as B,L as F,i as g}from"./entry.8895f1f2.js";const N=()=>w().$img,p={src:{type:String,required:!0},format:{type:String,default:void 0},quality:{type:[Number,String],default:void 0},background:{type:String,default:void 0},fit:{type:String,default:void 0},modifiers:{type:Object,default:void 0},preset:{type:String,default:void 0},provider:{type:String,default:void 0},sizes:{type:[Object,String],default:void 0},preload:{type:Boolean,default:void 0},width:{type:[String,Number],default:void 0},height:{type:[String,Number],default:void 0},alt:{type:String,default:void 0},referrerpolicy:{type:String,default:void 0},usemap:{type:String,default:void 0},longdesc:{type:String,default:void 0},ismap:{type:Boolean,default:void 0},loading:{type:String,default:void 0},crossorigin:{type:[Boolean,String],default:void 0,validator:e=>["anonymous","use-credentials","",!0,!1].includes(e)},decoding:{type:String,default:void 0,validator:e=>["async","auto","sync"].includes(e)}},j=e=>{const s=a(()=>({provider:e.provider,preset:e.preset})),u=a(()=>({width:d(e.width),height:d(e.height),alt:e.alt,referrerpolicy:e.referrerpolicy,usemap:e.usemap,longdesc:e.longdesc,ismap:e.ismap,crossorigin:e.crossorigin===!0?"anonymous":e.crossorigin||void 0,loading:e.loading,decoding:e.decoding})),n=a(()=>({...e.modifiers,width:d(e.width),height:d(e.height),format:e.format,quality:e.quality,background:e.background,fit:e.fit}));return{options:s,attrs:u,modifiers:n}},q={...p,legacyFormat:{type:String,default:null},imgAttrs:{type:Object,default:null}},I=x({name:"NuxtPicture",props:q,emits:["load"],setup:(e,s)=>{var m,y,_;const u=N(),n=j(e),S=a(()=>["png","webp","gif"].includes(l.value)),l=a(()=>k(e.src)),r=a(()=>e.format||l.value==="svg"?"svg":"webp"),v=a(()=>e.legacyFormat?e.legacyFormat:{webp:S.value?"png":"jpeg",svg:"png"}[r.value]||l.value),i=a(()=>r.value==="svg"?[{srcset:e.src}]:(v.value!==r.value?[v.value,r.value]:[r.value]).map(o=>{const{srcset:b,sizes:h,src:z}=u.getSizes(e.src,{...n.options.value,sizes:e.sizes||u.options.screens,modifiers:{...n.modifiers.value,format:o}});return{src:z,type:`image/${o}`,sizes:h,srcset:b}}));if(e.preload){const t=(m=i.value)!=null&&m[1]?1:0,o={rel:"preload",as:"image",imagesrcset:i.value[t].srcset};(_=(y=i.value)==null?void 0:y[t])!=null&&_.sizes&&(o.imagesizes=i.value[t].sizes),C({link:[o]})}const c={...e.imgAttrs,"data-nuxt-pic":""};for(const t in s.attrs)t in p&&!(t in c)&&(c[t]=s.attrs[t]);const f=B();return F(()=>{f.value.onload=t=>{s.emit("load",t)}}),()=>{var t;return g("picture",{key:i.value[0].src},[...(t=i.value)!=null&&t[1]?[g("source",{type:i.value[1].type,sizes:i.value[1].sizes,srcset:i.value[1].srcset})]:[],g("img",{ref:f,...n.attrs.value,...c,src:i.value[0].src,sizes:i.value[0].sizes,srcset:i.value[0].srcset})])}}});export{I as _,p as b};
