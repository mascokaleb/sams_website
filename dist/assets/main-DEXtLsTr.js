import{f as Vt}from"./sanityClient-kAGhWdKW.js";function tt(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function Lt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function Tt(t){return Lt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function St(t){return t._type==="@list"}function At(t){return t._type==="@span"}function Mt(t){return t._type==="@text"}const ht=["strong","em","code","underline","strike-through"];function Gt(t,e,n){if(!tt(t)||!t.marks)return[];if(!t.marks.length)return[];const r=t.marks.slice(),i={};return r.forEach(a=>{i[a]=1;for(let s=e+1;s<n.length;s++){const l=n[s];if(l&&tt(l)&&Array.isArray(l.marks)&&l.marks.indexOf(a)!==-1)i[a]++;else break}}),r.sort((a,s)=>Xt(i,a,s))}function Xt(t,e,n){const r=t[e],i=t[n];if(r!==i)return i-r;const a=ht.indexOf(e),s=ht.indexOf(n);return a!==s?a-s:e.localeCompare(n)}function Wt(t){var s;const{children:e}=t,n=t.markDefs??[];if(!e||!e.length)return[];const r=e.map(Gt),i={_type:"@span",children:[],markType:"<unknown>"};let a=[i];for(let l=0;l<e.length;l++){const h=e[l];if(!h)continue;const c=r[l]||[];let d=1;if(a.length>1)for(d;d<a.length;d++){const m=((s=a[d])==null?void 0:s.markKey)||"",p=c.indexOf(m);if(p===-1)break;c.splice(p,1)}a=a.slice(0,d);let y=a[a.length-1];if(y){for(const m of c){const p=n==null?void 0:n.find(P=>P._key===m),v=p?p._type:m,w={_type:"@span",_key:h._key,children:[],markDef:p,markType:v,markKey:m};y.children.push(w),a.push(w),y=w}if(tt(h)){const m=h.text.split(`
`);for(let p=m.length;p-- >1;)m.splice(p,0,`
`);y.children=y.children.concat(m.map(p=>({_type:"@text",text:p})))}else y.children=y.children.concat(h)}}return i.children}function Ft(t,e){const n=[];let r;for(let i=0;i<t.length;i++){const a=t[i];if(a){if(!Tt(a)){n.push(a),r=void 0;continue}if(!r){r=Q(a,i,e),n.push(r);continue}if(zt(a,r)){r.children.push(a);continue}if((a.level||1)>r.level){const s=Q(a,i,e);{const l=r.children[r.children.length-1],h={...l,children:[...l.children,s]};r.children[r.children.length-1]=h}r=s;continue}if((a.level||1)<r.level){const s=n[n.length-1],l=s&&lt(s,a);if(l){r=l,r.children.push(a);continue}r=Q(a,i,e),n.push(r);continue}if(a.listItem!==r.listItem){const s=n[n.length-1],l=s&&lt(s,{level:a.level||1});if(l&&l.listItem===a.listItem){r=l,r.children.push(a);continue}else{r=Q(a,i,e),n.push(r);continue}}console.warn("Unknown state encountered for block",a),n.push(a)}}return n}function zt(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function Q(t,e,n){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:n,level:t.level||1,listItem:t.listItem,children:[t]}}function lt(t,e){const n=e.level||1,r=e.listItem||"normal",i=typeof e.listItem=="string";if(St(t)&&(t.level||1)===n&&i&&(t.listItem||"normal")===r)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!tt(a)?lt(a,e):void 0}function Et(t){let e="";return t.children.forEach(n=>{Mt(n)?e+=n.text:At(n)&&(e+=Et(n))}),e}const Kt=["http","https","mailto","tel"],Zt={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Ht(t){return Qt(t.replace(/[&<>"']/g,e=>`&${Zt[e]};`))}function Qt(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Jt(t){const e=(t||"").trim(),n=e.charAt(0);if(n==="#"||n==="/")return!0;const r=e.indexOf(":");if(r===-1)return!0;const i=e.slice(0,r).toLowerCase();if(Kt.indexOf(i)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&r>a)return!0;const s=e.indexOf("#");return s!==-1&&r>s}const te={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},ee=({children:t})=>`<li>${t}</li>`,ne=({children:t,value:e})=>{const n=(e==null?void 0:e.href)||"";return Jt(n)?`<a href="${Ht(n)}">${t}</a>`:t},re={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:ne},W=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,It=t=>W(`block type "${t}"`,"types"),ie=t=>W(`mark type "${t}"`,"marks"),ae=t=>W(`block style "${t}"`,"block"),oe=t=>W(`list style "${t}"`,"list"),se=t=>W(`list item style "${t}"`,"listItem");function le(t){console.warn(t)}const ce=({value:t,isInline:e})=>{const n=It(t._type);return e?`<span style="display:none">${n}</span>`:`<div style="display:none">${n}</div>`},de=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,ue=({children:t})=>`<p>${t}</p>`,he=({children:t})=>`<ul>${t}</ul>`,fe=({children:t})=>`<li>${t}</li>`,ge=()=>"<br/>",me={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},ft={types:{},block:me,marks:re,list:te,listItem:ee,hardBreak:ge,escapeHTML:Ht,unknownType:ce,unknownMark:de,unknownList:he,unknownListItem:fe,unknownBlockStyle:ue};function ye(t,e){const{block:n,list:r,listItem:i,marks:a,types:s,...l}=e;return{...t,block:G(t,e,"block"),list:G(t,e,"list"),listItem:G(t,e,"listItem"),marks:G(t,e,"marks"),types:G(t,e,"types"),...l}}function G(t,e,n){const r=e[n],i=t[n];return typeof r=="function"||r&&typeof i=="function"?r:r?{...i,...r}:i}function pe(t,e={}){const{components:n,onMissingComponent:r=le}=e,i=r||ve,a=Array.isArray(t)?t:[t],s=Ft(a,"html"),l=n?ye(ft,n):ft,h=be(l,i);return s.map((c,d)=>h({node:c,index:d,isInline:!1,renderNode:h})).join("")}const be=(t,e)=>{function n(c){const{node:d,index:y,isInline:m}=c;return St(d)?i(d,y):Tt(d)?r(d,y):At(d)?a(d):Lt(d)?s(d,y,m):Mt(d)?l(d):h(d,y,m)}function r(c,d){const y=gt({node:c,index:d,isInline:!1,renderNode:n}),m=t.listItem,p=(typeof m=="function"?m:m[c.listItem])||t.unknownListItem;if(p===t.unknownListItem){const w=c.listItem||"bullet";e(se(w),{type:w,nodeType:"listItemStyle"})}let v=y.children;if(c.style&&c.style!=="normal"){const{listItem:w,...P}=c;v=n({node:P,index:d,isInline:!1})}return p({value:c,index:d,isInline:!1,renderNode:n,children:v})}function i(c,d){const y=c.children.map((v,w)=>n({node:v._key?v:{...v,_key:`li-${d}-${w}`},index:w,isInline:!1})),m=t.list,p=(typeof m=="function"?m:m[c.listItem])||t.unknownList;if(p===t.unknownList){const v=c.listItem||"bullet";e(oe(v),{nodeType:"listStyle",type:v})}return p({value:c,index:d,isInline:!1,renderNode:n,children:y.join("")})}function a(c){const{markDef:d,markType:y,markKey:m}=c,p=t.marks[y]||t.unknownMark,v=c.children.map((w,P)=>n({node:w,index:P,isInline:!0}));return p===t.unknownMark&&e(ie(y),{nodeType:"mark",type:y}),p({text:Et(c),value:d,markType:y,markKey:m,renderNode:n,children:v.join("")})}function s(c,d,y){const{_key:m,...p}=gt({node:c,index:d,isInline:y,renderNode:n}),v=p.node.style||"normal",w=(typeof t.block=="function"?t.block:t.block[v])||t.unknownBlockStyle;return w===t.unknownBlockStyle&&e(ae(v),{nodeType:"blockStyle",type:v}),w({...p,value:p.node,renderNode:n})}function l(c){if(c.text===`
`){const d=t.hardBreak;return d?d():`
`}return t.escapeHTML(c.text)}function h(c,d,y){const m=t.types[c._type];return m||e(It(c._type),{nodeType:"block",type:c._type}),(m||t.unknownType)({value:c,isInline:y,index:d,renderNode:n})}return n};function gt(t){const{node:e,index:n,isInline:r,renderNode:i}=t,a=Wt(e).map((s,l)=>i({node:s,isInline:!0,index:l,renderNode:i}));return{_key:e._key||`block-${n}`,children:a.join(""),index:n,isInline:r,node:e}}function ve(){}const rt="images/samuel-placeholder.svg",ct=rt,J=/^[a-zA-Z0-9_-]{11}$/,$={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},I={meta:null,items:[],videos:[],photos:[]},X={meta:null,items:[],totalCount:0},et={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{$e(),yn();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await ke(),window.location.hash&&setTimeout(()=>Bt(window.location.hash),100),Ln(t),t||Tn()});function $e(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const n=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",n),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function ke(){at(!0);const t=await Vt();if(!t)return mn("Unable to load the latest content. Please try again shortly."),at(!1),null;we(t.site),xe(t.hero,t.site),Le(t.about),Te(t.resume),Se(t.academics);const e=ot(t.highlightEvents||[]);I.meta=t.highlightsSection,I.items=e.filter(st),Ae();const n=ot(t.videos||[],"eventDate");I.videos=n,X.meta=t.videosSection,X.items=n.filter(st),X.totalCount=n.length,Me();const r=ot(t.galleryPhotos||[],"shotDate");return I.photos=r,et.meta=t.gallerySection,et.items=r.filter(st),Ee(),Pe(t.dualSport),De(t.contact),at(!1),_t(),t}function we(t){var r;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const i=document.querySelector(".brand-text");i&&(i.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const n=document.querySelector(".brand-mark");if(n)if((r=t.brandMarkImage)!=null&&r.url)n.innerHTML=`<span class="brand-mark-image"><img src="${A(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,n.classList.add("has-image");else{const i=t.brandMarkInitials||bn(t.siteTitle)||n.textContent||"SM";n.textContent=i,n.classList.remove("has-image")}}function xe(t,e){var a,s;const n=k($.heroCopy),r=k($.heroPhoto),i=k($.heroMetrics);if(!t){n&&(n.innerHTML=T("Hero content coming soon."));return}if(n){const l=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",h=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",c=t.bio?`<p>${o(t.bio)}</p>`:"",d=[vt(t.primaryCta,"primary","View Highlights","#highlights"),vt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");n.innerHTML=`
      ${l}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${h}
      </h1>
      ${c}
      <div class="hero-actions">
        ${d||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(r){const l=((a=t.headshot)==null?void 0:a.url)||rt,h=((s=t.headshot)==null?void 0:s.alt)||"Portrait of Samuel Masco",c=t.photoCaption||"Focused on the next shot.";r.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${l}" alt="${o(h)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${o(c)}</figcaption>
    `}i&&(Array.isArray(t.metrics)&&t.metrics.length?i.innerHTML=t.metrics.map(l=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${o(l.label||"")}</span>
              <span class="metric-value">${o(l.value||"")}</span>
            </div>
          `).join(""):i.innerHTML=T("Metrics coming soon."))}function Le(t){const e=k($.aboutHeading),n=k($.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"About")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:T("About section coming soon.")),n){if(!t){n.innerHTML=T("About details coming soon.");return}n.innerHTML=`
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
        ${dt(t.mindsetBody)}
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
    `}}function Te(t){const e=k($.resumeHeading),n=k($.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Golf Resume")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:T("Golf resume coming soon.")),n){if(!t){n.innerHTML=T("Resume details coming soon.");return}n.innerHTML=`
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
        ${dt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(r=>`<li>${o(r||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function Se(t){const e=k($.academicsHeading),n=k($.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Academics")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:T("Academics section coming soon.")),n){if(!t){n.innerHTML=T("Academic details coming soon.");return}const r=t.transcriptLabel||"Transcript",i=t.transcriptUrl?`<a class="btn subtle" href="${A(t.transcriptUrl)}" target="_blank" rel="noopener">${o(r)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${o(r)}</span>`;n.innerHTML=`
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
        ${dt(t.interestsBody)}
      </article>
    `}}function Ae(){const t=I.meta,e=I.items||[],n=k($.highlightsHeading),r=k($.highlightsTimeline),i=k($.highlightsActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:T("Highlights coming soon.")),!r)return;const a=(t==null?void 0:t.maxItems)||5,s=e.slice(0,a);if(!s.length){r.innerHTML=T("Highlight events coming soon."),i&&(i.innerHTML="");return}r.innerHTML=s.map((l,h)=>_e(l,h)).join(""),r.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),Re(r),i&&(i.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function Me(){const t=X.meta,e=X.items||[],n=k($.videosHeading),r=k($.videoGrid),i=k($.videosActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:T("Videos coming soon.")),!r)return;const a=(t==null?void 0:t.maxItems)||3,s=e.slice(0,a);if(!s.length){r.innerHTML=T("Video highlights coming soon."),i&&(i.innerHTML="");return}r.innerHTML=s.map((l,h)=>cn(l,h)).join(""),r.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),_t(),i&&(i.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function Ee(){const t=et.meta,e=et.items||[],n=k($.galleryHeading),r=k($.galleryGrid),i=k($.galleryActions);if(n){const l=(t==null?void 0:t.heading)||"Photo Gallery",h=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";n.innerHTML=`
      <h2>${o(l)}</h2>
      ${`<p>${o(h)}</p>`}
    `}if(!r)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),s=e.slice(0,a);if(!s.length){r.innerHTML=T("Gallery photos coming soon."),i&&(i.innerHTML="");return}if(r.innerHTML=s.map((l,h)=>He(l,h)).join(""),r.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),hn(r),i){const l=(t==null?void 0:t.ctaHref)||"gallery.html",h=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";i.innerHTML=`<a class="btn ghost" href="${A(l)}">${o(h)}</a>`}}function He(t,e=0){var P,q,F;const n=((P=t==null?void 0:t.image)==null?void 0:P.url)||rt,r=((q=t==null?void 0:t.image)==null?void 0:q.alt)||(t==null?void 0:t.title)||"Gallery highlight",i=xn(t),a=i||"",s=(F=t==null?void 0:t.image)!=null&&F.url?{src:n,alt:r,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,l=s?`data-photo-src="${A(s.src)}" data-photo-alt="${A(s.alt)}" data-photo-title="${A(s.title)}"`:"",h=[],c=wn(t==null?void 0:t.shotDate);c&&h.push(c),i&&h.push(i),t!=null&&t.location&&h.push(t.location);const d=h.map(U=>`<span>${o(U)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),y=d?`<div class="gallery-card-meta">${d}</div>`:"",m=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",p=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",v=p?`<div class="gallery-card-footer">${p}</div>`:"",w=s?`data-photo-preview="true" ${l}`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${w?` ${w}`:""}>
        ${a?`<span class="gallery-card-badge">${o(a)}</span>`:""}
        <img src="${A(n)}" alt="${o(r)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        ${y}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${m}
        ${Ie(t==null?void 0:t.tags)}
        ${v}
      </div>
    </article>
  `}function Ie(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(n=>typeof n=="string"?n.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(n=>`<span class="gallery-tag">${o(n)}</span>`).join("")}
    </div>
  `:""}function Pe(t){const e=k($.dualHeading),n=k($.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:T("Dual-sport content coming soon.")),n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=T("Dual-sport cards coming soon.");return}n.innerHTML=t.cards.map((r,i)=>`
          <article class="dual-card" data-motion="delay-${i+1}">
            <h3>${o(r.title||"")}</h3>
            ${r.body?`<p>${o(r.body)}</p>`:""}
            ${Array.isArray(r.bulletPoints)&&r.bulletPoints.length?`<ul>${r.bulletPoints.map(a=>`<li>${o(a||"")}</li>`).join("")}</ul>`:""}
          </article>
        `).join("")}}function De(t){const e=k($.contactHeading),n=k($.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:T("Contact section coming soon.")),!!n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=T("Contact cards coming soon.");return}n.innerHTML=t.cards.map((r,i)=>`
        <article class="contact-card" data-motion="delay-${i+1}">
          <h3>${o(r.title||"")}</h3>
          <ul>
            ${(r.entries||[]).map(a=>`<li>${Ce(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function Ce(t){var i;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",n=vn(t.value),r=(i=t.link)!=null&&i.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&n.length<=1?`${e}<a href="${A(t.link)}"${r}>${o(t.value||t.link)}</a>`:n.length?`${e}${n.map((a,s)=>{const l=s===0&&t.link?t.link:a.link;if(l){const c=l.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${A(l)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function _e(t,e){const n=kn(t),r=t.summary?`<p>${o(t.summary)}</p>`:"",i=Array.isArray(t.days)?t.days:[],a=Pt(i,{variant:"compact"}),s=`home-highlight-${e}`,l=(t==null?void 0:t._id)||(t==null?void 0:t.title)||s,c=!!(t!=null&&t.pinToTop)?'<span class="highlight-badge">Featured</span>':"",d=`
    <button class="highlight-toggle" type="button" data-highlight-modal="${A(l)}">
      View Details
    </button>
  `,y=`<div class="highlight-row-actions">${c}${d}</div>`;return`
    <article class="timeline-card" data-motion="delay-${e+1}">
      <header>
        <div class="highlight-row">
          <h3>${o(t.title||"")}</h3>
          ${y}
        </div>
        ${n?`<span class="timeline-date">${n}</span>`:""}
      </header>
      ${a}
      ${r}
    </article>
  `}function Pt(t=[],{variant:e="default",showLabels:n}={}){if(!Array.isArray(t)||!t.length)return"";const r=t.length,i=typeof n=="boolean"?n:r>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",r===1?"day-stats--single":"",`day-stats--cols-${Math.min(r,3)}`].filter(Boolean).join(" ")}">
      ${t.map((s,l)=>Ne(s,l,{showLabels:i,total:r})).join("")}
    </div>
  `}const mt=120,Be=57;function Ne(t,e,{showLabels:n,total:r}){if(!t)return"";const i=r===1,a=!i&&n?Ct(t,e,r):null,s=Oe(t);return s?`
    <div class="day-stat${i?" day-stat--single":""}">
      ${a?`<span class="day-stat-label">${o(a)}</span>`:""}
      ${s}
    </div>
  `:""}function Oe(t){const e=nn(t);return e.length?`
    <div class="day-metrics">
      ${qe(e)}
    </div>
  `:""}function qe(t){return`
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
  `}function Ye(t=[]){if(!Array.isArray(t))return"";const e=t.map((n,r)=>{if(!(n!=null&&n.notes))return"";const i=Ct(n,r,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(i)}</strong>
          <p>${o(n.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function Re(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",()=>{const n=e.getAttribute("data-highlight-modal");Ue(n)}))})}let R=null;function je(){if(R)return R;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&yt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&yt()}),document.body.appendChild(t),R=t,t}function Ue(t){const e=je(),n=e.querySelector("[data-highlight-overlay-body]");if(!n)return;const r=Ve(t);if(!r)return;const i=Ke(r),a=Ze(r);n.innerHTML=Ge(r,i,a),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function yt(){if(!R)return;const t=R.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),R.classList.remove("is-open"),R.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Ve(t){return t?I.items.find(e=>((e==null?void 0:e._id)||"")===t)||I.items.find(e=>(e==null?void 0:e.title)===t)||null:I.items[0]||null}function Ge(t,e,n){const i=[en(t),t.location?o(t.location):null].filter(Boolean),a=i.length?`<div class="highlight-overlay-meta">
        ${i.map(h=>`<span>${h}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=Pt(t.days||[],{variant:"list"}),l=Ye(t.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${o(t.title||"Tournament highlight")}</h2>
        ${a}
        ${t.summary?`<p class="highlight-overlay-summary">${o(t.summary)}</p>`:""}
      </header>
      ${s?`<section class="highlight-overlay-section">${s}</section>`:""}
      ${l?`<section class="highlight-overlay-section">${l}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${Xe(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Fe(n)}
      </section>
    </div>
  `}function Xe(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(We).join("")}
    </div>
  `}function We(t){const e=Je(t),n=t.thumbnailAlt||t.title||"Video highlight",r=tn(t);return`
    <article class="overlay-media-card">
      <div class="overlay-media-thumb">
        <img src="${A(e)}" alt="${o(n)}" loading="lazy" />
      </div>
      <div class="overlay-media-copy">
        <h4>${o(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${o(t.description)}</p>`:""}
        ${r?`<a class="btn subtle" href="${A(r)}" target="_blank" rel="noopener">Watch</a>`:""}
      </div>
    </article>
  `}function Fe(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(ze).join("")}
    </div>
  `}function ze(t){var i,a;const e=((i=t==null?void 0:t.image)==null?void 0:i.url)||ct,n=((a=t==null?void 0:t.image)==null?void 0:a.alt)||(t==null?void 0:t.title)||"Gallery photo",r=[t==null?void 0:t.title,t==null?void 0:t.description,t!=null&&t.photographer?`Photo: ${t.photographer}`:""].map(s=>s?o(s):"").filter(Boolean);return`
    <figure class="overlay-photo-card">
      <div class="overlay-media-thumb">
        <img src="${A(e)}" alt="${o(n)}" loading="lazy" />
      </div>
      ${r.length?`<figcaption>${r.join(" • ")}</figcaption>`:""}
    </figure>
  `}function Ke(t){return!t||!Array.isArray(I.videos)?[]:I.videos.filter(e=>Dt(e,t))}function Ze(t){return!t||!Array.isArray(I.photos)?[]:I.photos.filter(e=>Dt(e,t))}function Dt(t,e){const n=Qe(t);return n?!!(n.id&&(e!=null&&e._id)&&n.id===e._id||n.title&&(e!=null&&e.title)&&n.title===e.title):!1}function Qe(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function Je(t){return t?t.thumbnailUrl?t.thumbnailUrl:t.youtubeId?`https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`:ct:ct}function tn(t){return t?t.youtubeUrl?t.youtubeUrl:t.youtubeId?`https://youtu.be/${t.youtubeId}`:"":""}function en(t){return t?Nt(t.eventDate,t.endDate,{month:"long"}):""}function nn(t){if(!t)return[];const e=[],n=nt(t.score),r=nt(t.yardage);e.push(it({key:"score",label:"Score",display:typeof n=="number"?String(n):"—",progress:an(n)})),e.push(it({key:"yards",label:"Yardage",display:typeof r=="number"?r.toLocaleString():"—",secondary:"",progress:on(r,rn(t,r))}));const i=ln(t);return e.push(it({key:"rank",label:"Rank",display:i.display,secondary:i.secondary,progress:i.progress})),e.filter(Boolean)}function it({key:t,label:e,display:n,secondary:r,progress:i}){const a=n!=null&&n!==""?String(n):"—",s=r?String(r):"",l=typeof i=="number"&&!Number.isNaN(i)?i:0;return{key:t,label:e,display:a,secondary:s,progress:Math.max(0,l)}}function Ct(t,e,n){return t.label?t.label:n>1?`Day ${e+1}`:null}function nt(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function rn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function an(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=mt-Be;return(mt-t)/e}function on(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function sn(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const n=(e-t)/(e-1);return Math.max(0,Math.min(n,1))}function ln(t){const e=nt(t==null?void 0:t.rankingPosition),n=nt(t==null?void 0:t.rankingOutOf),r=sn(e,n);return typeof e=="number"?{display:String(e),secondary:typeof n=="number"?`of ${n}`:"",progress:r}:{display:"—",secondary:"",progress:0}}function cn(t,e){const n=pn(t),r=t.thumbnailUrl||(n?`https://img.youtube.com/vi/${n}/hqdefault.jpg`:rt),i=t.thumbnailAlt||t.title||"Video highlight",a=t.ctaLabel||"Play",s=t.title||"Video highlight",h=!!n?"":' disabled aria-disabled="true"';return`
    <article class="video-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(n)}" data-video-title="${o(s)}">
        <img src="${A(r)}" alt="${o(i)}" loading="lazy" />
        <button class="play-button" type="button"${h} aria-label="Play ${o(s)}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${o(a)}</span>
        </button>
      </div>
      <h3>${o(t.title||"")}</h3>
      <p>${o(t.description||"")}</p>
    </article>
  `}function _t(){document.querySelectorAll(".video-frame").forEach(t=>{if(t.dataset.playerReady==="true")return;const e=t.querySelector(".play-button"),n=t.dataset.videoId,r=t.dataset.videoTitle||"Samuel Masco golf video highlight";!e||!n||(e.addEventListener("click",()=>{un(n,r)}),t.dataset.playerReady="true")})}let j=null;function dn(){if(j)return j;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&pt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&pt()}),document.body.appendChild(t),j=t,t}function un(t,e){const n=dn(),r=n.querySelector(".video-overlay-frame");if(!r)return;r.innerHTML="";const i=document.createElement("iframe");i.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),i.setAttribute("title",e),i.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),i.setAttribute("allowfullscreen",""),i.loading="lazy",r.appendChild(i),n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function pt(){if(!j)return;const t=j.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),j.classList.remove("is-open"),j.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let O=null;function hn(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(n=>{n.dataset.photoPreviewReady!=="true"&&(n.addEventListener("click",()=>{gn(n.getAttribute("data-photo-src"),n.getAttribute("data-photo-alt"),n.getAttribute("data-photo-title"))}),n.dataset.photoPreviewReady="true")})}function fn(){if(O)return O;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&bt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&bt()}),document.body.appendChild(t),O=t,t}function gn(t,e,n){if(!t)return;const r=fn(),i=r.querySelector("img"),a=r.querySelector("figcaption");!i||!a||(i.src=t,i.alt=e||n||"Gallery photo",a.textContent=n||e||"",r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function bt(){if(!O)return;const t=O.querySelector("img"),e=O.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),O.classList.remove("is-open"),O.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function dt(t){return!Array.isArray(t)||!t.length?"":pe(t)}function k(t){return t?document.querySelector(t):null}function T(t){return`<p class="placeholder-text">${o(t)}</p>`}function at(t){document.body.dataset.contentLoading=String(t)}function mn(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function vt(t,e,n,r){const i=(t==null?void 0:t.label)||n,a=(t==null?void 0:t.href)||r;if(!i||!a)return"";const l=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${A(a)}"${l}>${o(i)}</a>`}function yn(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const n=e.getAttribute("href")||"";Bt(n)&&t.preventDefault()})}function Bt(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function Nt(t,e,{month:n="short"}={}){if(!t)return"";const r=new Date(t);if(Number.isNaN(r.getTime()))return o(t);if(!e)return r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});const i=new Date(e);if(Number.isNaN(i.getTime()))return`${r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=r.getFullYear()===i.getFullYear(),s=a&&r.getMonth()===i.getMonth();if(a&&s)return`${r.toLocaleDateString("en-US",{month:n})} ${r.getDate()}–${i.getDate()}, ${r.getFullYear()}`;if(a){const c=r.toLocaleDateString("en-US",{month:n,day:"numeric"}),d=i.toLocaleDateString("en-US",{month:n,day:"numeric"});return`${c} – ${d}, ${r.getFullYear()}`}const l=r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"}),h=i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});return`${l} – ${h}`}function pn(t){return t?$t(t.youtubeId)||$t(t.youtubeUrl):""}function $t(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(J.test(e))return e;let n;try{n=new URL(e)}catch{try{n=new URL(`https://${e}`)}catch{return""}}const r=n.hostname.replace(/^www\./,"").toLowerCase();if(r==="youtu.be"){const i=n.pathname.split("/").filter(Boolean)[0];return i&&J.test(i)?i:""}if(r==="youtube.com"||r.endsWith(".youtube.com")){const i=n.searchParams.get("v");if(i&&J.test(i))return i;const a=n.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const s=a[1];return s&&J.test(s)?s:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function A(t){return o(t)}function bn(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(n=>n.charAt(0).toUpperCase()).join(""):""}function vn(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(i=>i.trim()).filter(Boolean).map(i=>({text:i,link:$n(i)})):[]}function $n(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function kn(t){return t?Nt(t.eventDate,t.endDate,{month:"short"}):""}function wn(t){if(!t)return"";const e=new Date(t);return Number.isNaN(e.getTime())?t:e.toLocaleDateString("en-US",{month:"short",year:"numeric"})}function xn(t){var e;return t&&(((e=t==null?void 0:t.tournament)==null?void 0:e.title)||(t==null?void 0:t.tournament))||""}function ot(t,e="eventDate"){return Array.isArray(t)?[...t].sort((n,r)=>kt(r,e)-kt(n,e)):[]}function kt(t,e){if(!t)return 0;const n=t[e];if(n){const r=Date.parse(n);if(!Number.isNaN(r))return r}if(t._createdAt){const r=Date.parse(t._createdAt);if(!Number.isNaN(r))return r}return 0}function st(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function Ln(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(n=>n.classList.add("is-visible"));return}const e=new IntersectionObserver(n=>{n.forEach(r=>{r.isIntersecting&&(r.target.classList.add("is-visible"),e.unobserve(r.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(n=>e.observe(n))}function Tn(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const n=18,r={x:Math.min(window.innerWidth-n-24,window.innerWidth*.78),y:Math.min(window.innerHeight-n-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let i=performance.now(),a=!1,s=!0;const l=document.querySelector(".site-header"),h=document.querySelector(".hero"),c={x:0,y:0,active:!1},y=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(u=>Array.from(document.querySelectorAll(u))).filter(u=>u!==null&&u.isConnected),m=document.querySelector(".hero-scroll"),p=m?m.querySelector("span"):null,v={x:.5,y:-32},w={x:0,y:10},P=-80;function q(){e.style.transform=`translate3d(${r.x-n}px, ${r.y-n}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${r.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${r.textureOffsetY}px`)}function F(){var H;const u=document.querySelector(".hero-copy h1");if(!u)return null;const f="masco",b=(u.textContent||"").toLowerCase().lastIndexOf(f);if(b===-1)return null;const L=b+f.length-1,M=document.createTreeWalker(u,NodeFilter.SHOW_TEXT);let S=0,E=M.nextNode();for(;E;){const Y=E.textContent||"",C=Y.length;if(L<S+C){const _=L-S;if(_<0||_>=C)return null;const V=Y.charAt(_);if(!V||!V.trim())return null;const D=document.createRange();D.setStart(E,_),D.setEnd(E,Math.min(_+1,C));const B=D.getBoundingClientRect();return(H=D.detach)==null||H.call(D),!B||!B.width&&!B.height?null:{left:B.left+window.scrollX,right:B.right+window.scrollX,top:B.top+window.scrollY,bottom:B.bottom+window.scrollY,width:B.width,height:B.height}}S+=C,E=M.nextNode()}return null}function U(u){const f=u.top+n+P,g=n+4;return Math.max(f,g)}function Ot(){if(!h)return!0;const u=window.getComputedStyle(h),f=parseFloat(u.getPropertyValue("column-gap")||u.getPropertyValue("gap"))||0,g=h.clientWidth;if(!g)return!1;const b=280*3+f*2;return g>=b-.5}function qt(){const u=F();if(!u)return!1;const f=Z(),g=u.left+u.width/3+v.x,x=u.top+u.height/30+v.y,b=f.left+n+12,L=f.right-n-12,M=U(f),S=f.bottom-n-12;return r.x=N(g,b,L),r.y=N(x,M,S),r.vx=0,r.vy=0,q(),!0}function Yt(){if(!m)return!1;const u=xt(p||m),f=Z(),g=u.left+u.width/2+w.x,x=u.bottom+n+w.y,b=f.left+n+12,L=f.right-n-12,M=U(f),S=f.bottom-n-12;return r.x=N(g,b,L),r.y=N(x,M,S),r.vx=0,r.vy=0,q(),!0}function z(){qt()||Yt()||q()}function K(u={}){const{force:f=!1}=u,g=Ot();if(!f&&g===s)return;const x=s;s=g,e.style.display=g?"":"none",g&&(!x||f)&&z()}z(),K({force:!0}),window.addEventListener("load",()=>{z(),K({force:!0})},{once:!0}),requestAnimationFrame(()=>{z(),K({force:!0})});function Rt(u,f){if(!c.active)return;const g=r.x-c.x,x=r.y-c.y,b=Math.hypot(g,x),L=n+10;if(b>L)return;const M=.42;r.vx+=u*M,r.vy+=f*M;const S=34,E=Math.hypot(r.vx,r.vy);if(E>S){const H=S/E;r.vx*=H,r.vy*=H}if(b<n){const H=n-b,Y=g/(b||1),C=x/(b||1);r.x+=Y*(H+.5),r.y+=C*(H+.5)}}function jt(){const f=Z(),g=f.left+n+8,x=f.right-n-8,b=U(f),L=f.bottom-n-8;r.x<g?(r.x=g,r.vx=Math.abs(r.vx)*.78):r.x>x&&(r.x=x,r.vx=-Math.abs(r.vx)*.78),r.y<b?(r.y=b,r.vy=Math.abs(r.vy)*.78):r.y>L&&(r.y=L,r.vy=-Math.abs(r.vy)*.78)}function Ut(){for(const f of y){if(!f.isConnected)continue;const g=f.getBoundingClientRect(),x=window.scrollX,b=window.scrollY,L={left:g.left+x,right:g.right+x,top:g.top+b,bottom:g.bottom+b};if(g.width===0||g.height===0||g.right<-40||g.left>window.innerWidth+40||g.bottom<-40||g.top>window.innerHeight+40)continue;const M=N(r.x,L.left,L.right),S=N(r.y,L.top,L.bottom),E=r.x-M,H=r.y-S,Y=E*E+H*H;if(Y>=n*n||E===0&&H===0)continue;const C=Math.sqrt(Y)||1e-4,_=E/C,V=H/C;r.x=M+_*(n+.5),r.y=S+V*(n+.5);const D=r.vx*_+r.vy*V;D>0||(r.vx-=(1+.72)*D*_,r.vy-=(1+.72)*D*V)}}function Z(){return l?xt(l):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function ut(){const u=performance.now(),f=Math.min((u-i)/16.666,3);i=u,r.x+=r.vx*f,r.y+=r.vy*f,r.vx*=Math.pow(.985,f),r.vy*=Math.pow(.985,f),Math.abs(r.vx)<.02&&(r.vx=0),Math.abs(r.vy)<.02&&(r.vy=0),jt(),Ut(),a=Math.hypot(r.vx,r.vy)>.35,a&&(r.textureOffsetX=wt(r.textureOffsetX+r.vx*f*.32,12),r.textureOffsetY=wt(r.textureOffsetY+r.vy*f*.32,12)),q(),requestAnimationFrame(ut)}window.addEventListener("pointermove",u=>{if(u.pointerType&&u.pointerType!=="mouse"&&u.pointerType!=="pen")return;const f=c.x,g=c.y,x=c.active,b=u.clientX+window.scrollX,L=u.clientY+window.scrollY;c.x=b,c.y=L,c.active=!0;const M=x?b-f:0,S=x?L-g:0;x&&Rt(M,S)},{passive:!0}),window.addEventListener("pointerleave",()=>{c.active=!1}),window.addEventListener("pointerout",u=>{u.relatedTarget||(c.active=!1)}),window.addEventListener("blur",()=>{c.active=!1}),window.addEventListener("scroll",()=>{c.active=!1}),window.addEventListener("resize",()=>{const u=Z();r.x=N(r.x,u.left+n+8,u.right-n-8),r.y=N(r.y,U(u),u.bottom-n-8),K()}),requestAnimationFrame(ut)}function N(t,e,n){return Math.min(Math.max(t,e),n)}function wt(t,e){const n=t%e;return n<0?n+e:n}function xt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
