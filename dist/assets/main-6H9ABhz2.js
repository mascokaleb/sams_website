import{f as Pt}from"./sanityClient-D1oloeXP.js";function K(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function gt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function yt(t){return gt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function bt(t){return t._type==="@list"}function vt(t){return t._type==="@span"}function $t(t){return t._type==="@text"}const rt=["strong","em","code","underline","strike-through"];function _t(t,e,i){if(!K(t)||!t.marks)return[];if(!t.marks.length)return[];const n=t.marks.slice(),r={};return n.forEach(o=>{r[o]=1;for(let a=e+1;a<i.length;a++){const l=i[a];if(l&&K(l)&&Array.isArray(l.marks)&&l.marks.indexOf(o)!==-1)r[o]++;else break}}),n.sort((o,a)=>Nt(r,o,a))}function Nt(t,e,i){const n=t[e],r=t[i];if(n!==r)return r-n;const o=rt.indexOf(e),a=rt.indexOf(i);return o!==a?o-a:e.localeCompare(i)}function Bt(t){var a;const{children:e}=t,i=t.markDefs??[];if(!e||!e.length)return[];const n=e.map(_t),r={_type:"@span",children:[],markType:"<unknown>"};let o=[r];for(let l=0;l<e.length;l++){const p=e[l];if(!p)continue;const c=n[l]||[];let d=1;if(o.length>1)for(d;d<o.length;d++){const m=((a=o[d])==null?void 0:a.markKey)||"",y=c.indexOf(m);if(y===-1)break;c.splice(y,1)}o=o.slice(0,d);let g=o[o.length-1];if(g){for(const m of c){const y=i==null?void 0:i.find(_=>_._key===m),$=y?y._type:m,L={_type:"@span",_key:p._key,children:[],markDef:y,markType:$,markKey:m};g.children.push(L),o.push(L),g=L}if(K(p)){const m=p.text.split(`
`);for(let y=m.length;y-- >1;)m.splice(y,0,`
`);g.children=g.children.concat(m.map(y=>({_type:"@text",text:y})))}else g.children=g.children.concat(p)}}return r.children}function Ot(t,e){const i=[];let n;for(let r=0;r<t.length;r++){const o=t[r];if(o){if(!yt(o)){i.push(o),n=void 0;continue}if(!n){n=F(o,r,e),i.push(n);continue}if(Yt(o,n)){n.children.push(o);continue}if((o.level||1)>n.level){const a=F(o,r,e);{const l=n.children[n.children.length-1],p={...l,children:[...l.children,a]};n.children[n.children.length-1]=p}n=a;continue}if((o.level||1)<n.level){const a=i[i.length-1],l=a&&et(a,o);if(l){n=l,n.children.push(o);continue}n=F(o,r,e),i.push(n);continue}if(o.listItem!==n.listItem){const a=i[i.length-1],l=a&&et(a,{level:o.level||1});if(l&&l.listItem===o.listItem){n=l,n.children.push(o);continue}else{n=F(o,r,e),i.push(n);continue}}console.warn("Unknown state encountered for block",o),i.push(o)}}return i}function Yt(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function F(t,e,i){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:i,level:t.level||1,listItem:t.listItem,children:[t]}}function et(t,e){const i=e.level||1,n=e.listItem||"normal",r=typeof e.listItem=="string";if(bt(t)&&(t.level||1)===i&&r&&(t.listItem||"normal")===n)return t;if(!("children"in t))return;const o=t.children[t.children.length-1];return o&&!K(o)?et(o,e):void 0}function kt(t){let e="";return t.children.forEach(i=>{$t(i)?e+=i.text:vt(i)&&(e+=kt(i))}),e}const qt=["http","https","mailto","tel"],Rt={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function wt(t){return Xt(t.replace(/[&<>"']/g,e=>`&${Rt[e]};`))}function Xt(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Ut(t){const e=(t||"").trim(),i=e.charAt(0);if(i==="#"||i==="/")return!0;const n=e.indexOf(":");if(n===-1)return!0;const r=e.slice(0,n).toLowerCase();if(qt.indexOf(r)!==-1)return!0;const o=e.indexOf("?");if(o!==-1&&n>o)return!0;const a=e.indexOf("#");return a!==-1&&n>a}const Wt={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},jt=({children:t})=>`<li>${t}</li>`,Vt=({children:t,value:e})=>{const i=(e==null?void 0:e.href)||"";return Ut(i)?`<a href="${wt(i)}">${t}</a>`:t},Gt={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Vt},X=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,xt=t=>X(`block type "${t}"`,"types"),Ft=t=>X(`mark type "${t}"`,"marks"),zt=t=>X(`block style "${t}"`,"block"),Kt=t=>X(`list style "${t}"`,"list"),Zt=t=>X(`list item style "${t}"`,"listItem");function Qt(t){console.warn(t)}const Jt=({value:t,isInline:e})=>{const i=xt(t._type);return e?`<span style="display:none">${i}</span>`:`<div style="display:none">${i}</div>`},te=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,ee=({children:t})=>`<p>${t}</p>`,ne=({children:t})=>`<ul>${t}</ul>`,ie=({children:t})=>`<li>${t}</li>`,re=()=>"<br/>",oe={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},ot={types:{},block:oe,marks:Gt,list:Wt,listItem:jt,hardBreak:re,escapeHTML:wt,unknownType:Jt,unknownMark:te,unknownList:ne,unknownListItem:ie,unknownBlockStyle:ee};function se(t,e){const{block:i,list:n,listItem:r,marks:o,types:a,...l}=e;return{...t,block:q(t,e,"block"),list:q(t,e,"list"),listItem:q(t,e,"listItem"),marks:q(t,e,"marks"),types:q(t,e,"types"),...l}}function q(t,e,i){const n=e[i],r=t[i];return typeof n=="function"||n&&typeof r=="function"?n:n?{...r,...n}:r}function ae(t,e={}){const{components:i,onMissingComponent:n=Qt}=e,r=n||ce,o=Array.isArray(t)?t:[t],a=Ot(o,"html"),l=i?se(ot,i):ot,p=le(l,r);return a.map((c,d)=>p({node:c,index:d,isInline:!1,renderNode:p})).join("")}const le=(t,e)=>{function i(c){const{node:d,index:g,isInline:m}=c;return bt(d)?r(d,g):yt(d)?n(d,g):vt(d)?o(d):gt(d)?a(d,g,m):$t(d)?l(d):p(d,g,m)}function n(c,d){const g=st({node:c,index:d,isInline:!1,renderNode:i}),m=t.listItem,y=(typeof m=="function"?m:m[c.listItem])||t.unknownListItem;if(y===t.unknownListItem){const L=c.listItem||"bullet";e(Zt(L),{type:L,nodeType:"listItemStyle"})}let $=g.children;if(c.style&&c.style!=="normal"){const{listItem:L,..._}=c;$=i({node:_,index:d,isInline:!1})}return y({value:c,index:d,isInline:!1,renderNode:i,children:$})}function r(c,d){const g=c.children.map(($,L)=>i({node:$._key?$:{...$,_key:`li-${d}-${L}`},index:L,isInline:!1})),m=t.list,y=(typeof m=="function"?m:m[c.listItem])||t.unknownList;if(y===t.unknownList){const $=c.listItem||"bullet";e(Kt($),{nodeType:"listStyle",type:$})}return y({value:c,index:d,isInline:!1,renderNode:i,children:g.join("")})}function o(c){const{markDef:d,markType:g,markKey:m}=c,y=t.marks[g]||t.unknownMark,$=c.children.map((L,_)=>i({node:L,index:_,isInline:!0}));return y===t.unknownMark&&e(Ft(g),{nodeType:"mark",type:g}),y({text:kt(c),value:d,markType:g,markKey:m,renderNode:i,children:$.join("")})}function a(c,d,g){const{_key:m,...y}=st({node:c,index:d,isInline:g,renderNode:i}),$=y.node.style||"normal",L=(typeof t.block=="function"?t.block:t.block[$])||t.unknownBlockStyle;return L===t.unknownBlockStyle&&e(zt($),{nodeType:"blockStyle",type:$}),L({...y,value:y.node,renderNode:i})}function l(c){if(c.text===`
`){const d=t.hardBreak;return d?d():`
`}return t.escapeHTML(c.text)}function p(c,d,g){const m=t.types[c._type];return m||e(xt(c._type),{nodeType:"block",type:c._type}),(m||t.unknownType)({value:c,isInline:g,index:d,renderNode:i})}return i};function st(t){const{node:e,index:i,isInline:n,renderNode:r}=t,o=Bt(e).map((a,l)=>r({node:a,isInline:!0,index:l,renderNode:r}));return{_key:e._key||`block-${i}`,children:o.join(""),index:i,isInline:n,node:e}}function ce(){}const Lt="images/samuel-placeholder.svg",z=/^[a-zA-Z0-9_-]{11}$/,w={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},Z={meta:null,items:[]},R={meta:null,items:[],totalCount:0};document.addEventListener("DOMContentLoaded",async()=>{ue(),Ye();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await de(),window.location.hash&&setTimeout(()=>St(window.location.hash),100),Ve(t),t||Ge()});function ue(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const i=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",i),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function de(){tt(!0);const t=await Pt();if(!t)return Oe("Unable to load the latest content. Please try again shortly."),tt(!1),null;fe(t.site),he(t.hero,t.site),me(t.about),pe(t.resume),ge(t.academics);const e=dt(t.highlightEvents||[]);Z.meta=t.highlightsSection,Z.items=e.filter(ht),ye();const i=dt(t.videos||[],"eventDate");return R.meta=t.videosSection,R.items=i.filter(ht),R.totalCount=i.length,be(),ve(t.dualSport),$e(t.contact),tt(!1),Tt(),t}function fe(t){var n;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const i=document.querySelector(".brand-mark");if(i)if((n=t.brandMarkImage)!=null&&n.url)i.innerHTML=`<span class="brand-mark-image"><img src="${Y(t.brandMarkImage.url)}" alt="${s(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,i.classList.add("has-image");else{const r=t.brandMarkInitials||Xe(t.siteTitle)||i.textContent||"SM";i.textContent=r,i.classList.remove("has-image")}}function he(t,e){var o,a;const i=x(w.heroCopy),n=x(w.heroPhoto),r=x(w.heroMetrics);if(!t){i&&(i.innerHTML=T("Hero content coming soon."));return}if(i){const l=t.tagline?`<p class="hero-tag">${s(t.tagline)}</p>`:"",p=t.subheadline?`<span>${s(t.subheadline)}</span>`:"",c=t.bio?`<p>${s(t.bio)}</p>`:"",d=[ct(t.primaryCta,"primary","View Highlights","#highlights"),ct(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");i.innerHTML=`
      ${l}
      <h1>
        ${s(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${p}
      </h1>
      ${c}
      <div class="hero-actions">
        ${d||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(n){const l=((o=t.headshot)==null?void 0:o.url)||Lt,p=((a=t.headshot)==null?void 0:a.alt)||"Portrait of Samuel Masco",c=t.photoCaption||"Focused on the next shot.";n.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${l}" alt="${s(p)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${s(c)}</figcaption>
    `}r&&(Array.isArray(t.metrics)&&t.metrics.length?r.innerHTML=t.metrics.map(l=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${s(l.label||"")}</span>
              <span class="metric-value">${s(l.value||"")}</span>
            </div>
          `).join(""):r.innerHTML=T("Metrics coming soon."))}function me(t){const e=x(w.aboutHeading),i=x(w.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${s(t.heading||"About")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("About section coming soon.")),i){if(!t){i.innerHTML=T("About details coming soon.");return}i.innerHTML=`
      <article class="about-card" data-motion="delay-1">
        <h3>${s(t.profileCardTitle||"Profile")}</h3>
        <ul>
          ${(t.profileFacts||[]).map(n=>`
                <li><strong>${s(n.label||"")}: </strong>${s(n.value||"")}</li>
              `).join("")}
        </ul>
      </article>
      <article class="about-card about-story" data-motion="delay-2">
        <h3>${s(t.mindsetTitle||"Mindset & Goals")}</h3>
        ${nt(t.mindsetBody)}
      </article>
      <article class="about-card about-highlight" data-motion="delay-3">
        <h3>${s(t.quickHitsTitle||"Quick Hits")}</h3>
        ${(t.quickHits||[]).map(n=>`
              <div class="highlight-row">
                <span>${s(n.label||"")}</span>
                <span>${s(n.value||"")}</span>
              </div>
            `).join("")}
      </article>
    `}}function pe(t){const e=x(w.resumeHeading),i=x(w.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${s(t.heading||"Golf Resume")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Golf resume coming soon.")),i){if(!t){i.innerHTML=T("Resume details coming soon.");return}i.innerHTML=`
      <article class="panel" data-motion="delay-1">
        <h3>${s(t.performanceTitle||"Performance Snapshot")}</h3>
        <dl>
          ${(t.performanceStats||[]).map(n=>`
                <div>
                  <dt>${s(n.label||"")}</dt>
                  <dd>${s(n.value||"")}</dd>
                </div>
              `).join("")}
        </dl>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${s(t.trainingTitle||"Training Routine")}</h3>
        ${nt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${s(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(n=>`<li>${s(n||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function ge(t){const e=x(w.academicsHeading),i=x(w.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${s(t.heading||"Academics")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Academics section coming soon.")),i){if(!t){i.innerHTML=T("Academic details coming soon.");return}const n=t.transcriptLabel||"Transcript",r=t.transcriptUrl?`<a class="btn subtle" href="${Y(t.transcriptUrl)}" target="_blank" rel="noopener">${s(n)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${s(n)}</span>`;i.innerHTML=`
      <article class="academics-card" data-motion="delay-1">
        <h3>${s(t.schoolCardTitle||"School")}</h3>
        <ul>
          ${t.gpa?`<li><strong>GPA:</strong> ${s(t.gpa)}</li>`:""}
          ${t.honors?`<li><strong>Honors:</strong> ${s(t.honors)}</li>`:""}
          ${t.apCourses?`<li><strong>AP / IB:</strong> ${s(t.apCourses)}</li>`:""}
        </ul>
        ${r}
      </article>
      <article class="academics-card" data-motion="delay-2">
        <h3>${s(t.interestsTitle||"Academic Interests")}</h3>
        ${nt(t.interestsBody)}
      </article>
    `}}function ye(){const t=Z.meta,e=Z.items||[],i=x(w.highlightsHeading),n=x(w.highlightsTimeline),r=x(w.highlightsActions);if(i&&(i.innerHTML=t?`
          <h2>${s(t.heading||"Highlights")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Highlights coming soon.")),!n)return;const o=(t==null?void 0:t.maxItems)||5,a=e.slice(0,o);if(!a.length){n.innerHTML=T("Highlight events coming soon."),r&&(r.innerHTML="");return}n.innerHTML=a.map((l,p)=>we(l,p)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function be(){const t=R.meta,e=R.items||[],i=x(w.videosHeading),n=x(w.videoGrid),r=x(w.videosActions);if(i&&(i.innerHTML=t?`
          <h2>${s(t.heading||"Videos")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Videos coming soon.")),!n)return;const o=(t==null?void 0:t.maxItems)||3,a=e.slice(0,o);if(!a.length){n.innerHTML=T("Video highlights coming soon."),r&&(r.innerHTML="");return}n.innerHTML=a.map((l,p)=>_e(l,p)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),Tt(),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function ve(t){const e=x(w.dualHeading),i=x(w.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${s(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Dual-sport content coming soon.")),i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=T("Dual-sport cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>`
          <article class="dual-card" data-motion="delay-${r+1}">
            <h3>${s(n.title||"")}</h3>
            ${n.body?`<p>${s(n.body)}</p>`:""}
            ${Array.isArray(n.bulletPoints)&&n.bulletPoints.length?`<ul>${n.bulletPoints.map(o=>`<li>${s(o||"")}</li>`).join("")}</ul>`:""}
          </article>
        `).join("")}}function $e(t){const e=x(w.contactHeading),i=x(w.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${s(t.heading||"Let's Connect")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Contact section coming soon.")),!!i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=T("Contact cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${s(n.title||"")}</h3>
          <ul>
            ${(n.entries||[]).map(o=>`<li>${ke(o)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function ke(t){var r;if(!t)return"";const e=t.label?`<strong>${s(t.label)}:</strong> `:"",i=Ue(t.value),n=(r=t.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&i.length<=1?`${e}<a href="${Y(t.link)}"${n}>${s(t.value||t.link)}</a>`:i.length?`${e}${i.map((o,a)=>{const l=a===0&&t.link?t.link:o.link;if(l){const c=l.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${Y(l)}"${c}>${s(o.text)}</a>`}return s(o.text)}).join(" · ")}`:`${e}${s(t.value||"")}`}function we(t,e){const i=je(t),n=t.summary?`<p>${s(t.summary)}</p>`:"",r=Array.isArray(t.days)?t.days:[],o=xe(r,{variant:"compact"});return`
    <article class="timeline-card" data-motion="delay-${e+1}">
      <header>
        <h3>${s(t.title||"")}</h3>
        ${i?`<span class="timeline-date">${i}</span>`:""}
      </header>
      ${o}
      ${n}
    </article>
  `}function xe(t=[],{variant:e="default",showLabels:i}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,r=typeof i=="boolean"?i:n>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",n===1?"day-stats--single":"",`day-stats--cols-${Math.min(n,3)}`].filter(Boolean).join(" ")}">
      ${t.map((a,l)=>Te(a,l,{showLabels:r,total:n})).join("")}
    </div>
  `}const at=120,Le=57;function Te(t,e,{showLabels:i,total:n}){if(!t)return"";const r=n===1,o=!r&&i?He(t,e,n):null,a=Se(t);return a?`
    <div class="day-stat${r?" day-stat--single":""}">
      ${o?`<span class="day-stat-label">${s(o)}</span>`:""}
      ${a}
    </div>
  `:""}function Se(t){const e=Ae(t);return e.length?`
    <div class="day-metrics">
      ${Me(e)}
    </div>
  `:""}function Me(t){return`
    <div class="day-metric-list">
      ${t.map(e=>{const i=e.secondary?`<span class="day-metric-secondary">${s(e.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${e.key}">
              <span class="day-metric-value">${s(e.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${s(e.label)}
                  ${i}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function Ae(t){if(!t)return[];const e=[],i=Q(t.score),n=Q(t.yardage);e.push(J({key:"score",label:"Score",display:typeof i=="number"?String(i):"—",progress:Ee(i)})),e.push(J({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:Ce(n,Ie(t,n))}));const r=Pe(t);return e.push(J({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),e.filter(Boolean)}function J({key:t,label:e,display:i,secondary:n,progress:r}){const o=i!=null&&i!==""?String(i):"—",a=n?String(n):"",l=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:t,label:e,display:o,secondary:a,progress:Math.max(0,l)}}function He(t,e,i){return t.label?t.label:i>1?`Day ${e+1}`:null}function Q(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function Ie(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function Ee(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=at-Le;return(at-t)/e}function Ce(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function De(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const i=(e-t)/(e-1);return Math.max(0,Math.min(i,1))}function Pe(t){const e=Q(t==null?void 0:t.rankingPosition),i=Q(t==null?void 0:t.rankingOutOf),n=De(e,i);return typeof e=="number"?{display:String(e),secondary:typeof i=="number"?`of ${i}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function _e(t,e){const i=Re(t),n=t.thumbnailUrl||(i?`https://img.youtube.com/vi/${i}/hqdefault.jpg`:Lt),r=t.thumbnailAlt||t.title||"Video highlight",o=t.ctaLabel||"Play",a=t.title||"Video highlight",p=!!i?"":' disabled aria-disabled="true"';return`
    <article class="video-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${s(i)}" data-video-title="${s(a)}">
        <img src="${Y(n)}" alt="${s(r)}" loading="lazy" />
        <button class="play-button" type="button"${p} aria-label="Play ${s(a)}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${s(o)}</span>
        </button>
      </div>
      <h3>${s(t.title||"")}</h3>
      <p>${s(t.description||"")}</p>
    </article>
  `}function Tt(){document.querySelectorAll(".video-frame").forEach(t=>{if(t.dataset.playerReady==="true")return;const e=t.querySelector(".play-button"),i=t.dataset.videoId,n=t.dataset.videoTitle||"Samuel Masco golf video highlight";!e||!i||(e.addEventListener("click",()=>{Be(i,n)}),t.dataset.playerReady="true")})}let B=null;function Ne(){if(B)return B;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&lt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&lt()}),document.body.appendChild(t),B=t,t}function Be(t,e){const i=Ne(),n=i.querySelector(".video-overlay-frame");if(!n)return;n.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",e),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",n.appendChild(r),i.classList.add("is-open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function lt(){if(!B)return;const t=B.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),B.classList.remove("is-open"),B.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}function nt(t){return!Array.isArray(t)||!t.length?"":ae(t)}function x(t){return t?document.querySelector(t):null}function T(t){return`<p class="placeholder-text">${s(t)}</p>`}function tt(t){document.body.dataset.contentLoading=String(t)}function Oe(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${s(t)}</div>`)}function ct(t,e,i,n){const r=(t==null?void 0:t.label)||i,o=(t==null?void 0:t.href)||n;if(!r||!o)return"";const l=o.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${Y(o)}"${l}>${s(r)}</a>`}function Ye(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const i=e.getAttribute("href")||"";St(i)&&t.preventDefault()})}function St(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function qe(t,e,{month:i="short"}={}){if(!t)return"";const n=new Date(t);if(Number.isNaN(n.getTime()))return s(t);if(!e)return n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});const r=new Date(e);if(Number.isNaN(r.getTime()))return`${n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"})} – ${s(e)}`;const o=n.getFullYear()===r.getFullYear(),a=o&&n.getMonth()===r.getMonth();if(o&&a)return`${n.toLocaleDateString("en-US",{month:i})} ${n.getDate()}–${r.getDate()}, ${n.getFullYear()}`;if(o){const c=n.toLocaleDateString("en-US",{month:i,day:"numeric"}),d=r.toLocaleDateString("en-US",{month:i,day:"numeric"});return`${c} – ${d}, ${n.getFullYear()}`}const l=n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"}),p=r.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});return`${l} – ${p}`}function Re(t){return t?ut(t.youtubeId)||ut(t.youtubeUrl):""}function ut(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(z.test(e))return e;let i;try{i=new URL(e)}catch{try{i=new URL(`https://${e}`)}catch{return""}}const n=i.hostname.replace(/^www\./,"").toLowerCase();if(n==="youtu.be"){const r=i.pathname.split("/").filter(Boolean)[0];return r&&z.test(r)?r:""}if(n==="youtube.com"||n.endsWith(".youtube.com")){const r=i.searchParams.get("v");if(r&&z.test(r))return r;const o=i.pathname.split("/").filter(Boolean);if(o.length>=2&&(o[0]==="embed"||o[0]==="shorts")){const a=o[1];return a&&z.test(a)?a:""}}return""}function s(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Y(t){return s(t)}function Xe(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(i=>i.charAt(0).toUpperCase()).join(""):""}function Ue(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:We(r)})):[]}function We(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function je(t){return t?qe(t.eventDate,t.endDate,{month:"short"}):""}function dt(t,e="eventDate"){return Array.isArray(t)?[...t].sort((i,n)=>ft(n,e)-ft(i,e)):[]}function ft(t,e){if(!t)return 0;const i=t[e];if(i){const n=Date.parse(i);if(!Number.isNaN(n))return n}if(t._createdAt){const n=Date.parse(t._createdAt);if(!Number.isNaN(n))return n}return 0}function ht(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:!0:!1}function Ve(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(i=>i.classList.add("is-visible"));return}const e=new IntersectionObserver(i=>{i.forEach(n=>{n.isIntersecting&&(n.target.classList.add("is-visible"),e.unobserve(n.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(i=>e.observe(i))}function Ge(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const i=18,n={x:Math.min(window.innerWidth-i-24,window.innerWidth*.78),y:Math.min(window.innerHeight-i-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let r=performance.now(),o=!1,a=!0;const l=document.querySelector(".site-header"),p=document.querySelector(".hero"),c={x:0,y:0,active:!1},g=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(u=>Array.from(document.querySelectorAll(u))).filter(u=>u!==null&&u.isConnected),m=document.querySelector(".hero-scroll"),y=m?m.querySelector("span"):null,$={x:.5,y:-32},L={x:0,y:10},_=-80;function U(){e.style.transform=`translate3d(${n.x-i}px, ${n.y-i}px, 0)`,e.classList.toggle("is-moving",o),e.style.setProperty("--texture-offset-x",`${n.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${n.textureOffsetY}px`)}function Mt(){var H;const u=document.querySelector(".hero-copy h1");if(!u)return null;const f="masco",b=(u.textContent||"").toLowerCase().lastIndexOf(f);if(b===-1)return null;const k=b+f.length-1,M=document.createTreeWalker(u,NodeFilter.SHOW_TEXT);let S=0,A=M.nextNode();for(;A;){const N=A.textContent||"",E=N.length;if(k<S+E){const C=k-S;if(C<0||C>=E)return null;const O=N.charAt(C);if(!O||!O.trim())return null;const I=document.createRange();I.setStart(A,C),I.setEnd(A,Math.min(C+1,E));const D=I.getBoundingClientRect();return(H=I.detach)==null||H.call(I),!D||!D.width&&!D.height?null:{left:D.left+window.scrollX,right:D.right+window.scrollX,top:D.top+window.scrollY,bottom:D.bottom+window.scrollY,width:D.width,height:D.height}}S+=E,A=M.nextNode()}return null}function W(u){const f=u.top+i+_,h=i+4;return Math.max(f,h)}function At(){if(!p)return!0;const u=window.getComputedStyle(p),f=parseFloat(u.getPropertyValue("column-gap")||u.getPropertyValue("gap"))||0,h=p.clientWidth;if(!h)return!1;const b=280*3+f*2;return h>=b-.5}function Ht(){const u=Mt();if(!u)return!1;const f=G(),h=u.left+u.width/3+$.x,v=u.top+u.height/30+$.y,b=f.left+i+12,k=f.right-i-12,M=W(f),S=f.bottom-i-12;return n.x=P(h,b,k),n.y=P(v,M,S),n.vx=0,n.vy=0,U(),!0}function It(){if(!m)return!1;const u=pt(y||m),f=G(),h=u.left+u.width/2+L.x,v=u.bottom+i+L.y,b=f.left+i+12,k=f.right-i-12,M=W(f),S=f.bottom-i-12;return n.x=P(h,b,k),n.y=P(v,M,S),n.vx=0,n.vy=0,U(),!0}function j(){Ht()||It()||U()}function V(u={}){const{force:f=!1}=u,h=At();if(!f&&h===a)return;const v=a;a=h,e.style.display=h?"":"none",h&&(!v||f)&&j()}j(),V({force:!0}),window.addEventListener("load",()=>{j(),V({force:!0})},{once:!0}),requestAnimationFrame(()=>{j(),V({force:!0})});function Et(u,f){if(!c.active)return;const h=n.x-c.x,v=n.y-c.y,b=Math.hypot(h,v),k=i+10;if(b>k)return;const M=.42;n.vx+=u*M,n.vy+=f*M;const S=34,A=Math.hypot(n.vx,n.vy);if(A>S){const H=S/A;n.vx*=H,n.vy*=H}if(b<i){const H=i-b,N=h/(b||1),E=v/(b||1);n.x+=N*(H+.5),n.y+=E*(H+.5)}}function Ct(){const f=G(),h=f.left+i+8,v=f.right-i-8,b=W(f),k=f.bottom-i-8;n.x<h?(n.x=h,n.vx=Math.abs(n.vx)*.78):n.x>v&&(n.x=v,n.vx=-Math.abs(n.vx)*.78),n.y<b?(n.y=b,n.vy=Math.abs(n.vy)*.78):n.y>k&&(n.y=k,n.vy=-Math.abs(n.vy)*.78)}function Dt(){for(const f of g){if(!f.isConnected)continue;const h=f.getBoundingClientRect(),v=window.scrollX,b=window.scrollY,k={left:h.left+v,right:h.right+v,top:h.top+b,bottom:h.bottom+b};if(h.width===0||h.height===0||h.right<-40||h.left>window.innerWidth+40||h.bottom<-40||h.top>window.innerHeight+40)continue;const M=P(n.x,k.left,k.right),S=P(n.y,k.top,k.bottom),A=n.x-M,H=n.y-S,N=A*A+H*H;if(N>=i*i||A===0&&H===0)continue;const E=Math.sqrt(N)||1e-4,C=A/E,O=H/E;n.x=M+C*(i+.5),n.y=S+O*(i+.5);const I=n.vx*C+n.vy*O;I>0||(n.vx-=(1+.72)*I*C,n.vy-=(1+.72)*I*O)}}function G(){return l?pt(l):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function it(){const u=performance.now(),f=Math.min((u-r)/16.666,3);r=u,n.x+=n.vx*f,n.y+=n.vy*f,n.vx*=Math.pow(.985,f),n.vy*=Math.pow(.985,f),Math.abs(n.vx)<.02&&(n.vx=0),Math.abs(n.vy)<.02&&(n.vy=0),Ct(),Dt(),o=Math.hypot(n.vx,n.vy)>.35,o&&(n.textureOffsetX=mt(n.textureOffsetX+n.vx*f*.32,12),n.textureOffsetY=mt(n.textureOffsetY+n.vy*f*.32,12)),U(),requestAnimationFrame(it)}window.addEventListener("pointermove",u=>{if(u.pointerType&&u.pointerType!=="mouse"&&u.pointerType!=="pen")return;const f=c.x,h=c.y,v=c.active,b=u.clientX+window.scrollX,k=u.clientY+window.scrollY;c.x=b,c.y=k,c.active=!0;const M=v?b-f:0,S=v?k-h:0;v&&Et(M,S)},{passive:!0}),window.addEventListener("pointerleave",()=>{c.active=!1}),window.addEventListener("pointerout",u=>{u.relatedTarget||(c.active=!1)}),window.addEventListener("blur",()=>{c.active=!1}),window.addEventListener("scroll",()=>{c.active=!1}),window.addEventListener("resize",()=>{const u=G();n.x=P(n.x,u.left+i+8,u.right-i-8),n.y=P(n.y,W(u),u.bottom-i-8),V()}),requestAnimationFrame(it)}function P(t,e,i){return Math.min(Math.max(t,e),i)}function mt(t,e){const i=t%e;return i<0?i+e:i}function pt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
