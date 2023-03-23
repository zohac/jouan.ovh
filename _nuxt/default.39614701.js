import{_ as b}from"./nuxt-link.bb606373.js";import{k as m,C as g,o as a,l as r,V as t,a2 as l,$ as u,u as M,a0 as T,a1 as k,b as C,X as h,W as w,a3 as I,a4 as H,a5 as v,S as p,w as $,Y as D,r as S}from"./entry.b7d148fc.js";import{_ as U}from"./HeaderComponent.vue.47c6713b.js";import"./_commonjsHelpers.28e086c5.js";const y=e=>(T("data-v-23c7bfdc"),e=e(),k(),e),B={class:"copyright"},L=y(()=>t("span",{class:"text-color-red-light"},"♥",-1)),V=y(()=>t("a",{href:"https://nuxtjs.org/fr"},"Nuxtjs",-1)),z={__name:"FooterComponent",setup(e){const n=g(new Date().getFullYear());return(i,s)=>(a(),r("footer",null,[t("div",B,[l(" Made with "),L,l(" and "),V,l(". Copyright © "+u(M(n))+" Simon JOUAN ",1)])]))}},F=m(z,[["__scopeId","data-v-23c7bfdc"]]),R=C({name:"TerminalButton",emits:["open-terminal"]});function j(e,n,i,s,_,d){return a(),r("button",{onClick:n[0]||(n[0]=o=>e.$emit("open-terminal"))},"Terminal")}const A=m(R,[["render",j],["__scopeId","data-v-c9a3c006"]]),E=["data-id"],K={class:"header-text"},O=t("div",null,null,-1),Y={class:"terminal-body"},q=["innerHTML"],J={class:"git-prompt"},W=t("span",{class:"git-prompt-separator"},":",-1),X=t("span",{class:"git-prompt-directory"},"~",-1),G=t("span",{class:"git-prompt-separator"},"$",-1),P={class:"git-prompt"},Q=t("span",{class:"git-prompt-separator"},":",-1),Z=t("span",{class:"git-prompt-directory"},"~",-1),x=t("span",{class:"git-prompt-separator"},"$",-1);function ee(e,n,i,s,_,d){return a(),r("div",{ref:"terminalElement","data-id":e.id,class:"terminal",onClick:n[10]||(n[10]=(...o)=>e.focusUserInput&&e.focusUserInput(...o))},[t("div",{class:"terminal-header",onMousedown:n[1]||(n[1]=(...o)=>e.handleHeaderMouseDown&&e.handleHeaderMouseDown(...o)),onMouseup:n[2]||(n[2]=(...o)=>e.handleMouseUp&&e.handleMouseUp(...o))},[t("div",{class:"close-button",onClick:n[0]||(n[0]=(...o)=>e.closeTerminal&&e.closeTerminal(...o))}),t("div",K,u(e.defaultConfig.domainName),1),O],32),t("div",Y,[(a(!0),r(h,null,w(e.commandLines,(o,f)=>(a(),r("div",{key:f},[o.isResponse?(a(),r("span",{key:0,innerHTML:o.text},null,8,q)):(a(),r(h,{key:1},[t("span",J,[l(u(e.defaultConfig.userName)+"@"+u(e.defaultConfig.domainName)+" ",1),W,X,G]),l(u(o.text),1)],64))]))),128)),t("span",P,[l(u(e.defaultConfig.userName)+"@"+u(e.defaultConfig.domainName)+" ",1),Q,Z,x]),I(t("input",{ref:"userInputRef","onUpdate:modelValue":n[3]||(n[3]=o=>e.userInput=o),type:"text",class:"user-input",onKeydown:[n[4]||(n[4]=v((...o)=>e.submitInput&&e.submitInput(...o),["enter"])),n[5]||(n[5]=v((...o)=>e.handleHistoryNavigation&&e.handleHistoryNavigation(...o),["arrow-up"])),n[6]||(n[6]=v((...o)=>e.handleHistoryNavigation&&e.handleHistoryNavigation(...o),["arrow-down"]))]},null,544),[[H,e.userInput]])]),t("div",{class:"resize-handle",onMousedown:n[7]||(n[7]=(...o)=>e.handleMouseDown&&e.handleMouseDown(...o)),onMousemove:n[8]||(n[8]=(...o)=>e.handleResizeMouseMove&&e.handleResizeMouseMove(...o)),onMouseup:n[9]||(n[9]=(...o)=>e.handleMouseUp&&e.handleMouseUp(...o))},null,32)],8,E)}const ne=m(U,[["render",ee]]);function oe(){return"_"+Math.random().toString(36).slice(2,11)}const te={name:"TerminalManagerComponent",components:{},setup(){const e=g([]);return{terminals:e,createNewTerminal:(i={})=>{const s={id:oe(),terminalConfig:i};e.value.push(s)}}}};function se(e,n,i,s,_,d){const o=ne;return a(),r("div",null,[(a(!0),r(h,null,w(s.terminals,(f,c)=>(a(),r("div",{key:c},[p(o,{id:c,"create-new-terminal":s.createNewTerminal,"terminal-config":f.terminalConfig},null,8,["id","create-new-terminal","terminal-config"])]))),128))])}const ae=m(te,[["render",se]]),re=C({__name:"HeaderComponent",setup(e){const n=g(null),i=()=>{n.value&&n.value.createNewTerminal()},s=g(!0),_=()=>{s.value=!s.value},d=()=>{s.value=!0};return(o,f)=>{const c=b,N=A;return a(),r("header",null,[t("button",{class:"btn btn-small btn-dark",role:"button",onClick:_},"<sj />"),t("nav",{id:"menu",class:D({hidden:M(s)})},[t("div",{id:"close-menu",onClick:d}),t("ul",null,[t("li",null,[p(c,{to:"/",onClick:d},{default:$(()=>[l("Accueil")]),_:1})]),t("li",null,[p(c,{to:"/blog",onClick:d},{default:$(()=>[l("Blog")]),_:1})]),t("li",null,[p(N,{onClick:d,onOpenTerminal:i})])])],2),p(ae,{ref_key:"terminalManager",ref:n},null,512)])}}}),ie=m(re,[["__scopeId","data-v-83d0cb28"]]);const le={},de={class:"init",role:"img",title:""};function ue(e,n){const i=ie,s=F;return a(),r("div",de,[p(i),S(e.$slots,"default",{},void 0,!0),p(s)])}const fe=m(le,[["render",ue],["__scopeId","data-v-b19b4e4c"]]);export{fe as default};
