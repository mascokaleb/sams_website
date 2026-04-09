import{f as Te,p as W}from"./sanityClient-NVgrsKxR.js";function dt(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function Nt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function Rt(t){return Nt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function Vt(t){return t._type==="@list"}function Xt(t){return t._type==="@span"}function Gt(t){return t._type==="@text"}const Ht=["strong","em","code","underline","strike-through"];function Le(t,e,r){if(!dt(t)||!t.marks)return[];if(!t.marks.length)return[];const n=t.marks.slice(),i={};return n.forEach(a=>{i[a]=1;for(let s=e+1;s<r.length;s++){const l=r[s];if(l&&dt(l)&&Array.isArray(l.marks)&&l.marks.indexOf(a)!==-1)i[a]++;else break}}),n.sort((a,s)=>Se(i,a,s))}function Se(t,e,r){const n=t[e],i=t[r];if(n!==i)return i-n;const a=Ht.indexOf(e),s=Ht.indexOf(r);return a!==s?a-s:e.localeCompare(r)}function Ae(t){var s;const{children:e}=t,r=t.markDefs??[];if(!e||!e.length)return[];const n=e.map(Le),i={_type:"@span",children:[],markType:"<unknown>"};let a=[i];for(let l=0;l<e.length;l++){const f=e[l];if(!f)continue;const c=n[l]||[];let u=1;if(a.length>1)for(u;u<a.length;u++){const g=((s=a[u])==null?void 0:s.markKey)||"",p=c.indexOf(g);if(p===-1)break;c.splice(p,1)}a=a.slice(0,u);let y=a[a.length-1];if(y){for(const g of c){const p=r==null?void 0:r.find(C=>C._key===g),w=p?p._type:g,T={_type:"@span",_key:f._key,children:[],markDef:p,markType:w,markKey:g};y.children.push(T),a.push(T),y=T}if(dt(f)){const g=f.text.split(`
`);for(let p=g.length;p-- >1;)g.splice(p,0,`
`);y.children=y.children.concat(g.map(p=>({_type:"@text",text:p})))}else y.children=y.children.concat(f)}}return i.children}function Me(t,e){const r=[];let n;for(let i=0;i<t.length;i++){const a=t[i];if(a){if(!Rt(a)){r.push(a),n=void 0;continue}if(!n){n=lt(a,i,e),r.push(n);continue}if(He(a,n)){n.children.push(a);continue}if((a.level||1)>n.level){const s=lt(a,i,e);{const l=n.children[n.children.length-1],f={...l,children:[...l.children,s]};n.children[n.children.length-1]=f}n=s;continue}if((a.level||1)<n.level){const s=r[r.length-1],l=s&&bt(s,a);if(l){n=l,n.children.push(a);continue}n=lt(a,i,e),r.push(n);continue}if(a.listItem!==n.listItem){const s=r[r.length-1],l=s&&bt(s,{level:a.level||1});if(l&&l.listItem===a.listItem){n=l,n.children.push(a);continue}else{n=lt(a,i,e),r.push(n);continue}}console.warn("Unknown state encountered for block",a),r.push(a)}}return r}function He(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function lt(t,e,r){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:r,level:t.level||1,listItem:t.listItem,children:[t]}}function bt(t,e){const r=e.level||1,n=e.listItem||"normal",i=typeof e.listItem=="string";if(Vt(t)&&(t.level||1)===r&&i&&(t.listItem||"normal")===n)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!dt(a)?bt(a,e):void 0}function Ut(t){let e="";return t.children.forEach(r=>{Gt(r)?e+=r.text:Xt(r)&&(e+=Ut(r))}),e}const Ee=["http","https","mailto","tel"],Ie={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Wt(t){return Pe(t.replace(/[&<>"']/g,e=>`&${Ie[e]};`))}function Pe(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Ce(t){const e=(t||"").trim(),r=e.charAt(0);if(r==="#"||r==="/")return!0;const n=e.indexOf(":");if(n===-1)return!0;const i=e.slice(0,n).toLowerCase();if(Ee.indexOf(i)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&n>a)return!0;const s=e.indexOf("#");return s!==-1&&n>s}const De={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},Ye=({children:t})=>`<li>${t}</li>`,Be=({children:t,value:e})=>{const r=(e==null?void 0:e.href)||"";return Ce(r)?`<a href="${Wt(r)}">${t}</a>`:t},Oe={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Be},et=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,zt=t=>et(`block type "${t}"`,"types"),_e=t=>et(`mark type "${t}"`,"marks"),qe=t=>et(`block style "${t}"`,"block"),je=t=>et(`list style "${t}"`,"list"),Ne=t=>et(`list item style "${t}"`,"listItem");function Re(t){console.warn(t)}const Ve=({value:t,isInline:e})=>{const r=zt(t._type);return e?`<span style="display:none">${r}</span>`:`<div style="display:none">${r}</div>`},Xe=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,Ge=({children:t})=>`<p>${t}</p>`,Ue=({children:t})=>`<ul>${t}</ul>`,We=({children:t})=>`<li>${t}</li>`,ze=()=>"<br/>",Fe={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},Et={types:{},block:Fe,marks:Oe,list:De,listItem:Ye,hardBreak:ze,escapeHTML:Wt,unknownType:Ve,unknownMark:Xe,unknownList:Ue,unknownListItem:We,unknownBlockStyle:Ge};function Ke(t,e){const{block:r,list:n,listItem:i,marks:a,types:s,...l}=e;return{...t,block:J(t,e,"block"),list:J(t,e,"list"),listItem:J(t,e,"listItem"),marks:J(t,e,"marks"),types:J(t,e,"types"),...l}}function J(t,e,r){const n=e[r],i=t[r];return typeof n=="function"||n&&typeof i=="function"?n:n?{...i,...n}:i}function Ze(t,e={}){const{components:r,onMissingComponent:n=Re}=e,i=n||Je,a=Array.isArray(t)?t:[t],s=Me(a,"html"),l=r?Ke(Et,r):Et,f=Qe(l,i);return s.map((c,u)=>f({node:c,index:u,isInline:!1,renderNode:f})).join("")}const Qe=(t,e)=>{function r(c){const{node:u,index:y,isInline:g}=c;return Vt(u)?i(u,y):Rt(u)?n(u,y):Xt(u)?a(u):Nt(u)?s(u,y,g):Gt(u)?l(u):f(u,y,g)}function n(c,u){const y=It({node:c,index:u,isInline:!1,renderNode:r}),g=t.listItem,p=(typeof g=="function"?g:g[c.listItem])||t.unknownListItem;if(p===t.unknownListItem){const T=c.listItem||"bullet";e(Ne(T),{type:T,nodeType:"listItemStyle"})}let w=y.children;if(c.style&&c.style!=="normal"){const{listItem:T,...C}=c;w=r({node:C,index:u,isInline:!1})}return p({value:c,index:u,isInline:!1,renderNode:r,children:w})}function i(c,u){const y=c.children.map((w,T)=>r({node:w._key?w:{...w,_key:`li-${u}-${T}`},index:T,isInline:!1})),g=t.list,p=(typeof g=="function"?g:g[c.listItem])||t.unknownList;if(p===t.unknownList){const w=c.listItem||"bullet";e(je(w),{nodeType:"listStyle",type:w})}return p({value:c,index:u,isInline:!1,renderNode:r,children:y.join("")})}function a(c){const{markDef:u,markType:y,markKey:g}=c,p=t.marks[y]||t.unknownMark,w=c.children.map((T,C)=>r({node:T,index:C,isInline:!0}));return p===t.unknownMark&&e(_e(y),{nodeType:"mark",type:y}),p({text:Ut(c),value:u,markType:y,markKey:g,renderNode:r,children:w.join("")})}function s(c,u,y){const{_key:g,...p}=It({node:c,index:u,isInline:y,renderNode:r}),w=p.node.style||"normal",T=(typeof t.block=="function"?t.block:t.block[w])||t.unknownBlockStyle;return T===t.unknownBlockStyle&&e(qe(w),{nodeType:"blockStyle",type:w}),T({...p,value:p.node,renderNode:r})}function l(c){if(c.text===`
`){const u=t.hardBreak;return u?u():`
`}return t.escapeHTML(c.text)}function f(c,u,y){const g=t.types[c._type];return g||e(zt(c._type),{nodeType:"block",type:c._type}),(g||t.unknownType)({value:c,isInline:y,index:u,renderNode:r})}return r};function It(t){const{node:e,index:r,isInline:n,renderNode:i}=t,a=Ae(e).map((s,l)=>i({node:s,isInline:!0,index:l,renderNode:i}));return{_key:e._key||`block-${r}`,children:a.join(""),index:r,isInline:n,node:e}}function Je(){}const gt="images/samuel-placeholder.svg",Ft=gt,ct=/^[a-zA-Z0-9_-]{11}$/,x={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',upcomingHeading:'[data-template="upcoming-heading"]',upcomingGrid:'[data-template="upcoming-grid"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},I={meta:null,allItems:[],items:[],videos:[],photos:[]},tt={meta:null,items:[],totalCount:0},ut={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{tn(),er();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await en(),window.location.hash&&setTimeout(()=>ie(window.location.hash),100),sr(t),t||lr()});function tn(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const r=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",r),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(r=>{r.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function en(){ht(!0);const t=await Te();if(!t)return tr("Unable to load the latest content. Please try again shortly."),ht(!1),null;nn(t.site),rn(t.hero,t.site),an(t.about),on(t.resume),yn(t.academics);const e=yt(t.highlightEvents||[]);I.meta=t.highlightsSection,I.allItems=e,I.items=e.filter(pt),pn(),sn(t.upcomingTournamentsSection,t.upcomingTournaments||[]);const r=yt(t.videos||[],"eventDate");I.videos=r,tt.meta=t.videosSection,tt.items=r.filter(pt),tt.totalCount=r.length,bn();const n=yt(t.galleryPhotos||[],"shotDate");return I.photos=n,ut.meta=t.gallerySection,ut.items=n.filter(pt),$n(),wn(t.dualSport),xn(t.contact),ht(!1),xt(),t}function nn(t){var n;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const i=document.querySelector(".brand-text");i&&(i.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const r=document.querySelector(".brand-mark");if(r)if((n=t.brandMarkImage)!=null&&n.url){const i=U(t.brandMarkImage.focalPoint||t.brandMarkImage.hotspot),a=i?` style="object-position: ${v(i)};"`:"";r.innerHTML=`<span class="brand-mark-image"><img src="${v(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy"${a} /></span>`,r.classList.add("has-image")}else{const i=t.brandMarkInitials||nr(t.siteTitle)||r.textContent||"SM";r.textContent=i,r.classList.remove("has-image")}}function rn(t,e){var a,s,l,f;const r=k(x.heroCopy),n=k(x.heroPhoto),i=k(x.heroMetrics);if(!t){r&&(r.innerHTML=H("Hero content coming soon."));return}if(r){const c=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",u=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",y=t.bio?`<p>${o(t.bio)}</p>`:"",g=[Bt(t.primaryCta,"primary","View Highlights","#highlights"),Bt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");r.innerHTML=`
      ${c}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${u}
      </h1>
      ${y}
      <div class="hero-actions">
        ${g||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(n){const c=((a=t.headshot)==null?void 0:a.url)||gt,u=((s=t.headshot)==null?void 0:s.alt)||"Portrait of Samuel Masco",y=t.photoCaption||"Focused on the next shot.",g=U(((l=t.headshot)==null?void 0:l.focalPoint)||((f=t.headshot)==null?void 0:f.hotspot)),p=g?` style="object-position: ${v(g)};"`:"";n.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${c}" alt="${o(u)}" loading="lazy"${p} />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${o(y)}</figcaption>
    `}i&&(Array.isArray(t.metrics)&&t.metrics.length?i.innerHTML=t.metrics.map(c=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${o(c.label||"")}</span>
              <span class="metric-value">${o(c.value||"")}</span>
            </div>
          `).join(""):i.innerHTML=H("Metrics coming soon."))}function an(t){const e=k(x.aboutHeading),r=k(x.aboutGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"About")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("About section coming soon.")),r){if(!t){r.innerHTML=H("About details coming soon.");return}r.innerHTML=`
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
    `}}function on(t){const e=k(x.resumeHeading),r=k(x.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Golf Resume")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Golf resume coming soon.")),r){if(!t){r.innerHTML=H("Resume details coming soon.");return}const n=Array.isArray(t.performanceStats)?t.performanceStats:[],i=[],a=[];n.forEach(g=>{dn(g)?i.push(...hn(g==null?void 0:g.value)):a.push(g)});const s=Array.isArray(t.clubYardages)?t.clubYardages:[],l=s.length?s:i,f=l.length>0,c=t.clubYardagesTitle||"Club Yardages",u=f?`
          <div class="performance-column performance-column--clubs">
            <h4 class="performance-column-title">${o(c)}</h4>
            ${mn(l)}
          </div>
        `:"",y=a.map(g=>`
          <div class="performance-stat">
            <span class="performance-stat-label">${o(g.label||"")}</span>
            <span class="performance-stat-value">${o(g.value||"")}</span>
          </div>
        `).join("");r.innerHTML=`
      <article class="panel performance-panel${f?" performance-panel--split":""}" data-motion="delay-1">
        <h3>${o(t.performanceTitle||"Performance Snapshot")}</h3>
        <div class="performance-content">
          <div class="performance-column performance-column--stats">
            <div class="performance-stats-grid">
              ${y}
            </div>
          </div>
          ${u}
        </div>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${o(t.trainingTitle||"Training Routine")}</h3>
        ${kt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(g=>`<li>${o(g||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function sn(t,e){const r=k(x.upcomingHeading),n=k(x.upcomingGrid);if(r&&(r.innerHTML=t?`
          <h2>${o(t.heading||"Upcoming Tournaments")}</h2>
          ${t.subheading?`<p>${o(t.subheading)}</p>`:""}
        `:`
          <h2>Upcoming Tournaments</h2>
          <p>Next events on Samuel's competitive schedule.</p>
        `),!n)return;const i=Array.isArray(e)?e:[];if(!i.length){n.innerHTML=H("Upcoming tournaments coming soon.");return}const a=Math.max(1,(t==null?void 0:t.maxItems)||i.length),s=i.slice(0,a);n.innerHTML=s.map((l,f)=>ln(l,f)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible"))}function ln(t,e=0){if(!t)return"";const r=t.course||"Course TBD",n=t.location||"",i=Tt(t.eventDate,t.endDate,{month:"short"}),a=cn(t.yardage);return`
    <article class="upcoming-card" data-motion="delay-${e%4+1}">
      <div class="upcoming-card-date">${i||"Date TBD"}</div>
      <h3 class="upcoming-card-course">${o(r)}</h3>
      <div class="upcoming-card-meta">
        ${n?`<span class="upcoming-card-location">${o(n)}</span>`:""}
        ${a?`<span class="upcoming-card-yardage">${o(a)}</span>`:""}
      </div>
    </article>
  `}function cn(t){if(t==null)return"";const e=String(t).trim();return e?/yard|yd/i.test(e)?e:`${e} yds`:""}function dn(t){return!t||typeof t.label!="string"?!1:/club\s*yardage/i.test(t.label)}const un=["Woods","Irons","Wedges","Putter","Other"];function fn(t){const e=(t||"").toLowerCase();return/putter/.test(e)?"Putter":/wedge/.test(e)?"Wedges":/iron/.test(e)?"Irons":/driver|wood|hybrid|\b\d+\s*w\b|\b\dw\b/.test(e)?"Woods":"Other"}function gn(t){if(t==null)return"";const e=String(t).trim();return e?/yard|yd/i.test(e)?e:`${e} yds`:""}function mn(t){const e=new Map;if(t.forEach(i=>{if(!i||!i.club)return;const a=fn(i.club);e.has(a)||e.set(a,[]),e.get(a).push(i)}),!e.size)return"";const r=un.filter(i=>e.has(i));Array.from(e.keys()).forEach(i=>{r.includes(i)||r.push(i)});const n=r.length>1;return`
    <div class="club-yardage-groups">
      ${r.map(i=>{const a=e.get(i)||[];return`
            <div class="club-yardage-group">
              ${n?`<h5 class="club-yardage-group-title">${o(i)}</h5>`:""}
              <ul class="club-yardage-list">
                ${a.map(s=>`
                      <li>
                        <span class="club-yardage-name">${o((s==null?void 0:s.club)||"")}</span>
                        <span class="club-yardage-value">${o(gn(s==null?void 0:s.yardage))}</span>
                      </li>
                    `).join("")}
              </ul>
            </div>
          `}).join("")}
    </div>
  `}function hn(t){return!t||typeof t!="string"?[]:t.split(/[,\n;]/).map(e=>e.trim()).filter(Boolean).map(e=>{const r=e.indexOf(":");if(r>-1)return{club:e.slice(0,r).trim(),yardage:e.slice(r+1).trim()};const n=e.match(/^(.*?)\s+(\d[\d,]*)(\s*(?:yds?|yards?)?)\s*$/i);return n?{club:n[1].trim(),yardage:`${n[2]}${n[3]?n[3].trim():""}`}:{club:e,yardage:""}}).filter(e=>e.club)}function yn(t){const e=k(x.academicsHeading),r=k(x.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Academics")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Academics section coming soon.")),r){if(!t){r.innerHTML=H("Academic details coming soon.");return}const n=t.transcriptLabel||"Transcript",i=t.transcriptUrl?`<a class="btn subtle" href="${v(t.transcriptUrl)}" target="_blank" rel="noopener">${o(n)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${o(n)}</span>`;r.innerHTML=`
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
        ${kt(t.interestsBody)}
      </article>
    `}}function pn(){const t=I.meta,e=I.items||[],r=k(x.highlightsHeading),n=k(x.highlightsTimeline),i=k(x.highlightsActions);if(r&&(r.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Highlights coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||5,s=e.slice(0,a);if(!s.length){n.innerHTML=H("Highlight events coming soon."),i&&(i.innerHTML="");return}n.innerHTML=s.map((l,f)=>Tn(l,f)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),wt(n),i&&(i.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function bn(){const t=tt.meta,e=tt.items||[],r=k(x.videosHeading),n=k(x.videoGrid),i=k(x.videosActions);if(r&&(r.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Videos coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||3,s=e.slice(0,a);if(!s.length){n.innerHTML=H("Video highlights coming soon."),i&&(i.innerHTML="");return}n.innerHTML=s.map((l,f)=>Fn(l,f)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),xt(),wt(n),i&&(i.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function $n(){const t=ut.meta,e=ut.items||[],r=k(x.galleryHeading),n=k(x.galleryGrid),i=k(x.galleryActions);if(r){const l=(t==null?void 0:t.heading)||"Photo Gallery",f=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";r.innerHTML=`
      <h2>${o(l)}</h2>
      ${`<p>${o(f)}</p>`}
    `}if(!n)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),s=e.slice(0,a);if(!s.length){n.innerHTML=H("Gallery photos coming soon."),i&&(i.innerHTML="");return}if(n.innerHTML=s.map((l,f)=>vn(l,f)).join(""),n.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),re(n),wt(n),i){const l="gallery.html",f=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";i.innerHTML=`<a class="btn ghost" href="${v(l)}">${o(f)}</a>`}}function vn(t,e=0){var F,D,V,A,nt;const r=((F=t==null?void 0:t.image)==null?void 0:F.url)||gt,n=((D=t==null?void 0:t.image)==null?void 0:D.alt)||(t==null?void 0:t.title)||"Gallery highlight",i=te(t,{variant:"card"}),a=or(t==null?void 0:t.shotDate),s=a?ee(a):"",l=(V=t==null?void 0:t.image)!=null&&V.url?{src:r,alt:n,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,f=l?`data-photo-src="${v(l.src)}" data-photo-alt="${v(l.alt)}" data-photo-title="${v(l.title)}"`:"",c=[];t!=null&&t.location&&c.push(t.location);const u=c.map(Lt=>`<span>${o(Lt)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),y=u?`<div class="gallery-card-meta">${u}</div>`:"",g=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",p=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",w=p?`<div class="gallery-card-footer">${p}</div>`:"",T=l?`data-photo-preview="true" ${f}`:"",C=U(((A=t==null?void 0:t.image)==null?void 0:A.focalPoint)||((nt=t==null?void 0:t.image)==null?void 0:nt.hotspot)),z=C?` style="object-position: ${v(C)};"`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${T?` ${T}`:""}>
        ${s}
        <img src="${v(r)}" alt="${o(n)}" loading="lazy"${z} />
      </div>
      <div class="gallery-card-body">
        ${y}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${i?`<div class="card-chip-slot">${i}</div>`:""}
        ${g}
        ${$t(t==null?void 0:t.tags)}
        ${w}
      </div>
    </article>
  `}function $t(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(r=>typeof r=="string"?r.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(r=>`<span class="gallery-tag">${o(r)}</span>`).join("")}
    </div>
  `:""}function wn(t){const e=k(x.dualHeading),r=k(x.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Dual-sport content coming soon.")),r){if(!t||!Array.isArray(t.cards)||!t.cards.length){r.innerHTML=H("Dual-sport cards coming soon.");return}r.innerHTML=t.cards.map((n,i)=>{var f,c,u;const a=U(((f=n==null?void 0:n.image)==null?void 0:f.focalPoint)||((c=n==null?void 0:n.image)==null?void 0:c.hotspot)),s=a?` style="object-position: ${v(a)};"`:"",l=(u=n==null?void 0:n.image)!=null&&u.url?`
              <div class="dual-card-media">
                <img
                  src="${v(n.image.url)}"
                  alt="${o(n.image.alt||n.title||"Dual-sport card image")}"
                  loading="lazy"${s}
                />
              </div>
            `:"";return`
          <article class="dual-card" data-motion="delay-${i+1}">
            ${l}
            <h3>${o(n.title||"")}</h3>
            ${n.body?`<p>${o(n.body)}</p>`:""}
            ${Array.isArray(n.bulletPoints)&&n.bulletPoints.length?`<ul>${n.bulletPoints.map(y=>`<li>${o(y||"")}</li>`).join("")}</ul>`:""}
          </article>
        `}).join("")}}function xn(t){const e=k(x.contactHeading),r=k(x.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Contact section coming soon.")),!!r){if(!t||!Array.isArray(t.cards)||!t.cards.length){r.innerHTML=H("Contact cards coming soon.");return}r.innerHTML=t.cards.map((n,i)=>`
        <article class="contact-card" data-motion="delay-${i+1}">
          <h3>${o(n.title||"")}</h3>
          <ul>
            ${(n.entries||[]).map(a=>`<li>${kn(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function kn(t){var i;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",r=rr(t.value),n=(i=t.link)!=null&&i.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&r.length<=1?`${e}<a href="${v(t.link)}"${n}>${o(t.value||t.link)}</a>`:r.length?`${e}${r.map((a,s)=>{const l=s===0&&t.link?t.link:a.link;if(l){const c=l.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${v(l)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function Tn(t,e){const r=ar(t),n=t.summary?`<p>${o(t.summary)}</p>`:"",i=Array.isArray(t.days)?t.days:[],a=Kt(i,{variant:"compact"}),s=`home-highlight-${e}`,l=(t==null?void 0:t._id)||(t==null?void 0:t.title)||s,c=`<div class="highlight-row-actions">${`
    <button class="highlight-toggle" type="button" data-highlight-modal="${v(l)}">
      View Details
    </button>
  `}</div>`;return`
    <article class="timeline-card" data-motion="delay-${e+1}">
      <header>
        <div class="highlight-row">
          <h3>${o(t.title||"")}</h3>
          ${c}
        </div>
        ${r?`<span class="timeline-date">${r}</span>`:""}
      </header>
      ${a}
      ${n}
    </article>
  `}function Kt(t=[],{variant:e="default",showLabels:r}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,i=typeof r=="boolean"?r:n>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",n===1?"day-stats--single":"",`day-stats--cols-${Math.min(n,3)}`].filter(Boolean).join(" ")}">
      ${t.map((s,l)=>Sn(s,l,{showLabels:i,total:n})).join("")}
    </div>
  `}const Pt=120,Ln=57;function Sn(t,e,{showLabels:r,total:n}){if(!t)return"";const i=n===1,a=!i&&r?ne(t,e,n):null,s=An(t);return s?`
    <div class="day-stat${i?" day-stat--single":""}">
      ${a?`<span class="day-stat-label">${o(a)}</span>`:""}
      ${s}
    </div>
  `:""}function An(t){const e=Vn(t);return e.length?`
    <div class="day-metrics">
      ${Mn(e)}
    </div>
  `:""}function Mn(t){return`
    <div class="day-metric-list">
      ${t.map(e=>{const r=e.secondary?`<span class="day-metric-secondary">${o(e.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${e.key}">
              <span class="day-metric-value">${o(e.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${o(e.label)}
                  ${r}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function Hn(t=[]){if(!Array.isArray(t))return"";const e=t.map((r,n)=>{if(!(r!=null&&r.notes))return"";const i=ne(r,n,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(i)}</strong>
          <p>${o(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function wt(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation();const n=e.getAttribute("data-highlight-modal");In(n)}))})}let X=null;function En(){if(X)return X;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&Ct()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Ct()}),document.body.appendChild(t),X=t,t}function In(t){const e=En(),r=e.querySelector("[data-highlight-overlay-body]");if(!r)return;const n=Zt(t);if(!n)return;const i=On(n),a=_n(n);r.innerHTML=Pn(n,i,a),xt(r),re(r),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function Ct(){if(!X)return;const t=X.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),X.classList.remove("is-open"),X.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Zt(t){const e=[];if(Array.isArray(I.items)&&e.push(I.items),Array.isArray(I.allItems)&&e.push(I.allItems),!t)return e[0]&&e[0][0]||e[1]&&e[1][0]||null;for(const r of e){const n=r.find(a=>((a==null?void 0:a._id)||"")===t);if(n)return n;const i=r.find(a=>(a==null?void 0:a.title)===t);if(i)return i}return null}function Pn(t,e,r){const i=[Rn(t),t.location?o(t.location):null].filter(Boolean),a=i.length?`<div class="highlight-overlay-meta">
        ${i.map(f=>`<span>${f}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=Kt(t.days||[],{variant:"list"}),l=Hn(t.days||[]);return`
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
        ${Cn(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Yn(r)}
      </section>
    </div>
  `}function Cn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(Dn).join("")}
    </div>
  `}function Dn(t){const e=ae(t),r=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:Ft),n=t.thumbnailAlt||t.title||"Video highlight",i=t.title||"Video highlight",s=!!e?"":' disabled aria-disabled="true"',l=vt?vt(t):"",f=U(t.thumbnailFocalPoint||t.thumbnailHotspot),c=f?` style="object-position: ${v(f)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${o(e)}" data-video-title="${o(i)}">
        <img src="${v(r)}" alt="${o(n)}" loading="lazy"${c} />
        <button class="play-button" type="button"${s} aria-label="Play ${o(i)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${o(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${o(t.description)}</p>`:""}
        ${l}
      </div>
    </article>
  `}function Yn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(Bn).join("")}
    </div>
  `}function Bn(t){var f,c,u,y,g;const e=((f=t==null?void 0:t.image)==null?void 0:f.url)||Ft,r=((c=t==null?void 0:t.image)==null?void 0:c.alt)||(t==null?void 0:t.title)||"Gallery photo",n=(u=t==null?void 0:t.image)!=null&&u.url?{src:e,alt:r,title:(t==null?void 0:t.title)||"Gallery photo"}:null,i=n?`data-photo-preview="true" data-photo-src="${v(n.src)}" data-photo-alt="${v(n.alt)}" data-photo-title="${v(n.title)}"`:"",a=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",s=U(((y=t==null?void 0:t.image)==null?void 0:y.focalPoint)||((g=t==null?void 0:t.image)==null?void 0:g.hotspot)),l=s?` style="object-position: ${v(s)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${i?` ${i}`:""}>
        <img src="${v(e)}" alt="${o(r)}" loading="lazy"${l} />
      </div>
      <div class="gallery-card-body">
        <h4>${o((t==null?void 0:t.title)||"Gallery photo")}</h4>
        ${t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:""}
        ${$t?$t(t==null?void 0:t.tags):""}
        ${a?`<div class="gallery-card-footer">${a}</div>`:""}
      </div>
    </article>
  `}function On(t){return!t||!Array.isArray(I.videos)?[]:I.videos.filter(e=>Qt(e,t))}function _n(t){return!t||!Array.isArray(I.photos)?[]:I.photos.filter(e=>Qt(e,t))}function Qt(t,e){const r=Jt(t);return r?!!(r.id&&(e!=null&&e._id)&&r.id===e._id||r.title&&(e!=null&&e.title)&&r.title===e.title):!1}function Jt(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function qn(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function vt(t){const e=qn(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(r=>`<span class="gallery-tag">${o(r)}</span>`).join("")}
    </div>
  `:""}function jn(t){const e=Jt(t);if(!e||!e.title)return null;const r=e.id||e.title,n=r?Zt(r):null,i=n?n._id||n.title:null;return{label:(n==null?void 0:n.title)||e.title,targetId:i}}function te(t,{variant:e="inline"}={}){const r=jn(t);if(!(r!=null&&r.label))return"";const n=["tournament-chip"];e==="card"&&n.push("tournament-chip--on-card"),e==="inline"&&n.push("tournament-chip--inline");const i=o(r.label),a=v(`View ${r.label} tournament details`),s=r.targetId?` data-highlight-modal="${v(r.targetId)}"`:"",l=r.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(r.targetId)}`:"tournament-highlights.html",f="a";return`
    <${f} class="${n.join(" ")}" href="${v(l)}"${s}${r.targetId?` aria-label="${a}"`:""}>
      <span class="tournament-chip-name">${i}</span>
    </${f}>
  `}function Nn(t){if(!t)return null;const e=W(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function ee(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function Rn(t){return t?Tt(t.eventDate,t.endDate,{month:"long"}):""}function Vn(t){if(!t)return[];const e=[],r=ft(t.score),n=ft(t.yardage);e.push(mt({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:Gn(r)})),e.push(mt({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:Un(n,Xn(t,n))}));const i=zn(t);return e.push(mt({key:"rank",label:"Rank",display:i.display,secondary:i.secondary,progress:i.progress})),e.filter(Boolean)}function mt({key:t,label:e,display:r,secondary:n,progress:i}){const a=r!=null&&r!==""?String(r):"—",s=n?String(n):"",l=typeof i=="number"&&!Number.isNaN(i)?i:0;return{key:t,label:e,display:a,secondary:s,progress:Math.max(0,l)}}function ne(t,e,r){return t.label?t.label:r>1?`Day ${e+1}`:null}function ft(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function Xn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function Gn(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=Pt-Ln;return(Pt-t)/e}function Un(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function Wn(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const r=(e-t)/(e-1);return Math.max(0,Math.min(r,1))}function zn(t){const e=ft(t==null?void 0:t.rankingPosition),r=ft(t==null?void 0:t.rankingOutOf),n=Wn(e,r);return typeof e=="number"?{display:String(e),secondary:typeof r=="number"?`of ${r}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function Fn(t,e){const r=ae(t),n=t.thumbnailUrl||(r?`https://img.youtube.com/vi/${r}/hqdefault.jpg`:gt),i=t.thumbnailAlt||t.title||"Video highlight",a=t.title||"Video highlight",l=!!r?"":' disabled aria-disabled="true"',f=te(t,{variant:"card"}),c=Nn(t.eventDate),u=c?ee(c):"",y=vt(t),g=U(t.thumbnailFocalPoint||t.thumbnailHotspot),p=g?` style="object-position: ${v(g)};"`:"";return`
    <article class="video-gallery-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(r)}" data-video-title="${o(a)}">
        ${u}
        <img src="${v(n)}" alt="${o(i)}" loading="lazy"${p} />
        <button class="play-button" type="button"${l} aria-label="Play ${o(a)}">
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
  `}function xt(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(r=>{if(r.dataset.playerReady==="true")return;const n=r.querySelector(".play-button"),i=r.dataset.videoId,a=r.dataset.videoTitle||"Samuel Masco golf video highlight";!n||!i||(n.addEventListener("click",()=>{Zn(i,a)}),r.dataset.playerReady="true")})}let G=null;function Kn(){if(G)return G;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&Dt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Dt()}),document.body.appendChild(t),G=t,t}function Zn(t,e){const r=Kn(),n=r.querySelector(".video-overlay-frame");if(!n)return;n.innerHTML="";const i=document.createElement("iframe");i.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),i.setAttribute("title",e),i.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),i.setAttribute("allowfullscreen",""),i.loading="lazy",n.appendChild(i),r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function Dt(){if(!G)return;const t=G.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),G.classList.remove("is-open"),G.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let R=null;function re(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(r=>{r.dataset.photoPreviewReady!=="true"&&(r.addEventListener("click",n=>{n.target.closest(".tournament-chip")||Jn(r.getAttribute("data-photo-src"),r.getAttribute("data-photo-alt"),r.getAttribute("data-photo-title"))}),r.dataset.photoPreviewReady="true")})}function Qn(){if(R)return R;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&Yt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Yt()}),document.body.appendChild(t),R=t,t}function Jn(t,e,r){if(!t)return;const n=Qn(),i=n.querySelector("img"),a=n.querySelector("figcaption");!i||!a||(i.src=t,i.alt=e||r||"Gallery photo",a.textContent=r||e||"",n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function Yt(){if(!R)return;const t=R.querySelector("img"),e=R.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),R.classList.remove("is-open"),R.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function kt(t){return!Array.isArray(t)||!t.length?"":Ze(t)}function k(t){return t?document.querySelector(t):null}function H(t){return`<p class="placeholder-text">${o(t)}</p>`}function ht(t){document.body.dataset.contentLoading=String(t)}function tr(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function Bt(t,e,r,n){const i=(t==null?void 0:t.label)||r,a=(t==null?void 0:t.href)||n;if(!i||!a)return"";const l=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${v(a)}"${l}>${o(i)}</a>`}function er(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const r=e.getAttribute("href")||"";ie(r)&&t.preventDefault()})}function ie(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function Tt(t,e,{month:r="short"}={}){if(!t)return"";const n=W(t);if(!n)return o(t);if(!e)return n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const i=W(e);if(!i)return`${n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=n.getFullYear()===i.getFullYear(),s=a&&n.getMonth()===i.getMonth();if(a&&s)return`${n.toLocaleDateString("en-US",{month:r})} ${n.getDate()}–${i.getDate()}, ${n.getFullYear()}`;if(a){const c=n.toLocaleDateString("en-US",{month:r,day:"numeric"}),u=i.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${c} – ${u}, ${n.getFullYear()}`}const l=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),f=i.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${l} – ${f}`}function ae(t){return t?Ot(t.youtubeId)||Ot(t.youtubeUrl):""}function Ot(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(ct.test(e))return e;let r;try{r=new URL(e)}catch{try{r=new URL(`https://${e}`)}catch{return""}}const n=r.hostname.replace(/^www\./,"").toLowerCase();if(n==="youtu.be"){const i=r.pathname.split("/").filter(Boolean)[0];return i&&ct.test(i)?i:""}if(n==="youtube.com"||n.endsWith(".youtube.com")){const i=r.searchParams.get("v");if(i&&ct.test(i))return i;const a=r.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const s=a[1];return s&&ct.test(s)?s:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function v(t){return o(t)}function U(t){if(!t||typeof t.x!="number"||typeof t.y!="number")return"";const e=i=>Math.max(0,Math.min(1,i)),r=Math.round(e(t.x)*1e3)/10,n=Math.round(e(t.y)*1e3)/10;return`${r}% ${n}%`}function nr(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(r=>r.charAt(0).toUpperCase()).join(""):""}function rr(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(i=>i.trim()).filter(Boolean).map(i=>({text:i,link:ir(i)})):[]}function ir(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function ar(t){return t?Tt(t.eventDate,t.endDate,{month:"short"}):""}function or(t){if(!t)return null;const e=W(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function yt(t,e="eventDate"){return Array.isArray(t)?[...t].sort((r,n)=>_t(n,e)-_t(r,e)):[]}function _t(t,e){if(!t)return 0;const r=t[e],n=W(r);if(n)return n.getTime();const i=W(t._createdAt);return i?i.getTime():0}function pt(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function sr(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(r=>r.classList.add("is-visible"));return}const e=new IntersectionObserver(r=>{r.forEach(n=>{n.isIntersecting&&(n.target.classList.add("is-visible"),e.unobserve(n.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(r=>e.observe(r))}function lr(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const r=18,n={x:Math.min(window.innerWidth-r-24,window.innerWidth*.78),y:Math.min(window.innerHeight-r-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let i=performance.now(),a=!1,s=!0,l=null,f=!1,c=!1,u=null,y=null,g=0,p=!1,w=!1,T=null;const C=document.querySelector(".site-header"),z=document.querySelector(".hero"),F=document.querySelector("[data-golf-hole]"),D=document.querySelector("[data-golf-scoreboard]"),V=D?D.querySelector("[data-golf-score-value]"):null,A={x:0,y:0,active:!1},nt=r+16,oe=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(d=>Array.from(document.querySelectorAll(d))).filter(d=>d!==null&&d.isConnected),rt=document.querySelector(".hero-scroll"),se=rt?rt.querySelector("span"):null,St={x:.5,y:-32},At={x:0,y:10},le=-80;function K(){e.style.transform=`translate3d(${n.x-r}px, ${n.y-r}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${n.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${n.textureOffsetY}px`)}function ce(){var Y;const d=document.querySelector(".hero-copy h1");if(!d)return null;const m="masco",b=(d.textContent||"").toLowerCase().lastIndexOf(m);if(b===-1)return null;const S=b+m.length-1,E=document.createTreeWalker(d,NodeFilter.SHOW_TEXT);let M=0,L=E.nextNode();for(;L;){const _=L.textContent||"",q=_.length;if(S<M+q){const B=S-M;if(B<0||B>=q)return null;const j=_.charAt(B);if(!j||!j.trim())return null;const P=document.createRange();P.setStart(L,B),P.setEnd(L,Math.min(B+1,q));const O=P.getBoundingClientRect();return(Y=P.detach)==null||Y.call(P),!O||!O.width&&!O.height?null:{left:O.left+window.scrollX,right:O.right+window.scrollX,top:O.top+window.scrollY,bottom:O.bottom+window.scrollY,width:O.width,height:O.height}}M+=q,L=E.nextNode()}return null}function it(){f||(l={x:n.x,y:n.y},f=!0)}function de(){return l||{x:n.x,y:n.y}}function ue(){g=0,V&&(V.textContent=g)}function fe(){w||(g+=1,V&&(V.textContent=g),w=!0,clearTimeout(T),T=window.setTimeout(()=>{w=!1},500))}function Z(){w=!1,clearTimeout(T)}function ge(){D&&(D.classList.add("is-visible"),D.setAttribute("aria-hidden","false"),clearTimeout(y),y=window.setTimeout(()=>me(),3200))}function me(){D&&(D.classList.remove("is-visible"),D.setAttribute("aria-hidden","true"),ue())}function he(){if(!F)return null;const d=F.getBoundingClientRect();if(!d.width||!d.height)return null;const m=window.scrollX,h=window.scrollY,$=r*.5,b=r*.2;return{centerX:d.left+m+d.width/2,centerY:d.top+h+d.height*.5,radiusX:d.width/2+$,radiusY:d.height/2+b}}function ye(d){if(!d)return!1;const m=n.x-d.centerX,h=n.y-d.centerY,$=m/d.radiusX,b=h/d.radiusY;return $*$+b*b<=1}function at(d){const m=d.top+r+le,h=r+4;return Math.max(m,h)}function pe(){if(!z)return!0;const d=window.getComputedStyle(z),m=parseFloat(d.getPropertyValue("column-gap")||d.getPropertyValue("gap"))||0,h=z.clientWidth;if(!h)return!1;const b=280*3+m*2;return h>=b-.5}function be(d={}){const m=ce();if(!m)return!1;const h=st(),$=m.left+m.width/3+St.x,b=m.top+m.height/30+St.y,S=h.left+r+12,E=h.right-r-12,M=at(h),L=h.bottom-r-12;return n.x=N($,S,E),n.y=N(b,M,L),n.vx=0,n.vy=0,K(),d.recordHome&&it(),!0}function $e(d={}){if(!rt)return!1;const m=jt(se||rt),h=st(),$=m.left+m.width/2+At.x,b=m.bottom+r+At.y,S=h.left+r+12,E=h.right-r-12,M=at(h),L=h.bottom-r-12;return n.x=N($,S,E),n.y=N(b,M,L),n.vx=0,n.vy=0,K(),d.recordHome&&it(),!0}function ot(d={}){const{recordHome:m=!1}=d;be({recordHome:m})||$e({recordHome:m})||(K(),m&&it())}function Q(d={}){const{force:m=!1,skipReposition:h=!1}=d;if(c)return;const $=pe();if(!m&&$===s)return;const b=s;s=$,e.style.display=$?"":"none",$&&(!b||m)&&!h&&ot()}ot({recordHome:!0}),Q({force:!0}),window.addEventListener("load",()=>{ot(),Q({force:!0})},{once:!0}),requestAnimationFrame(()=>{ot(),Q({force:!0})});function ve(d,m){if(c||!A.active)return;const h=.42;n.vx+=d*h,n.vy+=m*h;const $=34,b=Math.hypot(n.vx,n.vy);if(b>$){const L=$/b;n.vx*=L,n.vy*=L}const S=n.x-A.x,E=n.y-A.y,M=Math.hypot(S,E);if(M<r){const L=r-M,Y=S/(M||1),_=E/(M||1);n.x+=Y*(L+.5),n.y+=_*(L+.5)}}function we(){const m=st(),h=m.left+r+8,$=m.right-r-8,b=at(m),S=m.bottom-r-8;n.x<h?(n.x=h,n.vx=Math.abs(n.vx)*.78):n.x>$&&(n.x=$,n.vx=-Math.abs(n.vx)*.78),n.y<b?(n.y=b,n.vy=Math.abs(n.vy)*.78):n.y>S&&(n.y=S,n.vy=-Math.abs(n.vy)*.78)}function xe(){for(const m of oe){if(!m.isConnected)continue;const h=m.getBoundingClientRect(),$=window.scrollX,b=window.scrollY,S={left:h.left+$,right:h.right+$,top:h.top+b,bottom:h.bottom+b};if(h.width===0||h.height===0||h.right<-40||h.left>window.innerWidth+40||h.bottom<-40||h.top>window.innerHeight+40)continue;const E=N(n.x,S.left,S.right),M=N(n.y,S.top,S.bottom),L=n.x-E,Y=n.y-M,_=L*L+Y*Y;if(_>=r*r||L===0&&Y===0)continue;const q=Math.sqrt(_)||1e-4,B=L/q,j=Y/q;n.x=E+B*(r+.5),n.y=M+j*(r+.5);const P=n.vx*B+n.vy*j;P>0||(n.vx-=(1+.72)*P*B,n.vy-=(1+.72)*P*j)}}function st(){return C?jt(C):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function ke(d){if(c)return;l||it(),c=!0,A.active=!1,p=!1,Z(),a=!1,n.vx=0,n.vy=0,e.classList.remove("is-moving"),e.classList.add("is-sinking"),ge();const m=d.centerX-r,h=d.centerY-r*.6,$=.6;clearTimeout(u),e.style.transition="transform 320ms ease-in, opacity 320ms ease-in, box-shadow 320ms ease-in",e.style.transform=`translate3d(${m}px, ${h}px, 0) scale(${$})`,e.style.opacity="0",e.style.boxShadow="0 10px 20px rgba(15, 29, 51, 0.2)",u=window.setTimeout(()=>{const b=de();n.x=b.x,n.y=b.y,n.vx=0,n.vy=0,e.style.transition="none",e.style.transform=`translate3d(${b.x-r}px, ${b.y-r}px, 0) scale(0.35)`,e.style.opacity="0",requestAnimationFrame(()=>{e.classList.remove("is-sinking"),e.classList.add("is-returning"),e.style.transition="transform 440ms cubic-bezier(0.18, 0.72, 0.22, 1.08), opacity 380ms ease-out, box-shadow 380ms ease-out",e.style.opacity="1",e.style.boxShadow="3px 4px 12px rgba(15, 29, 51, 0.25)",e.style.transform=`translate3d(${b.x-r}px, ${b.y-r}px, 0) scale(1)`}),u=window.setTimeout(()=>{e.classList.remove("is-returning","is-sinking"),e.style.transition="",e.style.opacity="",e.style.boxShadow="",K(),c=!1,Q({force:!0,skipReposition:!0})},520)},360)}function Mt(){if(requestAnimationFrame(Mt),c)return;const d=performance.now(),m=Math.min((d-i)/16.666,3);if(i=d,n.x+=n.vx*m,n.y+=n.vy*m,n.vx*=Math.pow(.985,m),n.vy*=Math.pow(.985,m),Math.abs(n.vx)<.02&&(n.vx=0),Math.abs(n.vy)<.02&&(n.vy=0),we(),xe(),a=Math.hypot(n.vx,n.vy)>.35,s){const h=he();if(h&&ye(h)){ke(h);return}}a&&(n.textureOffsetX=qt(n.textureOffsetX+n.vx*m*.32,12),n.textureOffsetY=qt(n.textureOffsetY+n.vy*m*.32,12)),K()}window.addEventListener("pointermove",d=>{if(d.pointerType&&d.pointerType!=="mouse"&&d.pointerType!=="pen")return;const m=A.x,h=A.y,$=A.active,b=d.clientX+window.scrollX,S=d.clientY+window.scrollY;A.x=b,A.y=S,A.active=!0;const E=$?b-m:0,M=$?S-h:0;if(!$)return;const L=n.x-A.x,Y=n.y-A.y,_=Math.hypot(L,Y),q=p;if(p=_<=nt,!p)return;const B=Math.hypot(n.vx,n.vy);ve(E,M);const j=Math.hypot(n.vx,n.vy),P=j-B;if(!q&&!w){const O=Math.hypot(E,M);(P>.35||j>1||O>1.2)&&fe()}},{passive:!0}),window.addEventListener("pointerleave",()=>{A.active=!1,p=!1,Z()}),window.addEventListener("pointerout",d=>{d.relatedTarget||(A.active=!1,p=!1,Z())}),window.addEventListener("blur",()=>{A.active=!1,p=!1,Z()}),window.addEventListener("scroll",()=>{A.active=!1,p=!1,Z()}),window.addEventListener("resize",()=>{if(!c){const d=st();n.x=N(n.x,d.left+r+8,d.right-r-8),n.y=N(n.y,at(d),d.bottom-r-8)}Q()}),requestAnimationFrame(Mt)}function N(t,e,r){return Math.min(Math.max(t,e),r)}function qt(t,e){const r=t%e;return r<0?r+e:r}function jt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
