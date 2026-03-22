import{f as ke,p as U}from"./sanityClient-CY7XfnrW.js";function ct(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function Yt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function jt(t){return Yt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function Nt(t){return t._type==="@list"}function Rt(t){return t._type==="@span"}function Xt(t){return t._type==="@text"}const At=["strong","em","code","underline","strike-through"];function Le(t,e,i){if(!ct(t)||!t.marks)return[];if(!t.marks.length)return[];const n=t.marks.slice(),r={};return n.forEach(a=>{r[a]=1;for(let l=e+1;l<i.length;l++){const s=i[l];if(s&&ct(s)&&Array.isArray(s.marks)&&s.marks.indexOf(a)!==-1)r[a]++;else break}}),n.sort((a,l)=>Te(r,a,l))}function Te(t,e,i){const n=t[e],r=t[i];if(n!==r)return r-n;const a=At.indexOf(e),l=At.indexOf(i);return a!==l?a-l:e.localeCompare(i)}function Se(t){var l;const{children:e}=t,i=t.markDefs??[];if(!e||!e.length)return[];const n=e.map(Le),r={_type:"@span",children:[],markType:"<unknown>"};let a=[r];for(let s=0;s<e.length;s++){const f=e[s];if(!f)continue;const c=n[s]||[];let u=1;if(a.length>1)for(u;u<a.length;u++){const y=((l=a[u])==null?void 0:l.markKey)||"",g=c.indexOf(y);if(g===-1)break;c.splice(g,1)}a=a.slice(0,u);let p=a[a.length-1];if(p){for(const y of c){const g=i==null?void 0:i.find(C=>C._key===y),w=g?g._type:y,x={_type:"@span",_key:f._key,children:[],markDef:g,markType:w,markKey:y};p.children.push(x),a.push(x),p=x}if(ct(f)){const y=f.text.split(`
`);for(let g=y.length;g-- >1;)y.splice(g,0,`
`);p.children=p.children.concat(y.map(g=>({_type:"@text",text:g})))}else p.children=p.children.concat(f)}}return r.children}function Ae(t,e){const i=[];let n;for(let r=0;r<t.length;r++){const a=t[r];if(a){if(!jt(a)){i.push(a),n=void 0;continue}if(!n){n=st(a,r,e),i.push(n);continue}if(Me(a,n)){n.children.push(a);continue}if((a.level||1)>n.level){const l=st(a,r,e);{const s=n.children[n.children.length-1],f={...s,children:[...s.children,l]};n.children[n.children.length-1]=f}n=l;continue}if((a.level||1)<n.level){const l=i[i.length-1],s=l&&bt(l,a);if(s){n=s,n.children.push(a);continue}n=st(a,r,e),i.push(n);continue}if(a.listItem!==n.listItem){const l=i[i.length-1],s=l&&bt(l,{level:a.level||1});if(s&&s.listItem===a.listItem){n=s,n.children.push(a);continue}else{n=st(a,r,e),i.push(n);continue}}console.warn("Unknown state encountered for block",a),i.push(a)}}return i}function Me(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function st(t,e,i){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:i,level:t.level||1,listItem:t.listItem,children:[t]}}function bt(t,e){const i=e.level||1,n=e.listItem||"normal",r=typeof e.listItem=="string";if(Nt(t)&&(t.level||1)===i&&r&&(t.listItem||"normal")===n)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!ct(a)?bt(a,e):void 0}function Vt(t){let e="";return t.children.forEach(i=>{Xt(i)?e+=i.text:Rt(i)&&(e+=Vt(i))}),e}const He=["http","https","mailto","tel"],Ee={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Gt(t){return Ie(t.replace(/[&<>"']/g,e=>`&${Ee[e]};`))}function Ie(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Pe(t){const e=(t||"").trim(),i=e.charAt(0);if(i==="#"||i==="/")return!0;const n=e.indexOf(":");if(n===-1)return!0;const r=e.slice(0,n).toLowerCase();if(He.indexOf(r)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&n>a)return!0;const l=e.indexOf("#");return l!==-1&&n>l}const Ce={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},De=({children:t})=>`<li>${t}</li>`,Be=({children:t,value:e})=>{const i=(e==null?void 0:e.href)||"";return Pe(i)?`<a href="${Gt(i)}">${t}</a>`:t},Oe={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Be},tt=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,Ut=t=>tt(`block type "${t}"`,"types"),_e=t=>tt(`mark type "${t}"`,"marks"),qe=t=>tt(`block style "${t}"`,"block"),Ye=t=>tt(`list style "${t}"`,"list"),je=t=>tt(`list item style "${t}"`,"listItem");function Ne(t){console.warn(t)}const Re=({value:t,isInline:e})=>{const i=Ut(t._type);return e?`<span style="display:none">${i}</span>`:`<div style="display:none">${i}</div>`},Xe=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,Ve=({children:t})=>`<p>${t}</p>`,Ge=({children:t})=>`<ul>${t}</ul>`,Ue=({children:t})=>`<li>${t}</li>`,We=()=>"<br/>",ze={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},Mt={types:{},block:ze,marks:Oe,list:Ce,listItem:De,hardBreak:We,escapeHTML:Gt,unknownType:Re,unknownMark:Xe,unknownList:Ge,unknownListItem:Ue,unknownBlockStyle:Ve};function Fe(t,e){const{block:i,list:n,listItem:r,marks:a,types:l,...s}=e;return{...t,block:Q(t,e,"block"),list:Q(t,e,"list"),listItem:Q(t,e,"listItem"),marks:Q(t,e,"marks"),types:Q(t,e,"types"),...s}}function Q(t,e,i){const n=e[i],r=t[i];return typeof n=="function"||n&&typeof r=="function"?n:n?{...r,...n}:r}function Ke(t,e={}){const{components:i,onMissingComponent:n=Ne}=e,r=n||Qe,a=Array.isArray(t)?t:[t],l=Ae(a,"html"),s=i?Fe(Mt,i):Mt,f=Ze(s,r);return l.map((c,u)=>f({node:c,index:u,isInline:!1,renderNode:f})).join("")}const Ze=(t,e)=>{function i(c){const{node:u,index:p,isInline:y}=c;return Nt(u)?r(u,p):jt(u)?n(u,p):Rt(u)?a(u):Yt(u)?l(u,p,y):Xt(u)?s(u):f(u,p,y)}function n(c,u){const p=Ht({node:c,index:u,isInline:!1,renderNode:i}),y=t.listItem,g=(typeof y=="function"?y:y[c.listItem])||t.unknownListItem;if(g===t.unknownListItem){const x=c.listItem||"bullet";e(je(x),{type:x,nodeType:"listItemStyle"})}let w=p.children;if(c.style&&c.style!=="normal"){const{listItem:x,...C}=c;w=i({node:C,index:u,isInline:!1})}return g({value:c,index:u,isInline:!1,renderNode:i,children:w})}function r(c,u){const p=c.children.map((w,x)=>i({node:w._key?w:{...w,_key:`li-${u}-${x}`},index:x,isInline:!1})),y=t.list,g=(typeof y=="function"?y:y[c.listItem])||t.unknownList;if(g===t.unknownList){const w=c.listItem||"bullet";e(Ye(w),{nodeType:"listStyle",type:w})}return g({value:c,index:u,isInline:!1,renderNode:i,children:p.join("")})}function a(c){const{markDef:u,markType:p,markKey:y}=c,g=t.marks[p]||t.unknownMark,w=c.children.map((x,C)=>i({node:x,index:C,isInline:!0}));return g===t.unknownMark&&e(_e(p),{nodeType:"mark",type:p}),g({text:Vt(c),value:u,markType:p,markKey:y,renderNode:i,children:w.join("")})}function l(c,u,p){const{_key:y,...g}=Ht({node:c,index:u,isInline:p,renderNode:i}),w=g.node.style||"normal",x=(typeof t.block=="function"?t.block:t.block[w])||t.unknownBlockStyle;return x===t.unknownBlockStyle&&e(qe(w),{nodeType:"blockStyle",type:w}),x({...g,value:g.node,renderNode:i})}function s(c){if(c.text===`
`){const u=t.hardBreak;return u?u():`
`}return t.escapeHTML(c.text)}function f(c,u,p){const y=t.types[c._type];return y||e(Ut(c._type),{nodeType:"block",type:c._type}),(y||t.unknownType)({value:c,isInline:p,index:u,renderNode:i})}return i};function Ht(t){const{node:e,index:i,isInline:n,renderNode:r}=t,a=Se(e).map((l,s)=>r({node:l,isInline:!0,index:s,renderNode:r}));return{_key:e._key||`block-${i}`,children:a.join(""),index:i,isInline:n,node:e}}function Qe(){}const ft="images/samuel-placeholder.svg",Wt=ft,lt=/^[a-zA-Z0-9_-]{11}$/,L={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},I={meta:null,allItems:[],items:[],videos:[],photos:[]},J={meta:null,items:[],totalCount:0},dt={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{Je(),Gn();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await tn(),window.location.hash&&setTimeout(()=>ne(window.location.hash),100),Zn(t),t||Qn()});function Je(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const i=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",i),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function tn(){gt(!0);const t=await ke();if(!t)return Vn("Unable to load the latest content. Please try again shortly."),gt(!1),null;en(t.site),nn(t.hero,t.site),rn(t.about),an(t.resume),on(t.academics);const e=yt(t.highlightEvents||[]);I.meta=t.highlightsSection,I.allItems=e,I.items=e.filter(pt),sn();const i=yt(t.videos||[],"eventDate");I.videos=i,J.meta=t.videosSection,J.items=i.filter(pt),J.totalCount=i.length,ln();const n=yt(t.galleryPhotos||[],"shotDate");return I.photos=n,dt.meta=t.gallerySection,dt.items=n.filter(pt),cn(),un(t.dualSport),fn(t.contact),gt(!1),xt(),t}function en(t){var n;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const i=document.querySelector(".brand-mark");if(i)if((n=t.brandMarkImage)!=null&&n.url)i.innerHTML=`<span class="brand-mark-image"><img src="${$(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,i.classList.add("has-image");else{const r=t.brandMarkInitials||Un(t.siteTitle)||i.textContent||"SM";i.textContent=r,i.classList.remove("has-image")}}function nn(t,e){var a,l;const i=T(L.heroCopy),n=T(L.heroPhoto),r=T(L.heroMetrics);if(!t){i&&(i.innerHTML=H("Hero content coming soon."));return}if(i){const s=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",f=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",c=t.bio?`<p>${o(t.bio)}</p>`:"",u=[Dt(t.primaryCta,"primary","View Highlights","#highlights"),Dt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");i.innerHTML=`
      ${s}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${f}
      </h1>
      ${c}
      <div class="hero-actions">
        ${u||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(n){const s=((a=t.headshot)==null?void 0:a.url)||ft,f=((l=t.headshot)==null?void 0:l.alt)||"Portrait of Samuel Masco",c=t.photoCaption||"Focused on the next shot.";n.innerHTML=`
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
          `).join(""):r.innerHTML=H("Metrics coming soon."))}function rn(t){const e=T(L.aboutHeading),i=T(L.aboutGrid);if(e&&(e.innerHTML=t?`
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
        ${kt(t.mindsetBody)}
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
    `}}function an(t){const e=T(L.resumeHeading),i=T(L.resumePanels);if(e&&(e.innerHTML=t?`
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
        ${kt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(n=>`<li>${o(n||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function on(t){const e=T(L.academicsHeading),i=T(L.academicsGrid);if(e&&(e.innerHTML=t?`
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
        ${kt(t.interestsBody)}
      </article>
    `}}function sn(){const t=I.meta,e=I.items||[],i=T(L.highlightsHeading),n=T(L.highlightsTimeline),r=T(L.highlightsActions);if(i&&(i.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Highlights coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||5,l=e.slice(0,a);if(!l.length){n.innerHTML=H("Highlight events coming soon."),r&&(r.innerHTML="");return}n.innerHTML=l.map((s,f)=>mn(s,f)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),wt(n),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function ln(){const t=J.meta,e=J.items||[],i=T(L.videosHeading),n=T(L.videoGrid),r=T(L.videosActions);if(i&&(i.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Videos coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||3,l=e.slice(0,a);if(!l.length){n.innerHTML=H("Video highlights coming soon."),r&&(r.innerHTML="");return}n.innerHTML=l.map((s,f)=>Yn(s,f)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),xt(),wt(n),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function cn(){const t=dt.meta,e=dt.items||[],i=T(L.galleryHeading),n=T(L.galleryGrid),r=T(L.galleryActions);if(i){const s=(t==null?void 0:t.heading)||"Photo Gallery",f=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";i.innerHTML=`
      <h2>${o(s)}</h2>
      ${`<p>${o(f)}</p>`}
    `}if(!n)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),l=e.slice(0,a);if(!l.length){n.innerHTML=H("Gallery photos coming soon."),r&&(r.innerHTML="");return}if(n.innerHTML=l.map((s,f)=>dn(s,f)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),ee(n),wt(n),r){const s="gallery.html",f=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";r.innerHTML=`<a class="btn ghost" href="${$(s)}">${o(f)}</a>`}}function dn(t,e=0){var z,D,X,A;const i=((z=t==null?void 0:t.image)==null?void 0:z.url)||ft,n=((D=t==null?void 0:t.image)==null?void 0:D.alt)||(t==null?void 0:t.title)||"Gallery highlight",r=Qt(t,{variant:"card"}),a=Kn(t==null?void 0:t.shotDate),l=a?Jt(a):"",s=(X=t==null?void 0:t.image)!=null&&X.url?{src:i,alt:n,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,f=s?`data-photo-src="${$(s.src)}" data-photo-alt="${$(s.alt)}" data-photo-title="${$(s.title)}"`:"",c=[];t!=null&&t.location&&c.push(t.location);const u=c.map(ht=>`<span>${o(ht)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),p=u?`<div class="gallery-card-meta">${u}</div>`:"",y=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",g=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",w=g?`<div class="gallery-card-footer">${g}</div>`:"",x=s?`data-photo-preview="true" ${f}`:"",C=et((A=t==null?void 0:t.image)==null?void 0:A.hotspot),W=C?` style="object-position: ${$(C)};"`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${x?` ${x}`:""}>
        ${l}
        <img src="${$(i)}" alt="${o(n)}" loading="lazy"${W} />
      </div>
      <div class="gallery-card-body">
        ${p}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${r?`<div class="card-chip-slot">${r}</div>`:""}
        ${y}
        ${vt(t==null?void 0:t.tags)}
        ${w}
      </div>
    </article>
  `}function vt(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(i=>typeof i=="string"?i.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(i=>`<span class="gallery-tag">${o(i)}</span>`).join("")}
    </div>
  `:""}function un(t){const e=T(L.dualHeading),i=T(L.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Dual-sport content coming soon.")),i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=H("Dual-sport cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>{var f,c;const a=et((f=n==null?void 0:n.image)==null?void 0:f.hotspot),l=a?` style="object-position: ${$(a)};"`:"",s=(c=n==null?void 0:n.image)!=null&&c.url?`
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
            ${Array.isArray(n.bulletPoints)&&n.bulletPoints.length?`<ul>${n.bulletPoints.map(u=>`<li>${o(u||"")}</li>`).join("")}</ul>`:""}
          </article>
        `}).join("")}}function fn(t){const e=T(L.contactHeading),i=T(L.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Contact section coming soon.")),!!i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=H("Contact cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${o(n.title||"")}</h3>
          <ul>
            ${(n.entries||[]).map(a=>`<li>${hn(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function hn(t){var r;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",i=Wn(t.value),n=(r=t.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&i.length<=1?`${e}<a href="${$(t.link)}"${n}>${o(t.value||t.link)}</a>`:i.length?`${e}${i.map((a,l)=>{const s=l===0&&t.link?t.link:a.link;if(s){const c=s.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${$(s)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function mn(t,e){const i=Fn(t),n=t.summary?`<p>${o(t.summary)}</p>`:"",r=Array.isArray(t.days)?t.days:[],a=zt(r,{variant:"compact"}),l=`home-highlight-${e}`,s=(t==null?void 0:t._id)||(t==null?void 0:t.title)||l,c=`<div class="highlight-row-actions">${`
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
  `}function zt(t=[],{variant:e="default",showLabels:i}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,r=typeof i=="boolean"?i:n>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",n===1?"day-stats--single":"",`day-stats--cols-${Math.min(n,3)}`].filter(Boolean).join(" ")}">
      ${t.map((l,s)=>yn(l,s,{showLabels:r,total:n})).join("")}
    </div>
  `}const Et=120,gn=57;function yn(t,e,{showLabels:i,total:n}){if(!t)return"";const r=n===1,a=!r&&i?te(t,e,n):null,l=pn(t);return l?`
    <div class="day-stat${r?" day-stat--single":""}">
      ${a?`<span class="day-stat-label">${o(a)}</span>`:""}
      ${l}
    </div>
  `:""}function pn(t){const e=Cn(t);return e.length?`
    <div class="day-metrics">
      ${bn(e)}
    </div>
  `:""}function bn(t){return`
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
  `}function vn(t=[]){if(!Array.isArray(t))return"";const e=t.map((i,n)=>{if(!(i!=null&&i.notes))return"";const r=te(i,n,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(r)}</strong>
          <p>${o(i.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function wt(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const n=e.getAttribute("data-highlight-modal");wn(n)}))})}let V=null;function $n(){if(V)return V;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&It()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&It()}),document.body.appendChild(t),V=t,t}function wn(t){const e=$n(),i=e.querySelector("[data-highlight-overlay-body]");if(!i)return;const n=Ft(t);if(!n)return;const r=An(n),a=Mn(n);i.innerHTML=xn(n,r,a),xt(i),ee(i),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function It(){if(!V)return;const t=V.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),V.classList.remove("is-open"),V.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Ft(t){const e=[];if(Array.isArray(I.items)&&e.push(I.items),Array.isArray(I.allItems)&&e.push(I.allItems),!t)return e[0]&&e[0][0]||e[1]&&e[1][0]||null;for(const i of e){const n=i.find(a=>((a==null?void 0:a._id)||"")===t);if(n)return n;const r=i.find(a=>(a==null?void 0:a.title)===t);if(r)return r}return null}function xn(t,e,i){const r=[Pn(t),t.location?o(t.location):null].filter(Boolean),a=r.length?`<div class="highlight-overlay-meta">
        ${r.map(f=>`<span>${f}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",l=zt(t.days||[],{variant:"list"}),s=vn(t.days||[]);return`
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
        ${kn(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Tn(i)}
      </section>
    </div>
  `}function kn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(Ln).join("")}
    </div>
  `}function Ln(t){const e=re(t),i=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:Wt),n=t.thumbnailAlt||t.title||"Video highlight",r=t.title||"Video highlight",l=!!e?"":' disabled aria-disabled="true"',s=$t?$t(t):"",f=et(t.thumbnailHotspot),c=f?` style="object-position: ${$(f)};"`:"";return`
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
  `}function Tn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(Sn).join("")}
    </div>
  `}function Sn(t){var f,c,u,p;const e=((f=t==null?void 0:t.image)==null?void 0:f.url)||Wt,i=((c=t==null?void 0:t.image)==null?void 0:c.alt)||(t==null?void 0:t.title)||"Gallery photo",n=(u=t==null?void 0:t.image)!=null&&u.url?{src:e,alt:i,title:(t==null?void 0:t.title)||"Gallery photo"}:null,r=n?`data-photo-preview="true" data-photo-src="${$(n.src)}" data-photo-alt="${$(n.alt)}" data-photo-title="${$(n.title)}"`:"",a=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",l=et((p=t==null?void 0:t.image)==null?void 0:p.hotspot),s=l?` style="object-position: ${$(l)};"`:"";return`
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
  `}function An(t){return!t||!Array.isArray(I.videos)?[]:I.videos.filter(e=>Kt(e,t))}function Mn(t){return!t||!Array.isArray(I.photos)?[]:I.photos.filter(e=>Kt(e,t))}function Kt(t,e){const i=Zt(t);return i?!!(i.id&&(e!=null&&e._id)&&i.id===e._id||i.title&&(e!=null&&e.title)&&i.title===e.title):!1}function Zt(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function Hn(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function $t(t){const e=Hn(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(i=>`<span class="gallery-tag">${o(i)}</span>`).join("")}
    </div>
  `:""}function En(t){const e=Zt(t);if(!e||!e.title)return null;const i=e.id||e.title,n=i?Ft(i):null,r=n?n._id||n.title:null;return{label:(n==null?void 0:n.title)||e.title,targetId:r}}function Qt(t,{variant:e="inline"}={}){const i=En(t);if(!(i!=null&&i.label))return"";const n=["tournament-chip"];e==="card"&&n.push("tournament-chip--on-card"),e==="inline"&&n.push("tournament-chip--inline");const r=o(i.label),a=$(`View ${i.label} tournament details`),l=i.targetId?` data-highlight-modal="${$(i.targetId)}"`:"",s=i.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(i.targetId)}`:"tournament-highlights.html",f="a";return`
    <${f} class="${n.join(" ")}" href="${$(s)}"${l}${i.targetId?` aria-label="${a}"`:""}>
      <span class="tournament-chip-name">${r}</span>
    </${f}>
  `}function In(t){if(!t)return null;const e=U(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function Jt(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function Pn(t){return t?ie(t.eventDate,t.endDate,{month:"long"}):""}function Cn(t){if(!t)return[];const e=[],i=ut(t.score),n=ut(t.yardage);e.push(mt({key:"score",label:"Score",display:typeof i=="number"?String(i):"—",progress:Bn(i)})),e.push(mt({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:On(n,Dn(t,n))}));const r=qn(t);return e.push(mt({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),e.filter(Boolean)}function mt({key:t,label:e,display:i,secondary:n,progress:r}){const a=i!=null&&i!==""?String(i):"—",l=n?String(n):"",s=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:t,label:e,display:a,secondary:l,progress:Math.max(0,s)}}function te(t,e,i){return t.label?t.label:i>1?`Day ${e+1}`:null}function ut(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function Dn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function Bn(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=Et-gn;return(Et-t)/e}function On(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function _n(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const i=(e-t)/(e-1);return Math.max(0,Math.min(i,1))}function qn(t){const e=ut(t==null?void 0:t.rankingPosition),i=ut(t==null?void 0:t.rankingOutOf),n=_n(e,i);return typeof e=="number"?{display:String(e),secondary:typeof i=="number"?`of ${i}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function Yn(t,e){const i=re(t),n=t.thumbnailUrl||(i?`https://img.youtube.com/vi/${i}/hqdefault.jpg`:ft),r=t.thumbnailAlt||t.title||"Video highlight",a=t.title||"Video highlight",s=!!i?"":' disabled aria-disabled="true"',f=Qt(t,{variant:"card"}),c=In(t.eventDate),u=c?Jt(c):"",p=$t(t),y=et(t.thumbnailHotspot),g=y?` style="object-position: ${$(y)};"`:"";return`
    <article class="video-gallery-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(i)}" data-video-title="${o(a)}">
        ${u}
        <img src="${$(n)}" alt="${o(r)}" loading="lazy"${g} />
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
  `}function xt(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(i=>{if(i.dataset.playerReady==="true")return;const n=i.querySelector(".play-button"),r=i.dataset.videoId,a=i.dataset.videoTitle||"Samuel Masco golf video highlight";!n||!r||(n.addEventListener("click",()=>{Nn(r,a)}),i.dataset.playerReady="true")})}let G=null;function jn(){if(G)return G;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&Pt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Pt()}),document.body.appendChild(t),G=t,t}function Nn(t,e){const i=jn(),n=i.querySelector(".video-overlay-frame");if(!n)return;n.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",e),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",n.appendChild(r),i.classList.add("is-open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function Pt(){if(!G)return;const t=G.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),G.classList.remove("is-open"),G.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let R=null;function ee(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(i=>{i.dataset.photoPreviewReady!=="true"&&(i.addEventListener("click",n=>{n.target.closest(".tournament-chip")||Xn(i.getAttribute("data-photo-src"),i.getAttribute("data-photo-alt"),i.getAttribute("data-photo-title"))}),i.dataset.photoPreviewReady="true")})}function Rn(){if(R)return R;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&Ct()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Ct()}),document.body.appendChild(t),R=t,t}function Xn(t,e,i){if(!t)return;const n=Rn(),r=n.querySelector("img"),a=n.querySelector("figcaption");!r||!a||(r.src=t,r.alt=e||i||"Gallery photo",a.textContent=i||e||"",n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function Ct(){if(!R)return;const t=R.querySelector("img"),e=R.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),R.classList.remove("is-open"),R.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function kt(t){return!Array.isArray(t)||!t.length?"":Ke(t)}function T(t){return t?document.querySelector(t):null}function H(t){return`<p class="placeholder-text">${o(t)}</p>`}function gt(t){document.body.dataset.contentLoading=String(t)}function Vn(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function Dt(t,e,i,n){const r=(t==null?void 0:t.label)||i,a=(t==null?void 0:t.href)||n;if(!r||!a)return"";const s=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${$(a)}"${s}>${o(r)}</a>`}function Gn(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const i=e.getAttribute("href")||"";ne(i)&&t.preventDefault()})}function ne(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function ie(t,e,{month:i="short"}={}){if(!t)return"";const n=U(t);if(!n)return o(t);if(!e)return n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});const r=U(e);if(!r)return`${n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=n.getFullYear()===r.getFullYear(),l=a&&n.getMonth()===r.getMonth();if(a&&l)return`${n.toLocaleDateString("en-US",{month:i})} ${n.getDate()}–${r.getDate()}, ${n.getFullYear()}`;if(a){const c=n.toLocaleDateString("en-US",{month:i,day:"numeric"}),u=r.toLocaleDateString("en-US",{month:i,day:"numeric"});return`${c} – ${u}, ${n.getFullYear()}`}const s=n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"}),f=r.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});return`${s} – ${f}`}function re(t){return t?Bt(t.youtubeId)||Bt(t.youtubeUrl):""}function Bt(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(lt.test(e))return e;let i;try{i=new URL(e)}catch{try{i=new URL(`https://${e}`)}catch{return""}}const n=i.hostname.replace(/^www\./,"").toLowerCase();if(n==="youtu.be"){const r=i.pathname.split("/").filter(Boolean)[0];return r&&lt.test(r)?r:""}if(n==="youtube.com"||n.endsWith(".youtube.com")){const r=i.searchParams.get("v");if(r&&lt.test(r))return r;const a=i.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const l=a[1];return l&&lt.test(l)?l:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function $(t){return o(t)}function et(t){if(!t||typeof t.x!="number"||typeof t.y!="number")return"";const e=r=>Math.max(0,Math.min(1,r)),i=Math.round(e(t.x)*1e3)/10,n=Math.round(e(t.y)*1e3)/10;return`${i}% ${n}%`}function Un(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(i=>i.charAt(0).toUpperCase()).join(""):""}function Wn(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:zn(r)})):[]}function zn(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function Fn(t){return t?ie(t.eventDate,t.endDate,{month:"short"}):""}function Kn(t){if(!t)return null;const e=U(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function yt(t,e="eventDate"){return Array.isArray(t)?[...t].sort((i,n)=>Ot(n,e)-Ot(i,e)):[]}function Ot(t,e){if(!t)return 0;const i=t[e],n=U(i);if(n)return n.getTime();const r=U(t._createdAt);return r?r.getTime():0}function pt(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function Zn(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(i=>i.classList.add("is-visible"));return}const e=new IntersectionObserver(i=>{i.forEach(n=>{n.isIntersecting&&(n.target.classList.add("is-visible"),e.unobserve(n.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(i=>e.observe(i))}function Qn(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const i=18,n={x:Math.min(window.innerWidth-i-24,window.innerWidth*.78),y:Math.min(window.innerHeight-i-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let r=performance.now(),a=!1,l=!0,s=null,f=!1,c=!1,u=null,p=null,y=0,g=!1,w=!1,x=null;const C=document.querySelector(".site-header"),W=document.querySelector(".hero"),z=document.querySelector("[data-golf-hole]"),D=document.querySelector("[data-golf-scoreboard]"),X=D?D.querySelector("[data-golf-score-value]"):null,A={x:0,y:0,active:!1},ht=i+16,ae=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(d=>Array.from(document.querySelectorAll(d))).filter(d=>d!==null&&d.isConnected),nt=document.querySelector(".hero-scroll"),oe=nt?nt.querySelector("span"):null,Lt={x:.5,y:-32},Tt={x:0,y:10},se=-80;function F(){e.style.transform=`translate3d(${n.x-i}px, ${n.y-i}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${n.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${n.textureOffsetY}px`)}function le(){var B;const d=document.querySelector(".hero-copy h1");if(!d)return null;const h="masco",b=(d.textContent||"").toLowerCase().lastIndexOf(h);if(b===-1)return null;const S=b+h.length-1,E=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);let M=0,k=E.nextNode();for(;k;){const q=k.textContent||"",Y=q.length;if(S<M+Y){const O=S-M;if(O<0||O>=Y)return null;const j=q.charAt(O);if(!j||!j.trim())return null;const P=document.createRange();P.setStart(k,O),P.setEnd(k,Math.min(O+1,Y));const _=P.getBoundingClientRect();return(B=P.detach)==null||B.call(P),!_||!_.width&&!_.height?null:{left:_.left+window.scrollX,right:_.right+window.scrollX,top:_.top+window.scrollY,bottom:_.bottom+window.scrollY,width:_.width,height:_.height}}M+=Y,k=E.nextNode()}return null}function it(){f||(s={x:n.x,y:n.y},f=!0)}function ce(){return s||{x:n.x,y:n.y}}function de(){y=0,X&&(X.textContent=y)}function ue(){w||(y+=1,X&&(X.textContent=y),w=!0,clearTimeout(x),x=window.setTimeout(()=>{w=!1},500))}function K(){w=!1,clearTimeout(x)}function fe(){D&&(D.classList.add("is-visible"),D.setAttribute("aria-hidden","false"),clearTimeout(p),p=window.setTimeout(()=>he(),3200))}function he(){D&&(D.classList.remove("is-visible"),D.setAttribute("aria-hidden","true"),de())}function me(){if(!z)return null;const d=z.getBoundingClientRect();if(!d.width||!d.height)return null;const h=window.scrollX,m=window.scrollY,v=i*.5,b=i*.2;return{centerX:d.left+h+d.width/2,centerY:d.top+m+d.height*.5,radiusX:d.width/2+v,radiusY:d.height/2+b}}function ge(d){if(!d)return!1;const h=n.x-d.centerX,m=n.y-d.centerY,v=h/d.radiusX,b=m/d.radiusY;return v*v+b*b<=1}function rt(d){const h=d.top+i+se,m=i+4;return Math.max(h,m)}function ye(){if(!W)return!0;const d=window.getComputedStyle(W),h=parseFloat(d.getPropertyValue("column-gap")||d.getPropertyValue("gap"))||0,m=W.clientWidth;if(!m)return!1;const b=280*3+h*2;return m>=b-.5}function pe(d={}){const h=le();if(!h)return!1;const m=ot(),v=h.left+h.width/3+Lt.x,b=h.top+h.height/30+Lt.y,S=m.left+i+12,E=m.right-i-12,M=rt(m),k=m.bottom-i-12;return n.x=N(v,S,E),n.y=N(b,M,k),n.vx=0,n.vy=0,F(),d.recordHome&&it(),!0}function be(d={}){if(!nt)return!1;const h=qt(oe||nt),m=ot(),v=h.left+h.width/2+Tt.x,b=h.bottom+i+Tt.y,S=m.left+i+12,E=m.right-i-12,M=rt(m),k=m.bottom-i-12;return n.x=N(v,S,E),n.y=N(b,M,k),n.vx=0,n.vy=0,F(),d.recordHome&&it(),!0}function at(d={}){const{recordHome:h=!1}=d;pe({recordHome:h})||be({recordHome:h})||(F(),h&&it())}function Z(d={}){const{force:h=!1,skipReposition:m=!1}=d;if(c)return;const v=ye();if(!h&&v===l)return;const b=l;l=v,e.style.display=v?"":"none",v&&(!b||h)&&!m&&at()}at({recordHome:!0}),Z({force:!0}),window.addEventListener("load",()=>{at(),Z({force:!0})},{once:!0}),requestAnimationFrame(()=>{at(),Z({force:!0})});function ve(d,h){if(c||!A.active)return;const m=.42;n.vx+=d*m,n.vy+=h*m;const v=34,b=Math.hypot(n.vx,n.vy);if(b>v){const k=v/b;n.vx*=k,n.vy*=k}const S=n.x-A.x,E=n.y-A.y,M=Math.hypot(S,E);if(M<i){const k=i-M,B=S/(M||1),q=E/(M||1);n.x+=B*(k+.5),n.y+=q*(k+.5)}}function $e(){const h=ot(),m=h.left+i+8,v=h.right-i-8,b=rt(h),S=h.bottom-i-8;n.x<m?(n.x=m,n.vx=Math.abs(n.vx)*.78):n.x>v&&(n.x=v,n.vx=-Math.abs(n.vx)*.78),n.y<b?(n.y=b,n.vy=Math.abs(n.vy)*.78):n.y>S&&(n.y=S,n.vy=-Math.abs(n.vy)*.78)}function we(){for(const h of ae){if(!h.isConnected)continue;const m=h.getBoundingClientRect(),v=window.scrollX,b=window.scrollY,S={left:m.left+v,right:m.right+v,top:m.top+b,bottom:m.bottom+b};if(m.width===0||m.height===0||m.right<-40||m.left>window.innerWidth+40||m.bottom<-40||m.top>window.innerHeight+40)continue;const E=N(n.x,S.left,S.right),M=N(n.y,S.top,S.bottom),k=n.x-E,B=n.y-M,q=k*k+B*B;if(q>=i*i||k===0&&B===0)continue;const Y=Math.sqrt(q)||1e-4,O=k/Y,j=B/Y;n.x=E+O*(i+.5),n.y=M+j*(i+.5);const P=n.vx*O+n.vy*j;P>0||(n.vx-=(1+.72)*P*O,n.vy-=(1+.72)*P*j)}}function ot(){return C?qt(C):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function xe(d){if(c)return;s||it(),c=!0,A.active=!1,g=!1,K(),a=!1,n.vx=0,n.vy=0,e.classList.remove("is-moving"),e.classList.add("is-sinking"),fe();const h=d.centerX-i,m=d.centerY-i*.6,v=.6;clearTimeout(u),e.style.transition="transform 320ms ease-in, opacity 320ms ease-in, box-shadow 320ms ease-in",e.style.transform=`translate3d(${h}px, ${m}px, 0) scale(${v})`,e.style.opacity="0",e.style.boxShadow="0 10px 20px rgba(15, 29, 51, 0.2)",u=window.setTimeout(()=>{const b=ce();n.x=b.x,n.y=b.y,n.vx=0,n.vy=0,e.style.transition="none",e.style.transform=`translate3d(${b.x-i}px, ${b.y-i}px, 0) scale(0.35)`,e.style.opacity="0",requestAnimationFrame(()=>{e.classList.remove("is-sinking"),e.classList.add("is-returning"),e.style.transition="transform 440ms cubic-bezier(0.18, 0.72, 0.22, 1.08), opacity 380ms ease-out, box-shadow 380ms ease-out",e.style.opacity="1",e.style.boxShadow="3px 4px 12px rgba(15, 29, 51, 0.25)",e.style.transform=`translate3d(${b.x-i}px, ${b.y-i}px, 0) scale(1)`}),u=window.setTimeout(()=>{e.classList.remove("is-returning","is-sinking"),e.style.transition="",e.style.opacity="",e.style.boxShadow="",F(),c=!1,Z({force:!0,skipReposition:!0})},520)},360)}function St(){if(requestAnimationFrame(St),c)return;const d=performance.now(),h=Math.min((d-r)/16.666,3);if(r=d,n.x+=n.vx*h,n.y+=n.vy*h,n.vx*=Math.pow(.985,h),n.vy*=Math.pow(.985,h),Math.abs(n.vx)<.02&&(n.vx=0),Math.abs(n.vy)<.02&&(n.vy=0),$e(),we(),a=Math.hypot(n.vx,n.vy)>.35,l){const m=me();if(m&&ge(m)){xe(m);return}}a&&(n.textureOffsetX=_t(n.textureOffsetX+n.vx*h*.32,12),n.textureOffsetY=_t(n.textureOffsetY+n.vy*h*.32,12)),F()}window.addEventListener("pointermove",d=>{if(d.pointerType&&d.pointerType!=="mouse"&&d.pointerType!=="pen")return;const h=A.x,m=A.y,v=A.active,b=d.clientX+window.scrollX,S=d.clientY+window.scrollY;A.x=b,A.y=S,A.active=!0;const E=v?b-h:0,M=v?S-m:0;if(!v)return;const k=n.x-A.x,B=n.y-A.y,q=Math.hypot(k,B),Y=g;if(g=q<=ht,!g)return;const O=Math.hypot(n.vx,n.vy);ve(E,M);const j=Math.hypot(n.vx,n.vy),P=j-O;if(!Y&&!w){const _=Math.hypot(E,M);(P>.35||j>1||_>1.2)&&ue()}},{passive:!0}),window.addEventListener("pointerleave",()=>{A.active=!1,g=!1,K()}),window.addEventListener("pointerout",d=>{d.relatedTarget||(A.active=!1,g=!1,K())}),window.addEventListener("blur",()=>{A.active=!1,g=!1,K()}),window.addEventListener("scroll",()=>{A.active=!1,g=!1,K()}),window.addEventListener("resize",()=>{if(!c){const d=ot();n.x=N(n.x,d.left+i+8,d.right-i-8),n.y=N(n.y,rt(d),d.bottom-i-8)}Z()}),requestAnimationFrame(St)}function N(t,e,i){return Math.min(Math.max(t,e),i)}function _t(t,e){const i=t%e;return i<0?i+e:i}function qt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
