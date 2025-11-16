import{f as Et}from"./sanityClient-DzwMick1.js";function K(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(n=>typeof n=="string"))}function ft(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(n=>typeof n._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(n=>typeof n=="object"&&"_type"in n)}function pt(t){return ft(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function mt(t){return t._type==="@list"}function gt(t){return t._type==="@span"}function yt(t){return t._type==="@text"}const nt=["strong","em","code","underline","strike-through"];function Ct(t,n,i){if(!K(t)||!t.marks)return[];if(!t.marks.length)return[];const e=t.marks.slice(),r={};return e.forEach(o=>{r[o]=1;for(let l=n+1;l<i.length;l++){const c=i[l];if(c&&K(c)&&Array.isArray(c.marks)&&c.marks.indexOf(o)!==-1)r[o]++;else break}}),e.sort((o,l)=>Pt(r,o,l))}function Pt(t,n,i){const e=t[n],r=t[i];if(e!==r)return r-e;const o=nt.indexOf(n),l=nt.indexOf(i);return o!==l?o-l:n.localeCompare(i)}function _t(t){var l;const{children:n}=t,i=t.markDefs??[];if(!n||!n.length)return[];const e=n.map(Ct),r={_type:"@span",children:[],markType:"<unknown>"};let o=[r];for(let c=0;c<n.length;c++){const m=n[c];if(!m)continue;const a=e[c]||[];let u=1;if(o.length>1)for(u;u<o.length;u++){const p=((l=o[u])==null?void 0:l.markKey)||"",y=a.indexOf(p);if(y===-1)break;a.splice(y,1)}o=o.slice(0,u);let g=o[o.length-1];if(g){for(const p of a){const y=i==null?void 0:i.find(B=>B._key===p),w=y?y._type:p,L={_type:"@span",_key:m._key,children:[],markDef:y,markType:w,markKey:p};g.children.push(L),o.push(L),g=L}if(K(m)){const p=m.text.split(`
`);for(let y=p.length;y-- >1;)p.splice(y,0,`
`);g.children=g.children.concat(p.map(y=>({_type:"@text",text:y})))}else g.children=g.children.concat(m)}}return r.children}function Bt(t,n){const i=[];let e;for(let r=0;r<t.length;r++){const o=t[r];if(o){if(!pt(o)){i.push(o),e=void 0;continue}if(!e){e=z(o,r,n),i.push(e);continue}if(Ot(o,e)){e.children.push(o);continue}if((o.level||1)>e.level){const l=z(o,r,n);{const c=e.children[e.children.length-1],m={...c,children:[...c.children,l]};e.children[e.children.length-1]=m}e=l;continue}if((o.level||1)<e.level){const l=i[i.length-1],c=l&&J(l,o);if(c){e=c,e.children.push(o);continue}e=z(o,r,n),i.push(e);continue}if(o.listItem!==e.listItem){const l=i[i.length-1],c=l&&J(l,{level:o.level||1});if(c&&c.listItem===o.listItem){e=c,e.children.push(o);continue}else{e=z(o,r,n),i.push(e);continue}}console.warn("Unknown state encountered for block",o),i.push(o)}}return i}function Ot(t,n){return(t.level||1)===n.level&&t.listItem===n.listItem}function z(t,n,i){return{_type:"@list",_key:`${t._key||`${n}`}-parent`,mode:i,level:t.level||1,listItem:t.listItem,children:[t]}}function J(t,n){const i=n.level||1,e=n.listItem||"normal",r=typeof n.listItem=="string";if(mt(t)&&(t.level||1)===i&&r&&(t.listItem||"normal")===e)return t;if(!("children"in t))return;const o=t.children[t.children.length-1];return o&&!K(o)?J(o,n):void 0}function bt(t){let n="";return t.children.forEach(i=>{yt(i)?n+=i.text:gt(i)&&(n+=bt(i))}),n}const Dt=["http","https","mailto","tel"],qt={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function vt(t){return Yt(t.replace(/[&<>"']/g,n=>`&${qt[n]};`))}function Yt(t){return t.replace(/ {2,}/g,n=>`${"&nbsp;".repeat(n.length-1)} `)}function Xt(t){const n=(t||"").trim(),i=n.charAt(0);if(i==="#"||i==="/")return!0;const e=n.indexOf(":");if(e===-1)return!0;const r=n.slice(0,e).toLowerCase();if(Dt.indexOf(r)!==-1)return!0;const o=n.indexOf("?");if(o!==-1&&e>o)return!0;const l=n.indexOf("#");return l!==-1&&e>l}const Vt={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},Wt=({children:t})=>`<li>${t}</li>`,Nt=({children:t,value:n})=>{const i=(n==null?void 0:n.href)||"";return Xt(i)?`<a href="${vt(i)}">${t}</a>`:t},jt={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Nt},W=(t,n)=>`Unknown ${t}, specify a component for it in the \`components.${n}\` option`,wt=t=>W(`block type "${t}"`,"types"),Rt=t=>W(`mark type "${t}"`,"marks"),Ut=t=>W(`block style "${t}"`,"block"),Gt=t=>W(`list style "${t}"`,"list"),zt=t=>W(`list item style "${t}"`,"listItem");function Ft(t){console.warn(t)}const Kt=({value:t,isInline:n})=>{const i=wt(t._type);return n?`<span style="display:none">${i}</span>`:`<div style="display:none">${i}</div>`},Zt=({markType:t,children:n})=>`<span class="unknown__pt__mark__${t}">${n}</span>`,Qt=({children:t})=>`<p>${t}</p>`,Jt=({children:t})=>`<ul>${t}</ul>`,te=({children:t})=>`<li>${t}</li>`,ee=()=>"<br/>",ne={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},it={types:{},block:ne,marks:jt,list:Vt,listItem:Wt,hardBreak:ee,escapeHTML:vt,unknownType:Kt,unknownMark:Zt,unknownList:Jt,unknownListItem:te,unknownBlockStyle:Qt};function ie(t,n){const{block:i,list:e,listItem:r,marks:o,types:l,...c}=n;return{...t,block:X(t,n,"block"),list:X(t,n,"list"),listItem:X(t,n,"listItem"),marks:X(t,n,"marks"),types:X(t,n,"types"),...c}}function X(t,n,i){const e=n[i],r=t[i];return typeof e=="function"||e&&typeof r=="function"?e:e?{...r,...e}:r}function re(t,n={}){const{components:i,onMissingComponent:e=Ft}=n,r=e||se,o=Array.isArray(t)?t:[t],l=Bt(o,"html"),c=i?ie(it,i):it,m=oe(c,r);return l.map((a,u)=>m({node:a,index:u,isInline:!1,renderNode:m})).join("")}const oe=(t,n)=>{function i(a){const{node:u,index:g,isInline:p}=a;return mt(u)?r(u,g):pt(u)?e(u,g):gt(u)?o(u):ft(u)?l(u,g,p):yt(u)?c(u):m(u,g,p)}function e(a,u){const g=rt({node:a,index:u,isInline:!1,renderNode:i}),p=t.listItem,y=(typeof p=="function"?p:p[a.listItem])||t.unknownListItem;if(y===t.unknownListItem){const L=a.listItem||"bullet";n(zt(L),{type:L,nodeType:"listItemStyle"})}let w=g.children;if(a.style&&a.style!=="normal"){const{listItem:L,...B}=a;w=i({node:B,index:u,isInline:!1})}return y({value:a,index:u,isInline:!1,renderNode:i,children:w})}function r(a,u){const g=a.children.map((w,L)=>i({node:w._key?w:{...w,_key:`li-${u}-${L}`},index:L,isInline:!1})),p=t.list,y=(typeof p=="function"?p:p[a.listItem])||t.unknownList;if(y===t.unknownList){const w=a.listItem||"bullet";n(Gt(w),{nodeType:"listStyle",type:w})}return y({value:a,index:u,isInline:!1,renderNode:i,children:g.join("")})}function o(a){const{markDef:u,markType:g,markKey:p}=a,y=t.marks[g]||t.unknownMark,w=a.children.map((L,B)=>i({node:L,index:B,isInline:!0}));return y===t.unknownMark&&n(Rt(g),{nodeType:"mark",type:g}),y({text:bt(a),value:u,markType:g,markKey:p,renderNode:i,children:w.join("")})}function l(a,u,g){const{_key:p,...y}=rt({node:a,index:u,isInline:g,renderNode:i}),w=y.node.style||"normal",L=(typeof t.block=="function"?t.block:t.block[w])||t.unknownBlockStyle;return L===t.unknownBlockStyle&&n(Ut(w),{nodeType:"blockStyle",type:w}),L({...y,value:y.node,renderNode:i})}function c(a){if(a.text===`
`){const u=t.hardBreak;return u?u():`
`}return t.escapeHTML(a.text)}function m(a,u,g){const p=t.types[a._type];return p||n(wt(a._type),{nodeType:"block",type:a._type}),(p||t.unknownType)({value:a,isInline:g,index:u,renderNode:i})}return i};function rt(t){const{node:n,index:i,isInline:e,renderNode:r}=t,o=_t(n).map((l,c)=>r({node:l,isInline:!0,index:c,renderNode:r}));return{_key:n._key||`block-${i}`,children:o.join(""),index:i,isInline:e,node:n}}function se(){}const $t="images/samuel-placeholder.svg",F=/^[a-zA-Z0-9_-]{11}$/,k={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},Z={meta:null,items:[]},V={meta:null,items:[],totalCount:0};document.addEventListener("DOMContentLoaded",async()=>{ae(),Le();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await le(),window.location.hash&&setTimeout(()=>xt(window.location.hash),100),Ie(t),t||Ee()});function ae(){const t=document.querySelector(".nav-toggle"),n=document.querySelector(".nav-links");!t||!n||(t.addEventListener("click",()=>{const i=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",i),n.classList.toggle("is-open")}),n.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),n.classList.remove("is-open")})}))}async function le(){Q(!0);const t=await Et();if(!t)return xe("Unable to load the latest content. Please try again shortly."),Q(!1),null;ce(t.site),de(t.hero,t.site),ue(t.about),he(t.resume),fe(t.academics);const n=lt(t.highlightEvents||[]);Z.meta=t.highlightsSection,Z.items=n.filter(dt),pe();const i=lt(t.videos||[],"eventDate");return V.meta=t.videosSection,V.items=i.filter(dt),V.totalCount=i.length,me(),ge(t.dualSport),ye(t.contact),Q(!1),kt(),t}function ce(t){var e;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=t.siteTitle)}const n=document.querySelector('meta[name="description"]');n&&t.seoDescription&&n.setAttribute("content",t.seoDescription);const i=document.querySelector(".brand-mark");if(i)if((e=t.brandMarkImage)!=null&&e.url)i.innerHTML=`<span class="brand-mark-image"><img src="${Y(t.brandMarkImage.url)}" alt="${s(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,i.classList.add("has-image");else{const r=t.brandMarkInitials||Me(t.siteTitle)||i.textContent||"SM";i.textContent=r,i.classList.remove("has-image")}}function de(t,n){var o,l;const i=x(k.heroCopy),e=x(k.heroPhoto),r=x(k.heroMetrics);if(!t){i&&(i.innerHTML=T("Hero content coming soon."));return}if(i){const c=t.tagline?`<p class="hero-tag">${s(t.tagline)}</p>`:"",m=t.subheadline?`<span>${s(t.subheadline)}</span>`:"",a=t.bio?`<p>${s(t.bio)}</p>`:"",u=[st(t.primaryCta,"primary","View Highlights","#highlights"),st(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");i.innerHTML=`
      ${c}
      <h1>
        ${s(t.headline||(n==null?void 0:n.siteTitle)||"")}
        ${m}
      </h1>
      ${a}
      <div class="hero-actions">
        ${u||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(e){const c=((o=t.headshot)==null?void 0:o.url)||$t,m=((l=t.headshot)==null?void 0:l.alt)||"Portrait of Samuel Masco",a=t.photoCaption||"Focused on the next shot.";e.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${c}" alt="${s(m)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${s(a)}</figcaption>
    `}r&&(Array.isArray(t.metrics)&&t.metrics.length?r.innerHTML=t.metrics.map(c=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${s(c.label||"")}</span>
              <span class="metric-value">${s(c.value||"")}</span>
            </div>
          `).join(""):r.innerHTML=T("Metrics coming soon."))}function ue(t){const n=x(k.aboutHeading),i=x(k.aboutGrid);if(n&&(n.innerHTML=t?`
          <h2>${s(t.heading||"About")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("About section coming soon.")),i){if(!t){i.innerHTML=T("About details coming soon.");return}i.innerHTML=`
      <article class="about-card" data-motion="delay-1">
        <h3>${s(t.profileCardTitle||"Profile")}</h3>
        <ul>
          ${(t.profileFacts||[]).map(e=>`
                <li><strong>${s(e.label||"")}: </strong>${s(e.value||"")}</li>
              `).join("")}
        </ul>
      </article>
      <article class="about-card about-story" data-motion="delay-2">
        <h3>${s(t.mindsetTitle||"Mindset & Goals")}</h3>
        ${tt(t.mindsetBody)}
      </article>
      <article class="about-card about-highlight" data-motion="delay-3">
        <h3>${s(t.quickHitsTitle||"Quick Hits")}</h3>
        ${(t.quickHits||[]).map(e=>`
              <div class="highlight-row">
                <span>${s(e.label||"")}</span>
                <span>${s(e.value||"")}</span>
              </div>
            `).join("")}
      </article>
    `}}function he(t){const n=x(k.resumeHeading),i=x(k.resumePanels);if(n&&(n.innerHTML=t?`
          <h2>${s(t.heading||"Golf Resume")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Golf resume coming soon.")),i){if(!t){i.innerHTML=T("Resume details coming soon.");return}i.innerHTML=`
      <article class="panel" data-motion="delay-1">
        <h3>${s(t.performanceTitle||"Performance Snapshot")}</h3>
        <dl>
          ${(t.performanceStats||[]).map(e=>`
                <div>
                  <dt>${s(e.label||"")}</dt>
                  <dd>${s(e.value||"")}</dd>
                </div>
              `).join("")}
        </dl>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${s(t.trainingTitle||"Training Routine")}</h3>
        ${tt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${s(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(e=>`<li>${s(e||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function fe(t){const n=x(k.academicsHeading),i=x(k.academicsGrid);if(n&&(n.innerHTML=t?`
          <h2>${s(t.heading||"Academics")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Academics section coming soon.")),i){if(!t){i.innerHTML=T("Academic details coming soon.");return}const e=t.transcriptLabel||"Transcript",r=t.transcriptUrl?`<a class="btn subtle" href="${Y(t.transcriptUrl)}" target="_blank" rel="noopener">${s(e)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${s(e)}</span>`;i.innerHTML=`
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
        ${tt(t.interestsBody)}
      </article>
    `}}function pe(){const t=Z.meta,n=Z.items||[],i=x(k.highlightsHeading),e=x(k.highlightsTimeline),r=x(k.highlightsActions);if(i&&(i.innerHTML=t?`
          <h2>${s(t.heading||"Highlights")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Highlights coming soon.")),!e)return;const o=(t==null?void 0:t.maxItems)||5,l=n.slice(0,o);if(!l.length){e.innerHTML=T("Highlight events coming soon."),r&&(r.innerHTML="");return}e.innerHTML=l.map((c,m)=>ve(c,m)).join(""),e.querySelectorAll("[data-motion]").forEach(c=>c.classList.add("is-visible")),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function me(){const t=V.meta,n=V.items||[],i=x(k.videosHeading),e=x(k.videoGrid),r=x(k.videosActions);if(i&&(i.innerHTML=t?`
          <h2>${s(t.heading||"Videos")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Videos coming soon.")),!e)return;const o=(t==null?void 0:t.maxItems)||3,l=n.slice(0,o);if(!l.length){e.innerHTML=T("Video highlights coming soon."),r&&(r.innerHTML="");return}e.innerHTML=l.map((c,m)=>we(c,m)).join(""),e.querySelectorAll("[data-motion]").forEach(c=>c.classList.add("is-visible")),kt(),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function ge(t){const n=x(k.dualHeading),i=x(k.dualGrid);if(n&&(n.innerHTML=t?`
          <h2>${s(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Dual-sport content coming soon.")),i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=T("Dual-sport cards coming soon.");return}i.innerHTML=t.cards.map((e,r)=>`
          <article class="dual-card" data-motion="delay-${r+1}">
            <h3>${s(e.title||"")}</h3>
            ${e.body?`<p>${s(e.body)}</p>`:""}
            ${Array.isArray(e.bulletPoints)&&e.bulletPoints.length?`<ul>${e.bulletPoints.map(o=>`<li>${s(o||"")}</li>`).join("")}</ul>`:""}
          </article>
        `).join("")}}function ye(t){const n=x(k.contactHeading),i=x(k.contactGrid);if(n&&(n.innerHTML=t?`
          <h2>${s(t.heading||"Let's Connect")}</h2>
          <p>${s(t.subheading||"")}</p>
        `:T("Contact section coming soon.")),!!i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=T("Contact cards coming soon.");return}i.innerHTML=t.cards.map((e,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${s(e.title||"")}</h3>
          <ul>
            ${(e.entries||[]).map(o=>`<li>${be(o)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function be(t){var r;if(!t)return"";const n=t.label?`<strong>${s(t.label)}:</strong> `:"",i=Se(t.value),e=(r=t.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&i.length<=1?`${n}<a href="${Y(t.link)}"${e}>${s(t.value||t.link)}</a>`:i.length?`${n}${i.map((o,l)=>{const c=l===0&&t.link?t.link:o.link;if(c){const a=c.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${Y(c)}"${a}>${s(o.text)}</a>`}return s(o.text)}).join(" · ")}`:`${n}${s(t.value||"")}`}function ve(t,n){const i=He(t),e=t.summary?`<p>${s(t.summary)}</p>`:"",r=Array.isArray(t.results)?`<ul>${t.results.map(o=>`<li>${s(o.description||"")}</li>`).join("")}</ul>`:"";return`
    <article class="timeline-card" data-motion="delay-${n+1}">
      <header>
        <h3>${s(t.title||"")}</h3>
        ${i?`<span class="timeline-date">${i}</span>`:""}
      </header>
      ${e}
      ${r}
    </article>
  `}function we(t,n){const i=Te(t),e=t.thumbnailUrl||(i?`https://img.youtube.com/vi/${i}/hqdefault.jpg`:$t),r=t.thumbnailAlt||t.title||"Video highlight",o=t.ctaLabel||"Play",l=t.title||"Video highlight",m=!!i?"":' disabled aria-disabled="true"';return`
    <article class="video-card" data-motion="delay-${n+1}">
      <div class="video-frame" data-video-id="${s(i)}" data-video-title="${s(l)}">
        <img src="${Y(e)}" alt="${s(r)}" loading="lazy" />
        <button class="play-button" type="button"${m} aria-label="Play ${s(l)}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${s(o)}</span>
        </button>
      </div>
      <h3>${s(t.title||"")}</h3>
      <p>${s(t.description||"")}</p>
    </article>
  `}function kt(){document.querySelectorAll(".video-frame").forEach(t=>{if(t.dataset.playerReady==="true")return;const n=t.querySelector(".play-button"),i=t.dataset.videoId,e=t.dataset.videoTitle||"Samuel Masco golf video highlight";!n||!i||(n.addEventListener("click",()=>{ke(i,e)}),t.dataset.playerReady="true")})}let D=null;function $e(){if(D)return D;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",n=>{n.target.closest("[data-overlay-close]")&&ot()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&t.classList.contains("is-open")&&ot()}),document.body.appendChild(t),D=t,t}function ke(t,n){const i=$e(),e=i.querySelector(".video-overlay-frame");if(!e)return;e.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",n),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",e.appendChild(r),i.classList.add("is-open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function ot(){if(!D)return;const t=D.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),D.classList.remove("is-open"),D.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}function tt(t){return!Array.isArray(t)||!t.length?"":re(t)}function x(t){return t?document.querySelector(t):null}function T(t){return`<p class="placeholder-text">${s(t)}</p>`}function Q(t){document.body.dataset.contentLoading=String(t)}function xe(t){const n=document.querySelector("main");n&&n.insertAdjacentHTML("afterbegin",`<div class="notification error">${s(t)}</div>`)}function st(t,n,i,e){const r=(t==null?void 0:t.label)||i,o=(t==null?void 0:t.href)||e;if(!r||!o)return"";const c=o.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${n}" href="${Y(o)}"${c}>${s(r)}</a>`}function Le(){document.addEventListener("click",t=>{const n=t.target.closest('a[data-scroll="true"]');if(!n)return;const i=n.getAttribute("href")||"";xt(i)&&t.preventDefault()})}function xt(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const n=document.querySelector(t);return n?(n.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function Te(t){return t?at(t.youtubeId)||at(t.youtubeUrl):""}function at(t){if(!t)return"";const n=String(t).trim();if(!n)return"";if(F.test(n))return n;let i;try{i=new URL(n)}catch{try{i=new URL(`https://${n}`)}catch{return""}}const e=i.hostname.replace(/^www\./,"").toLowerCase();if(e==="youtu.be"){const r=i.pathname.split("/").filter(Boolean)[0];return r&&F.test(r)?r:""}if(e==="youtube.com"||e.endsWith(".youtube.com")){const r=i.searchParams.get("v");if(r&&F.test(r))return r;const o=i.pathname.split("/").filter(Boolean);if(o.length>=2&&(o[0]==="embed"||o[0]==="shorts")){const l=o[1];return l&&F.test(l)?l:""}}return""}function s(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Y(t){return s(t)}function Me(t){if(!t)return"";const n=t.trim().split(/\s+/).filter(Boolean);return n.length?n.slice(0,2).map(i=>i.charAt(0).toUpperCase()).join(""):""}function Se(t){if(!t)return[];const n=String(t).trim();return n?n.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:Ae(r)})):[]}function Ae(t){if(!t)return null;const n=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${n.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${n}`:null}function He(t){if(!t)return"";if(t.dateLabel)return s(t.dateLabel);if(!t.eventDate)return"";const n=new Date(t.eventDate);return Number.isNaN(n.getTime())?s(t.eventDate):n.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function lt(t,n="eventDate"){return Array.isArray(t)?[...t].sort((i,e)=>ct(e,n)-ct(i,n)):[]}function ct(t,n){if(!t)return 0;const i=t[n];if(i){const e=Date.parse(i);if(!Number.isNaN(e))return e}if(t._createdAt){const e=Date.parse(t._createdAt);if(!Number.isNaN(e))return e}return 0}function dt(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:!0:!1}function Ie(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(i=>i.classList.add("is-visible"));return}const n=new IntersectionObserver(i=>{i.forEach(e=>{e.isIntersecting&&(e.target.classList.add("is-visible"),n.unobserve(e.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(i=>n.observe(i))}function Ee(){if(window.matchMedia("(pointer: coarse)").matches)return;const n=document.createElement("div");n.className="golf-ball",n.setAttribute("aria-hidden","true"),document.body.appendChild(n);const i=18,e={x:Math.min(window.innerWidth-i-24,window.innerWidth*.78),y:Math.min(window.innerHeight-i-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let r=performance.now(),o=!1,l=!0;const c=document.querySelector(".site-header"),m=document.querySelector(".hero"),a={x:0,y:0,active:!1},g=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(d=>Array.from(document.querySelectorAll(d))).filter(d=>d!==null&&d.isConnected),p=document.querySelector(".hero-scroll"),y=p?p.querySelector("span"):null,w={x:.5,y:-32},L={x:0,y:10},B=-80;function N(){n.style.transform=`translate3d(${e.x-i}px, ${e.y-i}px, 0)`,n.classList.toggle("is-moving",o),n.style.setProperty("--texture-offset-x",`${e.textureOffsetX}px`),n.style.setProperty("--texture-offset-y",`${e.textureOffsetY}px`)}function Lt(){var H;const d=document.querySelector(".hero-copy h1");if(!d)return null;const h="masco",b=(d.textContent||"").toLowerCase().lastIndexOf(h);if(b===-1)return null;const $=b+h.length-1,S=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);let M=0,A=S.nextNode();for(;A;){const O=A.textContent||"",E=O.length;if($<M+E){const C=$-M;if(C<0||C>=E)return null;const q=O.charAt(C);if(!q||!q.trim())return null;const I=document.createRange();I.setStart(A,C),I.setEnd(A,Math.min(C+1,E));const P=I.getBoundingClientRect();return(H=I.detach)==null||H.call(I),!P||!P.width&&!P.height?null:{left:P.left+window.scrollX,right:P.right+window.scrollX,top:P.top+window.scrollY,bottom:P.bottom+window.scrollY,width:P.width,height:P.height}}M+=E,A=S.nextNode()}return null}function j(d){const h=d.top+i+B,f=i+4;return Math.max(h,f)}function Tt(){if(!m)return!0;const d=window.getComputedStyle(m),h=parseFloat(d.getPropertyValue("column-gap")||d.getPropertyValue("gap"))||0,f=m.clientWidth;if(!f)return!1;const b=280*3+h*2;return f>=b-.5}function Mt(){const d=Lt();if(!d)return!1;const h=G(),f=d.left+d.width/3+w.x,v=d.top+d.height/30+w.y,b=h.left+i+12,$=h.right-i-12,S=j(h),M=h.bottom-i-12;return e.x=_(f,b,$),e.y=_(v,S,M),e.vx=0,e.vy=0,N(),!0}function St(){if(!p)return!1;const d=ht(y||p),h=G(),f=d.left+d.width/2+L.x,v=d.bottom+i+L.y,b=h.left+i+12,$=h.right-i-12,S=j(h),M=h.bottom-i-12;return e.x=_(f,b,$),e.y=_(v,S,M),e.vx=0,e.vy=0,N(),!0}function R(){Mt()||St()||N()}function U(d={}){const{force:h=!1}=d,f=Tt();if(!h&&f===l)return;const v=l;l=f,n.style.display=f?"":"none",f&&(!v||h)&&R()}R(),U({force:!0}),window.addEventListener("load",()=>{R(),U({force:!0})},{once:!0}),requestAnimationFrame(()=>{R(),U({force:!0})});function At(d,h){if(!a.active)return;const f=e.x-a.x,v=e.y-a.y,b=Math.hypot(f,v),$=i+10;if(b>$)return;const S=.42;e.vx+=d*S,e.vy+=h*S;const M=34,A=Math.hypot(e.vx,e.vy);if(A>M){const H=M/A;e.vx*=H,e.vy*=H}if(b<i){const H=i-b,O=f/(b||1),E=v/(b||1);e.x+=O*(H+.5),e.y+=E*(H+.5)}}function Ht(){const h=G(),f=h.left+i+8,v=h.right-i-8,b=j(h),$=h.bottom-i-8;e.x<f?(e.x=f,e.vx=Math.abs(e.vx)*.78):e.x>v&&(e.x=v,e.vx=-Math.abs(e.vx)*.78),e.y<b?(e.y=b,e.vy=Math.abs(e.vy)*.78):e.y>$&&(e.y=$,e.vy=-Math.abs(e.vy)*.78)}function It(){for(const h of g){if(!h.isConnected)continue;const f=h.getBoundingClientRect(),v=window.scrollX,b=window.scrollY,$={left:f.left+v,right:f.right+v,top:f.top+b,bottom:f.bottom+b};if(f.width===0||f.height===0||f.right<-40||f.left>window.innerWidth+40||f.bottom<-40||f.top>window.innerHeight+40)continue;const S=_(e.x,$.left,$.right),M=_(e.y,$.top,$.bottom),A=e.x-S,H=e.y-M,O=A*A+H*H;if(O>=i*i||A===0&&H===0)continue;const E=Math.sqrt(O)||1e-4,C=A/E,q=H/E;e.x=S+C*(i+.5),e.y=M+q*(i+.5);const I=e.vx*C+e.vy*q;I>0||(e.vx-=(1+.72)*I*C,e.vy-=(1+.72)*I*q)}}function G(){return c?ht(c):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function et(){const d=performance.now(),h=Math.min((d-r)/16.666,3);r=d,e.x+=e.vx*h,e.y+=e.vy*h,e.vx*=Math.pow(.985,h),e.vy*=Math.pow(.985,h),Math.abs(e.vx)<.02&&(e.vx=0),Math.abs(e.vy)<.02&&(e.vy=0),Ht(),It(),o=Math.hypot(e.vx,e.vy)>.35,o&&(e.textureOffsetX=ut(e.textureOffsetX+e.vx*h*.32,12),e.textureOffsetY=ut(e.textureOffsetY+e.vy*h*.32,12)),N(),requestAnimationFrame(et)}window.addEventListener("pointermove",d=>{if(d.pointerType&&d.pointerType!=="mouse"&&d.pointerType!=="pen")return;const h=a.x,f=a.y,v=a.active,b=d.clientX+window.scrollX,$=d.clientY+window.scrollY;a.x=b,a.y=$,a.active=!0;const S=v?b-h:0,M=v?$-f:0;v&&At(S,M)},{passive:!0}),window.addEventListener("pointerleave",()=>{a.active=!1}),window.addEventListener("pointerout",d=>{d.relatedTarget||(a.active=!1)}),window.addEventListener("blur",()=>{a.active=!1}),window.addEventListener("scroll",()=>{a.active=!1}),window.addEventListener("resize",()=>{const d=G();e.x=_(e.x,d.left+i+8,d.right-i-8),e.y=_(e.y,j(d),d.bottom-i-8),U()}),requestAnimationFrame(et)}function _(t,n,i){return Math.min(Math.max(t,n),i)}function ut(t,n){const i=t%n;return i<0?i+n:i}function ht(t){const n=t.getBoundingClientRect();return{left:n.left+window.scrollX,right:n.right+window.scrollX,top:n.top+window.scrollY,bottom:n.bottom+window.scrollY,width:n.width,height:n.height}}
