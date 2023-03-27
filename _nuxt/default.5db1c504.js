import{_ as T,a as I}from"./HeaderComponent.vue.85159e84.js";import{k as m,C as g,o as a,l as r,X as t,a2 as l,a1 as p,u as M,V as b,W as H,b as C,Z as w,Y as y,a3 as U,a4 as D,a5 as h,U as i,w as $,$ as S,r as B}from"./entry.eecb2418.js";import{_ as L}from"./nuxt-link.ad9353e0.js";import"./_base.bf0c0234.js";import"./_commonjsHelpers.28e086c5.js";const N=e=>(b("data-v-9eca168f"),e=e(),H(),e),V={class:"copyright"},z=N(()=>t("span",{class:"text-color-red-light"},"♥",-1)),F=N(()=>t("a",{href:"https://nuxtjs.org/fr"},"Nuxtjs",-1)),R={__name:"FooterComponent",setup(e){const n=g(new Date().getFullYear());return(d,s)=>(a(),r("footer",null,[t("div",V,[l(" Made with "),z,l(" and "),F,l(". Copyright © "+p(M(n))+" Simon JOUAN ",1)])]))}},O=m(R,[["__scopeId","data-v-9eca168f"]]),j=C({name:"TerminalButton",emits:["open-terminal"]});function A(e,n,d,s,c,u){return a(),r("button",{onClick:n[0]||(n[0]=o=>e.$emit("open-terminal"))},"Terminal")}const E=m(j,[["render",A],["__scopeId","data-v-c9a3c006"]]),K=["data-id"],Y={class:"header-text"},q=t("div",null,null,-1),J={class:"terminal-body"},W=["innerHTML"],X={class:"git-prompt"},Z=t("span",{class:"git-prompt-separator"},":",-1),G=t("span",{class:"git-prompt-directory"},"~",-1),P=t("span",{class:"git-prompt-separator"},"$",-1),Q={class:"git-prompt"},x=t("span",{class:"git-prompt-separator"},":",-1),ee=t("span",{class:"git-prompt-directory"},"~",-1),ne=t("span",{class:"git-prompt-separator"},"$",-1);function oe(e,n,d,s,c,u){return a(),r("div",{ref:"terminalElement","data-id":e.id,class:"terminal",onClick:n[10]||(n[10]=(...o)=>e.focusUserInput&&e.focusUserInput(...o))},[t("div",{class:"terminal-header",onMousedown:n[1]||(n[1]=(...o)=>e.handleHeaderMouseDown&&e.handleHeaderMouseDown(...o)),onMouseup:n[2]||(n[2]=(...o)=>e.handleMouseUp&&e.handleMouseUp(...o))},[t("div",{class:"close-button",onClick:n[0]||(n[0]=(...o)=>e.closeTerminal&&e.closeTerminal(...o))}),t("div",Y,p(e.defaultConfig.domainName),1),q],32),t("div",J,[(a(!0),r(w,null,y(e.commandLines,(o,_)=>(a(),r("div",{key:_},[o.isResponse?(a(),r("span",{key:0,innerHTML:o.text},null,8,W)):(a(),r(w,{key:1},[t("span",X,[l(p(e.defaultConfig.userName)+"@"+p(e.defaultConfig.domainName)+" ",1),Z,G,P]),l(p(o.text),1)],64))]))),128)),t("span",Q,[l(p(e.defaultConfig.userName)+"@"+p(e.defaultConfig.domainName)+" ",1),x,ee,ne]),U(t("input",{ref:"userInputRef","onUpdate:modelValue":n[3]||(n[3]=o=>e.userInput=o),type:"text",class:"user-input",onKeydown:[n[4]||(n[4]=h((...o)=>e.submitInput&&e.submitInput(...o),["enter"])),n[5]||(n[5]=h((...o)=>e.handleHistoryNavigation&&e.handleHistoryNavigation(...o),["arrow-up"])),n[6]||(n[6]=h((...o)=>e.handleHistoryNavigation&&e.handleHistoryNavigation(...o),["arrow-down"]))]},null,544),[[D,e.userInput]])]),t("div",{class:"resize-handle",onMousedown:n[7]||(n[7]=(...o)=>e.handleMouseDown&&e.handleMouseDown(...o)),onMousemove:n[8]||(n[8]=(...o)=>e.handleResizeMouseMove&&e.handleResizeMouseMove(...o)),onMouseup:n[9]||(n[9]=(...o)=>e.handleMouseUp&&e.handleMouseUp(...o))},null,32)],8,K)}const te=m(T,[["render",oe]]);function se(){return"_"+Math.random().toString(36).slice(2,11)}const ae={name:"TerminalManagerComponent",components:{},setup(){const e=g([]);return{terminals:e,createNewTerminal:(d={})=>{const s={id:se(),terminalConfig:d};e.value.push(s)}}}};function re(e,n,d,s,c,u){const o=te;return a(),r("div",null,[(a(!0),r(w,null,y(s.terminals,(_,f)=>(a(),r("div",{key:f},[i(o,{id:f,"create-new-terminal":s.createNewTerminal,"terminal-config":_.terminalConfig},null,8,["id","create-new-terminal","terminal-config"])]))),128))])}const ie=m(ae,[["render",re]]),le=C({__name:"HeaderComponent",setup(e){const n=g(null),d=()=>{n.value&&n.value.createNewTerminal()},s=g(!0),c=()=>{s.value=!s.value},u=()=>{s.value=!0};return(o,_)=>{const f=I,v=L,k=E;return a(),r("header",null,[t("button",{class:"btn btn-large btn-dark",role:"button","aria-label":"Ouvrir le menu",onClick:c},[i(f,{src:"/images/logo_white_32x32.png",preload:"",loading:"edger",alt:"logo",height:"32",width:"32"})]),t("nav",{id:"menu",class:S({hidden:M(s)})},[t("div",{id:"close-menu",onClick:u}),t("ul",null,[t("li",null,[i(v,{to:"/",onClick:u},{default:$(()=>[l("Accueil")]),_:1})]),t("li",null,[i(v,{to:"/blog",onClick:u},{default:$(()=>[l("Blog")]),_:1})]),t("li",null,[i(v,{to:"/about",onClick:u},{default:$(()=>[l("À propos")]),_:1})]),t("li",null,[i(k,{onClick:u,onOpenTerminal:d})])])],2),i(ie,{ref_key:"terminalManager",ref:n},null,512)])}}}),de=m(le,[["__scopeId","data-v-44d1de62"]]),ue={class:"init",role:"img",title:""},pe=C({__name:"default",setup(e){return(n,d)=>(a(),r("div",ue,[i(de),B(n.$slots,"default",{},void 0,!0),i(O)]))}});const ve=m(pe,[["__scopeId","data-v-40045e66"]]);export{ve as default};