import s from"./ContentSlot.04961a0b.js";import{b as o,h as u,e as f,j as m}from"./entry.b7d148fc.js";import"./utils.f4713845.js";const l=o({name:"Markdown",extends:s,setup(t){const{parent:e}=m(),{between:n,default:a}=u(),r=f(()=>typeof t.unwrap=="string"?t.unwrap.split(" "):["*"]);return{fallbackSlot:a,tags:r,between:n,parent:e}}});export{l as default};