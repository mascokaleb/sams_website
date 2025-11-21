import{f as Le}from"./sanityClient-CrohJ30J.js";function st(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function qt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function Yt(t){return qt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function jt(t){return t._type==="@list"}function Rt(t){return t._type==="@span"}function Xt(t){return t._type==="@text"}const At=["strong","em","code","underline","strike-through"];function Te(t,e,n){if(!st(t)||!t.marks)return[];if(!t.marks.length)return[];const i=t.marks.slice(),r={};return i.forEach(a=>{r[a]=1;for(let l=e+1;l<n.length;l++){const s=n[l];if(s&&st(s)&&Array.isArray(s.marks)&&s.marks.indexOf(a)!==-1)r[a]++;else break}}),i.sort((a,l)=>Se(r,a,l))}function Se(t,e,n){const i=t[e],r=t[n];if(i!==r)return r-i;const a=At.indexOf(e),l=At.indexOf(n);return a!==l?a-l:e.localeCompare(n)}function Ae(t){var l;const{children:e}=t,n=t.markDefs??[];if(!e||!e.length)return[];const i=e.map(Te),r={_type:"@span",children:[],markType:"<unknown>"};let a=[r];for(let s=0;s<e.length;s++){const f=e[s];if(!f)continue;const c=i[s]||[];let u=1;if(a.length>1)for(u;u<a.length;u++){const y=((l=a[u])==null?void 0:l.markKey)||"",g=c.indexOf(y);if(g===-1)break;c.splice(g,1)}a=a.slice(0,u);let p=a[a.length-1];if(p){for(const y of c){const g=n==null?void 0:n.find(D=>D._key===y),$=g?g._type:y,x={_type:"@span",_key:f._key,children:[],markDef:g,markType:$,markKey:y};p.children.push(x),a.push(x),p=x}if(st(f)){const y=f.text.split(`
`);for(let g=y.length;g-- >1;)y.splice(g,0,`
`);p.children=p.children.concat(y.map(g=>({_type:"@text",text:g})))}else p.children=p.children.concat(f)}}return r.children}function Me(t,e){const n=[];let i;for(let r=0;r<t.length;r++){const a=t[r];if(a){if(!Yt(a)){n.push(a),i=void 0;continue}if(!i){i=at(a,r,e),n.push(i);continue}if(He(a,i)){i.children.push(a);continue}if((a.level||1)>i.level){const l=at(a,r,e);{const s=i.children[i.children.length-1],f={...s,children:[...s.children,l]};i.children[i.children.length-1]=f}i=l;continue}if((a.level||1)<i.level){const l=n[n.length-1],s=l&&pt(l,a);if(s){i=s,i.children.push(a);continue}i=at(a,r,e),n.push(i);continue}if(a.listItem!==i.listItem){const l=n[n.length-1],s=l&&pt(l,{level:a.level||1});if(s&&s.listItem===a.listItem){i=s,i.children.push(a);continue}else{i=at(a,r,e),n.push(i);continue}}console.warn("Unknown state encountered for block",a),n.push(a)}}return n}function He(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function at(t,e,n){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:n,level:t.level||1,listItem:t.listItem,children:[t]}}function pt(t,e){const n=e.level||1,i=e.listItem||"normal",r=typeof e.listItem=="string";if(jt(t)&&(t.level||1)===n&&r&&(t.listItem||"normal")===i)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!st(a)?pt(a,e):void 0}function Vt(t){let e="";return t.children.forEach(n=>{Xt(n)?e+=n.text:Rt(n)&&(e+=Vt(n))}),e}const Ee=["http","https","mailto","tel"],Ie={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Gt(t){return Pe(t.replace(/[&<>"']/g,e=>`&${Ie[e]};`))}function Pe(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function De(t){const e=(t||"").trim(),n=e.charAt(0);if(n==="#"||n==="/")return!0;const i=e.indexOf(":");if(i===-1)return!0;const r=e.slice(0,i).toLowerCase();if(Ee.indexOf(r)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&i>a)return!0;const l=e.indexOf("#");return l!==-1&&i>l}const Ce={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},Oe=({children:t})=>`<li>${t}</li>`,Be=({children:t,value:e})=>{const n=(e==null?void 0:e.href)||"";return De(n)?`<a href="${Gt(n)}">${t}</a>`:t},Ne={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Be},J=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,Ut=t=>J(`block type "${t}"`,"types"),_e=t=>J(`mark type "${t}"`,"marks"),qe=t=>J(`block style "${t}"`,"block"),Ye=t=>J(`list style "${t}"`,"list"),je=t=>J(`list item style "${t}"`,"listItem");function Re(t){console.warn(t)}const Xe=({value:t,isInline:e})=>{const n=Ut(t._type);return e?`<span style="display:none">${n}</span>`:`<div style="display:none">${n}</div>`},Ve=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,Ge=({children:t})=>`<p>${t}</p>`,Ue=({children:t})=>`<ul>${t}</ul>`,We=({children:t})=>`<li>${t}</li>`,ze=()=>"<br/>",Fe={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},Mt={types:{},block:Fe,marks:Ne,list:Ce,listItem:Oe,hardBreak:ze,escapeHTML:Gt,unknownType:Xe,unknownMark:Ve,unknownList:Ue,unknownListItem:We,unknownBlockStyle:Ge};function Ke(t,e){const{block:n,list:i,listItem:r,marks:a,types:l,...s}=e;return{...t,block:Z(t,e,"block"),list:Z(t,e,"list"),listItem:Z(t,e,"listItem"),marks:Z(t,e,"marks"),types:Z(t,e,"types"),...s}}function Z(t,e,n){const i=e[n],r=t[n];return typeof i=="function"||i&&typeof r=="function"?i:i?{...r,...i}:r}function Ze(t,e={}){const{components:n,onMissingComponent:i=Re}=e,r=i||Je,a=Array.isArray(t)?t:[t],l=Me(a,"html"),s=n?Ke(Mt,n):Mt,f=Qe(s,r);return l.map((c,u)=>f({node:c,index:u,isInline:!1,renderNode:f})).join("")}const Qe=(t,e)=>{function n(c){const{node:u,index:p,isInline:y}=c;return jt(u)?r(u,p):Yt(u)?i(u,p):Rt(u)?a(u):qt(u)?l(u,p,y):Xt(u)?s(u):f(u,p,y)}function i(c,u){const p=Ht({node:c,index:u,isInline:!1,renderNode:n}),y=t.listItem,g=(typeof y=="function"?y:y[c.listItem])||t.unknownListItem;if(g===t.unknownListItem){const x=c.listItem||"bullet";e(je(x),{type:x,nodeType:"listItemStyle"})}let $=p.children;if(c.style&&c.style!=="normal"){const{listItem:x,...D}=c;$=n({node:D,index:u,isInline:!1})}return g({value:c,index:u,isInline:!1,renderNode:n,children:$})}function r(c,u){const p=c.children.map(($,x)=>n({node:$._key?$:{...$,_key:`li-${u}-${x}`},index:x,isInline:!1})),y=t.list,g=(typeof y=="function"?y:y[c.listItem])||t.unknownList;if(g===t.unknownList){const $=c.listItem||"bullet";e(Ye($),{nodeType:"listStyle",type:$})}return g({value:c,index:u,isInline:!1,renderNode:n,children:p.join("")})}function a(c){const{markDef:u,markType:p,markKey:y}=c,g=t.marks[p]||t.unknownMark,$=c.children.map((x,D)=>n({node:x,index:D,isInline:!0}));return g===t.unknownMark&&e(_e(p),{nodeType:"mark",type:p}),g({text:Vt(c),value:u,markType:p,markKey:y,renderNode:n,children:$.join("")})}function l(c,u,p){const{_key:y,...g}=Ht({node:c,index:u,isInline:p,renderNode:n}),$=g.node.style||"normal",x=(typeof t.block=="function"?t.block:t.block[$])||t.unknownBlockStyle;return x===t.unknownBlockStyle&&e(qe($),{nodeType:"blockStyle",type:$}),x({...g,value:g.node,renderNode:n})}function s(c){if(c.text===`
`){const u=t.hardBreak;return u?u():`
`}return t.escapeHTML(c.text)}function f(c,u,p){const y=t.types[c._type];return y||e(Ut(c._type),{nodeType:"block",type:c._type}),(y||t.unknownType)({value:c,isInline:p,index:u,renderNode:n})}return n};function Ht(t){const{node:e,index:n,isInline:i,renderNode:r}=t,a=Ae(e).map((l,s)=>r({node:l,isInline:!0,index:s,renderNode:r}));return{_key:e._key||`block-${n}`,children:a.join(""),index:n,isInline:i,node:e}}function Je(){}const dt="images/samuel-placeholder.svg",Wt=dt,ot=/^[a-zA-Z0-9_-]{11}$/,L={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},I={meta:null,allItems:[],items:[],videos:[],photos:[]},Q={meta:null,items:[],totalCount:0},lt={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{tn(),Gn();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await en(),window.location.hash&&setTimeout(()=>ne(window.location.hash),100),Zn(t),t||Qn()});function tn(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const n=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",n),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function en(){mt(!0);const t=await Le();if(!t)return Vn("Unable to load the latest content. Please try again shortly."),mt(!1),null;nn(t.site),rn(t.hero,t.site),an(t.about),on(t.resume),sn(t.academics);const e=gt(t.highlightEvents||[]);I.meta=t.highlightsSection,I.allItems=e,I.items=e.filter(yt),ln();const n=gt(t.videos||[],"eventDate");I.videos=n,Q.meta=t.videosSection,Q.items=n.filter(yt),Q.totalCount=n.length,cn();const i=gt(t.galleryPhotos||[],"shotDate");return I.photos=i,lt.meta=t.gallerySection,lt.items=i.filter(yt),dn(),fn(t.dualSport),hn(t.contact),mt(!1),xt(),t}function nn(t){var i;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const n=document.querySelector(".brand-mark");if(n)if((i=t.brandMarkImage)!=null&&i.url)n.innerHTML=`<span class="brand-mark-image"><img src="${w(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,n.classList.add("has-image");else{const r=t.brandMarkInitials||Un(t.siteTitle)||n.textContent||"SM";n.textContent=r,n.classList.remove("has-image")}}function rn(t,e){var a,l;const n=T(L.heroCopy),i=T(L.heroPhoto),r=T(L.heroMetrics);if(!t){n&&(n.innerHTML=H("Hero content coming soon."));return}if(n){const s=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",f=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",c=t.bio?`<p>${o(t.bio)}</p>`:"",u=[Ct(t.primaryCta,"primary","View Highlights","#highlights"),Ct(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");n.innerHTML=`
      ${s}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${f}
      </h1>
      ${c}
      <div class="hero-actions">
        ${u||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(i){const s=((a=t.headshot)==null?void 0:a.url)||dt,f=((l=t.headshot)==null?void 0:l.alt)||"Portrait of Samuel Masco",c=t.photoCaption||"Focused on the next shot.";i.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${s}" alt="${o(f)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${o(c)}</figcaption>
    `}r&&(Array.isArray(t.metrics)&&t.metrics.length?r.innerHTML=t.metrics.map(s=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${o(s.label||"")}</span>
              <span class="metric-value">${o(s.value||"")}</span>
            </div>
          `).join(""):r.innerHTML=H("Metrics coming soon."))}function an(t){const e=T(L.aboutHeading),n=T(L.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"About")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("About section coming soon.")),n){if(!t){n.innerHTML=H("About details coming soon.");return}n.innerHTML=`
      <article class="about-card" data-motion="delay-1">
        <h3>${o(t.profileCardTitle||"Profile")}</h3>
        <ul>
          ${(t.profileFacts||[]).map(i=>`
                <li><strong>${o(i.label||"")}: </strong>${o(i.value||"")}</li>
              `).join("")}
        </ul>
      </article>
      <article class="about-card about-story" data-motion="delay-2">
        <h3>${o(t.mindsetTitle||"Mindset & Goals")}</h3>
        ${kt(t.mindsetBody)}
      </article>
      <article class="about-card about-highlight" data-motion="delay-3">
        <h3>${o(t.quickHitsTitle||"Quick Hits")}</h3>
        ${(t.quickHits||[]).map(i=>`
              <div class="highlight-row">
                <span>${o(i.label||"")}</span>
                <span>${o(i.value||"")}</span>
              </div>
            `).join("")}
      </article>
    `}}function on(t){const e=T(L.resumeHeading),n=T(L.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Golf Resume")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Golf resume coming soon.")),n){if(!t){n.innerHTML=H("Resume details coming soon.");return}n.innerHTML=`
      <article class="panel" data-motion="delay-1">
        <h3>${o(t.performanceTitle||"Performance Snapshot")}</h3>
        <dl>
          ${(t.performanceStats||[]).map(i=>`
                <div>
                  <dt>${o(i.label||"")}</dt>
                  <dd>${o(i.value||"")}</dd>
                </div>
              `).join("")}
        </dl>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${o(t.trainingTitle||"Training Routine")}</h3>
        ${kt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(i=>`<li>${o(i||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function sn(t){const e=T(L.academicsHeading),n=T(L.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Academics")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Academics section coming soon.")),n){if(!t){n.innerHTML=H("Academic details coming soon.");return}const i=t.transcriptLabel||"Transcript",r=t.transcriptUrl?`<a class="btn subtle" href="${w(t.transcriptUrl)}" target="_blank" rel="noopener">${o(i)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${o(i)}</span>`;n.innerHTML=`
      <article class="academics-card" data-motion="delay-1">
        <h3>${o(t.schoolCardTitle||"School")}</h3>
        <ul>
          ${t.gpa?`<li><strong>GPA:</strong> ${o(t.gpa)}</li>`:""}
          ${t.honors?`<li><strong>Honors:</strong> ${o(t.honors)}</li>`:""}
          ${t.apCourses?`<li><strong>AP / IB:</strong> ${o(t.apCourses)}</li>`:""}
        </ul>
        ${r}
      </article>
      <article class="academics-card" data-motion="delay-2">
        <h3>${o(t.interestsTitle||"Academic Interests")}</h3>
        ${kt(t.interestsBody)}
      </article>
    `}}function ln(){const t=I.meta,e=I.items||[],n=T(L.highlightsHeading),i=T(L.highlightsTimeline),r=T(L.highlightsActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Highlights coming soon.")),!i)return;const a=(t==null?void 0:t.maxItems)||5,l=e.slice(0,a);if(!l.length){i.innerHTML=H("Highlight events coming soon."),r&&(r.innerHTML="");return}i.innerHTML=l.map((s,f)=>gn(s,f)).join(""),i.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),$t(i),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function cn(){const t=Q.meta,e=Q.items||[],n=T(L.videosHeading),i=T(L.videoGrid),r=T(L.videosActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Videos coming soon.")),!i)return;const a=(t==null?void 0:t.maxItems)||3,l=e.slice(0,a);if(!l.length){i.innerHTML=H("Video highlights coming soon."),r&&(r.innerHTML="");return}i.innerHTML=l.map((s,f)=>qn(s,f)).join(""),i.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),xt(),$t(i),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function dn(){const t=lt.meta,e=lt.items||[],n=T(L.galleryHeading),i=T(L.galleryGrid),r=T(L.galleryActions);if(n){const s=(t==null?void 0:t.heading)||"Photo Gallery",f=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";n.innerHTML=`
      <h2>${o(s)}</h2>
      ${`<p>${o(f)}</p>`}
    `}if(!i)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),l=e.slice(0,a);if(!l.length){i.innerHTML=H("Gallery photos coming soon."),r&&(r.innerHTML="");return}if(i.innerHTML=l.map((s,f)=>un(s,f)).join(""),i.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),ee(i),$t(i),r){const s="gallery.html",f=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";r.innerHTML=`<a class="btn ghost" href="${w(s)}">${o(f)}</a>`}}function un(t,e=0){var W,C,X,A;const n=((W=t==null?void 0:t.image)==null?void 0:W.url)||dt,i=((C=t==null?void 0:t.image)==null?void 0:C.alt)||(t==null?void 0:t.title)||"Gallery highlight",r=Qt(t,{variant:"card"}),a=ae(t==null?void 0:t.shotDate),l=a?wt(a):"",s=(X=t==null?void 0:t.image)!=null&&X.url?{src:n,alt:i,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,f=s?`data-photo-src="${w(s.src)}" data-photo-alt="${w(s.alt)}" data-photo-title="${w(s.title)}"`:"",c=[];t!=null&&t.location&&c.push(t.location);const u=c.map(ft=>`<span>${o(ft)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),p=u?`<div class="gallery-card-meta">${u}</div>`:"",y=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",g=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",$=g?`<div class="gallery-card-footer">${g}</div>`:"",x=s?`data-photo-preview="true" ${f}`:"",D=ut((A=t==null?void 0:t.image)==null?void 0:A.hotspot),U=D?` style="object-position: ${w(D)};"`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${x?` ${x}`:""}>
        ${l}
        <img src="${w(n)}" alt="${o(i)}" loading="lazy"${U} />
      </div>
      <div class="gallery-card-body">
        ${p}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${r?`<div class="card-chip-slot">${r}</div>`:""}
        ${y}
        ${bt(t==null?void 0:t.tags)}
        ${$}
      </div>
    </article>
  `}function bt(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(n=>typeof n=="string"?n.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(n=>`<span class="gallery-tag">${o(n)}</span>`).join("")}
    </div>
  `:""}function fn(t){const e=T(L.dualHeading),n=T(L.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Dual-sport content coming soon.")),n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=H("Dual-sport cards coming soon.");return}n.innerHTML=t.cards.map((i,r)=>`
          <article class="dual-card" data-motion="delay-${r+1}">
            <h3>${o(i.title||"")}</h3>
            ${i.body?`<p>${o(i.body)}</p>`:""}
            ${Array.isArray(i.bulletPoints)&&i.bulletPoints.length?`<ul>${i.bulletPoints.map(a=>`<li>${o(a||"")}</li>`).join("")}</ul>`:""}
          </article>
        `).join("")}}function hn(t){const e=T(L.contactHeading),n=T(L.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Contact section coming soon.")),!!n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=H("Contact cards coming soon.");return}n.innerHTML=t.cards.map((i,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${o(i.title||"")}</h3>
          <ul>
            ${(i.entries||[]).map(a=>`<li>${mn(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function mn(t){var r;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",n=Wn(t.value),i=(r=t.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&n.length<=1?`${e}<a href="${w(t.link)}"${i}>${o(t.value||t.link)}</a>`:n.length?`${e}${n.map((a,l)=>{const s=l===0&&t.link?t.link:a.link;if(s){const c=s.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${w(s)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function gn(t,e){const n=Fn(t),i=t.summary?`<p>${o(t.summary)}</p>`:"",r=Array.isArray(t.days)?t.days:[],a=zt(r,{variant:"compact"}),l=`home-highlight-${e}`,s=(t==null?void 0:t._id)||(t==null?void 0:t.title)||l,c=`<div class="highlight-row-actions">${`
    <button class="highlight-toggle" type="button" data-highlight-modal="${w(s)}">
      View Details
    </button>
  `}</div>`;return`
    <article class="timeline-card" data-motion="delay-${e+1}">
      <header>
        <div class="highlight-row">
          <h3>${o(t.title||"")}</h3>
          ${c}
        </div>
        ${n?`<span class="timeline-date">${n}</span>`:""}
      </header>
      ${a}
      ${i}
    </article>
  `}function zt(t=[],{variant:e="default",showLabels:n}={}){if(!Array.isArray(t)||!t.length)return"";const i=t.length,r=typeof n=="boolean"?n:i>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",i===1?"day-stats--single":"",`day-stats--cols-${Math.min(i,3)}`].filter(Boolean).join(" ")}">
      ${t.map((l,s)=>pn(l,s,{showLabels:r,total:i})).join("")}
    </div>
  `}const Et=120,yn=57;function pn(t,e,{showLabels:n,total:i}){if(!t)return"";const r=i===1,a=!r&&n?te(t,e,i):null,l=bn(t);return l?`
    <div class="day-stat${r?" day-stat--single":""}">
      ${a?`<span class="day-stat-label">${o(a)}</span>`:""}
      ${l}
    </div>
  `:""}function bn(t){const e=Dn(t);return e.length?`
    <div class="day-metrics">
      ${vn(e)}
    </div>
  `:""}function vn(t){return`
    <div class="day-metric-list">
      ${t.map(e=>{const n=e.secondary?`<span class="day-metric-secondary">${o(e.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${e.key}">
              <span class="day-metric-value">${o(e.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${o(e.label)}
                  ${n}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function $n(t=[]){if(!Array.isArray(t))return"";const e=t.map((n,i)=>{if(!(n!=null&&n.notes))return"";const r=te(n,i,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(r)}</strong>
          <p>${o(n.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function $t(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const i=e.getAttribute("data-highlight-modal");xn(i)}))})}let V=null;function wn(){if(V)return V;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&It()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&It()}),document.body.appendChild(t),V=t,t}function xn(t){const e=wn(),n=e.querySelector("[data-highlight-overlay-body]");if(!n)return;const i=Ft(t);if(!i)return;const r=Mn(i),a=Hn(i);n.innerHTML=kn(i,r,a),xt(n),ee(n),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function It(){if(!V)return;const t=V.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),V.classList.remove("is-open"),V.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Ft(t){const e=[];if(Array.isArray(I.items)&&e.push(I.items),Array.isArray(I.allItems)&&e.push(I.allItems),!t)return e[0]&&e[0][0]||e[1]&&e[1][0]||null;for(const n of e){const i=n.find(a=>((a==null?void 0:a._id)||"")===t);if(i)return i;const r=n.find(a=>(a==null?void 0:a.title)===t);if(r)return r}return null}function kn(t,e,n){const r=[Pn(t),t.location?o(t.location):null].filter(Boolean),a=r.length?`<div class="highlight-overlay-meta">
        ${r.map(f=>`<span>${f}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",l=zt(t.days||[],{variant:"list"}),s=$n(t.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${o(t.title||"Tournament highlight")}</h2>
        ${a}
        ${t.summary?`<p class="highlight-overlay-summary">${o(t.summary)}</p>`:""}
      </header>
      ${l?`<section class="highlight-overlay-section">${l}</section>`:""}
      ${s?`<section class="highlight-overlay-section">${s}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${Ln(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Sn(n)}
      </section>
    </div>
  `}function Ln(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(Tn).join("")}
    </div>
  `}function Tn(t){const e=re(t),n=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:Wt),i=t.thumbnailAlt||t.title||"Video highlight",r=t.title||"Video highlight",l=!!e?"":' disabled aria-disabled="true"',s=Jt(t.eventDate),f=s?wt(s):"",c=vt?vt(t):"",u=ut(t.thumbnailHotspot),p=u?` style="object-position: ${w(u)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${o(e)}" data-video-title="${o(r)}">
        ${f}
        <img src="${w(n)}" alt="${o(i)}" loading="lazy"${p} />
        <button class="play-button" type="button"${l} aria-label="Play ${o(r)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${o(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${o(t.description)}</p>`:""}
        ${c}
      </div>
    </article>
  `}function Sn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(An).join("")}
    </div>
  `}function An(t){var u,p,y,g;const e=((u=t==null?void 0:t.image)==null?void 0:u.url)||Wt,n=((p=t==null?void 0:t.image)==null?void 0:p.alt)||(t==null?void 0:t.title)||"Gallery photo",i=ae(t==null?void 0:t.shotDate),r=i?Kn(i):"",a=(y=t==null?void 0:t.image)!=null&&y.url?{src:e,alt:n,title:(t==null?void 0:t.title)||"Gallery photo"}:null,l=a?`data-photo-preview="true" data-photo-src="${w(a.src)}" data-photo-alt="${w(a.alt)}" data-photo-title="${w(a.title)}"`:"",s=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",f=ut((g=t==null?void 0:t.image)==null?void 0:g.hotspot),c=f?` style="object-position: ${w(f)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${l?` ${l}`:""}>
        ${r}
        <img src="${w(e)}" alt="${o(n)}" loading="lazy"${c} />
      </div>
      <div class="gallery-card-body">
        <h4>${o((t==null?void 0:t.title)||"Gallery photo")}</h4>
        ${t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:""}
        ${bt?bt(t==null?void 0:t.tags):""}
        ${s?`<div class="gallery-card-footer">${s}</div>`:""}
      </div>
    </article>
  `}function Mn(t){return!t||!Array.isArray(I.videos)?[]:I.videos.filter(e=>Kt(e,t))}function Hn(t){return!t||!Array.isArray(I.photos)?[]:I.photos.filter(e=>Kt(e,t))}function Kt(t,e){const n=Zt(t);return n?!!(n.id&&(e!=null&&e._id)&&n.id===e._id||n.title&&(e!=null&&e.title)&&n.title===e.title):!1}function Zt(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function En(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function vt(t){const e=En(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(n=>`<span class="gallery-tag">${o(n)}</span>`).join("")}
    </div>
  `:""}function In(t){const e=Zt(t);if(!e||!e.title)return null;const n=e.id||e.title,i=n?Ft(n):null,r=i?i._id||i.title:null;return{label:(i==null?void 0:i.title)||e.title,targetId:r}}function Qt(t,{variant:e="inline"}={}){const n=In(t);if(!(n!=null&&n.label))return"";const i=["tournament-chip"];e==="card"&&i.push("tournament-chip--on-card"),e==="inline"&&i.push("tournament-chip--inline");const r=o(n.label),a=w(`View ${n.label} tournament details`),l=n.targetId?` data-highlight-modal="${w(n.targetId)}"`:"",s=n.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(n.targetId)}`:"tournament-highlights.html",f="a";return`
    <${f} class="${i.join(" ")}" href="${w(s)}"${l}${n.targetId?` aria-label="${a}"`:""}>
      <span class="tournament-chip-name">${r}</span>
    </${f}>
  `}function Jt(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function wt(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function Pn(t){return t?ie(t.eventDate,t.endDate,{month:"long"}):""}function Dn(t){if(!t)return[];const e=[],n=ct(t.score),i=ct(t.yardage);e.push(ht({key:"score",label:"Score",display:typeof n=="number"?String(n):"—",progress:On(n)})),e.push(ht({key:"yards",label:"Yardage",display:typeof i=="number"?i.toLocaleString():"—",secondary:"",progress:Bn(i,Cn(t,i))}));const r=_n(t);return e.push(ht({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),e.filter(Boolean)}function ht({key:t,label:e,display:n,secondary:i,progress:r}){const a=n!=null&&n!==""?String(n):"—",l=i?String(i):"",s=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:t,label:e,display:a,secondary:l,progress:Math.max(0,s)}}function te(t,e,n){return t.label?t.label:n>1?`Day ${e+1}`:null}function ct(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function Cn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function On(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=Et-yn;return(Et-t)/e}function Bn(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function Nn(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const n=(e-t)/(e-1);return Math.max(0,Math.min(n,1))}function _n(t){const e=ct(t==null?void 0:t.rankingPosition),n=ct(t==null?void 0:t.rankingOutOf),i=Nn(e,n);return typeof e=="number"?{display:String(e),secondary:typeof n=="number"?`of ${n}`:"",progress:i}:{display:"—",secondary:"",progress:0}}function qn(t,e){const n=re(t),i=t.thumbnailUrl||(n?`https://img.youtube.com/vi/${n}/hqdefault.jpg`:dt),r=t.thumbnailAlt||t.title||"Video highlight",a=t.title||"Video highlight",s=!!n?"":' disabled aria-disabled="true"',f=Qt(t,{variant:"card"}),c=Jt(t.eventDate),u=c?wt(c):"",p=vt(t),y=ut(t.thumbnailHotspot),g=y?` style="object-position: ${w(y)};"`:"";return`
    <article class="video-gallery-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(n)}" data-video-title="${o(a)}">
        ${u}
        <img src="${w(i)}" alt="${o(r)}" loading="lazy"${g} />
        <button class="play-button" type="button"${s} aria-label="Play ${o(a)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h3>${o(t.title||"")}</h3>
        ${f?`<div class="card-chip-slot">${f}</div>`:""}
        <p>${o(t.description||"")}</p>
        ${p}
      </div>
    </article>
  `}function xt(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(n=>{if(n.dataset.playerReady==="true")return;const i=n.querySelector(".play-button"),r=n.dataset.videoId,a=n.dataset.videoTitle||"Samuel Masco golf video highlight";!i||!r||(i.addEventListener("click",()=>{jn(r,a)}),n.dataset.playerReady="true")})}let G=null;function Yn(){if(G)return G;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&Pt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Pt()}),document.body.appendChild(t),G=t,t}function jn(t,e){const n=Yn(),i=n.querySelector(".video-overlay-frame");if(!i)return;i.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",e),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",i.appendChild(r),n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function Pt(){if(!G)return;const t=G.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),G.classList.remove("is-open"),G.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let R=null;function ee(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(n=>{n.dataset.photoPreviewReady!=="true"&&(n.addEventListener("click",i=>{i.target.closest(".tournament-chip")||Xn(n.getAttribute("data-photo-src"),n.getAttribute("data-photo-alt"),n.getAttribute("data-photo-title"))}),n.dataset.photoPreviewReady="true")})}function Rn(){if(R)return R;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&Dt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Dt()}),document.body.appendChild(t),R=t,t}function Xn(t,e,n){if(!t)return;const i=Rn(),r=i.querySelector("img"),a=i.querySelector("figcaption");!r||!a||(r.src=t,r.alt=e||n||"Gallery photo",a.textContent=n||e||"",i.classList.add("is-open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function Dt(){if(!R)return;const t=R.querySelector("img"),e=R.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),R.classList.remove("is-open"),R.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function kt(t){return!Array.isArray(t)||!t.length?"":Ze(t)}function T(t){return t?document.querySelector(t):null}function H(t){return`<p class="placeholder-text">${o(t)}</p>`}function mt(t){document.body.dataset.contentLoading=String(t)}function Vn(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function Ct(t,e,n,i){const r=(t==null?void 0:t.label)||n,a=(t==null?void 0:t.href)||i;if(!r||!a)return"";const s=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${w(a)}"${s}>${o(r)}</a>`}function Gn(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const n=e.getAttribute("href")||"";ne(n)&&t.preventDefault()})}function ne(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function ie(t,e,{month:n="short"}={}){if(!t)return"";const i=new Date(t);if(Number.isNaN(i.getTime()))return o(t);if(!e)return i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});const r=new Date(e);if(Number.isNaN(r.getTime()))return`${i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=i.getFullYear()===r.getFullYear(),l=a&&i.getMonth()===r.getMonth();if(a&&l)return`${i.toLocaleDateString("en-US",{month:n})} ${i.getDate()}–${r.getDate()}, ${i.getFullYear()}`;if(a){const c=i.toLocaleDateString("en-US",{month:n,day:"numeric"}),u=r.toLocaleDateString("en-US",{month:n,day:"numeric"});return`${c} – ${u}, ${i.getFullYear()}`}const s=i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"}),f=r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});return`${s} – ${f}`}function re(t){return t?Ot(t.youtubeId)||Ot(t.youtubeUrl):""}function Ot(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(ot.test(e))return e;let n;try{n=new URL(e)}catch{try{n=new URL(`https://${e}`)}catch{return""}}const i=n.hostname.replace(/^www\./,"").toLowerCase();if(i==="youtu.be"){const r=n.pathname.split("/").filter(Boolean)[0];return r&&ot.test(r)?r:""}if(i==="youtube.com"||i.endsWith(".youtube.com")){const r=n.searchParams.get("v");if(r&&ot.test(r))return r;const a=n.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const l=a[1];return l&&ot.test(l)?l:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function w(t){return o(t)}function ut(t){if(!t||typeof t.x!="number"||typeof t.y!="number")return"";const e=r=>Math.max(0,Math.min(1,r)),n=Math.round(e(t.x)*1e3)/10,i=Math.round(e(t.y)*1e3)/10;return`${n}% ${i}%`}function Un(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(n=>n.charAt(0).toUpperCase()).join(""):""}function Wn(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:zn(r)})):[]}function zn(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function Fn(t){return t?ie(t.eventDate,t.endDate,{month:"short"}):""}function ae(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function Kn(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function gt(t,e="eventDate"){return Array.isArray(t)?[...t].sort((n,i)=>Bt(i,e)-Bt(n,e)):[]}function Bt(t,e){if(!t)return 0;const n=t[e];if(n){const i=Date.parse(n);if(!Number.isNaN(i))return i}if(t._createdAt){const i=Date.parse(t._createdAt);if(!Number.isNaN(i))return i}return 0}function yt(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function Zn(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(n=>n.classList.add("is-visible"));return}const e=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-visible"),e.unobserve(i.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(n=>e.observe(n))}function Qn(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const n=18,i={x:Math.min(window.innerWidth-n-24,window.innerWidth*.78),y:Math.min(window.innerHeight-n-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let r=performance.now(),a=!1,l=!0,s=null,f=!1,c=!1,u=null,p=null,y=0,g=!1,$=!1,x=null;const D=document.querySelector(".site-header"),U=document.querySelector(".hero"),W=document.querySelector("[data-golf-hole]"),C=document.querySelector("[data-golf-scoreboard]"),X=C?C.querySelector("[data-golf-score-value]"):null,A={x:0,y:0,active:!1},ft=n+16,oe=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(d=>Array.from(document.querySelectorAll(d))).filter(d=>d!==null&&d.isConnected),tt=document.querySelector(".hero-scroll"),se=tt?tt.querySelector("span"):null,Lt={x:.5,y:-32},Tt={x:0,y:10},le=-80;function z(){e.style.transform=`translate3d(${i.x-n}px, ${i.y-n}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${i.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${i.textureOffsetY}px`)}function ce(){var O;const d=document.querySelector(".hero-copy h1");if(!d)return null;const h="masco",b=(d.textContent||"").toLowerCase().lastIndexOf(h);if(b===-1)return null;const S=b+h.length-1,E=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);let M=0,k=E.nextNode();for(;k;){const _=k.textContent||"",q=_.length;if(S<M+q){const B=S-M;if(B<0||B>=q)return null;const Y=_.charAt(B);if(!Y||!Y.trim())return null;const P=document.createRange();P.setStart(k,B),P.setEnd(k,Math.min(B+1,q));const N=P.getBoundingClientRect();return(O=P.detach)==null||O.call(P),!N||!N.width&&!N.height?null:{left:N.left+window.scrollX,right:N.right+window.scrollX,top:N.top+window.scrollY,bottom:N.bottom+window.scrollY,width:N.width,height:N.height}}M+=q,k=E.nextNode()}return null}function et(){f||(s={x:i.x,y:i.y},f=!0)}function de(){return s||{x:i.x,y:i.y}}function ue(){y=0,X&&(X.textContent=y)}function fe(){$||(y+=1,X&&(X.textContent=y),$=!0,clearTimeout(x),x=window.setTimeout(()=>{$=!1},500))}function F(){$=!1,clearTimeout(x)}function he(){C&&(C.classList.add("is-visible"),C.setAttribute("aria-hidden","false"),clearTimeout(p),p=window.setTimeout(()=>me(),3200))}function me(){C&&(C.classList.remove("is-visible"),C.setAttribute("aria-hidden","true"),ue())}function ge(){if(!W)return null;const d=W.getBoundingClientRect();if(!d.width||!d.height)return null;const h=window.scrollX,m=window.scrollY,v=n*.5,b=n*.2;return{centerX:d.left+h+d.width/2,centerY:d.top+m+d.height*.5,radiusX:d.width/2+v,radiusY:d.height/2+b}}function ye(d){if(!d)return!1;const h=i.x-d.centerX,m=i.y-d.centerY,v=h/d.radiusX,b=m/d.radiusY;return v*v+b*b<=1}function nt(d){const h=d.top+n+le,m=n+4;return Math.max(h,m)}function pe(){if(!U)return!0;const d=window.getComputedStyle(U),h=parseFloat(d.getPropertyValue("column-gap")||d.getPropertyValue("gap"))||0,m=U.clientWidth;if(!m)return!1;const b=280*3+h*2;return m>=b-.5}function be(d={}){const h=ce();if(!h)return!1;const m=rt(),v=h.left+h.width/3+Lt.x,b=h.top+h.height/30+Lt.y,S=m.left+n+12,E=m.right-n-12,M=nt(m),k=m.bottom-n-12;return i.x=j(v,S,E),i.y=j(b,M,k),i.vx=0,i.vy=0,z(),d.recordHome&&et(),!0}function ve(d={}){if(!tt)return!1;const h=_t(se||tt),m=rt(),v=h.left+h.width/2+Tt.x,b=h.bottom+n+Tt.y,S=m.left+n+12,E=m.right-n-12,M=nt(m),k=m.bottom-n-12;return i.x=j(v,S,E),i.y=j(b,M,k),i.vx=0,i.vy=0,z(),d.recordHome&&et(),!0}function it(d={}){const{recordHome:h=!1}=d;be({recordHome:h})||ve({recordHome:h})||(z(),h&&et())}function K(d={}){const{force:h=!1,skipReposition:m=!1}=d;if(c)return;const v=pe();if(!h&&v===l)return;const b=l;l=v,e.style.display=v?"":"none",v&&(!b||h)&&!m&&it()}it({recordHome:!0}),K({force:!0}),window.addEventListener("load",()=>{it(),K({force:!0})},{once:!0}),requestAnimationFrame(()=>{it(),K({force:!0})});function $e(d,h){if(c||!A.active)return;const m=.42;i.vx+=d*m,i.vy+=h*m;const v=34,b=Math.hypot(i.vx,i.vy);if(b>v){const k=v/b;i.vx*=k,i.vy*=k}const S=i.x-A.x,E=i.y-A.y,M=Math.hypot(S,E);if(M<n){const k=n-M,O=S/(M||1),_=E/(M||1);i.x+=O*(k+.5),i.y+=_*(k+.5)}}function we(){const h=rt(),m=h.left+n+8,v=h.right-n-8,b=nt(h),S=h.bottom-n-8;i.x<m?(i.x=m,i.vx=Math.abs(i.vx)*.78):i.x>v&&(i.x=v,i.vx=-Math.abs(i.vx)*.78),i.y<b?(i.y=b,i.vy=Math.abs(i.vy)*.78):i.y>S&&(i.y=S,i.vy=-Math.abs(i.vy)*.78)}function xe(){for(const h of oe){if(!h.isConnected)continue;const m=h.getBoundingClientRect(),v=window.scrollX,b=window.scrollY,S={left:m.left+v,right:m.right+v,top:m.top+b,bottom:m.bottom+b};if(m.width===0||m.height===0||m.right<-40||m.left>window.innerWidth+40||m.bottom<-40||m.top>window.innerHeight+40)continue;const E=j(i.x,S.left,S.right),M=j(i.y,S.top,S.bottom),k=i.x-E,O=i.y-M,_=k*k+O*O;if(_>=n*n||k===0&&O===0)continue;const q=Math.sqrt(_)||1e-4,B=k/q,Y=O/q;i.x=E+B*(n+.5),i.y=M+Y*(n+.5);const P=i.vx*B+i.vy*Y;P>0||(i.vx-=(1+.72)*P*B,i.vy-=(1+.72)*P*Y)}}function rt(){return D?_t(D):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function ke(d){if(c)return;s||et(),c=!0,A.active=!1,g=!1,F(),a=!1,i.vx=0,i.vy=0,e.classList.remove("is-moving"),e.classList.add("is-sinking"),he();const h=d.centerX-n,m=d.centerY-n*.6,v=.6;clearTimeout(u),e.style.transition="transform 320ms ease-in, opacity 320ms ease-in, box-shadow 320ms ease-in",e.style.transform=`translate3d(${h}px, ${m}px, 0) scale(${v})`,e.style.opacity="0",e.style.boxShadow="0 10px 20px rgba(15, 29, 51, 0.2)",u=window.setTimeout(()=>{const b=de();i.x=b.x,i.y=b.y,i.vx=0,i.vy=0,e.style.transition="none",e.style.transform=`translate3d(${b.x-n}px, ${b.y-n}px, 0) scale(0.35)`,e.style.opacity="0",requestAnimationFrame(()=>{e.classList.remove("is-sinking"),e.classList.add("is-returning"),e.style.transition="transform 440ms cubic-bezier(0.18, 0.72, 0.22, 1.08), opacity 380ms ease-out, box-shadow 380ms ease-out",e.style.opacity="1",e.style.boxShadow="3px 4px 12px rgba(15, 29, 51, 0.25)",e.style.transform=`translate3d(${b.x-n}px, ${b.y-n}px, 0) scale(1)`}),u=window.setTimeout(()=>{e.classList.remove("is-returning","is-sinking"),e.style.transition="",e.style.opacity="",e.style.boxShadow="",z(),c=!1,K({force:!0,skipReposition:!0})},520)},360)}function St(){if(requestAnimationFrame(St),c)return;const d=performance.now(),h=Math.min((d-r)/16.666,3);if(r=d,i.x+=i.vx*h,i.y+=i.vy*h,i.vx*=Math.pow(.985,h),i.vy*=Math.pow(.985,h),Math.abs(i.vx)<.02&&(i.vx=0),Math.abs(i.vy)<.02&&(i.vy=0),we(),xe(),a=Math.hypot(i.vx,i.vy)>.35,l){const m=ge();if(m&&ye(m)){ke(m);return}}a&&(i.textureOffsetX=Nt(i.textureOffsetX+i.vx*h*.32,12),i.textureOffsetY=Nt(i.textureOffsetY+i.vy*h*.32,12)),z()}window.addEventListener("pointermove",d=>{if(d.pointerType&&d.pointerType!=="mouse"&&d.pointerType!=="pen")return;const h=A.x,m=A.y,v=A.active,b=d.clientX+window.scrollX,S=d.clientY+window.scrollY;A.x=b,A.y=S,A.active=!0;const E=v?b-h:0,M=v?S-m:0;if(!v)return;const k=i.x-A.x,O=i.y-A.y,_=Math.hypot(k,O),q=g;if(g=_<=ft,!g)return;const B=Math.hypot(i.vx,i.vy);$e(E,M);const Y=Math.hypot(i.vx,i.vy),P=Y-B;if(!q&&!$){const N=Math.hypot(E,M);(P>.35||Y>1||N>1.2)&&fe()}},{passive:!0}),window.addEventListener("pointerleave",()=>{A.active=!1,g=!1,F()}),window.addEventListener("pointerout",d=>{d.relatedTarget||(A.active=!1,g=!1,F())}),window.addEventListener("blur",()=>{A.active=!1,g=!1,F()}),window.addEventListener("scroll",()=>{A.active=!1,g=!1,F()}),window.addEventListener("resize",()=>{if(!c){const d=rt();i.x=j(i.x,d.left+n+8,d.right-n-8),i.y=j(i.y,nt(d),d.bottom-n-8)}K()}),requestAnimationFrame(St)}function j(t,e,n){return Math.min(Math.max(t,e),n)}function Nt(t,e){const n=t%e;return n<0?n+e:n}function _t(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
