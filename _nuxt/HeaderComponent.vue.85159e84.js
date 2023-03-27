var Me=Object.defineProperty;var Oe=(l,n,s)=>n in l?Me(l,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[n]=s;var le=(l,n,s)=>(Oe(l,typeof n!="symbol"?n+"":n,s),s);import{b as _e,C as A,e as V,Q as xe,v as Ce,L as ke,i as Ne,_ as Pe,p as Ie}from"./entry.eecb2418.js";import{b as Re,u as De,a as ze}from"./_base.bf0c0234.js";import{c as Le}from"./_commonjsHelpers.28e086c5.js";const Ue={...Re,placeholder:{type:[Boolean,String,Number,Array],default:void 0}},ei=_e({name:"NuxtImg",props:Ue,emits:["load"],setup:(l,n)=>{const s=De(),m=ze(l),E=A(!1),y=V(()=>s.getSizes(l.src,{...m.options.value,sizes:l.sizes,modifiers:{...m.modifiers.value,width:xe(l.width),height:xe(l.height)}})),f=V(()=>{const h={...m.attrs.value,"data-nuxt-img":""};return l.sizes&&(h.sizes=y.value.sizes,h.srcset=y.value.srcset),h}),M=V(()=>{let h=l.placeholder;if(h===""&&(h=!0),!h||E.value)return!1;if(typeof h=="string")return h;const e=Array.isArray(h)?h:typeof h=="number"?[h,h]:[10,10];return s(l.src,{...m.modifiers.value,width:e[0],height:e[1],quality:e[2]||50},m.options.value)}),T=V(()=>l.sizes?y.value.src:s(l.src,m.modifiers.value,m.options.value)),x=V(()=>M.value?M.value:T.value);if(l.preload){const h=Object.values(y.value).every(e=>e);Ce({link:[{rel:"preload",as:"image",...h?{href:y.value.src,imagesizes:y.value.sizes,imagesrcset:y.value.srcset}:{href:x.value}}]})}const g=A();return ke(()=>{if(M.value){const h=new Image;h.src=T.value,h.onload=e=>{g.value.src=T.value,E.value=!0,n.emit("load",e)}}else g.value.onload=h=>{n.emit("load",h)}}),()=>Ne("img",{ref:g,key:x.value,src:x.value,...f.value,...n.attrs})}});const qe={command:"helloWorld",description:"Un petit Bonjour !",run:function(l){return`Bonjour, ${l.userName} ! Bienvenue dans le terminal.`}},Be={command:"help",description:"Liste les commandes disponibles.",run:function(){return`<ul>${Object.values(z.programs).map(n=>`<li>${n.command} - ${n.description}</li>`).join("")}</ul>`}},He={command:"new",description:"Ouvre un nouveau terminal.",initialData:"Data dans la nouvelle fenêtre.",run:(l,n,s)=>n&&s?(n({initialData:s}),`Nouvelle fenêtre de terminal ouverte avec les données suivantes : ${s}`):n?(n(),"Un nouveau terminal a été ouvert."):"Impossible d'ouvrir un nouveau terminal."};var K={},je={get exports(){return K},set exports(l){K=l}};(function(l,n){(function(s,m){var E="1.0.34",y="",f="?",M="function",T="undefined",x="object",g="string",h="major",e="model",a="name",i="type",t="vendor",o="version",S="architecture",R="console",d="mobile",c="tablet",_="smarttv",P="wearable",w="embedded",k=350,B="Amazon",D="Apple",ue="ASUS",ce="BlackBerry",L="Browser",W="Chrome",Te="Edge",G="Firefox",Y="Google",de="Huawei",ee="LG",ie="Microsoft",me="Motorola",X="Opera",te="Samsung",be="Sharp",Z="Sony",ae="Xiaomi",oe="Zebra",we="Facebook",pe="Chromium OS",he="Mac OS",Ee=function(b,p){var u={};for(var v in b)p[v]&&p[v].length%2===0?u[v]=p[v].concat(b[v]):u[v]=b[v];return u},Q=function(b){for(var p={},u=0;u<b.length;u++)p[b[u].toUpperCase()]=b[u];return p},ve=function(b,p){return typeof b===g?H(p).indexOf(H(b))!==-1:!1},H=function(b){return b.toLowerCase()},Se=function(b){return typeof b===g?b.replace(/[^\d\.]/g,y).split(".")[0]:m},re=function(b,p){if(typeof b===g)return b=b.replace(/^\s\s*/,y),typeof p===T?b:b.substring(0,k)},j=function(b,p){for(var u=0,v,I,C,r,$,N;u<p.length&&!$;){var se=p[u],ye=p[u+1];for(v=I=0;v<se.length&&!$&&se[v];)if($=se[v++].exec(b),$)for(C=0;C<ye.length;C++)N=$[++I],r=ye[C],typeof r===x&&r.length>0?r.length===2?typeof r[1]==M?this[r[0]]=r[1].call(this,N):this[r[0]]=r[1]:r.length===3?typeof r[1]===M&&!(r[1].exec&&r[1].test)?this[r[0]]=N?r[1].call(this,N,r[2]):m:this[r[0]]=N?N.replace(r[1],r[2]):m:r.length===4&&(this[r[0]]=N?r[3].call(this,N.replace(r[1],r[2])):m):this[r]=N||m;u+=2}},ne=function(b,p){for(var u in p)if(typeof p[u]===x&&p[u].length>0){for(var v=0;v<p[u].length;v++)if(ve(p[u][v],b))return u===f?m:u}else if(ve(p[u],b))return u===f?m:u;return b},Ae={"1.0":"/8","1.2":"/1","1.3":"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"},fe={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2","8.1":"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},ge={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[o,[a,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[o,[a,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[a,o],[/opios[\/ ]+([\w\.]+)/i],[o,[a,X+" Mini"]],[/\bopr\/([\w\.]+)/i],[o,[a,X]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,/(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,/(ba?idubrowser)[\/ ]?([\w\.]+)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,/(weibo)__([\d\.]+)/i],[a,o],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[o,[a,"UC"+L]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i],[o,[a,"WeChat(Win) Desktop"]],[/micromessenger\/([\w\.]+)/i],[o,[a,"WeChat"]],[/konqueror\/([\w\.]+)/i],[o,[a,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[o,[a,"IE"]],[/yabrowser\/([\w\.]+)/i],[o,[a,"Yandex"]],[/(avast|avg)\/([\w\.]+)/i],[[a,/(.+)/,"$1 Secure "+L],o],[/\bfocus\/([\w\.]+)/i],[o,[a,G+" Focus"]],[/\bopt\/([\w\.]+)/i],[o,[a,X+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[o,[a,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[o,[a,"Dolphin"]],[/coast\/([\w\.]+)/i],[o,[a,X+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[o,[a,"MIUI "+L]],[/fxios\/([-\w\.]+)/i],[o,[a,G]],[/\bqihu|(qi?ho?o?|360)browser/i],[[a,"360 "+L]],[/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i],[[a,/(.+)/,"$1 "+L],o],[/(comodo_dragon)\/([\w\.]+)/i],[[a,/_/g," "],o],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i],[a,o],[/(metasr)[\/ ]?([\w\.]+)/i,/(lbbrowser)/i,/\[(linkedin)app\]/i],[a],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[a,we],o],[/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(chromium|instagram)[\/ ]([-\w\.]+)/i],[a,o],[/\bgsa\/([\w\.]+) .*safari\//i],[o,[a,"GSA"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[o,[a,W+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[a,W+" WebView"],o],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[o,[a,"Android "+L]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[a,o],[/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],[o,[a,"Mobile Safari"]],[/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],[o,a],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[a,[o,ne,Ae]],[/(webkit|khtml)\/([\w\.]+)/i],[a,o],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[a,"Netscape"],o],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[o,[a,G+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i,/panasonic;(viera)/i],[a,o],[/(cobalt)\/([\w\.]+)/i],[a,[o,/master.|lts./,""]]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],[[S,"amd64"]],[/(ia32(?=;))/i],[[S,H]],[/((?:i[346]|x)86)[;\)]/i],[[S,"ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[[S,"arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[[S,"armhf"]],[/windows (ce|mobile); ppc;/i],[[S,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[[S,/ower/,y,H]],[/(sun4\w)[;\)]/i],[[S,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[[S,H]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[e,[t,te],[i,c]],[/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,/samsung[- ]([-\w]+)/i,/sec-(sgh\w+)/i],[e,[t,te],[i,d]],[/\((ip(?:hone|od)[\w ]*);/i],[e,[t,D],[i,d]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[e,[t,D],[i,c]],[/(macintosh);/i],[e,[t,D]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[e,[t,be],[i,d]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[e,[t,de],[i,c]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i],[e,[t,de],[i,d]],[/\b(poco[\w ]+)(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],[[e,/_/g," "],[t,ae],[i,d]],[/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[e,/_/g," "],[t,ae],[i,c]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[e,[t,"OPPO"],[i,d]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[e,[t,"Vivo"],[i,d]],[/\b(rmx[12]\d{3})(?: bui|;|\))/i],[e,[t,"Realme"],[i,d]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[e,[t,me],[i,d]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[e,[t,me],[i,c]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[e,[t,ee],[i,c]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[e,[t,ee],[i,d]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[e,[t,"Lenovo"],[i,c]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[e,/_/g," "],[t,"Nokia"],[i,d]],[/(pixel c)\b/i],[e,[t,Y],[i,c]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[e,[t,Y],[i,d]],[/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[e,[t,Z],[i,d]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[e,"Xperia Tablet"],[t,Z],[i,c]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[e,[t,"OnePlus"],[i,d]],[/(alexa)webm/i,/(kf[a-z]{2}wi)( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[e,[t,B],[i,c]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[e,/(.+)/g,"Fire Phone $1"],[t,B],[i,d]],[/(playbook);[-\w\),; ]+(rim)/i],[e,t,[i,c]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[e,[t,ce],[i,d]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[e,[t,ue],[i,c]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[e,[t,ue],[i,d]],[/(nexus 9)/i],[e,[t,"HTC"],[i,c]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i],[t,[e,/_/g," "],[i,d]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[e,[t,"Acer"],[i,c]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[e,[t,"Meizu"],[i,d]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[t,e,[i,d]],[/(kobo)\s(ereader|touch)/i,/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[t,e,[i,c]],[/(surface duo)/i],[e,[t,ie],[i,c]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[e,[t,"Fairphone"],[i,d]],[/(u304aa)/i],[e,[t,"AT&T"],[i,d]],[/\bsie-(\w*)/i],[e,[t,"Siemens"],[i,d]],[/\b(rct\w+) b/i],[e,[t,"RCA"],[i,c]],[/\b(venue[\d ]{2,7}) b/i],[e,[t,"Dell"],[i,c]],[/\b(q(?:mv|ta)\w+) b/i],[e,[t,"Verizon"],[i,c]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[e,[t,"Barnes & Noble"],[i,c]],[/\b(tm\d{3}\w+) b/i],[e,[t,"NuVision"],[i,c]],[/\b(k88) b/i],[e,[t,"ZTE"],[i,c]],[/\b(nx\d{3}j) b/i],[e,[t,"ZTE"],[i,d]],[/\b(gen\d{3}) b.+49h/i],[e,[t,"Swiss"],[i,d]],[/\b(zur\d{3}) b/i],[e,[t,"Swiss"],[i,c]],[/\b((zeki)?tb.*\b) b/i],[e,[t,"Zeki"],[i,c]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[t,"Dragon Touch"],e,[i,c]],[/\b(ns-?\w{0,9}) b/i],[e,[t,"Insignia"],[i,c]],[/\b((nxa|next)-?\w{0,9}) b/i],[e,[t,"NextBook"],[i,c]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[t,"Voice"],e,[i,d]],[/\b(lvtel\-)?(v1[12]) b/i],[[t,"LvTel"],e,[i,d]],[/\b(ph-1) /i],[e,[t,"Essential"],[i,d]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[e,[t,"Envizen"],[i,c]],[/\b(trio[-\w\. ]+) b/i],[e,[t,"MachSpeed"],[i,c]],[/\btu_(1491) b/i],[e,[t,"Rotor"],[i,c]],[/(shield[\w ]+) b/i],[e,[t,"Nvidia"],[i,c]],[/(sprint) (\w+)/i],[t,e,[i,d]],[/(kin\.[onetw]{3})/i],[[e,/\./g," "],[t,ie],[i,d]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[e,[t,oe],[i,c]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[e,[t,oe],[i,d]],[/smart-tv.+(samsung)/i],[t,[i,_]],[/hbbtv.+maple;(\d+)/i],[[e,/^/,"SmartTV"],[t,te],[i,_]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[t,ee],[i,_]],[/(apple) ?tv/i],[t,[e,D+" TV"],[i,_]],[/crkey/i],[[e,W+"cast"],[t,Y],[i,_]],[/droid.+aft(\w)( bui|\))/i],[e,[t,B],[i,_]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[e,[t,be],[i,_]],[/(bravia[\w ]+)( bui|\))/i],[e,[t,Z],[i,_]],[/(mitv-\w{5}) bui/i],[e,[t,ae],[i,_]],[/Hbbtv.*(technisat) (.*);/i],[t,e,[i,_]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],[[t,re],[e,re],[i,_]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[i,_]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[t,e,[i,R]],[/droid.+; (shield) bui/i],[e,[t,"Nvidia"],[i,R]],[/(playstation [345portablevi]+)/i],[e,[t,Z],[i,R]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[e,[t,ie],[i,R]],[/((pebble))app/i],[t,e,[i,P]],[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],[e,[t,D],[i,P]],[/droid.+; (glass) \d/i],[e,[t,Y],[i,P]],[/droid.+; (wt63?0{2,3})\)/i],[e,[t,oe],[i,P]],[/(quest( 2| pro)?)/i],[e,[t,we],[i,P]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[t,[i,w]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],[e,[i,d]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[e,[i,c]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[i,c]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[i,d]],[/(android[-\w\. ]{0,9});.+buil/i],[e,[t,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[o,[a,Te+"HTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[o,[a,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i],[a,o],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[o,a]],os:[[/microsoft (windows) (vista|xp)/i],[a,o],[/(windows) nt 6\.2; (arm)/i,/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,/(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i],[a,[o,ne,fe]],[/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[a,"Windows"],[o,ne,fe]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/cfnetwork\/.+darwin/i],[[o,/_/g,"."],[a,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[a,he],[o,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],[o,a],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[a,o],[/\(bb(10);/i],[o,[a,ce]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[o,[a,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[o,[a,G+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[o,[a,"webOS"]],[/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],[o,[a,"watchOS"]],[/crkey\/([\d\.]+)/i],[o,[a,W+"cast"]],[/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],[[a,pe],o],[/panasonic;(viera)/i,/(netrange)mmh/i,/(nettv)\/(\d+\.[\w\.]+)/i,/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[a,o],[/(sunos) ?([\w\.\d]*)/i],[[a,"Solaris"],o],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,/(unix) ?([\w\.]*)/i],[a,o]]},O=function(b,p){if(typeof b===x&&(p=b,b=m),!(this instanceof O))return new O(b,p).getResult();var u=typeof s!==T&&s.navigator?s.navigator:m,v=b||(u&&u.userAgent?u.userAgent:y),I=u&&u.userAgentData?u.userAgentData:m,C=p?Ee(ge,p):ge;return this.getBrowser=function(){var r={};return r[a]=m,r[o]=m,j.call(r,v,C.browser),r[h]=Se(r[o]),u&&u.brave&&typeof u.brave.isBrave==M&&(r[a]="Brave"),r},this.getCPU=function(){var r={};return r[S]=m,j.call(r,v,C.cpu),r},this.getDevice=function(){var r={};return r[t]=m,r[e]=m,r[i]=m,j.call(r,v,C.device),!r[i]&&I&&I.mobile&&(r[i]=d),r[e]=="Macintosh"&&u&&typeof u.standalone!==T&&u.maxTouchPoints&&u.maxTouchPoints>2&&(r[e]="iPad",r[i]=c),r},this.getEngine=function(){var r={};return r[a]=m,r[o]=m,j.call(r,v,C.engine),r},this.getOS=function(){var r={};return r[a]=m,r[o]=m,j.call(r,v,C.os),!r[a]&&I&&I.platform!="Unknown"&&(r[a]=I.platform.replace(/chrome os/i,pe).replace(/macos/i,he)),r},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return v},this.setUA=function(r){return v=typeof r===g&&r.length>k?re(r,k):r,this},this.setUA(v),this};O.VERSION=E,O.BROWSER=Q([a,o,h]),O.CPU=Q([S]),O.DEVICE=Q([e,t,i,R,d,_,c,P,w]),O.ENGINE=O.OS=Q([a,o]),l.exports&&(n=l.exports=O),n.UAParser=O;var U=typeof s!==T&&(s.jQuery||s.Zepto);if(U&&!U.ua){var J=new O;U.ua=J.getResult(),U.ua.get=function(){return J.getUA()},U.ua.set=function(b){J.setUA(b);var p=J.getResult();for(var u in p)U.ua[u]=p[u]}}})(typeof window=="object"?window:Le)})(je,K);const $e=K,F=new $e,Ve={command:"system-info",description:"Affiche des informations sur le système de l'utilisateur.",run(){const l=F.getBrowser(),n=F.getCPU(),s=F.getDevice(),m=F.getEngine(),E=F.getOS();return`
<ul>
  <li>Navigateur: ${l.name} ${l.version}</li>
  <li>Moteur de rendu: ${m.name} ${m.version}</li>
  <li>Système d'exploitation: ${E.name} ${E.version}</li>
  <li>Architecture CPU: ${n.architecture}</li>
  <li>Type d'appareil: ${s.type||"Inconnu"}</li>
  <li>Marque d'appareil: ${s.vendor||"Inconnu"}</li>
  <li>Modèle d'appareil: ${s.model||"Inconnu"}</li>
</ul>`}},Fe={userInfo:{firstname:"Simon",lastname:"JOUAN",poste:"Développeur Fullstack & Testeur QA",experience:"3 ans",ville:"Valognes, France",telephone:"+33 6 58 96 90 20",email:"simon@jouan.ovh"},experiences:[{date:"02/2021 - aujourd'hui",entreprise:"Linkizz",description:"Testeur QA",technology:"nodejs Typesript Testcafé"},{date:"05/2020 - 12/2021",entreprise:"CINS",description:"Développeur Full Stack",technology:"PHP/MySQL HTML/CSS JS SASS Symfony-4/5 Drupal-7/8 Prestashop-1.7.* Wordpress Bootstrap Git Docker"},{date:"07/2007 - 05/2019",entreprise:"A+ Métrologie/Trescal",description:"Métrologue",technology:"Technicien métrologue multi-grandeur. Suppléant du dossier COFRAC en Électricité - magnétisme. Suppléant du laboratoire Électricité - magnétisme"},{date:"07/2001 - 07/2006",entreprise:"OPTEOR",description:"Régleur / Instrumentiste",technology:"Maintenance industrielle sur un site pétrochimique"}],degrees:[{date:"2017 - 2018",name:"Développeur d’application - PHP / Symfony",school:"OpenClassrooms",description:"Projet Wordpress • Projet Bootstrap • Projet Mysql • Projet PHP – POO • 3 Projet Symfony"},{date:"1999 - 2001",name:"BTS CIRA",school:"Lycée A. de Tocqueville à Cherbourg",description:"Contrôle Industriel et Régulation Automatique"},{date:"1997 - 1999",name:"BAC STL PLPI",school:"Lycée A. de Tocqueville à Cherbourg",description:"Science et Technique de Laboratoire option Physique de Laboratoire et Procédé Industriel"}],hobbies:["crossfit"]};class We{constructor(){le(this,"data",Fe)}parseData(){return this.getUserInformationsTable()+this.getExperiencesTable()+this.getDegreeTable()+this.getHobbiesTable()}getUserInformationsTable(){return`<table class="table w-50">
  <thead>
    <tr>
      <th colspan="2">User Informations</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td>${this.data.userInfo.firstname} ${this.data.userInfo.lastname}</td>
    </tr>
    <tr>
      <td>poste</td>
      <td>${this.data.userInfo.poste}</td>
    </tr>
    <tr>
      <td>experience</td>
      <td>${this.data.userInfo.experience}</td>
    </tr>
    <tr>
      <td>city</td>
      <td>${this.data.userInfo.ville}</td>
    </tr>
    <tr>
      <td>email</td>
      <td>${this.data.userInfo.email}</td>
    </tr>
  </tbody>
</table>
`}getExperiencesTable(){let n=`<table class="table w-100">
  <thead>
    <tr>
      <th colspan="4">Experiences</th>
    </tr>
    <tr>
      <th>Date</th>
      <th>Entreprise</th>
      <th>Description</th>
      <th>Technology</th>
    </tr>
  </thead>
  <tbody>
`;return this.data.experiences.forEach(s=>{n+=`    <tr>
      <td>${s.date}</td>
      <td>${s.entreprise}</td>
      <td>${s.description}</td>
      <td>${s.technology}</td>
    </tr>
`}),n+=`  </tbody>
</table>
`,n}getHobbiesTable(){if(this.data.hobbies.length===0)return"";let n=`<table class="table w-100">
  <thead>
    <tr>
      <th>Hobbies</th>
    </tr>
  </thead>
  <tbody>
`;return this.data.hobbies.forEach(s=>{n+=`    <tr>
      <td>${s}</td>
    </tr>
`}),n+=`  </tbody>
</table>
`,n}getDegreeTable(){let n=`<table class="table w-100">
  <thead>
    <tr>
      <th colspan="4">Degrees</th>
    </tr>
    <tr>
      <th>Date</th>
      <th>Name</th>
      <th>School</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
`;return this.data.degrees.forEach(s=>{n+=`    <tr>
      <td>${s.date}</td>
      <td>${s.name}</td>
      <td>${s.school}</td>
      <td>${s.description}</td>
    </tr>
`}),n+=`  </tbody>
</table>
`,n}}const Ge={command:"about",description:"Voulez-vous en savoir plus sur moi ?",initialData:new We().parseData(),run:(l,n,s)=>n&&s?(n({height:"600px",width:"800px",initialData:s}),"Un nouveau terminal a été ouvert."):n?(n(),"Un nouveau terminal a été ouvert."):"Impossible d'ouvrir un nouveau terminal."};class Ye{constructor(){le(this,"programs",{})}add(n){if(this.programs[n.command]){const s=`Un programme avec la clé ${n.command} existe déjà`;throw console.error(s),new Error(s)}return this.programs[n.command]=n,this}remove(n){if(!this.programs[n]){const s=`Aucun programme trouvé avec la clé ${n}`;throw console.error(s),new Error(s)}return delete this.programs[n],this}get(n){return this.programs[n]}}const z=new Ye;z.add(Be);z.add(qe);z.add(He);z.add(Ve);z.add(Ge);let q={width:"800px",height:"400px",userName:"anon.",domainName:"example.com",initialData:""};const Xe=async()=>{try{q=(await Pe(()=>import("./terminal.config.306afd08.js"),[],import.meta.url)).terminalDefaults}catch{console.warn("Aucun fichier terminal.config.ts trouvé. Utilisation des valeurs par défaut.")}};Xe();const ii=_e({name:"TerminalComponent",props:{id:{type:Number,required:!0,default:0},createNewTerminal:{type:Function,required:!1,default:()=>{}},terminalConfig:{type:Object,default:()=>({})}},setup(l){const n=A([]),s=A(""),m=A(!1),E=A(!1),y=A({x:0,y:0}),f=A(null),M=A(null),T=A([]),x=A(-1),g=A({width:l.terminalConfig.width||q.width,height:l.terminalConfig.height||q.height,userName:l.terminalConfig.userName||q.userName,domainName:l.terminalConfig.domainName||q.domainName,initialData:l.terminalConfig.initialData||q.initialData});g.value.initialData&&n.value.push({text:g.value.initialData,isResponse:!0});const h=()=>{f.value&&(f.value.style.zIndex=(Date.now()%2147483647).toString()),M.value&&M.value.focus()},e=()=>{const w=s.value.trim();if(w){n.value.push({text:s.value,isResponse:!1});const k=a(w);k instanceof HTMLElement?n.value.push({text:k.outerHTML,isResponse:!0}):n.value.push({text:k,isResponse:!0}),T.value.push(s.value),x.value=-1,s.value=""}},a=w=>{const k=z.get(w);return k?k.run({userName:g.value.userName},l.createNewTerminal,k.initialData):`Commande inconnue : ${w}`},i=w=>{w.key==="ArrowUp"?x.value<T.value.length-1&&x.value++:w.key==="ArrowDown"&&x.value>-1&&x.value--,x.value>-1&&x.value<T.value.length?s.value=T.value[T.value.length-1-x.value]:s.value=""},t=w=>{w.target instanceof HTMLElement&&w.target.classList.contains("resize-handle")&&(m.value=!0)},o=w=>{m.value&&f.value&&(f.value.style.width=`${w.clientX-f.value.offsetLeft}px`,f.value.style.height=`${w.clientY-f.value.offsetTop}px`)},S=()=>{m.value=!1,E.value=!1},R=w=>{w.target instanceof HTMLElement&&w.currentTarget instanceof HTMLElement&&w.currentTarget.parentElement&&w.target.classList.contains("terminal-header")&&(E.value=!0,y.value={x:w.clientX-w.currentTarget.parentElement.offsetLeft,y:w.clientY-w.currentTarget.parentElement.offsetTop},window.addEventListener("mousemove",d),window.addEventListener("mouseup",c))},d=w=>{if(E.value&&f.value){const k=f.value,B=Math.min(Math.max(0,w.clientX-y.value.x),window.innerWidth-k.offsetWidth),D=Math.min(Math.max(0,w.clientY-y.value.y),window.innerHeight-k.offsetHeight);k.style.left=`${B}px`,k.style.top=`${D}px`}},c=w=>{E.value&&(E.value=!1,window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",c))},_=()=>{f.value&&(f.value.style.width=g.value.width,f.value.style.height=g.value.height)},P=()=>{f.value&&(f.value.style.display="none")};return ke(()=>{_(),h()}),Ie(()=>[g.value.width,g.value.height],()=>{_()}),{defaultConfig:g,commandLines:n,userInput:s,terminalElement:f,userInputRef:M,submitInput:e,handleHistoryNavigation:i,handleMouseDown:t,handleResizeMouseMove:o,handleMouseUp:S,handleHeaderMouseDown:R,closeTerminal:P,focusUserInput:h}}});export{ii as _,ei as a};
