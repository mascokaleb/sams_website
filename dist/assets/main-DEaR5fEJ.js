import{f as xe}from"./sanityClient-B1_5ewQZ.js";function st(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function Nt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function _t(t){return Nt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function qt(t){return t._type==="@list"}function Yt(t){return t._type==="@span"}function Rt(t){return t._type==="@text"}const Tt=["strong","em","code","underline","strike-through"];function Le(t,e,n){if(!st(t)||!t.marks)return[];if(!t.marks.length)return[];const r=t.marks.slice(),i={};return r.forEach(a=>{i[a]=1;for(let l=e+1;l<n.length;l++){const s=n[l];if(s&&st(s)&&Array.isArray(s.marks)&&s.marks.indexOf(a)!==-1)i[a]++;else break}}),r.sort((a,l)=>Te(i,a,l))}function Te(t,e,n){const r=t[e],i=t[n];if(r!==i)return i-r;const a=Tt.indexOf(e),l=Tt.indexOf(n);return a!==l?a-l:e.localeCompare(n)}function Se(t){var l;const{children:e}=t,n=t.markDefs??[];if(!e||!e.length)return[];const r=e.map(Le),i={_type:"@span",children:[],markType:"<unknown>"};let a=[i];for(let s=0;s<e.length;s++){const f=e[s];if(!f)continue;const c=r[s]||[];let u=1;if(a.length>1)for(u;u<a.length;u++){const p=((l=a[u])==null?void 0:l.markKey)||"",g=c.indexOf(p);if(g===-1)break;c.splice(g,1)}a=a.slice(0,u);let b=a[a.length-1];if(b){for(const p of c){const g=n==null?void 0:n.find(D=>D._key===p),$=g?g._type:p,w={_type:"@span",_key:f._key,children:[],markDef:g,markType:$,markKey:p};b.children.push(w),a.push(w),b=w}if(st(f)){const p=f.text.split(`
`);for(let g=p.length;g-- >1;)p.splice(g,0,`
`);b.children=b.children.concat(p.map(g=>({_type:"@text",text:g})))}else b.children=b.children.concat(f)}}return i.children}function Ae(t,e){const n=[];let r;for(let i=0;i<t.length;i++){const a=t[i];if(a){if(!_t(a)){n.push(a),r=void 0;continue}if(!r){r=at(a,i,e),n.push(r);continue}if(Me(a,r)){r.children.push(a);continue}if((a.level||1)>r.level){const l=at(a,i,e);{const s=r.children[r.children.length-1],f={...s,children:[...s.children,l]};r.children[r.children.length-1]=f}r=l;continue}if((a.level||1)<r.level){const l=n[n.length-1],s=l&&gt(l,a);if(s){r=s,r.children.push(a);continue}r=at(a,i,e),n.push(r);continue}if(a.listItem!==r.listItem){const l=n[n.length-1],s=l&&gt(l,{level:a.level||1});if(s&&s.listItem===a.listItem){r=s,r.children.push(a);continue}else{r=at(a,i,e),n.push(r);continue}}console.warn("Unknown state encountered for block",a),n.push(a)}}return n}function Me(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function at(t,e,n){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:n,level:t.level||1,listItem:t.listItem,children:[t]}}function gt(t,e){const n=e.level||1,r=e.listItem||"normal",i=typeof e.listItem=="string";if(qt(t)&&(t.level||1)===n&&i&&(t.listItem||"normal")===r)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!st(a)?gt(a,e):void 0}function Xt(t){let e="";return t.children.forEach(n=>{Rt(n)?e+=n.text:Yt(n)&&(e+=Xt(n))}),e}const He=["http","https","mailto","tel"],Ee={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Vt(t){return Ie(t.replace(/[&<>"']/g,e=>`&${Ee[e]};`))}function Ie(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Pe(t){const e=(t||"").trim(),n=e.charAt(0);if(n==="#"||n==="/")return!0;const r=e.indexOf(":");if(r===-1)return!0;const i=e.slice(0,r).toLowerCase();if(He.indexOf(i)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&r>a)return!0;const l=e.indexOf("#");return l!==-1&&r>l}const De={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},Ce=({children:t})=>`<li>${t}</li>`,Oe=({children:t,value:e})=>{const n=(e==null?void 0:e.href)||"";return Pe(n)?`<a href="${Vt(n)}">${t}</a>`:t},Be={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Oe},Q=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,jt=t=>Q(`block type "${t}"`,"types"),Ne=t=>Q(`mark type "${t}"`,"marks"),_e=t=>Q(`block style "${t}"`,"block"),qe=t=>Q(`list style "${t}"`,"list"),Ye=t=>Q(`list item style "${t}"`,"listItem");function Re(t){console.warn(t)}const Xe=({value:t,isInline:e})=>{const n=jt(t._type);return e?`<span style="display:none">${n}</span>`:`<div style="display:none">${n}</div>`},Ve=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,je=({children:t})=>`<p>${t}</p>`,Ge=({children:t})=>`<ul>${t}</ul>`,Ue=({children:t})=>`<li>${t}</li>`,We=()=>"<br/>",ze={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},St={types:{},block:ze,marks:Be,list:De,listItem:Ce,hardBreak:We,escapeHTML:Vt,unknownType:Xe,unknownMark:Ve,unknownList:Ge,unknownListItem:Ue,unknownBlockStyle:je};function Fe(t,e){const{block:n,list:r,listItem:i,marks:a,types:l,...s}=e;return{...t,block:K(t,e,"block"),list:K(t,e,"list"),listItem:K(t,e,"listItem"),marks:K(t,e,"marks"),types:K(t,e,"types"),...s}}function K(t,e,n){const r=e[n],i=t[n];return typeof r=="function"||r&&typeof i=="function"?r:r?{...i,...r}:i}function Ke(t,e={}){const{components:n,onMissingComponent:r=Re}=e,i=r||Qe,a=Array.isArray(t)?t:[t],l=Ae(a,"html"),s=n?Fe(St,n):St,f=Ze(s,i);return l.map((c,u)=>f({node:c,index:u,isInline:!1,renderNode:f})).join("")}const Ze=(t,e)=>{function n(c){const{node:u,index:b,isInline:p}=c;return qt(u)?i(u,b):_t(u)?r(u,b):Yt(u)?a(u):Nt(u)?l(u,b,p):Rt(u)?s(u):f(u,b,p)}function r(c,u){const b=At({node:c,index:u,isInline:!1,renderNode:n}),p=t.listItem,g=(typeof p=="function"?p:p[c.listItem])||t.unknownListItem;if(g===t.unknownListItem){const w=c.listItem||"bullet";e(Ye(w),{type:w,nodeType:"listItemStyle"})}let $=b.children;if(c.style&&c.style!=="normal"){const{listItem:w,...D}=c;$=n({node:D,index:u,isInline:!1})}return g({value:c,index:u,isInline:!1,renderNode:n,children:$})}function i(c,u){const b=c.children.map(($,w)=>n({node:$._key?$:{...$,_key:`li-${u}-${w}`},index:w,isInline:!1})),p=t.list,g=(typeof p=="function"?p:p[c.listItem])||t.unknownList;if(g===t.unknownList){const $=c.listItem||"bullet";e(qe($),{nodeType:"listStyle",type:$})}return g({value:c,index:u,isInline:!1,renderNode:n,children:b.join("")})}function a(c){const{markDef:u,markType:b,markKey:p}=c,g=t.marks[b]||t.unknownMark,$=c.children.map((w,D)=>n({node:w,index:D,isInline:!0}));return g===t.unknownMark&&e(Ne(b),{nodeType:"mark",type:b}),g({text:Xt(c),value:u,markType:b,markKey:p,renderNode:n,children:$.join("")})}function l(c,u,b){const{_key:p,...g}=At({node:c,index:u,isInline:b,renderNode:n}),$=g.node.style||"normal",w=(typeof t.block=="function"?t.block:t.block[$])||t.unknownBlockStyle;return w===t.unknownBlockStyle&&e(_e($),{nodeType:"blockStyle",type:$}),w({...g,value:g.node,renderNode:n})}function s(c){if(c.text===`
`){const u=t.hardBreak;return u?u():`
`}return t.escapeHTML(c.text)}function f(c,u,b){const p=t.types[c._type];return p||e(jt(c._type),{nodeType:"block",type:c._type}),(p||t.unknownType)({value:c,isInline:b,index:u,renderNode:n})}return n};function At(t){const{node:e,index:n,isInline:r,renderNode:i}=t,a=Se(e).map((l,s)=>i({node:l,isInline:!0,index:s,renderNode:i}));return{_key:e._key||`block-${n}`,children:a.join(""),index:n,isInline:r,node:e}}function Qe(){}const dt="images/samuel-placeholder.svg",Gt=dt,ot=/^[a-zA-Z0-9_-]{11}$/,x={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},I={meta:null,allItems:[],items:[],videos:[],photos:[]},Z={meta:null,items:[],totalCount:0},lt={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{Je(),jn();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await tn(),window.location.hash&&setTimeout(()=>te(window.location.hash),100),Kn(t),t||Zn()});function Je(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const n=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",n),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function tn(){ft(!0);const t=await xe();if(!t)return Vn("Unable to load the latest content. Please try again shortly."),ft(!1),null;en(t.site),nn(t.hero,t.site),rn(t.about),an(t.resume),on(t.academics);const e=ht(t.highlightEvents||[]);I.meta=t.highlightsSection,I.allItems=e,I.items=e.filter(mt),sn();const n=ht(t.videos||[],"eventDate");I.videos=n,Z.meta=t.videosSection,Z.items=n.filter(mt),Z.totalCount=n.length,ln();const r=ht(t.galleryPhotos||[],"shotDate");return I.photos=r,lt.meta=t.gallerySection,lt.items=r.filter(mt),cn(),un(t.dualSport),fn(t.contact),ft(!1),$t(),t}function en(t){var r;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const i=document.querySelector(".brand-text");i&&(i.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const n=document.querySelector(".brand-mark");if(n)if((r=t.brandMarkImage)!=null&&r.url)n.innerHTML=`<span class="brand-mark-image"><img src="${S(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,n.classList.add("has-image");else{const i=t.brandMarkInitials||Gn(t.siteTitle)||n.textContent||"SM";n.textContent=i,n.classList.remove("has-image")}}function nn(t,e){var a,l;const n=L(x.heroCopy),r=L(x.heroPhoto),i=L(x.heroMetrics);if(!t){n&&(n.innerHTML=M("Hero content coming soon."));return}if(n){const s=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",f=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",c=t.bio?`<p>${o(t.bio)}</p>`:"",u=[Pt(t.primaryCta,"primary","View Highlights","#highlights"),Pt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");n.innerHTML=`
      ${s}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${f}
      </h1>
      ${c}
      <div class="hero-actions">
        ${u||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(r){const s=((a=t.headshot)==null?void 0:a.url)||dt,f=((l=t.headshot)==null?void 0:l.alt)||"Portrait of Samuel Masco",c=t.photoCaption||"Focused on the next shot.";r.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${s}" alt="${o(f)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${o(c)}</figcaption>
    `}i&&(Array.isArray(t.metrics)&&t.metrics.length?i.innerHTML=t.metrics.map(s=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${o(s.label||"")}</span>
              <span class="metric-value">${o(s.value||"")}</span>
            </div>
          `).join(""):i.innerHTML=M("Metrics coming soon."))}function rn(t){const e=L(x.aboutHeading),n=L(x.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"About")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:M("About section coming soon.")),n){if(!t){n.innerHTML=M("About details coming soon.");return}n.innerHTML=`
      <article class="about-card" data-motion="delay-1">
        <h3>${o(t.profileCardTitle||"Profile")}</h3>
        <ul>
          ${(t.profileFacts||[]).map(r=>`
                <li><strong>${o(r.label||"")}: </strong>${o(r.value||"")}</li>
              `).join("")}
        </ul>
      </article>
      <article class="about-card about-story" data-motion="delay-2">
        <h3>${o(t.mindsetTitle||"Mindset & Goals")}</h3>
        ${wt(t.mindsetBody)}
      </article>
      <article class="about-card about-highlight" data-motion="delay-3">
        <h3>${o(t.quickHitsTitle||"Quick Hits")}</h3>
        ${(t.quickHits||[]).map(r=>`
              <div class="highlight-row">
                <span>${o(r.label||"")}</span>
                <span>${o(r.value||"")}</span>
              </div>
            `).join("")}
      </article>
    `}}function an(t){const e=L(x.resumeHeading),n=L(x.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Golf Resume")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:M("Golf resume coming soon.")),n){if(!t){n.innerHTML=M("Resume details coming soon.");return}n.innerHTML=`
      <article class="panel" data-motion="delay-1">
        <h3>${o(t.performanceTitle||"Performance Snapshot")}</h3>
        <dl>
          ${(t.performanceStats||[]).map(r=>`
                <div>
                  <dt>${o(r.label||"")}</dt>
                  <dd>${o(r.value||"")}</dd>
                </div>
              `).join("")}
        </dl>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${o(t.trainingTitle||"Training Routine")}</h3>
        ${wt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(r=>`<li>${o(r||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function on(t){const e=L(x.academicsHeading),n=L(x.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Academics")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:M("Academics section coming soon.")),n){if(!t){n.innerHTML=M("Academic details coming soon.");return}const r=t.transcriptLabel||"Transcript",i=t.transcriptUrl?`<a class="btn subtle" href="${S(t.transcriptUrl)}" target="_blank" rel="noopener">${o(r)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${o(r)}</span>`;n.innerHTML=`
      <article class="academics-card" data-motion="delay-1">
        <h3>${o(t.schoolCardTitle||"School")}</h3>
        <ul>
          ${t.gpa?`<li><strong>GPA:</strong> ${o(t.gpa)}</li>`:""}
          ${t.honors?`<li><strong>Honors:</strong> ${o(t.honors)}</li>`:""}
          ${t.apCourses?`<li><strong>AP / IB:</strong> ${o(t.apCourses)}</li>`:""}
        </ul>
        ${i}
      </article>
      <article class="academics-card" data-motion="delay-2">
        <h3>${o(t.interestsTitle||"Academic Interests")}</h3>
        ${wt(t.interestsBody)}
      </article>
    `}}function sn(){const t=I.meta,e=I.items||[],n=L(x.highlightsHeading),r=L(x.highlightsTimeline),i=L(x.highlightsActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:M("Highlights coming soon.")),!r)return;const a=(t==null?void 0:t.maxItems)||5,l=e.slice(0,a);if(!l.length){r.innerHTML=M("Highlight events coming soon."),i&&(i.innerHTML="");return}r.innerHTML=l.map((s,f)=>mn(s,f)).join(""),r.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),bt(r),i&&(i.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function ln(){const t=Z.meta,e=Z.items||[],n=L(x.videosHeading),r=L(x.videoGrid),i=L(x.videosActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:M("Videos coming soon.")),!r)return;const a=(t==null?void 0:t.maxItems)||3,l=e.slice(0,a);if(!l.length){r.innerHTML=M("Video highlights coming soon."),i&&(i.innerHTML="");return}r.innerHTML=l.map((s,f)=>_n(s,f)).join(""),r.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),$t(),bt(r),i&&(i.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function cn(){const t=lt.meta,e=lt.items||[],n=L(x.galleryHeading),r=L(x.galleryGrid),i=L(x.galleryActions);if(n){const s=(t==null?void 0:t.heading)||"Photo Gallery",f=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";n.innerHTML=`
      <h2>${o(s)}</h2>
      ${`<p>${o(f)}</p>`}
    `}if(!r)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),l=e.slice(0,a);if(!l.length){r.innerHTML=M("Gallery photos coming soon."),i&&(i.innerHTML="");return}if(r.innerHTML=l.map((s,f)=>dn(s,f)).join(""),r.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),Jt(r),bt(r),i){const s=(t==null?void 0:t.ctaHref)||"gallery.html",f=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";i.innerHTML=`<a class="btn ghost" href="${S(s)}">${o(f)}</a>`}}function dn(t,e=0){var D,G,U;const n=((D=t==null?void 0:t.image)==null?void 0:D.url)||dt,r=((G=t==null?void 0:t.image)==null?void 0:G.alt)||(t==null?void 0:t.title)||"Gallery highlight",i=Kt(t,{variant:"card"}),a=re(t==null?void 0:t.shotDate),l=a?vt(a):"",s=(U=t==null?void 0:t.image)!=null&&U.url?{src:n,alt:r,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,f=s?`data-photo-src="${S(s.src)}" data-photo-alt="${S(s.alt)}" data-photo-title="${S(s.title)}"`:"",c=[];t!=null&&t.location&&c.push(t.location);const u=c.map(N=>`<span>${o(N)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),b=u?`<div class="gallery-card-meta">${u}</div>`:"",p=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",g=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",$=g?`<div class="gallery-card-footer">${g}</div>`:"",w=s?`data-photo-preview="true" ${f}`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${w?` ${w}`:""}>
        ${l}
        <img src="${S(n)}" alt="${o(r)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        ${b}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${i?`<div class="card-chip-slot">${i}</div>`:""}
        ${p}
        ${yt(t==null?void 0:t.tags)}
        ${$}
      </div>
    </article>
  `}function yt(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(n=>typeof n=="string"?n.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(n=>`<span class="gallery-tag">${o(n)}</span>`).join("")}
    </div>
  `:""}function un(t){const e=L(x.dualHeading),n=L(x.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:M("Dual-sport content coming soon.")),n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=M("Dual-sport cards coming soon.");return}n.innerHTML=t.cards.map((r,i)=>`
          <article class="dual-card" data-motion="delay-${i+1}">
            <h3>${o(r.title||"")}</h3>
            ${r.body?`<p>${o(r.body)}</p>`:""}
            ${Array.isArray(r.bulletPoints)&&r.bulletPoints.length?`<ul>${r.bulletPoints.map(a=>`<li>${o(a||"")}</li>`).join("")}</ul>`:""}
          </article>
        `).join("")}}function fn(t){const e=L(x.contactHeading),n=L(x.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:M("Contact section coming soon.")),!!n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=M("Contact cards coming soon.");return}n.innerHTML=t.cards.map((r,i)=>`
        <article class="contact-card" data-motion="delay-${i+1}">
          <h3>${o(r.title||"")}</h3>
          <ul>
            ${(r.entries||[]).map(a=>`<li>${hn(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function hn(t){var i;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",n=Un(t.value),r=(i=t.link)!=null&&i.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&n.length<=1?`${e}<a href="${S(t.link)}"${r}>${o(t.value||t.link)}</a>`:n.length?`${e}${n.map((a,l)=>{const s=l===0&&t.link?t.link:a.link;if(s){const c=s.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${S(s)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function mn(t,e){const n=zn(t),r=t.summary?`<p>${o(t.summary)}</p>`:"",i=Array.isArray(t.days)?t.days:[],a=Ut(i,{variant:"compact"}),l=`home-highlight-${e}`,s=(t==null?void 0:t._id)||(t==null?void 0:t.title)||l,c=`<div class="highlight-row-actions">${`
    <button class="highlight-toggle" type="button" data-highlight-modal="${S(s)}">
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
      ${r}
    </article>
  `}function Ut(t=[],{variant:e="default",showLabels:n}={}){if(!Array.isArray(t)||!t.length)return"";const r=t.length,i=typeof n=="boolean"?n:r>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",r===1?"day-stats--single":"",`day-stats--cols-${Math.min(r,3)}`].filter(Boolean).join(" ")}">
      ${t.map((l,s)=>yn(l,s,{showLabels:i,total:r})).join("")}
    </div>
  `}const Mt=120,gn=57;function yn(t,e,{showLabels:n,total:r}){if(!t)return"";const i=r===1,a=!i&&n?Qt(t,e,r):null,l=pn(t);return l?`
    <div class="day-stat${i?" day-stat--single":""}">
      ${a?`<span class="day-stat-label">${o(a)}</span>`:""}
      ${l}
    </div>
  `:""}function pn(t){const e=Pn(t);return e.length?`
    <div class="day-metrics">
      ${bn(e)}
    </div>
  `:""}function bn(t){return`
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
  `}function vn(t=[]){if(!Array.isArray(t))return"";const e=t.map((n,r)=>{if(!(n!=null&&n.notes))return"";const i=Qt(n,r,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(i)}</strong>
          <p>${o(n.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function bt(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const r=e.getAttribute("data-highlight-modal");wn(r)}))})}let V=null;function $n(){if(V)return V;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&Ht()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Ht()}),document.body.appendChild(t),V=t,t}function wn(t){const e=$n(),n=e.querySelector("[data-highlight-overlay-body]");if(!n)return;const r=Wt(t);if(!r)return;const i=An(r),a=Mn(r);n.innerHTML=kn(r,i,a),$t(n),Jt(n),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function Ht(){if(!V)return;const t=V.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),V.classList.remove("is-open"),V.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Wt(t){const e=[];if(Array.isArray(I.items)&&e.push(I.items),Array.isArray(I.allItems)&&e.push(I.allItems),!t)return e[0]&&e[0][0]||e[1]&&e[1][0]||null;for(const n of e){const r=n.find(a=>((a==null?void 0:a._id)||"")===t);if(r)return r;const i=n.find(a=>(a==null?void 0:a.title)===t);if(i)return i}return null}function kn(t,e,n){const i=[In(t),t.location?o(t.location):null].filter(Boolean),a=i.length?`<div class="highlight-overlay-meta">
        ${i.map(f=>`<span>${f}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",l=Ut(t.days||[],{variant:"list"}),s=vn(t.days||[]);return`
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
        ${xn(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Tn(n)}
      </section>
    </div>
  `}function xn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(Ln).join("")}
    </div>
  `}function Ln(t){const e=ne(t),n=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:Gt),r=t.thumbnailAlt||t.title||"Video highlight",i=t.title||"Video highlight",l=!!e?"":' disabled aria-disabled="true"',s=Zt(t.eventDate),f=s?vt(s):"",c=pt?pt(t):"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${o(e)}" data-video-title="${o(i)}">
        ${f}
        <img src="${S(n)}" alt="${o(r)}" loading="lazy" />
        <button class="play-button" type="button"${l} aria-label="Play ${o(i)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${o(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${o(t.description)}</p>`:""}
        ${c}
      </div>
    </article>
  `}function Tn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(Sn).join("")}
    </div>
  `}function Sn(t){var f,c,u;const e=((f=t==null?void 0:t.image)==null?void 0:f.url)||Gt,n=((c=t==null?void 0:t.image)==null?void 0:c.alt)||(t==null?void 0:t.title)||"Gallery photo",r=re(t==null?void 0:t.shotDate),i=r?Fn(r):"",a=(u=t==null?void 0:t.image)!=null&&u.url?{src:e,alt:n,title:(t==null?void 0:t.title)||"Gallery photo"}:null,l=a?`data-photo-preview="true" data-photo-src="${S(a.src)}" data-photo-alt="${S(a.alt)}" data-photo-title="${S(a.title)}"`:"",s=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${l?` ${l}`:""}>
        ${i}
        <img src="${S(e)}" alt="${o(n)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        <h4>${o((t==null?void 0:t.title)||"Gallery photo")}</h4>
        ${t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:""}
        ${yt?yt(t==null?void 0:t.tags):""}
        ${s?`<div class="gallery-card-footer">${s}</div>`:""}
      </div>
    </article>
  `}function An(t){return!t||!Array.isArray(I.videos)?[]:I.videos.filter(e=>zt(e,t))}function Mn(t){return!t||!Array.isArray(I.photos)?[]:I.photos.filter(e=>zt(e,t))}function zt(t,e){const n=Ft(t);return n?!!(n.id&&(e!=null&&e._id)&&n.id===e._id||n.title&&(e!=null&&e.title)&&n.title===e.title):!1}function Ft(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function Hn(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function pt(t){const e=Hn(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(n=>`<span class="gallery-tag">${o(n)}</span>`).join("")}
    </div>
  `:""}function En(t){const e=Ft(t);if(!e||!e.title)return null;const n=e.id||e.title,r=n?Wt(n):null,i=r?r._id||r.title:null;return{label:(r==null?void 0:r.title)||e.title,targetId:i}}function Kt(t,{variant:e="inline"}={}){const n=En(t);if(!(n!=null&&n.label))return"";const r=["tournament-chip"];e==="card"&&r.push("tournament-chip--on-card"),e==="inline"&&r.push("tournament-chip--inline");const i=o(n.label),a=S(`View ${n.label} tournament details`),l=n.targetId?` data-highlight-modal="${S(n.targetId)}"`:"",s=n.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(n.targetId)}`:"tournament-highlights.html",f="a";return`
    <${f} class="${r.join(" ")}" href="${S(s)}"${l}${n.targetId?` aria-label="${a}"`:""}>
      <span class="tournament-chip-name">${i}</span>
    </${f}>
  `}function Zt(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function vt(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function In(t){return t?ee(t.eventDate,t.endDate,{month:"long"}):""}function Pn(t){if(!t)return[];const e=[],n=ct(t.score),r=ct(t.yardage);e.push(ut({key:"score",label:"Score",display:typeof n=="number"?String(n):"—",progress:Cn(n)})),e.push(ut({key:"yards",label:"Yardage",display:typeof r=="number"?r.toLocaleString():"—",secondary:"",progress:On(r,Dn(t,r))}));const i=Nn(t);return e.push(ut({key:"rank",label:"Rank",display:i.display,secondary:i.secondary,progress:i.progress})),e.filter(Boolean)}function ut({key:t,label:e,display:n,secondary:r,progress:i}){const a=n!=null&&n!==""?String(n):"—",l=r?String(r):"",s=typeof i=="number"&&!Number.isNaN(i)?i:0;return{key:t,label:e,display:a,secondary:l,progress:Math.max(0,s)}}function Qt(t,e,n){return t.label?t.label:n>1?`Day ${e+1}`:null}function ct(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function Dn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function Cn(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=Mt-gn;return(Mt-t)/e}function On(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function Bn(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const n=(e-t)/(e-1);return Math.max(0,Math.min(n,1))}function Nn(t){const e=ct(t==null?void 0:t.rankingPosition),n=ct(t==null?void 0:t.rankingOutOf),r=Bn(e,n);return typeof e=="number"?{display:String(e),secondary:typeof n=="number"?`of ${n}`:"",progress:r}:{display:"—",secondary:"",progress:0}}function _n(t,e){const n=ne(t),r=t.thumbnailUrl||(n?`https://img.youtube.com/vi/${n}/hqdefault.jpg`:dt),i=t.thumbnailAlt||t.title||"Video highlight",a=t.title||"Video highlight",s=!!n?"":' disabled aria-disabled="true"',f=Kt(t,{variant:"card"}),c=Zt(t.eventDate),u=c?vt(c):"",b=pt(t);return`
    <article class="video-gallery-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(n)}" data-video-title="${o(a)}">
        ${u}
        <img src="${S(r)}" alt="${o(i)}" loading="lazy" />
        <button class="play-button" type="button"${s} aria-label="Play ${o(a)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h3>${o(t.title||"")}</h3>
        ${f?`<div class="card-chip-slot">${f}</div>`:""}
        <p>${o(t.description||"")}</p>
        ${b}
      </div>
    </article>
  `}function $t(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(n=>{if(n.dataset.playerReady==="true")return;const r=n.querySelector(".play-button"),i=n.dataset.videoId,a=n.dataset.videoTitle||"Samuel Masco golf video highlight";!r||!i||(r.addEventListener("click",()=>{Yn(i,a)}),n.dataset.playerReady="true")})}let j=null;function qn(){if(j)return j;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&Et()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Et()}),document.body.appendChild(t),j=t,t}function Yn(t,e){const n=qn(),r=n.querySelector(".video-overlay-frame");if(!r)return;r.innerHTML="";const i=document.createElement("iframe");i.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),i.setAttribute("title",e),i.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),i.setAttribute("allowfullscreen",""),i.loading="lazy",r.appendChild(i),n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function Et(){if(!j)return;const t=j.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),j.classList.remove("is-open"),j.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let X=null;function Jt(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(n=>{n.dataset.photoPreviewReady!=="true"&&(n.addEventListener("click",r=>{r.target.closest(".tournament-chip")||Xn(n.getAttribute("data-photo-src"),n.getAttribute("data-photo-alt"),n.getAttribute("data-photo-title"))}),n.dataset.photoPreviewReady="true")})}function Rn(){if(X)return X;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&It()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&It()}),document.body.appendChild(t),X=t,t}function Xn(t,e,n){if(!t)return;const r=Rn(),i=r.querySelector("img"),a=r.querySelector("figcaption");!i||!a||(i.src=t,i.alt=e||n||"Gallery photo",a.textContent=n||e||"",r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function It(){if(!X)return;const t=X.querySelector("img"),e=X.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),X.classList.remove("is-open"),X.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function wt(t){return!Array.isArray(t)||!t.length?"":Ke(t)}function L(t){return t?document.querySelector(t):null}function M(t){return`<p class="placeholder-text">${o(t)}</p>`}function ft(t){document.body.dataset.contentLoading=String(t)}function Vn(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function Pt(t,e,n,r){const i=(t==null?void 0:t.label)||n,a=(t==null?void 0:t.href)||r;if(!i||!a)return"";const s=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${S(a)}"${s}>${o(i)}</a>`}function jn(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const n=e.getAttribute("href")||"";te(n)&&t.preventDefault()})}function te(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function ee(t,e,{month:n="short"}={}){if(!t)return"";const r=new Date(t);if(Number.isNaN(r.getTime()))return o(t);if(!e)return r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});const i=new Date(e);if(Number.isNaN(i.getTime()))return`${r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=r.getFullYear()===i.getFullYear(),l=a&&r.getMonth()===i.getMonth();if(a&&l)return`${r.toLocaleDateString("en-US",{month:n})} ${r.getDate()}–${i.getDate()}, ${r.getFullYear()}`;if(a){const c=r.toLocaleDateString("en-US",{month:n,day:"numeric"}),u=i.toLocaleDateString("en-US",{month:n,day:"numeric"});return`${c} – ${u}, ${r.getFullYear()}`}const s=r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"}),f=i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});return`${s} – ${f}`}function ne(t){return t?Dt(t.youtubeId)||Dt(t.youtubeUrl):""}function Dt(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(ot.test(e))return e;let n;try{n=new URL(e)}catch{try{n=new URL(`https://${e}`)}catch{return""}}const r=n.hostname.replace(/^www\./,"").toLowerCase();if(r==="youtu.be"){const i=n.pathname.split("/").filter(Boolean)[0];return i&&ot.test(i)?i:""}if(r==="youtube.com"||r.endsWith(".youtube.com")){const i=n.searchParams.get("v");if(i&&ot.test(i))return i;const a=n.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const l=a[1];return l&&ot.test(l)?l:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function S(t){return o(t)}function Gn(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(n=>n.charAt(0).toUpperCase()).join(""):""}function Un(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(i=>i.trim()).filter(Boolean).map(i=>({text:i,link:Wn(i)})):[]}function Wn(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function zn(t){return t?ee(t.eventDate,t.endDate,{month:"short"}):""}function re(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function Fn(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function ht(t,e="eventDate"){return Array.isArray(t)?[...t].sort((n,r)=>Ct(r,e)-Ct(n,e)):[]}function Ct(t,e){if(!t)return 0;const n=t[e];if(n){const r=Date.parse(n);if(!Number.isNaN(r))return r}if(t._createdAt){const r=Date.parse(t._createdAt);if(!Number.isNaN(r))return r}return 0}function mt(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function Kn(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(n=>n.classList.add("is-visible"));return}const e=new IntersectionObserver(n=>{n.forEach(r=>{r.isIntersecting&&(r.target.classList.add("is-visible"),e.unobserve(r.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(n=>e.observe(n))}function Zn(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const n=18,r={x:Math.min(window.innerWidth-n-24,window.innerWidth*.78),y:Math.min(window.innerHeight-n-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let i=performance.now(),a=!1,l=!0,s=null,f=!1,c=!1,u=null,b=null,p=0,g=!1,$=!1,w=null;const D=document.querySelector(".site-header"),G=document.querySelector(".hero"),U=document.querySelector("[data-golf-hole]"),N=document.querySelector("[data-golf-scoreboard]"),J=N?N.querySelector("[data-golf-score-value]"):null,H={x:0,y:0,active:!1},ie=n+16,ae=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(d=>Array.from(document.querySelectorAll(d))).filter(d=>d!==null&&d.isConnected),tt=document.querySelector(".hero-scroll"),oe=tt?tt.querySelector("span"):null,kt={x:.5,y:-32},xt={x:0,y:10},se=-80;function W(){e.style.transform=`translate3d(${r.x-n}px, ${r.y-n}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${r.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${r.textureOffsetY}px`)}function le(){var C;const d=document.querySelector(".hero-copy h1");if(!d)return null;const h="masco",y=(d.textContent||"").toLowerCase().lastIndexOf(h);if(y===-1)return null;const T=y+h.length-1,E=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);let A=0,k=E.nextNode();for(;k;){const _=k.textContent||"",q=_.length;if(T<A+q){const O=T-A;if(O<0||O>=q)return null;const Y=_.charAt(O);if(!Y||!Y.trim())return null;const P=document.createRange();P.setStart(k,O),P.setEnd(k,Math.min(O+1,q));const B=P.getBoundingClientRect();return(C=P.detach)==null||C.call(P),!B||!B.width&&!B.height?null:{left:B.left+window.scrollX,right:B.right+window.scrollX,top:B.top+window.scrollY,bottom:B.bottom+window.scrollY,width:B.width,height:B.height}}A+=q,k=E.nextNode()}return null}function et(){f||(s={x:r.x,y:r.y},f=!0)}function ce(){return s||{x:r.x,y:r.y}}function de(){p=0,J&&(J.textContent=p)}function ue(){$||(p+=1,J&&(J.textContent=p),$=!0,clearTimeout(w),w=window.setTimeout(()=>{$=!1},500))}function z(){$=!1,clearTimeout(w)}function fe(){N&&(N.classList.add("is-visible"),N.setAttribute("aria-hidden","false"),clearTimeout(b),b=window.setTimeout(()=>he(),3200))}function he(){N&&(N.classList.remove("is-visible"),N.setAttribute("aria-hidden","true"),de())}function me(){if(!U)return null;const d=U.getBoundingClientRect();if(!d.width||!d.height)return null;const h=window.scrollX,m=window.scrollY,v=n*.5,y=n*.2;return{centerX:d.left+h+d.width/2,centerY:d.top+m+d.height*.5,radiusX:d.width/2+v,radiusY:d.height/2+y}}function ge(d){if(!d)return!1;const h=r.x-d.centerX,m=r.y-d.centerY,v=h/d.radiusX,y=m/d.radiusY;return v*v+y*y<=1}function nt(d){const h=d.top+n+se,m=n+4;return Math.max(h,m)}function ye(){if(!G)return!0;const d=window.getComputedStyle(G),h=parseFloat(d.getPropertyValue("column-gap")||d.getPropertyValue("gap"))||0,m=G.clientWidth;if(!m)return!1;const y=280*3+h*2;return m>=y-.5}function pe(d={}){const h=le();if(!h)return!1;const m=it(),v=h.left+h.width/3+kt.x,y=h.top+h.height/30+kt.y,T=m.left+n+12,E=m.right-n-12,A=nt(m),k=m.bottom-n-12;return r.x=R(v,T,E),r.y=R(y,A,k),r.vx=0,r.vy=0,W(),d.recordHome&&et(),!0}function be(d={}){if(!tt)return!1;const h=Bt(oe||tt),m=it(),v=h.left+h.width/2+xt.x,y=h.bottom+n+xt.y,T=m.left+n+12,E=m.right-n-12,A=nt(m),k=m.bottom-n-12;return r.x=R(v,T,E),r.y=R(y,A,k),r.vx=0,r.vy=0,W(),d.recordHome&&et(),!0}function rt(d={}){const{recordHome:h=!1}=d;pe({recordHome:h})||be({recordHome:h})||(W(),h&&et())}function F(d={}){const{force:h=!1,skipReposition:m=!1}=d;if(c)return;const v=ye();if(!h&&v===l)return;const y=l;l=v,e.style.display=v?"":"none",v&&(!y||h)&&!m&&rt()}rt({recordHome:!0}),F({force:!0}),window.addEventListener("load",()=>{rt(),F({force:!0})},{once:!0}),requestAnimationFrame(()=>{rt(),F({force:!0})});function ve(d,h){if(c||!H.active)return;const m=.42;r.vx+=d*m,r.vy+=h*m;const v=34,y=Math.hypot(r.vx,r.vy);if(y>v){const k=v/y;r.vx*=k,r.vy*=k}const T=r.x-H.x,E=r.y-H.y,A=Math.hypot(T,E);if(A<n){const k=n-A,C=T/(A||1),_=E/(A||1);r.x+=C*(k+.5),r.y+=_*(k+.5)}}function $e(){const h=it(),m=h.left+n+8,v=h.right-n-8,y=nt(h),T=h.bottom-n-8;r.x<m?(r.x=m,r.vx=Math.abs(r.vx)*.78):r.x>v&&(r.x=v,r.vx=-Math.abs(r.vx)*.78),r.y<y?(r.y=y,r.vy=Math.abs(r.vy)*.78):r.y>T&&(r.y=T,r.vy=-Math.abs(r.vy)*.78)}function we(){for(const h of ae){if(!h.isConnected)continue;const m=h.getBoundingClientRect(),v=window.scrollX,y=window.scrollY,T={left:m.left+v,right:m.right+v,top:m.top+y,bottom:m.bottom+y};if(m.width===0||m.height===0||m.right<-40||m.left>window.innerWidth+40||m.bottom<-40||m.top>window.innerHeight+40)continue;const E=R(r.x,T.left,T.right),A=R(r.y,T.top,T.bottom),k=r.x-E,C=r.y-A,_=k*k+C*C;if(_>=n*n||k===0&&C===0)continue;const q=Math.sqrt(_)||1e-4,O=k/q,Y=C/q;r.x=E+O*(n+.5),r.y=A+Y*(n+.5);const P=r.vx*O+r.vy*Y;P>0||(r.vx-=(1+.72)*P*O,r.vy-=(1+.72)*P*Y)}}function it(){return D?Bt(D):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function ke(d){if(c)return;s||et(),c=!0,H.active=!1,g=!1,z(),a=!1,r.vx=0,r.vy=0,e.classList.remove("is-moving"),e.classList.add("is-sinking"),fe();const h=d.centerX-n,m=d.centerY-n*.6,v=.6;clearTimeout(u),e.style.transition="transform 320ms ease-in, opacity 320ms ease-in, box-shadow 320ms ease-in",e.style.transform=`translate3d(${h}px, ${m}px, 0) scale(${v})`,e.style.opacity="0",e.style.boxShadow="0 10px 20px rgba(15, 29, 51, 0.2)",u=window.setTimeout(()=>{const y=ce();r.x=y.x,r.y=y.y,r.vx=0,r.vy=0,e.style.transition="none",e.style.transform=`translate3d(${y.x-n}px, ${y.y-n}px, 0) scale(0.35)`,e.style.opacity="0",requestAnimationFrame(()=>{e.classList.remove("is-sinking"),e.classList.add("is-returning"),e.style.transition="transform 440ms cubic-bezier(0.18, 0.72, 0.22, 1.08), opacity 380ms ease-out, box-shadow 380ms ease-out",e.style.opacity="1",e.style.boxShadow="3px 4px 12px rgba(15, 29, 51, 0.25)",e.style.transform=`translate3d(${y.x-n}px, ${y.y-n}px, 0) scale(1)`}),u=window.setTimeout(()=>{e.classList.remove("is-returning","is-sinking"),e.style.transition="",e.style.opacity="",e.style.boxShadow="",W(),c=!1,F({force:!0,skipReposition:!0})},520)},360)}function Lt(){if(requestAnimationFrame(Lt),c)return;const d=performance.now(),h=Math.min((d-i)/16.666,3);if(i=d,r.x+=r.vx*h,r.y+=r.vy*h,r.vx*=Math.pow(.985,h),r.vy*=Math.pow(.985,h),Math.abs(r.vx)<.02&&(r.vx=0),Math.abs(r.vy)<.02&&(r.vy=0),$e(),we(),a=Math.hypot(r.vx,r.vy)>.35,l){const m=me();if(m&&ge(m)){ke(m);return}}a&&(r.textureOffsetX=Ot(r.textureOffsetX+r.vx*h*.32,12),r.textureOffsetY=Ot(r.textureOffsetY+r.vy*h*.32,12)),W()}window.addEventListener("pointermove",d=>{if(d.pointerType&&d.pointerType!=="mouse"&&d.pointerType!=="pen")return;const h=H.x,m=H.y,v=H.active,y=d.clientX+window.scrollX,T=d.clientY+window.scrollY;H.x=y,H.y=T,H.active=!0;const E=v?y-h:0,A=v?T-m:0;if(!v)return;const k=r.x-H.x,C=r.y-H.y,_=Math.hypot(k,C),q=g;if(g=_<=ie,!g)return;const O=Math.hypot(r.vx,r.vy);ve(E,A);const Y=Math.hypot(r.vx,r.vy),P=Y-O;if(!q&&!$){const B=Math.hypot(E,A);(P>.35||Y>1||B>1.2)&&ue()}},{passive:!0}),window.addEventListener("pointerleave",()=>{H.active=!1,g=!1,z()}),window.addEventListener("pointerout",d=>{d.relatedTarget||(H.active=!1,g=!1,z())}),window.addEventListener("blur",()=>{H.active=!1,g=!1,z()}),window.addEventListener("scroll",()=>{H.active=!1,g=!1,z()}),window.addEventListener("resize",()=>{if(!c){const d=it();r.x=R(r.x,d.left+n+8,d.right-n-8),r.y=R(r.y,nt(d),d.bottom-n-8)}F()}),requestAnimationFrame(Lt)}function R(t,e,n){return Math.min(Math.max(t,e),n)}function Ot(t,e){const n=t%e;return n<0?n+e:n}function Bt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
