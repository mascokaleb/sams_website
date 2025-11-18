import{f as Bt}from"./sanityClient-kAGhWdKW.js";function Q(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function wt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function kt(t){return wt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function xt(t){return t._type==="@list"}function Lt(t){return t._type==="@span"}function Tt(t){return t._type==="@text"}const dt=["strong","em","code","underline","strike-through"];function Ot(t,e,r){if(!Q(t)||!t.marks)return[];if(!t.marks.length)return[];const n=t.marks.slice(),i={};return n.forEach(o=>{i[o]=1;for(let s=e+1;s<r.length;s++){const l=r[s];if(l&&Q(l)&&Array.isArray(l.marks)&&l.marks.indexOf(o)!==-1)i[o]++;else break}}),n.sort((o,s)=>qt(i,o,s))}function qt(t,e,r){const n=t[e],i=t[r];if(n!==i)return i-n;const o=dt.indexOf(e),s=dt.indexOf(r);return o!==s?o-s:e.localeCompare(r)}function Yt(t){var s;const{children:e}=t,r=t.markDefs??[];if(!e||!e.length)return[];const n=e.map(Ot),i={_type:"@span",children:[],markType:"<unknown>"};let o=[i];for(let l=0;l<e.length;l++){const f=e[l];if(!f)continue;const c=n[l]||[];let u=1;if(o.length>1)for(u;u<o.length;u++){const p=((s=o[u])==null?void 0:s.markKey)||"",y=c.indexOf(p);if(y===-1)break;c.splice(y,1)}o=o.slice(0,u);let g=o[o.length-1];if(g){for(const p of c){const y=r==null?void 0:r.find(I=>I._key===p),v=y?y._type:p,k={_type:"@span",_key:f._key,children:[],markDef:y,markType:v,markKey:p};g.children.push(k),o.push(k),g=k}if(Q(f)){const p=f.text.split(`
`);for(let y=p.length;y-- >1;)p.splice(y,0,`
`);g.children=g.children.concat(p.map(y=>({_type:"@text",text:y})))}else g.children=g.children.concat(f)}}return i.children}function Rt(t,e){const r=[];let n;for(let i=0;i<t.length;i++){const o=t[i];if(o){if(!kt(o)){r.push(o),n=void 0;continue}if(!n){n=K(o,i,e),r.push(n);continue}if(Gt(o,n)){n.children.push(o);continue}if((o.level||1)>n.level){const s=K(o,i,e);{const l=n.children[n.children.length-1],f={...l,children:[...l.children,s]};n.children[n.children.length-1]=f}n=s;continue}if((o.level||1)<n.level){const s=r[r.length-1],l=s&&at(s,o);if(l){n=l,n.children.push(o);continue}n=K(o,i,e),r.push(n);continue}if(o.listItem!==n.listItem){const s=r[r.length-1],l=s&&at(s,{level:o.level||1});if(l&&l.listItem===o.listItem){n=l,n.children.push(o);continue}else{n=K(o,i,e),r.push(n);continue}}console.warn("Unknown state encountered for block",o),r.push(o)}}return r}function Gt(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function K(t,e,r){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:r,level:t.level||1,listItem:t.listItem,children:[t]}}function at(t,e){const r=e.level||1,n=e.listItem||"normal",i=typeof e.listItem=="string";if(xt(t)&&(t.level||1)===r&&i&&(t.listItem||"normal")===n)return t;if(!("children"in t))return;const o=t.children[t.children.length-1];return o&&!Q(o)?at(o,e):void 0}function St(t){let e="";return t.children.forEach(r=>{Tt(r)?e+=r.text:Lt(r)&&(e+=St(r))}),e}const Xt=["http","https","mailto","tel"],Ut={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Mt(t){return jt(t.replace(/[&<>"']/g,e=>`&${Ut[e]};`))}function jt(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Wt(t){const e=(t||"").trim(),r=e.charAt(0);if(r==="#"||r==="/")return!0;const n=e.indexOf(":");if(n===-1)return!0;const i=e.slice(0,n).toLowerCase();if(Xt.indexOf(i)!==-1)return!0;const o=e.indexOf("?");if(o!==-1&&n>o)return!0;const s=e.indexOf("#");return s!==-1&&n>s}const Vt={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},zt=({children:t})=>`<li>${t}</li>`,Ft=({children:t,value:e})=>{const r=(e==null?void 0:e.href)||"";return Wt(r)?`<a href="${Mt(r)}">${t}</a>`:t},Kt={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Ft},j=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,At=t=>j(`block type "${t}"`,"types"),Zt=t=>j(`mark type "${t}"`,"marks"),Qt=t=>j(`block style "${t}"`,"block"),Jt=t=>j(`list style "${t}"`,"list"),te=t=>j(`list item style "${t}"`,"listItem");function ee(t){console.warn(t)}const ne=({value:t,isInline:e})=>{const r=At(t._type);return e?`<span style="display:none">${r}</span>`:`<div style="display:none">${r}</div>`},re=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,ie=({children:t})=>`<p>${t}</p>`,oe=({children:t})=>`<ul>${t}</ul>`,ae=({children:t})=>`<li>${t}</li>`,se=()=>"<br/>",le={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},ut={types:{},block:le,marks:Kt,list:Vt,listItem:zt,hardBreak:se,escapeHTML:Mt,unknownType:ne,unknownMark:re,unknownList:oe,unknownListItem:ae,unknownBlockStyle:ie};function ce(t,e){const{block:r,list:n,listItem:i,marks:o,types:s,...l}=e;return{...t,block:X(t,e,"block"),list:X(t,e,"list"),listItem:X(t,e,"listItem"),marks:X(t,e,"marks"),types:X(t,e,"types"),...l}}function X(t,e,r){const n=e[r],i=t[r];return typeof n=="function"||n&&typeof i=="function"?n:n?{...i,...n}:i}function de(t,e={}){const{components:r,onMissingComponent:n=ee}=e,i=n||fe,o=Array.isArray(t)?t:[t],s=Rt(o,"html"),l=r?ce(ut,r):ut,f=ue(l,i);return s.map((c,u)=>f({node:c,index:u,isInline:!1,renderNode:f})).join("")}const ue=(t,e)=>{function r(c){const{node:u,index:g,isInline:p}=c;return xt(u)?i(u,g):kt(u)?n(u,g):Lt(u)?o(u):wt(u)?s(u,g,p):Tt(u)?l(u):f(u,g,p)}function n(c,u){const g=ft({node:c,index:u,isInline:!1,renderNode:r}),p=t.listItem,y=(typeof p=="function"?p:p[c.listItem])||t.unknownListItem;if(y===t.unknownListItem){const k=c.listItem||"bullet";e(te(k),{type:k,nodeType:"listItemStyle"})}let v=g.children;if(c.style&&c.style!=="normal"){const{listItem:k,...I}=c;v=r({node:I,index:u,isInline:!1})}return y({value:c,index:u,isInline:!1,renderNode:r,children:v})}function i(c,u){const g=c.children.map((v,k)=>r({node:v._key?v:{...v,_key:`li-${u}-${k}`},index:k,isInline:!1})),p=t.list,y=(typeof p=="function"?p:p[c.listItem])||t.unknownList;if(y===t.unknownList){const v=c.listItem||"bullet";e(Jt(v),{nodeType:"listStyle",type:v})}return y({value:c,index:u,isInline:!1,renderNode:r,children:g.join("")})}function o(c){const{markDef:u,markType:g,markKey:p}=c,y=t.marks[g]||t.unknownMark,v=c.children.map((k,I)=>r({node:k,index:I,isInline:!0}));return y===t.unknownMark&&e(Zt(g),{nodeType:"mark",type:g}),y({text:St(c),value:u,markType:g,markKey:p,renderNode:r,children:v.join("")})}function s(c,u,g){const{_key:p,...y}=ft({node:c,index:u,isInline:g,renderNode:r}),v=y.node.style||"normal",k=(typeof t.block=="function"?t.block:t.block[v])||t.unknownBlockStyle;return k===t.unknownBlockStyle&&e(Qt(v),{nodeType:"blockStyle",type:v}),k({...y,value:y.node,renderNode:r})}function l(c){if(c.text===`
`){const u=t.hardBreak;return u?u():`
`}return t.escapeHTML(c.text)}function f(c,u,g){const p=t.types[c._type];return p||e(At(c._type),{nodeType:"block",type:c._type}),(p||t.unknownType)({value:c,isInline:g,index:u,renderNode:r})}return r};function ft(t){const{node:e,index:r,isInline:n,renderNode:i}=t,o=Yt(e).map((s,l)=>i({node:s,isInline:!0,index:l,renderNode:i}));return{_key:e._key||`block-${r}`,children:o.join(""),index:r,isInline:n,node:e}}function fe(){}const st="images/samuel-placeholder.svg",Z=/^[a-zA-Z0-9_-]{11}$/,$={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},J={meta:null,items:[]},U={meta:null,items:[],totalCount:0},tt={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{me(),ze();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await he(),window.location.hash&&setTimeout(()=>Et(window.location.hash),100),rn(t),t||on()});function me(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const r=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",r),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(r=>{r.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function he(){rt(!0);const t=await Bt();if(!t)return Ve("Unable to load the latest content. Please try again shortly."),rt(!1),null;pe(t.site),ge(t.hero,t.site),ye(t.about),be(t.resume),ve(t.academics);const e=it(t.highlightEvents||[]);J.meta=t.highlightsSection,J.items=e.filter(ot),$e();const r=it(t.videos||[],"eventDate");U.meta=t.videosSection,U.items=r.filter(ot),U.totalCount=r.length,we();const n=it(t.galleryPhotos||[],"shotDate");return tt.meta=t.gallerySection,tt.items=n.filter(ot),ke(),Te(t.dualSport),Se(t.contact),rt(!1),Ht(),t}function pe(t){var n;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const i=document.querySelector(".brand-text");i&&(i.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const r=document.querySelector(".brand-mark");if(r)if((n=t.brandMarkImage)!=null&&n.url)r.innerHTML=`<span class="brand-mark-image"><img src="${E(t.brandMarkImage.url)}" alt="${a(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,r.classList.add("has-image");else{const i=t.brandMarkInitials||Ze(t.siteTitle)||r.textContent||"SM";r.textContent=i,r.classList.remove("has-image")}}function ge(t,e){var o,s;const r=w($.heroCopy),n=w($.heroPhoto),i=w($.heroMetrics);if(!t){r&&(r.innerHTML=T("Hero content coming soon."));return}if(r){const l=t.tagline?`<p class="hero-tag">${a(t.tagline)}</p>`:"",f=t.subheadline?`<span>${a(t.subheadline)}</span>`:"",c=t.bio?`<p>${a(t.bio)}</p>`:"",u=[gt(t.primaryCta,"primary","View Highlights","#highlights"),gt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");r.innerHTML=`
      ${l}
      <h1>
        ${a(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${f}
      </h1>
      ${c}
      <div class="hero-actions">
        ${u||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(n){const l=((o=t.headshot)==null?void 0:o.url)||st,f=((s=t.headshot)==null?void 0:s.alt)||"Portrait of Samuel Masco",c=t.photoCaption||"Focused on the next shot.";n.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${l}" alt="${a(f)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${a(c)}</figcaption>
    `}i&&(Array.isArray(t.metrics)&&t.metrics.length?i.innerHTML=t.metrics.map(l=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${a(l.label||"")}</span>
              <span class="metric-value">${a(l.value||"")}</span>
            </div>
          `).join(""):i.innerHTML=T("Metrics coming soon."))}function ye(t){const e=w($.aboutHeading),r=w($.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${a(t.heading||"About")}</h2>
          <p>${a(t.subheading||"")}</p>
        `:T("About section coming soon.")),r){if(!t){r.innerHTML=T("About details coming soon.");return}r.innerHTML=`
      <article class="about-card" data-motion="delay-1">
        <h3>${a(t.profileCardTitle||"Profile")}</h3>
        <ul>
          ${(t.profileFacts||[]).map(n=>`
                <li><strong>${a(n.label||"")}: </strong>${a(n.value||"")}</li>
              `).join("")}
        </ul>
      </article>
      <article class="about-card about-story" data-motion="delay-2">
        <h3>${a(t.mindsetTitle||"Mindset & Goals")}</h3>
        ${lt(t.mindsetBody)}
      </article>
      <article class="about-card about-highlight" data-motion="delay-3">
        <h3>${a(t.quickHitsTitle||"Quick Hits")}</h3>
        ${(t.quickHits||[]).map(n=>`
              <div class="highlight-row">
                <span>${a(n.label||"")}</span>
                <span>${a(n.value||"")}</span>
              </div>
            `).join("")}
      </article>
    `}}function be(t){const e=w($.resumeHeading),r=w($.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${a(t.heading||"Golf Resume")}</h2>
          <p>${a(t.subheading||"")}</p>
        `:T("Golf resume coming soon.")),r){if(!t){r.innerHTML=T("Resume details coming soon.");return}r.innerHTML=`
      <article class="panel" data-motion="delay-1">
        <h3>${a(t.performanceTitle||"Performance Snapshot")}</h3>
        <dl>
          ${(t.performanceStats||[]).map(n=>`
                <div>
                  <dt>${a(n.label||"")}</dt>
                  <dd>${a(n.value||"")}</dd>
                </div>
              `).join("")}
        </dl>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${a(t.trainingTitle||"Training Routine")}</h3>
        ${lt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${a(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(n=>`<li>${a(n||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function ve(t){const e=w($.academicsHeading),r=w($.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${a(t.heading||"Academics")}</h2>
          <p>${a(t.subheading||"")}</p>
        `:T("Academics section coming soon.")),r){if(!t){r.innerHTML=T("Academic details coming soon.");return}const n=t.transcriptLabel||"Transcript",i=t.transcriptUrl?`<a class="btn subtle" href="${E(t.transcriptUrl)}" target="_blank" rel="noopener">${a(n)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${a(n)}</span>`;r.innerHTML=`
      <article class="academics-card" data-motion="delay-1">
        <h3>${a(t.schoolCardTitle||"School")}</h3>
        <ul>
          ${t.gpa?`<li><strong>GPA:</strong> ${a(t.gpa)}</li>`:""}
          ${t.honors?`<li><strong>Honors:</strong> ${a(t.honors)}</li>`:""}
          ${t.apCourses?`<li><strong>AP / IB:</strong> ${a(t.apCourses)}</li>`:""}
        </ul>
        ${i}
      </article>
      <article class="academics-card" data-motion="delay-2">
        <h3>${a(t.interestsTitle||"Academic Interests")}</h3>
        ${lt(t.interestsBody)}
      </article>
    `}}function $e(){const t=J.meta,e=J.items||[],r=w($.highlightsHeading),n=w($.highlightsTimeline),i=w($.highlightsActions);if(r&&(r.innerHTML=t?`
          <h2>${a(t.heading||"Highlights")}</h2>
          <p>${a(t.subheading||"")}</p>
        `:T("Highlights coming soon.")),!n)return;const o=(t==null?void 0:t.maxItems)||5,s=e.slice(0,o);if(!s.length){n.innerHTML=T("Highlight events coming soon."),i&&(i.innerHTML="");return}n.innerHTML=s.map((l,f)=>Ae(l,f)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),i&&(i.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function we(){const t=U.meta,e=U.items||[],r=w($.videosHeading),n=w($.videoGrid),i=w($.videosActions);if(r&&(r.innerHTML=t?`
          <h2>${a(t.heading||"Videos")}</h2>
          <p>${a(t.subheading||"")}</p>
        `:T("Videos coming soon.")),!n)return;const o=(t==null?void 0:t.maxItems)||3,s=e.slice(0,o);if(!s.length){n.innerHTML=T("Video highlights coming soon."),i&&(i.innerHTML="");return}n.innerHTML=s.map((l,f)=>Re(l,f)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),Ht(),i&&(i.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function ke(){const t=tt.meta,e=tt.items||[],r=w($.galleryHeading),n=w($.galleryGrid),i=w($.galleryActions);if(r){const l=(t==null?void 0:t.heading)||"Photo Gallery",f=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";r.innerHTML=`
      <h2>${a(l)}</h2>
      ${`<p>${a(f)}</p>`}
    `}if(!n)return;const o=Math.max(1,(t==null?void 0:t.maxItems)||6),s=e.slice(0,o);if(!s.length){n.innerHTML=T("Gallery photos coming soon."),i&&(i.innerHTML="");return}if(n.innerHTML=s.map((l,f)=>xe(l,f)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),Ue(n),i){const l=(t==null?void 0:t.ctaHref)||"gallery.html",f=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";i.innerHTML=`<a class="btn ghost" href="${E(l)}">${a(f)}</a>`}}function xe(t,e=0){var I,O,W;const r=((I=t==null?void 0:t.image)==null?void 0:I.url)||st,n=((O=t==null?void 0:t.image)==null?void 0:O.alt)||(t==null?void 0:t.title)||"Gallery highlight",i=nn(t),o=i||"",s=(W=t==null?void 0:t.image)!=null&&W.url?{src:r,alt:n,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,l=s?`data-photo-src="${E(s.src)}" data-photo-alt="${E(s.alt)}" data-photo-title="${E(s.title)}"`:"",f=[],c=en(t==null?void 0:t.shotDate);c&&f.push(c),i&&f.push(i),t!=null&&t.location&&f.push(t.location);const u=f.map(R=>`<span>${a(R)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),g=u?`<div class="gallery-card-meta">${u}</div>`:"",p=t!=null&&t.description?`<p class="gallery-card-description">${a(t.description)}</p>`:"",y=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${a(t.photographer)}</div>`:"",v=y?`<div class="gallery-card-footer">${y}</div>`:"",k=s?`data-photo-preview="true" ${l}`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${k?` ${k}`:""}>
        ${o?`<span class="gallery-card-badge">${a(o)}</span>`:""}
        <img src="${E(r)}" alt="${a(n)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        ${g}
        <h3>${a((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${p}
        ${Le(t==null?void 0:t.tags)}
        ${v}
      </div>
    </article>
  `}function Le(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(r=>typeof r=="string"?r.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(r=>`<span class="gallery-tag">${a(r)}</span>`).join("")}
    </div>
  `:""}function Te(t){const e=w($.dualHeading),r=w($.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${a(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${a(t.subheading||"")}</p>
        `:T("Dual-sport content coming soon.")),r){if(!t||!Array.isArray(t.cards)||!t.cards.length){r.innerHTML=T("Dual-sport cards coming soon.");return}r.innerHTML=t.cards.map((n,i)=>`
          <article class="dual-card" data-motion="delay-${i+1}">
            <h3>${a(n.title||"")}</h3>
            ${n.body?`<p>${a(n.body)}</p>`:""}
            ${Array.isArray(n.bulletPoints)&&n.bulletPoints.length?`<ul>${n.bulletPoints.map(o=>`<li>${a(o||"")}</li>`).join("")}</ul>`:""}
          </article>
        `).join("")}}function Se(t){const e=w($.contactHeading),r=w($.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${a(t.heading||"Let's Connect")}</h2>
          <p>${a(t.subheading||"")}</p>
        `:T("Contact section coming soon.")),!!r){if(!t||!Array.isArray(t.cards)||!t.cards.length){r.innerHTML=T("Contact cards coming soon.");return}r.innerHTML=t.cards.map((n,i)=>`
        <article class="contact-card" data-motion="delay-${i+1}">
          <h3>${a(n.title||"")}</h3>
          <ul>
            ${(n.entries||[]).map(o=>`<li>${Me(o)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function Me(t){var i;if(!t)return"";const e=t.label?`<strong>${a(t.label)}:</strong> `:"",r=Qe(t.value),n=(i=t.link)!=null&&i.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&r.length<=1?`${e}<a href="${E(t.link)}"${n}>${a(t.value||t.link)}</a>`:r.length?`${e}${r.map((o,s)=>{const l=s===0&&t.link?t.link:o.link;if(l){const c=l.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${E(l)}"${c}>${a(o.text)}</a>`}return a(o.text)}).join(" · ")}`:`${e}${a(t.value||"")}`}function Ae(t,e){const r=tn(t),n=t.summary?`<p>${a(t.summary)}</p>`:"",i=Array.isArray(t.days)?t.days:[],o=He(i,{variant:"compact"});return`
    <article class="timeline-card" data-motion="delay-${e+1}">
      <header>
        <h3>${a(t.title||"")}</h3>
        ${r?`<span class="timeline-date">${r}</span>`:""}
      </header>
      ${o}
      ${n}
    </article>
  `}function He(t=[],{variant:e="default",showLabels:r}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,i=typeof r=="boolean"?r:n>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",n===1?"day-stats--single":"",`day-stats--cols-${Math.min(n,3)}`].filter(Boolean).join(" ")}">
      ${t.map((s,l)=>Ie(s,l,{showLabels:i,total:n})).join("")}
    </div>
  `}const mt=120,Ee=57;function Ie(t,e,{showLabels:r,total:n}){if(!t)return"";const i=n===1,o=!i&&r?Ne(t,e,n):null,s=Pe(t);return s?`
    <div class="day-stat${i?" day-stat--single":""}">
      ${o?`<span class="day-stat-label">${a(o)}</span>`:""}
      ${s}
    </div>
  `:""}function Pe(t){const e=Ce(t);return e.length?`
    <div class="day-metrics">
      ${De(e)}
    </div>
  `:""}function De(t){return`
    <div class="day-metric-list">
      ${t.map(e=>{const r=e.secondary?`<span class="day-metric-secondary">${a(e.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${e.key}">
              <span class="day-metric-value">${a(e.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${a(e.label)}
                  ${r}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function Ce(t){if(!t)return[];const e=[],r=et(t.score),n=et(t.yardage);e.push(nt({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:Be(r)})),e.push(nt({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:Oe(n,_e(t,n))}));const i=Ye(t);return e.push(nt({key:"rank",label:"Rank",display:i.display,secondary:i.secondary,progress:i.progress})),e.filter(Boolean)}function nt({key:t,label:e,display:r,secondary:n,progress:i}){const o=r!=null&&r!==""?String(r):"—",s=n?String(n):"",l=typeof i=="number"&&!Number.isNaN(i)?i:0;return{key:t,label:e,display:o,secondary:s,progress:Math.max(0,l)}}function Ne(t,e,r){return t.label?t.label:r>1?`Day ${e+1}`:null}function et(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function _e(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function Be(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=mt-Ee;return(mt-t)/e}function Oe(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function qe(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const r=(e-t)/(e-1);return Math.max(0,Math.min(r,1))}function Ye(t){const e=et(t==null?void 0:t.rankingPosition),r=et(t==null?void 0:t.rankingOutOf),n=qe(e,r);return typeof e=="number"?{display:String(e),secondary:typeof r=="number"?`of ${r}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function Re(t,e){const r=Ke(t),n=t.thumbnailUrl||(r?`https://img.youtube.com/vi/${r}/hqdefault.jpg`:st),i=t.thumbnailAlt||t.title||"Video highlight",o=t.ctaLabel||"Play",s=t.title||"Video highlight",f=!!r?"":' disabled aria-disabled="true"';return`
    <article class="video-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${a(r)}" data-video-title="${a(s)}">
        <img src="${E(n)}" alt="${a(i)}" loading="lazy" />
        <button class="play-button" type="button"${f} aria-label="Play ${a(s)}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${a(o)}</span>
        </button>
      </div>
      <h3>${a(t.title||"")}</h3>
      <p>${a(t.description||"")}</p>
    </article>
  `}function Ht(){document.querySelectorAll(".video-frame").forEach(t=>{if(t.dataset.playerReady==="true")return;const e=t.querySelector(".play-button"),r=t.dataset.videoId,n=t.dataset.videoTitle||"Samuel Masco golf video highlight";!e||!r||(e.addEventListener("click",()=>{Xe(r,n)}),t.dataset.playerReady="true")})}let Y=null;function Ge(){if(Y)return Y;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&ht()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&ht()}),document.body.appendChild(t),Y=t,t}function Xe(t,e){const r=Ge(),n=r.querySelector(".video-overlay-frame");if(!n)return;n.innerHTML="";const i=document.createElement("iframe");i.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),i.setAttribute("title",e),i.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),i.setAttribute("allowfullscreen",""),i.loading="lazy",n.appendChild(i),r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function ht(){if(!Y)return;const t=Y.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),Y.classList.remove("is-open"),Y.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let B=null;function Ue(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(r=>{r.dataset.photoPreviewReady!=="true"&&(r.addEventListener("click",()=>{We(r.getAttribute("data-photo-src"),r.getAttribute("data-photo-alt"),r.getAttribute("data-photo-title"))}),r.dataset.photoPreviewReady="true")})}function je(){if(B)return B;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="photo-overlay-backdrop" data-photo-overlay-close></div>
    <div class="photo-overlay-dialog" role="dialog" aria-modal="true">
      <button class="photo-overlay-close" type="button" data-photo-overlay-close>
        <span class="sr-only">Close photo</span>
        ×
      </button>
      <figure class="photo-overlay-frame">
        <img src="" alt="" loading="lazy" />
        <figcaption></figcaption>
      </figure>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&pt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&pt()}),document.body.appendChild(t),B=t,t}function We(t,e,r){if(!t)return;const n=je(),i=n.querySelector("img"),o=n.querySelector("figcaption");!i||!o||(i.src=t,i.alt=e||r||"Gallery photo",o.textContent=r||e||"",n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function pt(){if(!B)return;const t=B.querySelector("img"),e=B.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),B.classList.remove("is-open"),B.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function lt(t){return!Array.isArray(t)||!t.length?"":de(t)}function w(t){return t?document.querySelector(t):null}function T(t){return`<p class="placeholder-text">${a(t)}</p>`}function rt(t){document.body.dataset.contentLoading=String(t)}function Ve(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${a(t)}</div>`)}function gt(t,e,r,n){const i=(t==null?void 0:t.label)||r,o=(t==null?void 0:t.href)||n;if(!i||!o)return"";const l=o.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${E(o)}"${l}>${a(i)}</a>`}function ze(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const r=e.getAttribute("href")||"";Et(r)&&t.preventDefault()})}function Et(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function Fe(t,e,{month:r="short"}={}){if(!t)return"";const n=new Date(t);if(Number.isNaN(n.getTime()))return a(t);if(!e)return n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const i=new Date(e);if(Number.isNaN(i.getTime()))return`${n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${a(e)}`;const o=n.getFullYear()===i.getFullYear(),s=o&&n.getMonth()===i.getMonth();if(o&&s)return`${n.toLocaleDateString("en-US",{month:r})} ${n.getDate()}–${i.getDate()}, ${n.getFullYear()}`;if(o){const c=n.toLocaleDateString("en-US",{month:r,day:"numeric"}),u=i.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${c} – ${u}, ${n.getFullYear()}`}const l=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),f=i.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${l} – ${f}`}function Ke(t){return t?yt(t.youtubeId)||yt(t.youtubeUrl):""}function yt(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(Z.test(e))return e;let r;try{r=new URL(e)}catch{try{r=new URL(`https://${e}`)}catch{return""}}const n=r.hostname.replace(/^www\./,"").toLowerCase();if(n==="youtu.be"){const i=r.pathname.split("/").filter(Boolean)[0];return i&&Z.test(i)?i:""}if(n==="youtube.com"||n.endsWith(".youtube.com")){const i=r.searchParams.get("v");if(i&&Z.test(i))return i;const o=r.pathname.split("/").filter(Boolean);if(o.length>=2&&(o[0]==="embed"||o[0]==="shorts")){const s=o[1];return s&&Z.test(s)?s:""}}return""}function a(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function E(t){return a(t)}function Ze(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(r=>r.charAt(0).toUpperCase()).join(""):""}function Qe(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(i=>i.trim()).filter(Boolean).map(i=>({text:i,link:Je(i)})):[]}function Je(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function tn(t){return t?Fe(t.eventDate,t.endDate,{month:"short"}):""}function en(t){if(!t)return"";const e=new Date(t);return Number.isNaN(e.getTime())?t:e.toLocaleDateString("en-US",{month:"short",year:"numeric"})}function nn(t){var e;return t&&(((e=t==null?void 0:t.tournament)==null?void 0:e.title)||(t==null?void 0:t.tournament))||""}function it(t,e="eventDate"){return Array.isArray(t)?[...t].sort((r,n)=>bt(n,e)-bt(r,e)):[]}function bt(t,e){if(!t)return 0;const r=t[e];if(r){const n=Date.parse(r);if(!Number.isNaN(n))return n}if(t._createdAt){const n=Date.parse(t._createdAt);if(!Number.isNaN(n))return n}return 0}function ot(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function rn(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(r=>r.classList.add("is-visible"));return}const e=new IntersectionObserver(r=>{r.forEach(n=>{n.isIntersecting&&(n.target.classList.add("is-visible"),e.unobserve(n.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(r=>e.observe(r))}function on(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const r=18,n={x:Math.min(window.innerWidth-r-24,window.innerWidth*.78),y:Math.min(window.innerHeight-r-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let i=performance.now(),o=!1,s=!0;const l=document.querySelector(".site-header"),f=document.querySelector(".hero"),c={x:0,y:0,active:!1},g=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(d=>Array.from(document.querySelectorAll(d))).filter(d=>d!==null&&d.isConnected),p=document.querySelector(".hero-scroll"),y=p?p.querySelector("span"):null,v={x:.5,y:-32},k={x:0,y:10},I=-80;function O(){e.style.transform=`translate3d(${n.x-r}px, ${n.y-r}px, 0)`,e.classList.toggle("is-moving",o),e.style.setProperty("--texture-offset-x",`${n.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${n.textureOffsetY}px`)}function W(){var H;const d=document.querySelector(".hero-copy h1");if(!d)return null;const m="masco",b=(d.textContent||"").toLowerCase().lastIndexOf(m);if(b===-1)return null;const L=b+m.length-1,M=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);let S=0,A=M.nextNode();for(;A;){const q=A.textContent||"",D=q.length;if(L<S+D){const C=L-S;if(C<0||C>=D)return null;const G=q.charAt(C);if(!G||!G.trim())return null;const P=document.createRange();P.setStart(A,C),P.setEnd(A,Math.min(C+1,D));const N=P.getBoundingClientRect();return(H=P.detach)==null||H.call(P),!N||!N.width&&!N.height?null:{left:N.left+window.scrollX,right:N.right+window.scrollX,top:N.top+window.scrollY,bottom:N.bottom+window.scrollY,width:N.width,height:N.height}}S+=D,A=M.nextNode()}return null}function R(d){const m=d.top+r+I,h=r+4;return Math.max(m,h)}function It(){if(!f)return!0;const d=window.getComputedStyle(f),m=parseFloat(d.getPropertyValue("column-gap")||d.getPropertyValue("gap"))||0,h=f.clientWidth;if(!h)return!1;const b=280*3+m*2;return h>=b-.5}function Pt(){const d=W();if(!d)return!1;const m=F(),h=d.left+d.width/3+v.x,x=d.top+d.height/30+v.y,b=m.left+r+12,L=m.right-r-12,M=R(m),S=m.bottom-r-12;return n.x=_(h,b,L),n.y=_(x,M,S),n.vx=0,n.vy=0,O(),!0}function Dt(){if(!p)return!1;const d=$t(y||p),m=F(),h=d.left+d.width/2+k.x,x=d.bottom+r+k.y,b=m.left+r+12,L=m.right-r-12,M=R(m),S=m.bottom-r-12;return n.x=_(h,b,L),n.y=_(x,M,S),n.vx=0,n.vy=0,O(),!0}function V(){Pt()||Dt()||O()}function z(d={}){const{force:m=!1}=d,h=It();if(!m&&h===s)return;const x=s;s=h,e.style.display=h?"":"none",h&&(!x||m)&&V()}V(),z({force:!0}),window.addEventListener("load",()=>{V(),z({force:!0})},{once:!0}),requestAnimationFrame(()=>{V(),z({force:!0})});function Ct(d,m){if(!c.active)return;const h=n.x-c.x,x=n.y-c.y,b=Math.hypot(h,x),L=r+10;if(b>L)return;const M=.42;n.vx+=d*M,n.vy+=m*M;const S=34,A=Math.hypot(n.vx,n.vy);if(A>S){const H=S/A;n.vx*=H,n.vy*=H}if(b<r){const H=r-b,q=h/(b||1),D=x/(b||1);n.x+=q*(H+.5),n.y+=D*(H+.5)}}function Nt(){const m=F(),h=m.left+r+8,x=m.right-r-8,b=R(m),L=m.bottom-r-8;n.x<h?(n.x=h,n.vx=Math.abs(n.vx)*.78):n.x>x&&(n.x=x,n.vx=-Math.abs(n.vx)*.78),n.y<b?(n.y=b,n.vy=Math.abs(n.vy)*.78):n.y>L&&(n.y=L,n.vy=-Math.abs(n.vy)*.78)}function _t(){for(const m of g){if(!m.isConnected)continue;const h=m.getBoundingClientRect(),x=window.scrollX,b=window.scrollY,L={left:h.left+x,right:h.right+x,top:h.top+b,bottom:h.bottom+b};if(h.width===0||h.height===0||h.right<-40||h.left>window.innerWidth+40||h.bottom<-40||h.top>window.innerHeight+40)continue;const M=_(n.x,L.left,L.right),S=_(n.y,L.top,L.bottom),A=n.x-M,H=n.y-S,q=A*A+H*H;if(q>=r*r||A===0&&H===0)continue;const D=Math.sqrt(q)||1e-4,C=A/D,G=H/D;n.x=M+C*(r+.5),n.y=S+G*(r+.5);const P=n.vx*C+n.vy*G;P>0||(n.vx-=(1+.72)*P*C,n.vy-=(1+.72)*P*G)}}function F(){return l?$t(l):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function ct(){const d=performance.now(),m=Math.min((d-i)/16.666,3);i=d,n.x+=n.vx*m,n.y+=n.vy*m,n.vx*=Math.pow(.985,m),n.vy*=Math.pow(.985,m),Math.abs(n.vx)<.02&&(n.vx=0),Math.abs(n.vy)<.02&&(n.vy=0),Nt(),_t(),o=Math.hypot(n.vx,n.vy)>.35,o&&(n.textureOffsetX=vt(n.textureOffsetX+n.vx*m*.32,12),n.textureOffsetY=vt(n.textureOffsetY+n.vy*m*.32,12)),O(),requestAnimationFrame(ct)}window.addEventListener("pointermove",d=>{if(d.pointerType&&d.pointerType!=="mouse"&&d.pointerType!=="pen")return;const m=c.x,h=c.y,x=c.active,b=d.clientX+window.scrollX,L=d.clientY+window.scrollY;c.x=b,c.y=L,c.active=!0;const M=x?b-m:0,S=x?L-h:0;x&&Ct(M,S)},{passive:!0}),window.addEventListener("pointerleave",()=>{c.active=!1}),window.addEventListener("pointerout",d=>{d.relatedTarget||(c.active=!1)}),window.addEventListener("blur",()=>{c.active=!1}),window.addEventListener("scroll",()=>{c.active=!1}),window.addEventListener("resize",()=>{const d=F();n.x=_(n.x,d.left+r+8,d.right-r-8),n.y=_(n.y,R(d),d.bottom-r-8),z()}),requestAnimationFrame(ct)}function _(t,e,r){return Math.min(Math.max(t,e),r)}function vt(t,e){const r=t%e;return r<0?r+e:r}function $t(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
