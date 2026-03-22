import{f as Le,p as W}from"./sanityClient-De9uMa3J.js";function dt(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function jt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function Nt(t){return jt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function Rt(t){return t._type==="@list"}function Xt(t){return t._type==="@span"}function Vt(t){return t._type==="@text"}const At=["strong","em","code","underline","strike-through"];function Te(t,e,i){if(!dt(t)||!t.marks)return[];if(!t.marks.length)return[];const n=t.marks.slice(),r={};return n.forEach(a=>{r[a]=1;for(let l=e+1;l<i.length;l++){const s=i[l];if(s&&dt(s)&&Array.isArray(s.marks)&&s.marks.indexOf(a)!==-1)r[a]++;else break}}),n.sort((a,l)=>Se(r,a,l))}function Se(t,e,i){const n=t[e],r=t[i];if(n!==r)return r-n;const a=At.indexOf(e),l=At.indexOf(i);return a!==l?a-l:e.localeCompare(i)}function Me(t){var l;const{children:e}=t,i=t.markDefs??[];if(!e||!e.length)return[];const n=e.map(Te),r={_type:"@span",children:[],markType:"<unknown>"};let a=[r];for(let s=0;s<e.length;s++){const f=e[s];if(!f)continue;const c=n[s]||[];let u=1;if(a.length>1)for(u;u<a.length;u++){const g=((l=a[u])==null?void 0:l.markKey)||"",p=c.indexOf(g);if(p===-1)break;c.splice(p,1)}a=a.slice(0,u);let y=a[a.length-1];if(y){for(const g of c){const p=i==null?void 0:i.find(C=>C._key===g),w=p?p._type:g,k={_type:"@span",_key:f._key,children:[],markDef:p,markType:w,markKey:g};y.children.push(k),a.push(k),y=k}if(dt(f)){const g=f.text.split(`
`);for(let p=g.length;p-- >1;)g.splice(p,0,`
`);y.children=y.children.concat(g.map(p=>({_type:"@text",text:p})))}else y.children=y.children.concat(f)}}return r.children}function Ae(t,e){const i=[];let n;for(let r=0;r<t.length;r++){const a=t[r];if(a){if(!Nt(a)){i.push(a),n=void 0;continue}if(!n){n=lt(a,r,e),i.push(n);continue}if(He(a,n)){n.children.push(a);continue}if((a.level||1)>n.level){const l=lt(a,r,e);{const s=n.children[n.children.length-1],f={...s,children:[...s.children,l]};n.children[n.children.length-1]=f}n=l;continue}if((a.level||1)<n.level){const l=i[i.length-1],s=l&&bt(l,a);if(s){n=s,n.children.push(a);continue}n=lt(a,r,e),i.push(n);continue}if(a.listItem!==n.listItem){const l=i[i.length-1],s=l&&bt(l,{level:a.level||1});if(s&&s.listItem===a.listItem){n=s,n.children.push(a);continue}else{n=lt(a,r,e),i.push(n);continue}}console.warn("Unknown state encountered for block",a),i.push(a)}}return i}function He(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function lt(t,e,i){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:i,level:t.level||1,listItem:t.listItem,children:[t]}}function bt(t,e){const i=e.level||1,n=e.listItem||"normal",r=typeof e.listItem=="string";if(Rt(t)&&(t.level||1)===i&&r&&(t.listItem||"normal")===n)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!dt(a)?bt(a,e):void 0}function Gt(t){let e="";return t.children.forEach(i=>{Vt(i)?e+=i.text:Xt(i)&&(e+=Gt(i))}),e}const Ie=["http","https","mailto","tel"],Ee={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Ut(t){return Pe(t.replace(/[&<>"']/g,e=>`&${Ee[e]};`))}function Pe(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Ce(t){const e=(t||"").trim(),i=e.charAt(0);if(i==="#"||i==="/")return!0;const n=e.indexOf(":");if(n===-1)return!0;const r=e.slice(0,n).toLowerCase();if(Ie.indexOf(r)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&n>a)return!0;const l=e.indexOf("#");return l!==-1&&n>l}const De={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},Be=({children:t})=>`<li>${t}</li>`,Oe=({children:t,value:e})=>{const i=(e==null?void 0:e.href)||"";return Ce(i)?`<a href="${Ut(i)}">${t}</a>`:t},_e={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Oe},et=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,Wt=t=>et(`block type "${t}"`,"types"),qe=t=>et(`mark type "${t}"`,"marks"),Ye=t=>et(`block style "${t}"`,"block"),je=t=>et(`list style "${t}"`,"list"),Ne=t=>et(`list item style "${t}"`,"listItem");function Re(t){console.warn(t)}const Xe=({value:t,isInline:e})=>{const i=Wt(t._type);return e?`<span style="display:none">${i}</span>`:`<div style="display:none">${i}</div>`},Ve=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,Ge=({children:t})=>`<p>${t}</p>`,Ue=({children:t})=>`<ul>${t}</ul>`,We=({children:t})=>`<li>${t}</li>`,ze=()=>"<br/>",Fe={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},Ht={types:{},block:Fe,marks:_e,list:De,listItem:Be,hardBreak:ze,escapeHTML:Ut,unknownType:Xe,unknownMark:Ve,unknownList:Ue,unknownListItem:We,unknownBlockStyle:Ge};function Ke(t,e){const{block:i,list:n,listItem:r,marks:a,types:l,...s}=e;return{...t,block:J(t,e,"block"),list:J(t,e,"list"),listItem:J(t,e,"listItem"),marks:J(t,e,"marks"),types:J(t,e,"types"),...s}}function J(t,e,i){const n=e[i],r=t[i];return typeof n=="function"||n&&typeof r=="function"?n:n?{...r,...n}:r}function Ze(t,e={}){const{components:i,onMissingComponent:n=Re}=e,r=n||Je,a=Array.isArray(t)?t:[t],l=Ae(a,"html"),s=i?Ke(Ht,i):Ht,f=Qe(s,r);return l.map((c,u)=>f({node:c,index:u,isInline:!1,renderNode:f})).join("")}const Qe=(t,e)=>{function i(c){const{node:u,index:y,isInline:g}=c;return Rt(u)?r(u,y):Nt(u)?n(u,y):Xt(u)?a(u):jt(u)?l(u,y,g):Vt(u)?s(u):f(u,y,g)}function n(c,u){const y=It({node:c,index:u,isInline:!1,renderNode:i}),g=t.listItem,p=(typeof g=="function"?g:g[c.listItem])||t.unknownListItem;if(p===t.unknownListItem){const k=c.listItem||"bullet";e(Ne(k),{type:k,nodeType:"listItemStyle"})}let w=y.children;if(c.style&&c.style!=="normal"){const{listItem:k,...C}=c;w=i({node:C,index:u,isInline:!1})}return p({value:c,index:u,isInline:!1,renderNode:i,children:w})}function r(c,u){const y=c.children.map((w,k)=>i({node:w._key?w:{...w,_key:`li-${u}-${k}`},index:k,isInline:!1})),g=t.list,p=(typeof g=="function"?g:g[c.listItem])||t.unknownList;if(p===t.unknownList){const w=c.listItem||"bullet";e(je(w),{nodeType:"listStyle",type:w})}return p({value:c,index:u,isInline:!1,renderNode:i,children:y.join("")})}function a(c){const{markDef:u,markType:y,markKey:g}=c,p=t.marks[y]||t.unknownMark,w=c.children.map((k,C)=>i({node:k,index:C,isInline:!0}));return p===t.unknownMark&&e(qe(y),{nodeType:"mark",type:y}),p({text:Gt(c),value:u,markType:y,markKey:g,renderNode:i,children:w.join("")})}function l(c,u,y){const{_key:g,...p}=It({node:c,index:u,isInline:y,renderNode:i}),w=p.node.style||"normal",k=(typeof t.block=="function"?t.block:t.block[w])||t.unknownBlockStyle;return k===t.unknownBlockStyle&&e(Ye(w),{nodeType:"blockStyle",type:w}),k({...p,value:p.node,renderNode:i})}function s(c){if(c.text===`
`){const u=t.hardBreak;return u?u():`
`}return t.escapeHTML(c.text)}function f(c,u,y){const g=t.types[c._type];return g||e(Wt(c._type),{nodeType:"block",type:c._type}),(g||t.unknownType)({value:c,isInline:y,index:u,renderNode:i})}return i};function It(t){const{node:e,index:i,isInline:n,renderNode:r}=t,a=Me(e).map((l,s)=>r({node:l,isInline:!0,index:s,renderNode:r}));return{_key:e._key||`block-${i}`,children:a.join(""),index:i,isInline:n,node:e}}function Je(){}const ht="images/samuel-placeholder.svg",zt=ht,ct=/^[a-zA-Z0-9_-]{11}$/,L={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},E={meta:null,allItems:[],items:[],videos:[],photos:[]},tt={meta:null,items:[],totalCount:0},ut={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{tn(),Un();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await en(),window.location.hash&&setTimeout(()=>ie(window.location.hash),100),Qn(t),t||Jn()});function tn(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const i=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",i),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function en(){gt(!0);const t=await Le();if(!t)return Gn("Unable to load the latest content. Please try again shortly."),gt(!1),null;nn(t.site),rn(t.hero,t.site),an(t.about),on(t.resume),sn(t.academics);const e=yt(t.highlightEvents||[]);E.meta=t.highlightsSection,E.allItems=e,E.items=e.filter(pt),ln();const i=yt(t.videos||[],"eventDate");E.videos=i,tt.meta=t.videosSection,tt.items=i.filter(pt),tt.totalCount=i.length,cn();const n=yt(t.galleryPhotos||[],"shotDate");return E.photos=n,ut.meta=t.gallerySection,ut.items=n.filter(pt),dn(),fn(t.dualSport),hn(t.contact),gt(!1),kt(),t}function nn(t){var n;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const i=document.querySelector(".brand-mark");if(i)if((n=t.brandMarkImage)!=null&&n.url){const r=U(t.brandMarkImage.focalPoint||t.brandMarkImage.hotspot),a=r?` style="object-position: ${$(r)};"`:"";i.innerHTML=`<span class="brand-mark-image"><img src="${$(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy"${a} /></span>`,i.classList.add("has-image")}else{const r=t.brandMarkInitials||Wn(t.siteTitle)||i.textContent||"SM";i.textContent=r,i.classList.remove("has-image")}}function rn(t,e){var a,l,s,f;const i=T(L.heroCopy),n=T(L.heroPhoto),r=T(L.heroMetrics);if(!t){i&&(i.innerHTML=H("Hero content coming soon."));return}if(i){const c=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",u=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",y=t.bio?`<p>${o(t.bio)}</p>`:"",g=[Bt(t.primaryCta,"primary","View Highlights","#highlights"),Bt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");i.innerHTML=`
      ${c}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${u}
      </h1>
      ${y}
      <div class="hero-actions">
        ${g||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(n){const c=((a=t.headshot)==null?void 0:a.url)||ht,u=((l=t.headshot)==null?void 0:l.alt)||"Portrait of Samuel Masco",y=t.photoCaption||"Focused on the next shot.",g=U(((s=t.headshot)==null?void 0:s.focalPoint)||((f=t.headshot)==null?void 0:f.hotspot)),p=g?` style="object-position: ${$(g)};"`:"";n.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${c}" alt="${o(u)}" loading="lazy"${p} />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${o(y)}</figcaption>
    `}r&&(Array.isArray(t.metrics)&&t.metrics.length?r.innerHTML=t.metrics.map(c=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${o(c.label||"")}</span>
              <span class="metric-value">${o(c.value||"")}</span>
            </div>
          `).join(""):r.innerHTML=H("Metrics coming soon."))}function an(t){const e=T(L.aboutHeading),i=T(L.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"About")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("About section coming soon.")),i){if(!t){i.innerHTML=H("About details coming soon.");return}i.innerHTML=`
      <article class="about-card" data-motion="delay-1">
        <h3>${o(t.profileCardTitle||"Profile")}</h3>
        <ul>
          ${(t.profileFacts||[]).map(n=>`
                <li><strong>${o(n.label||"")}: </strong>${o(n.value||"")}</li>
              `).join("")}
        </ul>
      </article>
      <article class="about-card about-story" data-motion="delay-2">
        <h3>${o(t.mindsetTitle||"Mindset & Goals")}</h3>
        ${xt(t.mindsetBody)}
      </article>
      <article class="about-card about-highlight" data-motion="delay-3">
        <h3>${o(t.quickHitsTitle||"Quick Hits")}</h3>
        ${(t.quickHits||[]).map(n=>`
              <div class="highlight-row">
                <span>${o(n.label||"")}</span>
                <span>${o(n.value||"")}</span>
              </div>
            `).join("")}
      </article>
    `}}function on(t){const e=T(L.resumeHeading),i=T(L.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Golf Resume")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Golf resume coming soon.")),i){if(!t){i.innerHTML=H("Resume details coming soon.");return}i.innerHTML=`
      <article class="panel" data-motion="delay-1">
        <h3>${o(t.performanceTitle||"Performance Snapshot")}</h3>
        <dl>
          ${(t.performanceStats||[]).map(n=>`
                <div>
                  <dt>${o(n.label||"")}</dt>
                  <dd>${o(n.value||"")}</dd>
                </div>
              `).join("")}
        </dl>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${o(t.trainingTitle||"Training Routine")}</h3>
        ${xt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(n=>`<li>${o(n||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function sn(t){const e=T(L.academicsHeading),i=T(L.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Academics")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Academics section coming soon.")),i){if(!t){i.innerHTML=H("Academic details coming soon.");return}const n=t.transcriptLabel||"Transcript",r=t.transcriptUrl?`<a class="btn subtle" href="${$(t.transcriptUrl)}" target="_blank" rel="noopener">${o(n)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${o(n)}</span>`;i.innerHTML=`
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
        ${xt(t.interestsBody)}
      </article>
    `}}function ln(){const t=E.meta,e=E.items||[],i=T(L.highlightsHeading),n=T(L.highlightsTimeline),r=T(L.highlightsActions);if(i&&(i.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Highlights coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||5,l=e.slice(0,a);if(!l.length){n.innerHTML=H("Highlight events coming soon."),r&&(r.innerHTML="");return}n.innerHTML=l.map((s,f)=>gn(s,f)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),wt(n),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function cn(){const t=tt.meta,e=tt.items||[],i=T(L.videosHeading),n=T(L.videoGrid),r=T(L.videosActions);if(i&&(i.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Videos coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||3,l=e.slice(0,a);if(!l.length){n.innerHTML=H("Video highlights coming soon."),r&&(r.innerHTML="");return}n.innerHTML=l.map((s,f)=>jn(s,f)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),kt(),wt(n),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function dn(){const t=ut.meta,e=ut.items||[],i=T(L.galleryHeading),n=T(L.galleryGrid),r=T(L.galleryActions);if(i){const s=(t==null?void 0:t.heading)||"Photo Gallery",f=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";i.innerHTML=`
      <h2>${o(s)}</h2>
      ${`<p>${o(f)}</p>`}
    `}if(!n)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),l=e.slice(0,a);if(!l.length){n.innerHTML=H("Gallery photos coming soon."),r&&(r.innerHTML="");return}if(n.innerHTML=l.map((s,f)=>un(s,f)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),ne(n),wt(n),r){const s="gallery.html",f=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";r.innerHTML=`<a class="btn ghost" href="${$(s)}">${o(f)}</a>`}}function un(t,e=0){var F,D,X,M,nt;const i=((F=t==null?void 0:t.image)==null?void 0:F.url)||ht,n=((D=t==null?void 0:t.image)==null?void 0:D.alt)||(t==null?void 0:t.title)||"Gallery highlight",r=Jt(t,{variant:"card"}),a=Zn(t==null?void 0:t.shotDate),l=a?te(a):"",s=(X=t==null?void 0:t.image)!=null&&X.url?{src:i,alt:n,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,f=s?`data-photo-src="${$(s.src)}" data-photo-alt="${$(s.alt)}" data-photo-title="${$(s.title)}"`:"",c=[];t!=null&&t.location&&c.push(t.location);const u=c.map(Lt=>`<span>${o(Lt)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),y=u?`<div class="gallery-card-meta">${u}</div>`:"",g=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",p=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",w=p?`<div class="gallery-card-footer">${p}</div>`:"",k=s?`data-photo-preview="true" ${f}`:"",C=U(((M=t==null?void 0:t.image)==null?void 0:M.focalPoint)||((nt=t==null?void 0:t.image)==null?void 0:nt.hotspot)),z=C?` style="object-position: ${$(C)};"`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${k?` ${k}`:""}>
        ${l}
        <img src="${$(i)}" alt="${o(n)}" loading="lazy"${z} />
      </div>
      <div class="gallery-card-body">
        ${y}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${r?`<div class="card-chip-slot">${r}</div>`:""}
        ${g}
        ${vt(t==null?void 0:t.tags)}
        ${w}
      </div>
    </article>
  `}function vt(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(i=>typeof i=="string"?i.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(i=>`<span class="gallery-tag">${o(i)}</span>`).join("")}
    </div>
  `:""}function fn(t){const e=T(L.dualHeading),i=T(L.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Dual-sport content coming soon.")),i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=H("Dual-sport cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>{var f,c,u;const a=U(((f=n==null?void 0:n.image)==null?void 0:f.focalPoint)||((c=n==null?void 0:n.image)==null?void 0:c.hotspot)),l=a?` style="object-position: ${$(a)};"`:"",s=(u=n==null?void 0:n.image)!=null&&u.url?`
              <div class="dual-card-media">
                <img
                  src="${$(n.image.url)}"
                  alt="${o(n.image.alt||n.title||"Dual-sport card image")}"
                  loading="lazy"${l}
                />
              </div>
            `:"";return`
          <article class="dual-card" data-motion="delay-${r+1}">
            ${s}
            <h3>${o(n.title||"")}</h3>
            ${n.body?`<p>${o(n.body)}</p>`:""}
            ${Array.isArray(n.bulletPoints)&&n.bulletPoints.length?`<ul>${n.bulletPoints.map(y=>`<li>${o(y||"")}</li>`).join("")}</ul>`:""}
          </article>
        `}).join("")}}function hn(t){const e=T(L.contactHeading),i=T(L.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Contact section coming soon.")),!!i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=H("Contact cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${o(n.title||"")}</h3>
          <ul>
            ${(n.entries||[]).map(a=>`<li>${mn(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function mn(t){var r;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",i=zn(t.value),n=(r=t.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&i.length<=1?`${e}<a href="${$(t.link)}"${n}>${o(t.value||t.link)}</a>`:i.length?`${e}${i.map((a,l)=>{const s=l===0&&t.link?t.link:a.link;if(s){const c=s.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${$(s)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function gn(t,e){const i=Kn(t),n=t.summary?`<p>${o(t.summary)}</p>`:"",r=Array.isArray(t.days)?t.days:[],a=Ft(r,{variant:"compact"}),l=`home-highlight-${e}`,s=(t==null?void 0:t._id)||(t==null?void 0:t.title)||l,c=`<div class="highlight-row-actions">${`
    <button class="highlight-toggle" type="button" data-highlight-modal="${$(s)}">
      View Details
    </button>
  `}</div>`;return`
    <article class="timeline-card" data-motion="delay-${e+1}">
      <header>
        <div class="highlight-row">
          <h3>${o(t.title||"")}</h3>
          ${c}
        </div>
        ${i?`<span class="timeline-date">${i}</span>`:""}
      </header>
      ${a}
      ${n}
    </article>
  `}function Ft(t=[],{variant:e="default",showLabels:i}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,r=typeof i=="boolean"?i:n>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",n===1?"day-stats--single":"",`day-stats--cols-${Math.min(n,3)}`].filter(Boolean).join(" ")}">
      ${t.map((l,s)=>pn(l,s,{showLabels:r,total:n})).join("")}
    </div>
  `}const Et=120,yn=57;function pn(t,e,{showLabels:i,total:n}){if(!t)return"";const r=n===1,a=!r&&i?ee(t,e,n):null,l=bn(t);return l?`
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
      ${t.map(e=>{const i=e.secondary?`<span class="day-metric-secondary">${o(e.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${e.key}">
              <span class="day-metric-value">${o(e.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${o(e.label)}
                  ${i}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function $n(t=[]){if(!Array.isArray(t))return"";const e=t.map((i,n)=>{if(!(i!=null&&i.notes))return"";const r=ee(i,n,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(r)}</strong>
          <p>${o(i.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function wt(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const n=e.getAttribute("data-highlight-modal");kn(n)}))})}let V=null;function wn(){if(V)return V;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&Pt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Pt()}),document.body.appendChild(t),V=t,t}function kn(t){const e=wn(),i=e.querySelector("[data-highlight-overlay-body]");if(!i)return;const n=Kt(t);if(!n)return;const r=An(n),a=Hn(n);i.innerHTML=xn(n,r,a),kt(i),ne(i),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function Pt(){if(!V)return;const t=V.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),V.classList.remove("is-open"),V.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Kt(t){const e=[];if(Array.isArray(E.items)&&e.push(E.items),Array.isArray(E.allItems)&&e.push(E.allItems),!t)return e[0]&&e[0][0]||e[1]&&e[1][0]||null;for(const i of e){const n=i.find(a=>((a==null?void 0:a._id)||"")===t);if(n)return n;const r=i.find(a=>(a==null?void 0:a.title)===t);if(r)return r}return null}function xn(t,e,i){const r=[Cn(t),t.location?o(t.location):null].filter(Boolean),a=r.length?`<div class="highlight-overlay-meta">
        ${r.map(f=>`<span>${f}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",l=Ft(t.days||[],{variant:"list"}),s=$n(t.days||[]);return`
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
        ${Sn(i)}
      </section>
    </div>
  `}function Ln(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(Tn).join("")}
    </div>
  `}function Tn(t){const e=ae(t),i=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:zt),n=t.thumbnailAlt||t.title||"Video highlight",r=t.title||"Video highlight",l=!!e?"":' disabled aria-disabled="true"',s=$t?$t(t):"",f=U(t.thumbnailFocalPoint||t.thumbnailHotspot),c=f?` style="object-position: ${$(f)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${o(e)}" data-video-title="${o(r)}">
        <img src="${$(i)}" alt="${o(n)}" loading="lazy"${c} />
        <button class="play-button" type="button"${l} aria-label="Play ${o(r)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${o(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${o(t.description)}</p>`:""}
        ${s}
      </div>
    </article>
  `}function Sn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(Mn).join("")}
    </div>
  `}function Mn(t){var f,c,u,y,g;const e=((f=t==null?void 0:t.image)==null?void 0:f.url)||zt,i=((c=t==null?void 0:t.image)==null?void 0:c.alt)||(t==null?void 0:t.title)||"Gallery photo",n=(u=t==null?void 0:t.image)!=null&&u.url?{src:e,alt:i,title:(t==null?void 0:t.title)||"Gallery photo"}:null,r=n?`data-photo-preview="true" data-photo-src="${$(n.src)}" data-photo-alt="${$(n.alt)}" data-photo-title="${$(n.title)}"`:"",a=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",l=U(((y=t==null?void 0:t.image)==null?void 0:y.focalPoint)||((g=t==null?void 0:t.image)==null?void 0:g.hotspot)),s=l?` style="object-position: ${$(l)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${r?` ${r}`:""}>
        <img src="${$(e)}" alt="${o(i)}" loading="lazy"${s} />
      </div>
      <div class="gallery-card-body">
        <h4>${o((t==null?void 0:t.title)||"Gallery photo")}</h4>
        ${t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:""}
        ${vt?vt(t==null?void 0:t.tags):""}
        ${a?`<div class="gallery-card-footer">${a}</div>`:""}
      </div>
    </article>
  `}function An(t){return!t||!Array.isArray(E.videos)?[]:E.videos.filter(e=>Zt(e,t))}function Hn(t){return!t||!Array.isArray(E.photos)?[]:E.photos.filter(e=>Zt(e,t))}function Zt(t,e){const i=Qt(t);return i?!!(i.id&&(e!=null&&e._id)&&i.id===e._id||i.title&&(e!=null&&e.title)&&i.title===e.title):!1}function Qt(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function In(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function $t(t){const e=In(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(i=>`<span class="gallery-tag">${o(i)}</span>`).join("")}
    </div>
  `:""}function En(t){const e=Qt(t);if(!e||!e.title)return null;const i=e.id||e.title,n=i?Kt(i):null,r=n?n._id||n.title:null;return{label:(n==null?void 0:n.title)||e.title,targetId:r}}function Jt(t,{variant:e="inline"}={}){const i=En(t);if(!(i!=null&&i.label))return"";const n=["tournament-chip"];e==="card"&&n.push("tournament-chip--on-card"),e==="inline"&&n.push("tournament-chip--inline");const r=o(i.label),a=$(`View ${i.label} tournament details`),l=i.targetId?` data-highlight-modal="${$(i.targetId)}"`:"",s=i.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(i.targetId)}`:"tournament-highlights.html",f="a";return`
    <${f} class="${n.join(" ")}" href="${$(s)}"${l}${i.targetId?` aria-label="${a}"`:""}>
      <span class="tournament-chip-name">${r}</span>
    </${f}>
  `}function Pn(t){if(!t)return null;const e=W(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function te(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function Cn(t){return t?re(t.eventDate,t.endDate,{month:"long"}):""}function Dn(t){if(!t)return[];const e=[],i=ft(t.score),n=ft(t.yardage);e.push(mt({key:"score",label:"Score",display:typeof i=="number"?String(i):"—",progress:On(i)})),e.push(mt({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:_n(n,Bn(t,n))}));const r=Yn(t);return e.push(mt({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),e.filter(Boolean)}function mt({key:t,label:e,display:i,secondary:n,progress:r}){const a=i!=null&&i!==""?String(i):"—",l=n?String(n):"",s=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:t,label:e,display:a,secondary:l,progress:Math.max(0,s)}}function ee(t,e,i){return t.label?t.label:i>1?`Day ${e+1}`:null}function ft(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function Bn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function On(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=Et-yn;return(Et-t)/e}function _n(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function qn(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const i=(e-t)/(e-1);return Math.max(0,Math.min(i,1))}function Yn(t){const e=ft(t==null?void 0:t.rankingPosition),i=ft(t==null?void 0:t.rankingOutOf),n=qn(e,i);return typeof e=="number"?{display:String(e),secondary:typeof i=="number"?`of ${i}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function jn(t,e){const i=ae(t),n=t.thumbnailUrl||(i?`https://img.youtube.com/vi/${i}/hqdefault.jpg`:ht),r=t.thumbnailAlt||t.title||"Video highlight",a=t.title||"Video highlight",s=!!i?"":' disabled aria-disabled="true"',f=Jt(t,{variant:"card"}),c=Pn(t.eventDate),u=c?te(c):"",y=$t(t),g=U(t.thumbnailFocalPoint||t.thumbnailHotspot),p=g?` style="object-position: ${$(g)};"`:"";return`
    <article class="video-gallery-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(i)}" data-video-title="${o(a)}">
        ${u}
        <img src="${$(n)}" alt="${o(r)}" loading="lazy"${p} />
        <button class="play-button" type="button"${s} aria-label="Play ${o(a)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h3>${o(t.title||"")}</h3>
        ${f?`<div class="card-chip-slot">${f}</div>`:""}
        <p>${o(t.description||"")}</p>
        ${y}
      </div>
    </article>
  `}function kt(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(i=>{if(i.dataset.playerReady==="true")return;const n=i.querySelector(".play-button"),r=i.dataset.videoId,a=i.dataset.videoTitle||"Samuel Masco golf video highlight";!n||!r||(n.addEventListener("click",()=>{Rn(r,a)}),i.dataset.playerReady="true")})}let G=null;function Nn(){if(G)return G;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&Ct()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Ct()}),document.body.appendChild(t),G=t,t}function Rn(t,e){const i=Nn(),n=i.querySelector(".video-overlay-frame");if(!n)return;n.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",e),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",n.appendChild(r),i.classList.add("is-open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function Ct(){if(!G)return;const t=G.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),G.classList.remove("is-open"),G.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let R=null;function ne(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(i=>{i.dataset.photoPreviewReady!=="true"&&(i.addEventListener("click",n=>{n.target.closest(".tournament-chip")||Vn(i.getAttribute("data-photo-src"),i.getAttribute("data-photo-alt"),i.getAttribute("data-photo-title"))}),i.dataset.photoPreviewReady="true")})}function Xn(){if(R)return R;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&Dt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Dt()}),document.body.appendChild(t),R=t,t}function Vn(t,e,i){if(!t)return;const n=Xn(),r=n.querySelector("img"),a=n.querySelector("figcaption");!r||!a||(r.src=t,r.alt=e||i||"Gallery photo",a.textContent=i||e||"",n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function Dt(){if(!R)return;const t=R.querySelector("img"),e=R.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),R.classList.remove("is-open"),R.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function xt(t){return!Array.isArray(t)||!t.length?"":Ze(t)}function T(t){return t?document.querySelector(t):null}function H(t){return`<p class="placeholder-text">${o(t)}</p>`}function gt(t){document.body.dataset.contentLoading=String(t)}function Gn(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function Bt(t,e,i,n){const r=(t==null?void 0:t.label)||i,a=(t==null?void 0:t.href)||n;if(!r||!a)return"";const s=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${$(a)}"${s}>${o(r)}</a>`}function Un(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const i=e.getAttribute("href")||"";ie(i)&&t.preventDefault()})}function ie(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function re(t,e,{month:i="short"}={}){if(!t)return"";const n=W(t);if(!n)return o(t);if(!e)return n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});const r=W(e);if(!r)return`${n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=n.getFullYear()===r.getFullYear(),l=a&&n.getMonth()===r.getMonth();if(a&&l)return`${n.toLocaleDateString("en-US",{month:i})} ${n.getDate()}–${r.getDate()}, ${n.getFullYear()}`;if(a){const c=n.toLocaleDateString("en-US",{month:i,day:"numeric"}),u=r.toLocaleDateString("en-US",{month:i,day:"numeric"});return`${c} – ${u}, ${n.getFullYear()}`}const s=n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"}),f=r.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});return`${s} – ${f}`}function ae(t){return t?Ot(t.youtubeId)||Ot(t.youtubeUrl):""}function Ot(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(ct.test(e))return e;let i;try{i=new URL(e)}catch{try{i=new URL(`https://${e}`)}catch{return""}}const n=i.hostname.replace(/^www\./,"").toLowerCase();if(n==="youtu.be"){const r=i.pathname.split("/").filter(Boolean)[0];return r&&ct.test(r)?r:""}if(n==="youtube.com"||n.endsWith(".youtube.com")){const r=i.searchParams.get("v");if(r&&ct.test(r))return r;const a=i.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const l=a[1];return l&&ct.test(l)?l:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function $(t){return o(t)}function U(t){if(!t||typeof t.x!="number"||typeof t.y!="number")return"";const e=r=>Math.max(0,Math.min(1,r)),i=Math.round(e(t.x)*1e3)/10,n=Math.round(e(t.y)*1e3)/10;return`${i}% ${n}%`}function Wn(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(i=>i.charAt(0).toUpperCase()).join(""):""}function zn(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:Fn(r)})):[]}function Fn(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function Kn(t){return t?re(t.eventDate,t.endDate,{month:"short"}):""}function Zn(t){if(!t)return null;const e=W(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function yt(t,e="eventDate"){return Array.isArray(t)?[...t].sort((i,n)=>_t(n,e)-_t(i,e)):[]}function _t(t,e){if(!t)return 0;const i=t[e],n=W(i);if(n)return n.getTime();const r=W(t._createdAt);return r?r.getTime():0}function pt(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function Qn(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(i=>i.classList.add("is-visible"));return}const e=new IntersectionObserver(i=>{i.forEach(n=>{n.isIntersecting&&(n.target.classList.add("is-visible"),e.unobserve(n.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(i=>e.observe(i))}function Jn(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const i=18,n={x:Math.min(window.innerWidth-i-24,window.innerWidth*.78),y:Math.min(window.innerHeight-i-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let r=performance.now(),a=!1,l=!0,s=null,f=!1,c=!1,u=null,y=null,g=0,p=!1,w=!1,k=null;const C=document.querySelector(".site-header"),z=document.querySelector(".hero"),F=document.querySelector("[data-golf-hole]"),D=document.querySelector("[data-golf-scoreboard]"),X=D?D.querySelector("[data-golf-score-value]"):null,M={x:0,y:0,active:!1},nt=i+16,oe=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(d=>Array.from(document.querySelectorAll(d))).filter(d=>d!==null&&d.isConnected),it=document.querySelector(".hero-scroll"),se=it?it.querySelector("span"):null,Tt={x:.5,y:-32},St={x:0,y:10},le=-80;function K(){e.style.transform=`translate3d(${n.x-i}px, ${n.y-i}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${n.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${n.textureOffsetY}px`)}function ce(){var B;const d=document.querySelector(".hero-copy h1");if(!d)return null;const h="masco",b=(d.textContent||"").toLowerCase().lastIndexOf(h);if(b===-1)return null;const S=b+h.length-1,I=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);let A=0,x=I.nextNode();for(;x;){const q=x.textContent||"",Y=q.length;if(S<A+Y){const O=S-A;if(O<0||O>=Y)return null;const j=q.charAt(O);if(!j||!j.trim())return null;const P=document.createRange();P.setStart(x,O),P.setEnd(x,Math.min(O+1,Y));const _=P.getBoundingClientRect();return(B=P.detach)==null||B.call(P),!_||!_.width&&!_.height?null:{left:_.left+window.scrollX,right:_.right+window.scrollX,top:_.top+window.scrollY,bottom:_.bottom+window.scrollY,width:_.width,height:_.height}}A+=Y,x=I.nextNode()}return null}function rt(){f||(s={x:n.x,y:n.y},f=!0)}function de(){return s||{x:n.x,y:n.y}}function ue(){g=0,X&&(X.textContent=g)}function fe(){w||(g+=1,X&&(X.textContent=g),w=!0,clearTimeout(k),k=window.setTimeout(()=>{w=!1},500))}function Z(){w=!1,clearTimeout(k)}function he(){D&&(D.classList.add("is-visible"),D.setAttribute("aria-hidden","false"),clearTimeout(y),y=window.setTimeout(()=>me(),3200))}function me(){D&&(D.classList.remove("is-visible"),D.setAttribute("aria-hidden","true"),ue())}function ge(){if(!F)return null;const d=F.getBoundingClientRect();if(!d.width||!d.height)return null;const h=window.scrollX,m=window.scrollY,v=i*.5,b=i*.2;return{centerX:d.left+h+d.width/2,centerY:d.top+m+d.height*.5,radiusX:d.width/2+v,radiusY:d.height/2+b}}function ye(d){if(!d)return!1;const h=n.x-d.centerX,m=n.y-d.centerY,v=h/d.radiusX,b=m/d.radiusY;return v*v+b*b<=1}function at(d){const h=d.top+i+le,m=i+4;return Math.max(h,m)}function pe(){if(!z)return!0;const d=window.getComputedStyle(z),h=parseFloat(d.getPropertyValue("column-gap")||d.getPropertyValue("gap"))||0,m=z.clientWidth;if(!m)return!1;const b=280*3+h*2;return m>=b-.5}function be(d={}){const h=ce();if(!h)return!1;const m=st(),v=h.left+h.width/3+Tt.x,b=h.top+h.height/30+Tt.y,S=m.left+i+12,I=m.right-i-12,A=at(m),x=m.bottom-i-12;return n.x=N(v,S,I),n.y=N(b,A,x),n.vx=0,n.vy=0,K(),d.recordHome&&rt(),!0}function ve(d={}){if(!it)return!1;const h=Yt(se||it),m=st(),v=h.left+h.width/2+St.x,b=h.bottom+i+St.y,S=m.left+i+12,I=m.right-i-12,A=at(m),x=m.bottom-i-12;return n.x=N(v,S,I),n.y=N(b,A,x),n.vx=0,n.vy=0,K(),d.recordHome&&rt(),!0}function ot(d={}){const{recordHome:h=!1}=d;be({recordHome:h})||ve({recordHome:h})||(K(),h&&rt())}function Q(d={}){const{force:h=!1,skipReposition:m=!1}=d;if(c)return;const v=pe();if(!h&&v===l)return;const b=l;l=v,e.style.display=v?"":"none",v&&(!b||h)&&!m&&ot()}ot({recordHome:!0}),Q({force:!0}),window.addEventListener("load",()=>{ot(),Q({force:!0})},{once:!0}),requestAnimationFrame(()=>{ot(),Q({force:!0})});function $e(d,h){if(c||!M.active)return;const m=.42;n.vx+=d*m,n.vy+=h*m;const v=34,b=Math.hypot(n.vx,n.vy);if(b>v){const x=v/b;n.vx*=x,n.vy*=x}const S=n.x-M.x,I=n.y-M.y,A=Math.hypot(S,I);if(A<i){const x=i-A,B=S/(A||1),q=I/(A||1);n.x+=B*(x+.5),n.y+=q*(x+.5)}}function we(){const h=st(),m=h.left+i+8,v=h.right-i-8,b=at(h),S=h.bottom-i-8;n.x<m?(n.x=m,n.vx=Math.abs(n.vx)*.78):n.x>v&&(n.x=v,n.vx=-Math.abs(n.vx)*.78),n.y<b?(n.y=b,n.vy=Math.abs(n.vy)*.78):n.y>S&&(n.y=S,n.vy=-Math.abs(n.vy)*.78)}function ke(){for(const h of oe){if(!h.isConnected)continue;const m=h.getBoundingClientRect(),v=window.scrollX,b=window.scrollY,S={left:m.left+v,right:m.right+v,top:m.top+b,bottom:m.bottom+b};if(m.width===0||m.height===0||m.right<-40||m.left>window.innerWidth+40||m.bottom<-40||m.top>window.innerHeight+40)continue;const I=N(n.x,S.left,S.right),A=N(n.y,S.top,S.bottom),x=n.x-I,B=n.y-A,q=x*x+B*B;if(q>=i*i||x===0&&B===0)continue;const Y=Math.sqrt(q)||1e-4,O=x/Y,j=B/Y;n.x=I+O*(i+.5),n.y=A+j*(i+.5);const P=n.vx*O+n.vy*j;P>0||(n.vx-=(1+.72)*P*O,n.vy-=(1+.72)*P*j)}}function st(){return C?Yt(C):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function xe(d){if(c)return;s||rt(),c=!0,M.active=!1,p=!1,Z(),a=!1,n.vx=0,n.vy=0,e.classList.remove("is-moving"),e.classList.add("is-sinking"),he();const h=d.centerX-i,m=d.centerY-i*.6,v=.6;clearTimeout(u),e.style.transition="transform 320ms ease-in, opacity 320ms ease-in, box-shadow 320ms ease-in",e.style.transform=`translate3d(${h}px, ${m}px, 0) scale(${v})`,e.style.opacity="0",e.style.boxShadow="0 10px 20px rgba(15, 29, 51, 0.2)",u=window.setTimeout(()=>{const b=de();n.x=b.x,n.y=b.y,n.vx=0,n.vy=0,e.style.transition="none",e.style.transform=`translate3d(${b.x-i}px, ${b.y-i}px, 0) scale(0.35)`,e.style.opacity="0",requestAnimationFrame(()=>{e.classList.remove("is-sinking"),e.classList.add("is-returning"),e.style.transition="transform 440ms cubic-bezier(0.18, 0.72, 0.22, 1.08), opacity 380ms ease-out, box-shadow 380ms ease-out",e.style.opacity="1",e.style.boxShadow="3px 4px 12px rgba(15, 29, 51, 0.25)",e.style.transform=`translate3d(${b.x-i}px, ${b.y-i}px, 0) scale(1)`}),u=window.setTimeout(()=>{e.classList.remove("is-returning","is-sinking"),e.style.transition="",e.style.opacity="",e.style.boxShadow="",K(),c=!1,Q({force:!0,skipReposition:!0})},520)},360)}function Mt(){if(requestAnimationFrame(Mt),c)return;const d=performance.now(),h=Math.min((d-r)/16.666,3);if(r=d,n.x+=n.vx*h,n.y+=n.vy*h,n.vx*=Math.pow(.985,h),n.vy*=Math.pow(.985,h),Math.abs(n.vx)<.02&&(n.vx=0),Math.abs(n.vy)<.02&&(n.vy=0),we(),ke(),a=Math.hypot(n.vx,n.vy)>.35,l){const m=ge();if(m&&ye(m)){xe(m);return}}a&&(n.textureOffsetX=qt(n.textureOffsetX+n.vx*h*.32,12),n.textureOffsetY=qt(n.textureOffsetY+n.vy*h*.32,12)),K()}window.addEventListener("pointermove",d=>{if(d.pointerType&&d.pointerType!=="mouse"&&d.pointerType!=="pen")return;const h=M.x,m=M.y,v=M.active,b=d.clientX+window.scrollX,S=d.clientY+window.scrollY;M.x=b,M.y=S,M.active=!0;const I=v?b-h:0,A=v?S-m:0;if(!v)return;const x=n.x-M.x,B=n.y-M.y,q=Math.hypot(x,B),Y=p;if(p=q<=nt,!p)return;const O=Math.hypot(n.vx,n.vy);$e(I,A);const j=Math.hypot(n.vx,n.vy),P=j-O;if(!Y&&!w){const _=Math.hypot(I,A);(P>.35||j>1||_>1.2)&&fe()}},{passive:!0}),window.addEventListener("pointerleave",()=>{M.active=!1,p=!1,Z()}),window.addEventListener("pointerout",d=>{d.relatedTarget||(M.active=!1,p=!1,Z())}),window.addEventListener("blur",()=>{M.active=!1,p=!1,Z()}),window.addEventListener("scroll",()=>{M.active=!1,p=!1,Z()}),window.addEventListener("resize",()=>{if(!c){const d=st();n.x=N(n.x,d.left+i+8,d.right-i-8),n.y=N(n.y,at(d),d.bottom-i-8)}Q()}),requestAnimationFrame(Mt)}function N(t,e,i){return Math.min(Math.max(t,e),i)}function qt(t,e){const i=t%e;return i<0?i+e:i}function Yt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
