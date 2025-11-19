import{f as Xt}from"./sanityClient-CMsjYHwX.js";function tt(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function xt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function Tt(t){return xt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function St(t){return t._type==="@list"}function At(t){return t._type==="@span"}function Mt(t){return t._type==="@text"}const ht=["strong","em","code","underline","strike-through"];function Wt(t,e,n){if(!tt(t)||!t.marks)return[];if(!t.marks.length)return[];const i=t.marks.slice(),r={};return i.forEach(a=>{r[a]=1;for(let s=e+1;s<n.length;s++){const l=n[s];if(l&&tt(l)&&Array.isArray(l.marks)&&l.marks.indexOf(a)!==-1)r[a]++;else break}}),i.sort((a,s)=>zt(r,a,s))}function zt(t,e,n){const i=t[e],r=t[n];if(i!==r)return r-i;const a=ht.indexOf(e),s=ht.indexOf(n);return a!==s?a-s:e.localeCompare(n)}function Ft(t){var s;const{children:e}=t,n=t.markDefs??[];if(!e||!e.length)return[];const i=e.map(Wt),r={_type:"@span",children:[],markType:"<unknown>"};let a=[r];for(let l=0;l<e.length;l++){const d=e[l];if(!d)continue;const c=i[l]||[];let h=1;if(a.length>1)for(h;h<a.length;h++){const g=((s=a[h])==null?void 0:s.markKey)||"",p=c.indexOf(g);if(p===-1)break;c.splice(p,1)}a=a.slice(0,h);let y=a[a.length-1];if(y){for(const g of c){const p=n==null?void 0:n.find(P=>P._key===g),v=p?p._type:g,k={_type:"@span",_key:d._key,children:[],markDef:p,markType:v,markKey:g};y.children.push(k),a.push(k),y=k}if(tt(d)){const g=d.text.split(`
`);for(let p=g.length;p-- >1;)g.splice(p,0,`
`);y.children=y.children.concat(g.map(p=>({_type:"@text",text:p})))}else y.children=y.children.concat(d)}}return r.children}function Kt(t,e){const n=[];let i;for(let r=0;r<t.length;r++){const a=t[r];if(a){if(!Tt(a)){n.push(a),i=void 0;continue}if(!i){i=Q(a,r,e),n.push(i);continue}if(Zt(a,i)){i.children.push(a);continue}if((a.level||1)>i.level){const s=Q(a,r,e);{const l=i.children[i.children.length-1],d={...l,children:[...l.children,s]};i.children[i.children.length-1]=d}i=s;continue}if((a.level||1)<i.level){const s=n[n.length-1],l=s&&lt(s,a);if(l){i=l,i.children.push(a);continue}i=Q(a,r,e),n.push(i);continue}if(a.listItem!==i.listItem){const s=n[n.length-1],l=s&&lt(s,{level:a.level||1});if(l&&l.listItem===a.listItem){i=l,i.children.push(a);continue}else{i=Q(a,r,e),n.push(i);continue}}console.warn("Unknown state encountered for block",a),n.push(a)}}return n}function Zt(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function Q(t,e,n){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:n,level:t.level||1,listItem:t.listItem,children:[t]}}function lt(t,e){const n=e.level||1,i=e.listItem||"normal",r=typeof e.listItem=="string";if(St(t)&&(t.level||1)===n&&r&&(t.listItem||"normal")===i)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!tt(a)?lt(a,e):void 0}function Et(t){let e="";return t.children.forEach(n=>{Mt(n)?e+=n.text:At(n)&&(e+=Et(n))}),e}const Qt=["http","https","mailto","tel"],Jt={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Ht(t){return te(t.replace(/[&<>"']/g,e=>`&${Jt[e]};`))}function te(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function ee(t){const e=(t||"").trim(),n=e.charAt(0);if(n==="#"||n==="/")return!0;const i=e.indexOf(":");if(i===-1)return!0;const r=e.slice(0,i).toLowerCase();if(Qt.indexOf(r)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&i>a)return!0;const s=e.indexOf("#");return s!==-1&&i>s}const ne={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},ie=({children:t})=>`<li>${t}</li>`,re=({children:t,value:e})=>{const n=(e==null?void 0:e.href)||"";return ee(n)?`<a href="${Ht(n)}">${t}</a>`:t},ae={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:re},W=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,It=t=>W(`block type "${t}"`,"types"),oe=t=>W(`mark type "${t}"`,"marks"),se=t=>W(`block style "${t}"`,"block"),le=t=>W(`list style "${t}"`,"list"),ce=t=>W(`list item style "${t}"`,"listItem");function de(t){console.warn(t)}const ue=({value:t,isInline:e})=>{const n=It(t._type);return e?`<span style="display:none">${n}</span>`:`<div style="display:none">${n}</div>`},he=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,fe=({children:t})=>`<p>${t}</p>`,me=({children:t})=>`<ul>${t}</ul>`,ge=({children:t})=>`<li>${t}</li>`,ye=()=>"<br/>",pe={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},ft={types:{},block:pe,marks:ae,list:ne,listItem:ie,hardBreak:ye,escapeHTML:Ht,unknownType:ue,unknownMark:he,unknownList:me,unknownListItem:ge,unknownBlockStyle:fe};function be(t,e){const{block:n,list:i,listItem:r,marks:a,types:s,...l}=e;return{...t,block:U(t,e,"block"),list:U(t,e,"list"),listItem:U(t,e,"listItem"),marks:U(t,e,"marks"),types:U(t,e,"types"),...l}}function U(t,e,n){const i=e[n],r=t[n];return typeof i=="function"||i&&typeof r=="function"?i:i?{...r,...i}:r}function ve(t,e={}){const{components:n,onMissingComponent:i=de}=e,r=i||we,a=Array.isArray(t)?t:[t],s=Kt(a,"html"),l=n?be(ft,n):ft,d=$e(l,r);return s.map((c,h)=>d({node:c,index:h,isInline:!1,renderNode:d})).join("")}const $e=(t,e)=>{function n(c){const{node:h,index:y,isInline:g}=c;return St(h)?r(h,y):Tt(h)?i(h,y):At(h)?a(h):xt(h)?s(h,y,g):Mt(h)?l(h):d(h,y,g)}function i(c,h){const y=mt({node:c,index:h,isInline:!1,renderNode:n}),g=t.listItem,p=(typeof g=="function"?g:g[c.listItem])||t.unknownListItem;if(p===t.unknownListItem){const k=c.listItem||"bullet";e(ce(k),{type:k,nodeType:"listItemStyle"})}let v=y.children;if(c.style&&c.style!=="normal"){const{listItem:k,...P}=c;v=n({node:P,index:h,isInline:!1})}return p({value:c,index:h,isInline:!1,renderNode:n,children:v})}function r(c,h){const y=c.children.map((v,k)=>n({node:v._key?v:{...v,_key:`li-${h}-${k}`},index:k,isInline:!1})),g=t.list,p=(typeof g=="function"?g:g[c.listItem])||t.unknownList;if(p===t.unknownList){const v=c.listItem||"bullet";e(le(v),{nodeType:"listStyle",type:v})}return p({value:c,index:h,isInline:!1,renderNode:n,children:y.join("")})}function a(c){const{markDef:h,markType:y,markKey:g}=c,p=t.marks[y]||t.unknownMark,v=c.children.map((k,P)=>n({node:k,index:P,isInline:!0}));return p===t.unknownMark&&e(oe(y),{nodeType:"mark",type:y}),p({text:Et(c),value:h,markType:y,markKey:g,renderNode:n,children:v.join("")})}function s(c,h,y){const{_key:g,...p}=mt({node:c,index:h,isInline:y,renderNode:n}),v=p.node.style||"normal",k=(typeof t.block=="function"?t.block:t.block[v])||t.unknownBlockStyle;return k===t.unknownBlockStyle&&e(se(v),{nodeType:"blockStyle",type:v}),k({...p,value:p.node,renderNode:n})}function l(c){if(c.text===`
`){const h=t.hardBreak;return h?h():`
`}return t.escapeHTML(c.text)}function d(c,h,y){const g=t.types[c._type];return g||e(It(c._type),{nodeType:"block",type:c._type}),(g||t.unknownType)({value:c,isInline:y,index:h,renderNode:n})}return n};function mt(t){const{node:e,index:n,isInline:i,renderNode:r}=t,a=Ft(e).map((s,l)=>r({node:s,isInline:!0,index:l,renderNode:r}));return{_key:e._key||`block-${n}`,children:a.join(""),index:n,isInline:i,node:e}}function we(){}const it="images/samuel-placeholder.svg",Pt=it,J=/^[a-zA-Z0-9_-]{11}$/,$={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},I={meta:null,items:[],videos:[],photos:[]},X={meta:null,items:[],totalCount:0},et={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{ke(),gn();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await Le(),window.location.hash&&setTimeout(()=>Nt(window.location.hash),100),kn(t),t||Ln()});function ke(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const n=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",n),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function Le(){at(!0);const t=await Xt();if(!t)return mn("Unable to load the latest content. Please try again shortly."),at(!1),null;xe(t.site),Te(t.hero,t.site),Se(t.about),Ae(t.resume),Me(t.academics);const e=ot(t.highlightEvents||[]);I.meta=t.highlightsSection,I.items=e.filter(st),Ee();const n=ot(t.videos||[],"eventDate");I.videos=n,X.meta=t.videosSection,X.items=n.filter(st),X.totalCount=n.length,He();const i=ot(t.galleryPhotos||[],"shotDate");return I.photos=i,et.meta=t.gallerySection,et.items=i.filter(st),Ie(),Ce(t.dualSport),_e(t.contact),at(!1),ct(),t}function xe(t){var i;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const n=document.querySelector(".brand-mark");if(n)if((i=t.brandMarkImage)!=null&&i.url)n.innerHTML=`<span class="brand-mark-image"><img src="${T(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,n.classList.add("has-image");else{const r=t.brandMarkInitials||yn(t.siteTitle)||n.textContent||"SM";n.textContent=r,n.classList.remove("has-image")}}function Te(t,e){var a,s;const n=w($.heroCopy),i=w($.heroPhoto),r=w($.heroMetrics);if(!t){n&&(n.innerHTML=S("Hero content coming soon."));return}if(n){const l=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",d=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",c=t.bio?`<p>${o(t.bio)}</p>`:"",h=[vt(t.primaryCta,"primary","View Highlights","#highlights"),vt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");n.innerHTML=`
      ${l}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${d}
      </h1>
      ${c}
      <div class="hero-actions">
        ${h||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(i){const l=((a=t.headshot)==null?void 0:a.url)||it,d=((s=t.headshot)==null?void 0:s.alt)||"Portrait of Samuel Masco",c=t.photoCaption||"Focused on the next shot.";i.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${l}" alt="${o(d)}" loading="lazy" />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${o(c)}</figcaption>
    `}r&&(Array.isArray(t.metrics)&&t.metrics.length?r.innerHTML=t.metrics.map(l=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${o(l.label||"")}</span>
              <span class="metric-value">${o(l.value||"")}</span>
            </div>
          `).join(""):r.innerHTML=S("Metrics coming soon."))}function Se(t){const e=w($.aboutHeading),n=w($.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"About")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:S("About section coming soon.")),n){if(!t){n.innerHTML=S("About details coming soon.");return}n.innerHTML=`
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
        ${dt(t.mindsetBody)}
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
    `}}function Ae(t){const e=w($.resumeHeading),n=w($.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Golf Resume")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:S("Golf resume coming soon.")),n){if(!t){n.innerHTML=S("Resume details coming soon.");return}n.innerHTML=`
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
        ${dt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(i=>`<li>${o(i||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function Me(t){const e=w($.academicsHeading),n=w($.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Academics")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:S("Academics section coming soon.")),n){if(!t){n.innerHTML=S("Academic details coming soon.");return}const i=t.transcriptLabel||"Transcript",r=t.transcriptUrl?`<a class="btn subtle" href="${T(t.transcriptUrl)}" target="_blank" rel="noopener">${o(i)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${o(i)}</span>`;n.innerHTML=`
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
        ${dt(t.interestsBody)}
      </article>
    `}}function Ee(){const t=I.meta,e=I.items||[],n=w($.highlightsHeading),i=w($.highlightsTimeline),r=w($.highlightsActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:S("Highlights coming soon.")),!i)return;const a=(t==null?void 0:t.maxItems)||5,s=e.slice(0,a);if(!s.length){i.innerHTML=S("Highlight events coming soon."),r&&(r.innerHTML="");return}i.innerHTML=s.map((l,d)=>Ne(l,d)).join(""),i.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),Ge(i),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function He(){const t=X.meta,e=X.items||[],n=w($.videosHeading),i=w($.videoGrid),r=w($.videosActions);if(n&&(n.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:S("Videos coming soon.")),!i)return;const a=(t==null?void 0:t.maxItems)||3,s=e.slice(0,a);if(!s.length){i.innerHTML=S("Video highlights coming soon."),r&&(r.innerHTML="");return}i.innerHTML=s.map((l,d)=>cn(l,d)).join(""),i.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),ct(),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function Ie(){const t=et.meta,e=et.items||[],n=w($.galleryHeading),i=w($.galleryGrid),r=w($.galleryActions);if(n){const l=(t==null?void 0:t.heading)||"Photo Gallery",d=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";n.innerHTML=`
      <h2>${o(l)}</h2>
      ${`<p>${o(d)}</p>`}
    `}if(!i)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),s=e.slice(0,a);if(!s.length){i.innerHTML=S("Gallery photos coming soon."),r&&(r.innerHTML="");return}if(i.innerHTML=s.map((l,d)=>Pe(l,d)).join(""),i.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),Bt(i),r){const l=(t==null?void 0:t.ctaHref)||"gallery.html",d=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";r.innerHTML=`<a class="btn ghost" href="${T(l)}">${o(d)}</a>`}}function Pe(t,e=0){var P,q,z;const n=((P=t==null?void 0:t.image)==null?void 0:P.url)||it,i=((q=t==null?void 0:t.image)==null?void 0:q.alt)||(t==null?void 0:t.title)||"Gallery highlight",r=wn(t),a=r||"",s=(z=t==null?void 0:t.image)!=null&&z.url?{src:n,alt:i,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,l=s?`data-photo-src="${T(s.src)}" data-photo-alt="${T(s.alt)}" data-photo-title="${T(s.title)}"`:"",d=[],c=$n(t==null?void 0:t.shotDate);c&&d.push(c),r&&d.push(r),t!=null&&t.location&&d.push(t.location);const h=d.map(G=>`<span>${o(G)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),y=h?`<div class="gallery-card-meta">${h}</div>`:"",g=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",p=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",v=p?`<div class="gallery-card-footer">${p}</div>`:"",k=s?`data-photo-preview="true" ${l}`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${k?` ${k}`:""}>
        ${a?`<span class="gallery-card-badge">${o(a)}</span>`:""}
        <img src="${T(n)}" alt="${o(i)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        ${y}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${g}
        ${De(t==null?void 0:t.tags)}
        ${v}
      </div>
    </article>
  `}function De(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(n=>typeof n=="string"?n.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(n=>`<span class="gallery-tag">${o(n)}</span>`).join("")}
    </div>
  `:""}function Ce(t){const e=w($.dualHeading),n=w($.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:S("Dual-sport content coming soon.")),n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=S("Dual-sport cards coming soon.");return}n.innerHTML=t.cards.map((i,r)=>`
          <article class="dual-card" data-motion="delay-${r+1}">
            <h3>${o(i.title||"")}</h3>
            ${i.body?`<p>${o(i.body)}</p>`:""}
            ${Array.isArray(i.bulletPoints)&&i.bulletPoints.length?`<ul>${i.bulletPoints.map(a=>`<li>${o(a||"")}</li>`).join("")}</ul>`:""}
          </article>
        `).join("")}}function _e(t){const e=w($.contactHeading),n=w($.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:S("Contact section coming soon.")),!!n){if(!t||!Array.isArray(t.cards)||!t.cards.length){n.innerHTML=S("Contact cards coming soon.");return}n.innerHTML=t.cards.map((i,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${o(i.title||"")}</h3>
          <ul>
            ${(i.entries||[]).map(a=>`<li>${Be(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function Be(t){var r;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",n=pn(t.value),i=(r=t.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&n.length<=1?`${e}<a href="${T(t.link)}"${i}>${o(t.value||t.link)}</a>`:n.length?`${e}${n.map((a,s)=>{const l=s===0&&t.link?t.link:a.link;if(l){const c=l.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${T(l)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function Ne(t,e){const n=vn(t),i=t.summary?`<p>${o(t.summary)}</p>`:"",r=Array.isArray(t.days)?t.days:[],a=Dt(r,{variant:"compact"}),s=`home-highlight-${e}`,l=(t==null?void 0:t._id)||(t==null?void 0:t.title)||s,c=`<div class="highlight-row-actions">${`
    <button class="highlight-toggle" type="button" data-highlight-modal="${T(l)}">
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
  `}function Dt(t=[],{variant:e="default",showLabels:n}={}){if(!Array.isArray(t)||!t.length)return"";const i=t.length,r=typeof n=="boolean"?n:i>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",i===1?"day-stats--single":"",`day-stats--cols-${Math.min(i,3)}`].filter(Boolean).join(" ")}">
      ${t.map((s,l)=>qe(s,l,{showLabels:r,total:i})).join("")}
    </div>
  `}const gt=120,Oe=57;function qe(t,e,{showLabels:n,total:i}){if(!t)return"";const r=i===1,a=!r&&n?_t(t,e,i):null,s=Ye(t);return s?`
    <div class="day-stat${r?" day-stat--single":""}">
      ${a?`<span class="day-stat-label">${o(a)}</span>`:""}
      ${s}
    </div>
  `:""}function Ye(t){const e=nn(t);return e.length?`
    <div class="day-metrics">
      ${Re(e)}
    </div>
  `:""}function Re(t){return`
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
  `}function je(t=[]){if(!Array.isArray(t))return"";const e=t.map((n,i)=>{if(!(n!=null&&n.notes))return"";const r=_t(n,i,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(r)}</strong>
          <p>${o(n.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function Ge(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",()=>{const n=e.getAttribute("data-highlight-modal");Ue(n)}))})}let R=null;function Ve(){if(R)return R;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&yt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&yt()}),document.body.appendChild(t),R=t,t}function Ue(t){const e=Ve(),n=e.querySelector("[data-highlight-overlay-body]");if(!n)return;const i=Xe(t);if(!i)return;const r=Qe(i),a=Je(i);n.innerHTML=We(i,r,a),ct(n),Bt(n),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function yt(){if(!R)return;const t=R.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),R.classList.remove("is-open"),R.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Xe(t){return t?I.items.find(e=>((e==null?void 0:e._id)||"")===t)||I.items.find(e=>(e==null?void 0:e.title)===t)||null:I.items[0]||null}function We(t,e,n){const r=[en(t),t.location?o(t.location):null].filter(Boolean),a=r.length?`<div class="highlight-overlay-meta">
        ${r.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=Dt(t.days||[],{variant:"list"}),l=je(t.days||[]);return`
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
        ${ze(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Ke(n)}
      </section>
    </div>
  `}function ze(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(Fe).join("")}
    </div>
  `}function Fe(t){const e=qt(t),n=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:Pt),i=t.thumbnailAlt||t.title||"Video highlight",r=t.ctaLabel||"Play",a=t.title||"Video highlight",l=!!e?"":' disabled aria-disabled="true"';return`
    <article class="overlay-media-card overlay-video-card">
      <div class="video-frame" data-video-id="${o(e)}" data-video-title="${o(a)}">
        <img src="${T(n)}" alt="${o(i)}" loading="lazy" />
        <button class="play-button" type="button"${l} aria-label="Play ${o(a)}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${o(r)}</span>
        </button>
      </div>
      <div class="overlay-media-copy">
        <h4>${o(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${o(t.description)}</p>`:""}
      </div>
    </article>
  `}function Ke(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(Ze).join("")}
    </div>
  `}function Ze(t){var s,l,d;const e=((s=t==null?void 0:t.image)==null?void 0:s.url)||Pt,n=((l=t==null?void 0:t.image)==null?void 0:l.alt)||(t==null?void 0:t.title)||"Gallery photo",i=[t==null?void 0:t.title,t==null?void 0:t.description,t!=null&&t.photographer?`Photo: ${t.photographer}`:""].map(c=>c?o(c):"").filter(Boolean),r=(d=t==null?void 0:t.image)!=null&&d.url?{src:e,alt:n,title:(t==null?void 0:t.title)||"Gallery photo"}:null,a=r?`data-photo-preview="true" data-photo-src="${T(r.src)}" data-photo-alt="${T(r.alt)}" data-photo-title="${T(r.title)}"`:"";return`
    <figure class="overlay-photo-card">
      <div class="overlay-media-thumb"${a?` ${a}`:""}>
        <img src="${T(e)}" alt="${o(n)}" loading="lazy" />
      </div>
      ${i.length?`<figcaption>${i.join(" • ")}</figcaption>`:""}
    </figure>
  `}function Qe(t){return!t||!Array.isArray(I.videos)?[]:I.videos.filter(e=>Ct(e,t))}function Je(t){return!t||!Array.isArray(I.photos)?[]:I.photos.filter(e=>Ct(e,t))}function Ct(t,e){const n=tn(t);return n?!!(n.id&&(e!=null&&e._id)&&n.id===e._id||n.title&&(e!=null&&e.title)&&n.title===e.title):!1}function tn(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function en(t){return t?Ot(t.eventDate,t.endDate,{month:"long"}):""}function nn(t){if(!t)return[];const e=[],n=nt(t.score),i=nt(t.yardage);e.push(rt({key:"score",label:"Score",display:typeof n=="number"?String(n):"—",progress:an(n)})),e.push(rt({key:"yards",label:"Yardage",display:typeof i=="number"?i.toLocaleString():"—",secondary:"",progress:on(i,rn(t,i))}));const r=ln(t);return e.push(rt({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),e.filter(Boolean)}function rt({key:t,label:e,display:n,secondary:i,progress:r}){const a=n!=null&&n!==""?String(n):"—",s=i?String(i):"",l=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:t,label:e,display:a,secondary:s,progress:Math.max(0,l)}}function _t(t,e,n){return t.label?t.label:n>1?`Day ${e+1}`:null}function nt(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function rn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function an(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=gt-Oe;return(gt-t)/e}function on(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function sn(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const n=(e-t)/(e-1);return Math.max(0,Math.min(n,1))}function ln(t){const e=nt(t==null?void 0:t.rankingPosition),n=nt(t==null?void 0:t.rankingOutOf),i=sn(e,n);return typeof e=="number"?{display:String(e),secondary:typeof n=="number"?`of ${n}`:"",progress:i}:{display:"—",secondary:"",progress:0}}function cn(t,e){const n=qt(t),i=t.thumbnailUrl||(n?`https://img.youtube.com/vi/${n}/hqdefault.jpg`:it),r=t.thumbnailAlt||t.title||"Video highlight",a=t.ctaLabel||"Play",s=t.title||"Video highlight",d=!!n?"":' disabled aria-disabled="true"';return`
    <article class="video-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(n)}" data-video-title="${o(s)}">
        <img src="${T(i)}" alt="${o(r)}" loading="lazy" />
        <button class="play-button" type="button"${d} aria-label="Play ${o(s)}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${o(a)}</span>
        </button>
      </div>
      <h3>${o(t.title||"")}</h3>
      <p>${o(t.description||"")}</p>
    </article>
  `}function ct(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(n=>{if(n.dataset.playerReady==="true")return;const i=n.querySelector(".play-button"),r=n.dataset.videoId,a=n.dataset.videoTitle||"Samuel Masco golf video highlight";!i||!r||(i.addEventListener("click",()=>{un(r,a)}),n.dataset.playerReady="true")})}let j=null;function dn(){if(j)return j;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&pt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&pt()}),document.body.appendChild(t),j=t,t}function un(t,e){const n=dn(),i=n.querySelector(".video-overlay-frame");if(!i)return;i.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",e),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",i.appendChild(r),n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function pt(){if(!j)return;const t=j.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),j.classList.remove("is-open"),j.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let O=null;function Bt(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(n=>{n.dataset.photoPreviewReady!=="true"&&(n.addEventListener("click",()=>{fn(n.getAttribute("data-photo-src"),n.getAttribute("data-photo-alt"),n.getAttribute("data-photo-title"))}),n.dataset.photoPreviewReady="true")})}function hn(){if(O)return O;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&bt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&bt()}),document.body.appendChild(t),O=t,t}function fn(t,e,n){if(!t)return;const i=hn(),r=i.querySelector("img"),a=i.querySelector("figcaption");!r||!a||(r.src=t,r.alt=e||n||"Gallery photo",a.textContent=n||e||"",i.classList.add("is-open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function bt(){if(!O)return;const t=O.querySelector("img"),e=O.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),O.classList.remove("is-open"),O.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function dt(t){return!Array.isArray(t)||!t.length?"":ve(t)}function w(t){return t?document.querySelector(t):null}function S(t){return`<p class="placeholder-text">${o(t)}</p>`}function at(t){document.body.dataset.contentLoading=String(t)}function mn(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function vt(t,e,n,i){const r=(t==null?void 0:t.label)||n,a=(t==null?void 0:t.href)||i;if(!r||!a)return"";const l=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${T(a)}"${l}>${o(r)}</a>`}function gn(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const n=e.getAttribute("href")||"";Nt(n)&&t.preventDefault()})}function Nt(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function Ot(t,e,{month:n="short"}={}){if(!t)return"";const i=new Date(t);if(Number.isNaN(i.getTime()))return o(t);if(!e)return i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});const r=new Date(e);if(Number.isNaN(r.getTime()))return`${i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=i.getFullYear()===r.getFullYear(),s=a&&i.getMonth()===r.getMonth();if(a&&s)return`${i.toLocaleDateString("en-US",{month:n})} ${i.getDate()}–${r.getDate()}, ${i.getFullYear()}`;if(a){const c=i.toLocaleDateString("en-US",{month:n,day:"numeric"}),h=r.toLocaleDateString("en-US",{month:n,day:"numeric"});return`${c} – ${h}, ${i.getFullYear()}`}const l=i.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"}),d=r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});return`${l} – ${d}`}function qt(t){return t?$t(t.youtubeId)||$t(t.youtubeUrl):""}function $t(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(J.test(e))return e;let n;try{n=new URL(e)}catch{try{n=new URL(`https://${e}`)}catch{return""}}const i=n.hostname.replace(/^www\./,"").toLowerCase();if(i==="youtu.be"){const r=n.pathname.split("/").filter(Boolean)[0];return r&&J.test(r)?r:""}if(i==="youtube.com"||i.endsWith(".youtube.com")){const r=n.searchParams.get("v");if(r&&J.test(r))return r;const a=n.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const s=a[1];return s&&J.test(s)?s:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function T(t){return o(t)}function yn(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(n=>n.charAt(0).toUpperCase()).join(""):""}function pn(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:bn(r)})):[]}function bn(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function vn(t){return t?Ot(t.eventDate,t.endDate,{month:"short"}):""}function $n(t){if(!t)return"";const e=new Date(t);return Number.isNaN(e.getTime())?t:e.toLocaleDateString("en-US",{month:"short",year:"numeric"})}function wn(t){var e;return t&&(((e=t==null?void 0:t.tournament)==null?void 0:e.title)||(t==null?void 0:t.tournament))||""}function ot(t,e="eventDate"){return Array.isArray(t)?[...t].sort((n,i)=>wt(i,e)-wt(n,e)):[]}function wt(t,e){if(!t)return 0;const n=t[e];if(n){const i=Date.parse(n);if(!Number.isNaN(i))return i}if(t._createdAt){const i=Date.parse(t._createdAt);if(!Number.isNaN(i))return i}return 0}function st(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function kn(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(n=>n.classList.add("is-visible"));return}const e=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-visible"),e.unobserve(i.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(n=>e.observe(n))}function Ln(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const n=18,i={x:Math.min(window.innerWidth-n-24,window.innerWidth*.78),y:Math.min(window.innerHeight-n-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let r=performance.now(),a=!1,s=!0;const l=document.querySelector(".site-header"),d=document.querySelector(".hero"),c={x:0,y:0,active:!1},y=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(u=>Array.from(document.querySelectorAll(u))).filter(u=>u!==null&&u.isConnected),g=document.querySelector(".hero-scroll"),p=g?g.querySelector("span"):null,v={x:.5,y:-32},k={x:0,y:10},P=-80;function q(){e.style.transform=`translate3d(${i.x-n}px, ${i.y-n}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${i.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${i.textureOffsetY}px`)}function z(){var H;const u=document.querySelector(".hero-copy h1");if(!u)return null;const f="masco",b=(u.textContent||"").toLowerCase().lastIndexOf(f);if(b===-1)return null;const x=b+f.length-1,M=document.createTreeWalker(u,NodeFilter.SHOW_TEXT);let A=0,E=M.nextNode();for(;E;){const Y=E.textContent||"",C=Y.length;if(x<A+C){const _=x-A;if(_<0||_>=C)return null;const V=Y.charAt(_);if(!V||!V.trim())return null;const D=document.createRange();D.setStart(E,_),D.setEnd(E,Math.min(_+1,C));const B=D.getBoundingClientRect();return(H=D.detach)==null||H.call(D),!B||!B.width&&!B.height?null:{left:B.left+window.scrollX,right:B.right+window.scrollX,top:B.top+window.scrollY,bottom:B.bottom+window.scrollY,width:B.width,height:B.height}}A+=C,E=M.nextNode()}return null}function G(u){const f=u.top+n+P,m=n+4;return Math.max(f,m)}function Yt(){if(!d)return!0;const u=window.getComputedStyle(d),f=parseFloat(u.getPropertyValue("column-gap")||u.getPropertyValue("gap"))||0,m=d.clientWidth;if(!m)return!1;const b=280*3+f*2;return m>=b-.5}function Rt(){const u=z();if(!u)return!1;const f=Z(),m=u.left+u.width/3+v.x,L=u.top+u.height/30+v.y,b=f.left+n+12,x=f.right-n-12,M=G(f),A=f.bottom-n-12;return i.x=N(m,b,x),i.y=N(L,M,A),i.vx=0,i.vy=0,q(),!0}function jt(){if(!g)return!1;const u=Lt(p||g),f=Z(),m=u.left+u.width/2+k.x,L=u.bottom+n+k.y,b=f.left+n+12,x=f.right-n-12,M=G(f),A=f.bottom-n-12;return i.x=N(m,b,x),i.y=N(L,M,A),i.vx=0,i.vy=0,q(),!0}function F(){Rt()||jt()||q()}function K(u={}){const{force:f=!1}=u,m=Yt();if(!f&&m===s)return;const L=s;s=m,e.style.display=m?"":"none",m&&(!L||f)&&F()}F(),K({force:!0}),window.addEventListener("load",()=>{F(),K({force:!0})},{once:!0}),requestAnimationFrame(()=>{F(),K({force:!0})});function Gt(u,f){if(!c.active)return;const m=i.x-c.x,L=i.y-c.y,b=Math.hypot(m,L),x=n+10;if(b>x)return;const M=.42;i.vx+=u*M,i.vy+=f*M;const A=34,E=Math.hypot(i.vx,i.vy);if(E>A){const H=A/E;i.vx*=H,i.vy*=H}if(b<n){const H=n-b,Y=m/(b||1),C=L/(b||1);i.x+=Y*(H+.5),i.y+=C*(H+.5)}}function Vt(){const f=Z(),m=f.left+n+8,L=f.right-n-8,b=G(f),x=f.bottom-n-8;i.x<m?(i.x=m,i.vx=Math.abs(i.vx)*.78):i.x>L&&(i.x=L,i.vx=-Math.abs(i.vx)*.78),i.y<b?(i.y=b,i.vy=Math.abs(i.vy)*.78):i.y>x&&(i.y=x,i.vy=-Math.abs(i.vy)*.78)}function Ut(){for(const f of y){if(!f.isConnected)continue;const m=f.getBoundingClientRect(),L=window.scrollX,b=window.scrollY,x={left:m.left+L,right:m.right+L,top:m.top+b,bottom:m.bottom+b};if(m.width===0||m.height===0||m.right<-40||m.left>window.innerWidth+40||m.bottom<-40||m.top>window.innerHeight+40)continue;const M=N(i.x,x.left,x.right),A=N(i.y,x.top,x.bottom),E=i.x-M,H=i.y-A,Y=E*E+H*H;if(Y>=n*n||E===0&&H===0)continue;const C=Math.sqrt(Y)||1e-4,_=E/C,V=H/C;i.x=M+_*(n+.5),i.y=A+V*(n+.5);const D=i.vx*_+i.vy*V;D>0||(i.vx-=(1+.72)*D*_,i.vy-=(1+.72)*D*V)}}function Z(){return l?Lt(l):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function ut(){const u=performance.now(),f=Math.min((u-r)/16.666,3);r=u,i.x+=i.vx*f,i.y+=i.vy*f,i.vx*=Math.pow(.985,f),i.vy*=Math.pow(.985,f),Math.abs(i.vx)<.02&&(i.vx=0),Math.abs(i.vy)<.02&&(i.vy=0),Vt(),Ut(),a=Math.hypot(i.vx,i.vy)>.35,a&&(i.textureOffsetX=kt(i.textureOffsetX+i.vx*f*.32,12),i.textureOffsetY=kt(i.textureOffsetY+i.vy*f*.32,12)),q(),requestAnimationFrame(ut)}window.addEventListener("pointermove",u=>{if(u.pointerType&&u.pointerType!=="mouse"&&u.pointerType!=="pen")return;const f=c.x,m=c.y,L=c.active,b=u.clientX+window.scrollX,x=u.clientY+window.scrollY;c.x=b,c.y=x,c.active=!0;const M=L?b-f:0,A=L?x-m:0;L&&Gt(M,A)},{passive:!0}),window.addEventListener("pointerleave",()=>{c.active=!1}),window.addEventListener("pointerout",u=>{u.relatedTarget||(c.active=!1)}),window.addEventListener("blur",()=>{c.active=!1}),window.addEventListener("scroll",()=>{c.active=!1}),window.addEventListener("resize",()=>{const u=Z();i.x=N(i.x,u.left+n+8,u.right-n-8),i.y=N(i.y,G(u),u.bottom-n-8),K()}),requestAnimationFrame(ut)}function N(t,e,n){return Math.min(Math.max(t,e),n)}function kt(t,e){const n=t%e;return n<0?n+e:n}function Lt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
