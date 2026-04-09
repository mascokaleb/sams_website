import{f as Te,p as W}from"./sanityClient-Dc01ZrBL.js";function dt(t){return t._type==="span"&&"text"in t&&typeof t.text=="string"&&(typeof t.marks>"u"||Array.isArray(t.marks)&&t.marks.every(e=>typeof e=="string"))}function Nt(t){return typeof t._type=="string"&&t._type[0]!=="@"&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(e=>typeof e._key=="string"))&&"children"in t&&Array.isArray(t.children)&&t.children.every(e=>typeof e=="object"&&"_type"in e)}function Rt(t){return Nt(t)&&"listItem"in t&&typeof t.listItem=="string"&&(typeof t.level>"u"||typeof t.level=="number")}function Xt(t){return t._type==="@list"}function Vt(t){return t._type==="@span"}function Ut(t){return t._type==="@text"}const Ht=["strong","em","code","underline","strike-through"];function Le(t,e,i){if(!dt(t)||!t.marks)return[];if(!t.marks.length)return[];const n=t.marks.slice(),r={};return n.forEach(a=>{r[a]=1;for(let l=e+1;l<i.length;l++){const s=i[l];if(s&&dt(s)&&Array.isArray(s.marks)&&s.marks.indexOf(a)!==-1)r[a]++;else break}}),n.sort((a,l)=>Se(r,a,l))}function Se(t,e,i){const n=t[e],r=t[i];if(n!==r)return r-n;const a=Ht.indexOf(e),l=Ht.indexOf(i);return a!==l?a-l:e.localeCompare(i)}function Ae(t){var l;const{children:e}=t,i=t.markDefs??[];if(!e||!e.length)return[];const n=e.map(Le),r={_type:"@span",children:[],markType:"<unknown>"};let a=[r];for(let s=0;s<e.length;s++){const m=e[s];if(!m)continue;const c=n[s]||[];let f=1;if(a.length>1)for(f;f<a.length;f++){const y=((l=a[f])==null?void 0:l.markKey)||"",p=c.indexOf(y);if(p===-1)break;c.splice(p,1)}a=a.slice(0,f);let d=a[a.length-1];if(d){for(const y of c){const p=i==null?void 0:i.find(C=>C._key===y),w=p?p._type:y,T={_type:"@span",_key:m._key,children:[],markDef:p,markType:w,markKey:y};d.children.push(T),a.push(T),d=T}if(dt(m)){const y=m.text.split(`
`);for(let p=y.length;p-- >1;)y.splice(p,0,`
`);d.children=d.children.concat(y.map(p=>({_type:"@text",text:p})))}else d.children=d.children.concat(m)}}return r.children}function Me(t,e){const i=[];let n;for(let r=0;r<t.length;r++){const a=t[r];if(a){if(!Rt(a)){i.push(a),n=void 0;continue}if(!n){n=lt(a,r,e),i.push(n);continue}if(He(a,n)){n.children.push(a);continue}if((a.level||1)>n.level){const l=lt(a,r,e);{const s=n.children[n.children.length-1],m={...s,children:[...s.children,l]};n.children[n.children.length-1]=m}n=l;continue}if((a.level||1)<n.level){const l=i[i.length-1],s=l&&bt(l,a);if(s){n=s,n.children.push(a);continue}n=lt(a,r,e),i.push(n);continue}if(a.listItem!==n.listItem){const l=i[i.length-1],s=l&&bt(l,{level:a.level||1});if(s&&s.listItem===a.listItem){n=s,n.children.push(a);continue}else{n=lt(a,r,e),i.push(n);continue}}console.warn("Unknown state encountered for block",a),i.push(a)}}return i}function He(t,e){return(t.level||1)===e.level&&t.listItem===e.listItem}function lt(t,e,i){return{_type:"@list",_key:`${t._key||`${e}`}-parent`,mode:i,level:t.level||1,listItem:t.listItem,children:[t]}}function bt(t,e){const i=e.level||1,n=e.listItem||"normal",r=typeof e.listItem=="string";if(Xt(t)&&(t.level||1)===i&&r&&(t.listItem||"normal")===n)return t;if(!("children"in t))return;const a=t.children[t.children.length-1];return a&&!dt(a)?bt(a,e):void 0}function Gt(t){let e="";return t.children.forEach(i=>{Ut(i)?e+=i.text:Vt(i)&&(e+=Gt(i))}),e}const Ie=["http","https","mailto","tel"],Ee={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Wt(t){return Pe(t.replace(/[&<>"']/g,e=>`&${Ee[e]};`))}function Pe(t){return t.replace(/ {2,}/g,e=>`${"&nbsp;".repeat(e.length-1)} `)}function Ce(t){const e=(t||"").trim(),i=e.charAt(0);if(i==="#"||i==="/")return!0;const n=e.indexOf(":");if(n===-1)return!0;const r=e.slice(0,n).toLowerCase();if(Ie.indexOf(r)!==-1)return!0;const a=e.indexOf("?");if(a!==-1&&n>a)return!0;const l=e.indexOf("#");return l!==-1&&n>l}const De={number:({children:t})=>`<ol>${t}</ol>`,bullet:({children:t})=>`<ul>${t}</ul>`},Be=({children:t})=>`<li>${t}</li>`,Ye=({children:t,value:e})=>{const i=(e==null?void 0:e.href)||"";return Ce(i)?`<a href="${Wt(i)}">${t}</a>`:t},Oe={em:({children:t})=>`<em>${t}</em>`,strong:({children:t})=>`<strong>${t}</strong>`,code:({children:t})=>`<code>${t}</code>`,underline:({children:t})=>`<span style="text-decoration:underline">${t}</span>`,"strike-through":({children:t})=>`<del>${t}</del>`,link:Ye},et=(t,e)=>`Unknown ${t}, specify a component for it in the \`components.${e}\` option`,zt=t=>et(`block type "${t}"`,"types"),_e=t=>et(`mark type "${t}"`,"marks"),qe=t=>et(`block style "${t}"`,"block"),je=t=>et(`list style "${t}"`,"list"),Ne=t=>et(`list item style "${t}"`,"listItem");function Re(t){console.warn(t)}const Xe=({value:t,isInline:e})=>{const i=zt(t._type);return e?`<span style="display:none">${i}</span>`:`<div style="display:none">${i}</div>`},Ve=({markType:t,children:e})=>`<span class="unknown__pt__mark__${t}">${e}</span>`,Ue=({children:t})=>`<p>${t}</p>`,Ge=({children:t})=>`<ul>${t}</ul>`,We=({children:t})=>`<li>${t}</li>`,ze=()=>"<br/>",Fe={normal:({children:t})=>`<p>${t}</p>`,blockquote:({children:t})=>`<blockquote>${t}</blockquote>`,h1:({children:t})=>`<h1>${t}</h1>`,h2:({children:t})=>`<h2>${t}</h2>`,h3:({children:t})=>`<h3>${t}</h3>`,h4:({children:t})=>`<h4>${t}</h4>`,h5:({children:t})=>`<h5>${t}</h5>`,h6:({children:t})=>`<h6>${t}</h6>`},It={types:{},block:Fe,marks:Oe,list:De,listItem:Be,hardBreak:ze,escapeHTML:Wt,unknownType:Xe,unknownMark:Ve,unknownList:Ge,unknownListItem:We,unknownBlockStyle:Ue};function Ke(t,e){const{block:i,list:n,listItem:r,marks:a,types:l,...s}=e;return{...t,block:J(t,e,"block"),list:J(t,e,"list"),listItem:J(t,e,"listItem"),marks:J(t,e,"marks"),types:J(t,e,"types"),...s}}function J(t,e,i){const n=e[i],r=t[i];return typeof n=="function"||n&&typeof r=="function"?n:n?{...r,...n}:r}function Ze(t,e={}){const{components:i,onMissingComponent:n=Re}=e,r=n||Je,a=Array.isArray(t)?t:[t],l=Me(a,"html"),s=i?Ke(It,i):It,m=Qe(s,r);return l.map((c,f)=>m({node:c,index:f,isInline:!1,renderNode:m})).join("")}const Qe=(t,e)=>{function i(c){const{node:f,index:d,isInline:y}=c;return Xt(f)?r(f,d):Rt(f)?n(f,d):Vt(f)?a(f):Nt(f)?l(f,d,y):Ut(f)?s(f):m(f,d,y)}function n(c,f){const d=Et({node:c,index:f,isInline:!1,renderNode:i}),y=t.listItem,p=(typeof y=="function"?y:y[c.listItem])||t.unknownListItem;if(p===t.unknownListItem){const T=c.listItem||"bullet";e(Ne(T),{type:T,nodeType:"listItemStyle"})}let w=d.children;if(c.style&&c.style!=="normal"){const{listItem:T,...C}=c;w=i({node:C,index:f,isInline:!1})}return p({value:c,index:f,isInline:!1,renderNode:i,children:w})}function r(c,f){const d=c.children.map((w,T)=>i({node:w._key?w:{...w,_key:`li-${f}-${T}`},index:T,isInline:!1})),y=t.list,p=(typeof y=="function"?y:y[c.listItem])||t.unknownList;if(p===t.unknownList){const w=c.listItem||"bullet";e(je(w),{nodeType:"listStyle",type:w})}return p({value:c,index:f,isInline:!1,renderNode:i,children:d.join("")})}function a(c){const{markDef:f,markType:d,markKey:y}=c,p=t.marks[d]||t.unknownMark,w=c.children.map((T,C)=>i({node:T,index:C,isInline:!0}));return p===t.unknownMark&&e(_e(d),{nodeType:"mark",type:d}),p({text:Gt(c),value:f,markType:d,markKey:y,renderNode:i,children:w.join("")})}function l(c,f,d){const{_key:y,...p}=Et({node:c,index:f,isInline:d,renderNode:i}),w=p.node.style||"normal",T=(typeof t.block=="function"?t.block:t.block[w])||t.unknownBlockStyle;return T===t.unknownBlockStyle&&e(qe(w),{nodeType:"blockStyle",type:w}),T({...p,value:p.node,renderNode:i})}function s(c){if(c.text===`
`){const f=t.hardBreak;return f?f():`
`}return t.escapeHTML(c.text)}function m(c,f,d){const y=t.types[c._type];return y||e(zt(c._type),{nodeType:"block",type:c._type}),(y||t.unknownType)({value:c,isInline:d,index:f,renderNode:i})}return i};function Et(t){const{node:e,index:i,isInline:n,renderNode:r}=t,a=Ae(e).map((l,s)=>r({node:l,isInline:!0,index:s,renderNode:r}));return{_key:e._key||`block-${i}`,children:a.join(""),index:i,isInline:n,node:e}}function Je(){}const mt="images/samuel-placeholder.svg",Ft=mt,ct=/^[a-zA-Z0-9_-]{11}$/,x={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',heroMetrics:'[data-template="hero-metrics"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',upcomingHeading:'[data-template="upcoming-heading"]',upcomingGrid:'[data-template="upcoming-grid"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},E={meta:null,allItems:[],items:[],videos:[],photos:[]},tt={meta:null,items:[],totalCount:0},ut={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{tn(),Zn();const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await en(),window.location.hash&&setTimeout(()=>re(window.location.hash),100),ii(t),t||ri()});function tn(){const t=document.querySelector(".nav-toggle"),e=document.querySelector(".nav-links");!t||!e||(t.addEventListener("click",()=>{const i=t.getAttribute("aria-expanded")==="true"?"false":"true";t.setAttribute("aria-expanded",i),e.classList.toggle("is-open")}),e.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{t.setAttribute("aria-expanded","false"),e.classList.remove("is-open")})}))}async function en(){ht(!0);const t=await Te();if(!t)return Kn("Unable to load the latest content. Please try again shortly."),ht(!1),null;nn(t.site),rn(t.hero,t.site),an(t.about),on(t.resume),fn(t.academics);const e=yt(t.highlightEvents||[]);E.meta=t.highlightsSection,E.allItems=e,E.items=e.filter(pt),mn(),sn(t.upcomingTournamentsSection,t.upcomingTournaments||[]);const i=yt(t.videos||[],"eventDate");E.videos=i,tt.meta=t.videosSection,tt.items=i.filter(pt),tt.totalCount=i.length,gn();const n=yt(t.galleryPhotos||[],"shotDate");return E.photos=n,ut.meta=t.gallerySection,ut.items=n.filter(pt),hn(),pn(t.dualSport),bn(t.contact),ht(!1),xt(),t}function nn(t){var n;if(!t)return;if(t.siteTitle){document.title=t.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=t.siteTitle)}const e=document.querySelector('meta[name="description"]');e&&t.seoDescription&&e.setAttribute("content",t.seoDescription);const i=document.querySelector(".brand-mark");if(i)if((n=t.brandMarkImage)!=null&&n.url){const r=G(t.brandMarkImage.focalPoint||t.brandMarkImage.hotspot),a=r?` style="object-position: ${v(r)};"`:"";i.innerHTML=`<span class="brand-mark-image"><img src="${v(t.brandMarkImage.url)}" alt="${o(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy"${a} /></span>`,i.classList.add("has-image")}else{const r=t.brandMarkInitials||Qn(t.siteTitle)||i.textContent||"SM";i.textContent=r,i.classList.remove("has-image")}}function rn(t,e){var a,l,s,m;const i=k(x.heroCopy),n=k(x.heroPhoto),r=k(x.heroMetrics);if(!t){i&&(i.innerHTML=H("Hero content coming soon."));return}if(i){const c=t.tagline?`<p class="hero-tag">${o(t.tagline)}</p>`:"",f=t.subheadline?`<span>${o(t.subheadline)}</span>`:"",d=t.bio?`<p>${o(t.bio)}</p>`:"",y=[Yt(t.primaryCta,"primary","View Highlights","#highlights"),Yt(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join("");i.innerHTML=`
      ${c}
      <h1>
        ${o(t.headline||(e==null?void 0:e.siteTitle)||"")}
        ${f}
      </h1>
      ${d}
      <div class="hero-actions">
        ${y||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(n){const c=((a=t.headshot)==null?void 0:a.url)||mt,f=((l=t.headshot)==null?void 0:l.alt)||"Portrait of Samuel Masco",d=t.photoCaption||"Focused on the next shot.",y=G(((s=t.headshot)==null?void 0:s.focalPoint)||((m=t.headshot)==null?void 0:m.hotspot)),p=y?` style="object-position: ${v(y)};"`:"";n.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${c}" alt="${o(f)}" loading="lazy"${p} />
        <div class="hero-photo-glow" aria-hidden="true"></div>
      </div>
      <figcaption>${o(d)}</figcaption>
    `}r&&(Array.isArray(t.metrics)&&t.metrics.length?r.innerHTML=t.metrics.map(c=>`
            <div class="metric-card" data-motion>
              <span class="metric-label">${o(c.label||"")}</span>
              <span class="metric-value">${o(c.value||"")}</span>
            </div>
          `).join(""):r.innerHTML=H("Metrics coming soon."))}function an(t){const e=k(x.aboutHeading),i=k(x.aboutGrid);if(e&&(e.innerHTML=t?`
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
    `}}function on(t){const e=k(x.resumeHeading),i=k(x.resumePanels);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Golf Resume")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Golf resume coming soon.")),i){if(!t){i.innerHTML=H("Resume details coming soon.");return}const n=Array.isArray(t.performanceStats)?t.performanceStats:[],r=[],a=[];n.forEach(d=>{dn(d)?r.push(...un(d==null?void 0:d.value)):a.push(d)});const l=Array.isArray(t.clubYardages)?t.clubYardages:[],s=l.length?l:r,m=s.length>0,c=t.clubYardagesTitle||"Club Yardages",f=m?`
          <div class="performance-column performance-column--clubs">
            <h4 class="performance-column-title">${o(c)}</h4>
            <ul class="club-yardage-list">
              ${s.map(d=>`
                    <li>
                      <span class="club-yardage-name">${o((d==null?void 0:d.club)||"")}</span>
                      <span class="club-yardage-value">${o((d==null?void 0:d.yardage)||"")}</span>
                    </li>
                  `).join("")}
            </ul>
          </div>
        `:"";i.innerHTML=`
      <article class="panel performance-panel${m?" performance-panel--split":""}" data-motion="delay-1">
        <h3>${o(t.performanceTitle||"Performance Snapshot")}</h3>
        <div class="performance-content">
          <div class="performance-column performance-column--stats">
            <dl>
              ${a.map(d=>`
                    <div>
                      <dt>${o(d.label||"")}</dt>
                      <dd>${o(d.value||"")}</dd>
                    </div>
                  `).join("")}
            </dl>
          </div>
          ${f}
        </div>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${o(t.trainingTitle||"Training Routine")}</h3>
        ${kt(t.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${o(t.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(t.experienceList||[]).map(d=>`<li>${o(d||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function sn(t,e){const i=k(x.upcomingHeading),n=k(x.upcomingGrid);if(i&&(i.innerHTML=t?`
          <h2>${o(t.heading||"Upcoming Tournaments")}</h2>
          ${t.subheading?`<p>${o(t.subheading)}</p>`:""}
        `:`
          <h2>Upcoming Tournaments</h2>
          <p>Next events on Samuel's competitive schedule.</p>
        `),!n)return;const r=Array.isArray(e)?e:[];if(!r.length){n.innerHTML=H("Upcoming tournaments coming soon.");return}const a=Math.max(1,(t==null?void 0:t.maxItems)||r.length),l=r.slice(0,a);n.innerHTML=l.map((s,m)=>ln(s,m)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible"))}function ln(t,e=0){if(!t)return"";const i=t.course||"Course TBD",n=t.location||"",r=Tt(t.eventDate,t.endDate,{month:"short"}),a=cn(t.yardage);return`
    <article class="upcoming-card" data-motion="delay-${e%4+1}">
      <div class="upcoming-card-date">${r||"Date TBD"}</div>
      <h3 class="upcoming-card-course">${o(i)}</h3>
      <div class="upcoming-card-meta">
        ${n?`<span class="upcoming-card-location">${o(n)}</span>`:""}
        ${a?`<span class="upcoming-card-yardage">${o(a)}</span>`:""}
      </div>
    </article>
  `}function cn(t){if(t==null)return"";const e=String(t).trim();return e?/yard|yd/i.test(e)?e:`${e} yds`:""}function dn(t){return!t||typeof t.label!="string"?!1:/club\s*yardage/i.test(t.label)}function un(t){return!t||typeof t!="string"?[]:t.split(/[,\n;]/).map(e=>e.trim()).filter(Boolean).map(e=>{const i=e.indexOf(":");if(i>-1)return{club:e.slice(0,i).trim(),yardage:e.slice(i+1).trim()};const n=e.match(/^(.*?)\s+(\d[\d,]*)(\s*(?:yds?|yards?)?)\s*$/i);return n?{club:n[1].trim(),yardage:`${n[2]}${n[3]?n[3].trim():""}`}:{club:e,yardage:""}}).filter(e=>e.club)}function fn(t){const e=k(x.academicsHeading),i=k(x.academicsGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Academics")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Academics section coming soon.")),i){if(!t){i.innerHTML=H("Academic details coming soon.");return}const n=t.transcriptLabel||"Transcript",r=t.transcriptUrl?`<a class="btn subtle" href="${v(t.transcriptUrl)}" target="_blank" rel="noopener">${o(n)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${o(n)}</span>`;i.innerHTML=`
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
    `}}function mn(){const t=E.meta,e=E.items||[],i=k(x.highlightsHeading),n=k(x.highlightsTimeline),r=k(x.highlightsActions);if(i&&(i.innerHTML=t?`
          <h2>${o(t.heading||"Highlights")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Highlights coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||5,l=e.slice(0,a);if(!l.length){n.innerHTML=H("Highlight events coming soon."),r&&(r.innerHTML="");return}n.innerHTML=l.map((s,m)=>vn(s,m)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),wt(n),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function gn(){const t=tt.meta,e=tt.items||[],i=k(x.videosHeading),n=k(x.videoGrid),r=k(x.videosActions);if(i&&(i.innerHTML=t?`
          <h2>${o(t.heading||"Videos")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Videos coming soon.")),!n)return;const a=(t==null?void 0:t.maxItems)||3,l=e.slice(0,a);if(!l.length){n.innerHTML=H("Video highlights coming soon."),r&&(r.innerHTML="");return}n.innerHTML=l.map((s,m)=>Un(s,m)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),xt(),wt(n),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function hn(){const t=ut.meta,e=ut.items||[],i=k(x.galleryHeading),n=k(x.galleryGrid),r=k(x.galleryActions);if(i){const s=(t==null?void 0:t.heading)||"Photo Gallery",m=(t==null?void 0:t.subheading)||"Tournament action and behind-the-scenes moments.";i.innerHTML=`
      <h2>${o(s)}</h2>
      ${`<p>${o(m)}</p>`}
    `}if(!n)return;const a=Math.max(1,(t==null?void 0:t.maxItems)||6),l=e.slice(0,a);if(!l.length){n.innerHTML=H("Gallery photos coming soon."),r&&(r.innerHTML="");return}if(n.innerHTML=l.map((s,m)=>yn(s,m)).join(""),n.querySelectorAll("[data-motion]").forEach(s=>s.classList.add("is-visible")),ie(n),wt(n),r){const s="gallery.html",m=(t==null?void 0:t.ctaLabel)||"Explore the full gallery";r.innerHTML=`<a class="btn ghost" href="${v(s)}">${o(m)}</a>`}}function yn(t,e=0){var F,D,X,A,nt;const i=((F=t==null?void 0:t.image)==null?void 0:F.url)||mt,n=((D=t==null?void 0:t.image)==null?void 0:D.alt)||(t==null?void 0:t.title)||"Gallery highlight",r=te(t,{variant:"card"}),a=ni(t==null?void 0:t.shotDate),l=a?ee(a):"",s=(X=t==null?void 0:t.image)!=null&&X.url?{src:i,alt:n,title:(t==null?void 0:t.title)||"Gallery highlight"}:null,m=s?`data-photo-src="${v(s.src)}" data-photo-alt="${v(s.alt)}" data-photo-title="${v(s.title)}"`:"",c=[];t!=null&&t.location&&c.push(t.location);const f=c.map(Lt=>`<span>${o(Lt)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),d=f?`<div class="gallery-card-meta">${f}</div>`:"",y=t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:"",p=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",w=p?`<div class="gallery-card-footer">${p}</div>`:"",T=s?`data-photo-preview="true" ${m}`:"",C=G(((A=t==null?void 0:t.image)==null?void 0:A.focalPoint)||((nt=t==null?void 0:t.image)==null?void 0:nt.hotspot)),z=C?` style="object-position: ${v(C)};"`:"";return`
    <article class="gallery-card" data-motion="delay-${e%3+1}">
      <div class="gallery-card-media"${T?` ${T}`:""}>
        ${l}
        <img src="${v(i)}" alt="${o(n)}" loading="lazy"${z} />
      </div>
      <div class="gallery-card-body">
        ${d}
        <h3>${o((t==null?void 0:t.title)||"Gallery highlight")}</h3>
        ${r?`<div class="card-chip-slot">${r}</div>`:""}
        ${y}
        ${$t(t==null?void 0:t.tags)}
        ${w}
      </div>
    </article>
  `}function $t(t){if(!Array.isArray(t)||!t.length)return"";const e=t.map(i=>typeof i=="string"?i.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(i=>`<span class="gallery-tag">${o(i)}</span>`).join("")}
    </div>
  `:""}function pn(t){const e=k(x.dualHeading),i=k(x.dualGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Dual-Sport Athlete")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Dual-sport content coming soon.")),i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=H("Dual-sport cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>{var m,c,f;const a=G(((m=n==null?void 0:n.image)==null?void 0:m.focalPoint)||((c=n==null?void 0:n.image)==null?void 0:c.hotspot)),l=a?` style="object-position: ${v(a)};"`:"",s=(f=n==null?void 0:n.image)!=null&&f.url?`
              <div class="dual-card-media">
                <img
                  src="${v(n.image.url)}"
                  alt="${o(n.image.alt||n.title||"Dual-sport card image")}"
                  loading="lazy"${l}
                />
              </div>
            `:"";return`
          <article class="dual-card" data-motion="delay-${r+1}">
            ${s}
            <h3>${o(n.title||"")}</h3>
            ${n.body?`<p>${o(n.body)}</p>`:""}
            ${Array.isArray(n.bulletPoints)&&n.bulletPoints.length?`<ul>${n.bulletPoints.map(d=>`<li>${o(d||"")}</li>`).join("")}</ul>`:""}
          </article>
        `}).join("")}}function bn(t){const e=k(x.contactHeading),i=k(x.contactGrid);if(e&&(e.innerHTML=t?`
          <h2>${o(t.heading||"Let's Connect")}</h2>
          <p>${o(t.subheading||"")}</p>
        `:H("Contact section coming soon.")),!!i){if(!t||!Array.isArray(t.cards)||!t.cards.length){i.innerHTML=H("Contact cards coming soon.");return}i.innerHTML=t.cards.map((n,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${o(n.title||"")}</h3>
          <ul>
            ${(n.entries||[]).map(a=>`<li>${$n(a)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function $n(t){var r;if(!t)return"";const e=t.label?`<strong>${o(t.label)}:</strong> `:"",i=Jn(t.value),n=(r=t.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return t.link&&i.length<=1?`${e}<a href="${v(t.link)}"${n}>${o(t.value||t.link)}</a>`:i.length?`${e}${i.map((a,l)=>{const s=l===0&&t.link?t.link:a.link;if(s){const c=s.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${v(s)}"${c}>${o(a.text)}</a>`}return o(a.text)}).join(" · ")}`:`${e}${o(t.value||"")}`}function vn(t,e){const i=ei(t),n=t.summary?`<p>${o(t.summary)}</p>`:"",r=Array.isArray(t.days)?t.days:[],a=Kt(r,{variant:"compact"}),l=`home-highlight-${e}`,s=(t==null?void 0:t._id)||(t==null?void 0:t.title)||l,c=`<div class="highlight-row-actions">${`
    <button class="highlight-toggle" type="button" data-highlight-modal="${v(s)}">
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
  `}function Kt(t=[],{variant:e="default",showLabels:i}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,r=typeof i=="boolean"?i:n>1;return`
    <div class="${["day-stats",e==="compact"?"day-stats--compact":"",e==="list"?"day-stats--list":"",n===1?"day-stats--single":"",`day-stats--cols-${Math.min(n,3)}`].filter(Boolean).join(" ")}">
      ${t.map((l,s)=>xn(l,s,{showLabels:r,total:n})).join("")}
    </div>
  `}const Pt=120,wn=57;function xn(t,e,{showLabels:i,total:n}){if(!t)return"";const r=n===1,a=!r&&i?ne(t,e,n):null,l=kn(t);return l?`
    <div class="day-stat${r?" day-stat--single":""}">
      ${a?`<span class="day-stat-label">${o(a)}</span>`:""}
      ${l}
    </div>
  `:""}function kn(t){const e=qn(t);return e.length?`
    <div class="day-metrics">
      ${Tn(e)}
    </div>
  `:""}function Tn(t){return`
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
  `}function Ln(t=[]){if(!Array.isArray(t))return"";const e=t.map((i,n)=>{if(!(i!=null&&i.notes))return"";const r=ne(i,n,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${o(r)}</strong>
          <p>${o(i.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function wt(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const n=e.getAttribute("data-highlight-modal");An(n)}))})}let V=null;function Sn(){if(V)return V;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&Ct()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Ct()}),document.body.appendChild(t),V=t,t}function An(t){const e=Sn(),i=e.querySelector("[data-highlight-overlay-body]");if(!i)return;const n=Zt(t);if(!n)return;const r=Cn(n),a=Dn(n);i.innerHTML=Mn(n,r,a),xt(i),ie(i),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function Ct(){if(!V)return;const t=V.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),V.classList.remove("is-open"),V.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Zt(t){const e=[];if(Array.isArray(E.items)&&e.push(E.items),Array.isArray(E.allItems)&&e.push(E.allItems),!t)return e[0]&&e[0][0]||e[1]&&e[1][0]||null;for(const i of e){const n=i.find(a=>((a==null?void 0:a._id)||"")===t);if(n)return n;const r=i.find(a=>(a==null?void 0:a.title)===t);if(r)return r}return null}function Mn(t,e,i){const r=[_n(t),t.location?o(t.location):null].filter(Boolean),a=r.length?`<div class="highlight-overlay-meta">
        ${r.map(m=>`<span>${m}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",l=Kt(t.days||[],{variant:"list"}),s=Ln(t.days||[]);return`
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
        ${Hn(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${En(i)}
      </section>
    </div>
  `}function Hn(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(In).join("")}
    </div>
  `}function In(t){const e=ae(t),i=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:Ft),n=t.thumbnailAlt||t.title||"Video highlight",r=t.title||"Video highlight",l=!!e?"":' disabled aria-disabled="true"',s=vt?vt(t):"",m=G(t.thumbnailFocalPoint||t.thumbnailHotspot),c=m?` style="object-position: ${v(m)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${o(e)}" data-video-title="${o(r)}">
        <img src="${v(i)}" alt="${o(n)}" loading="lazy"${c} />
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
  `}function En(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(Pn).join("")}
    </div>
  `}function Pn(t){var m,c,f,d,y;const e=((m=t==null?void 0:t.image)==null?void 0:m.url)||Ft,i=((c=t==null?void 0:t.image)==null?void 0:c.alt)||(t==null?void 0:t.title)||"Gallery photo",n=(f=t==null?void 0:t.image)!=null&&f.url?{src:e,alt:i,title:(t==null?void 0:t.title)||"Gallery photo"}:null,r=n?`data-photo-preview="true" data-photo-src="${v(n.src)}" data-photo-alt="${v(n.alt)}" data-photo-title="${v(n.title)}"`:"",a=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${o(t.photographer)}</div>`:"",l=G(((d=t==null?void 0:t.image)==null?void 0:d.focalPoint)||((y=t==null?void 0:t.image)==null?void 0:y.hotspot)),s=l?` style="object-position: ${v(l)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${r?` ${r}`:""}>
        <img src="${v(e)}" alt="${o(i)}" loading="lazy"${s} />
      </div>
      <div class="gallery-card-body">
        <h4>${o((t==null?void 0:t.title)||"Gallery photo")}</h4>
        ${t!=null&&t.description?`<p class="gallery-card-description">${o(t.description)}</p>`:""}
        ${$t?$t(t==null?void 0:t.tags):""}
        ${a?`<div class="gallery-card-footer">${a}</div>`:""}
      </div>
    </article>
  `}function Cn(t){return!t||!Array.isArray(E.videos)?[]:E.videos.filter(e=>Qt(e,t))}function Dn(t){return!t||!Array.isArray(E.photos)?[]:E.photos.filter(e=>Qt(e,t))}function Qt(t,e){const i=Jt(t);return i?!!(i.id&&(e!=null&&e._id)&&i.id===e._id||i.title&&(e!=null&&e.title)&&i.title===e.title):!1}function Jt(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function Bn(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function vt(t){const e=Bn(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(i=>`<span class="gallery-tag">${o(i)}</span>`).join("")}
    </div>
  `:""}function Yn(t){const e=Jt(t);if(!e||!e.title)return null;const i=e.id||e.title,n=i?Zt(i):null,r=n?n._id||n.title:null;return{label:(n==null?void 0:n.title)||e.title,targetId:r}}function te(t,{variant:e="inline"}={}){const i=Yn(t);if(!(i!=null&&i.label))return"";const n=["tournament-chip"];e==="card"&&n.push("tournament-chip--on-card"),e==="inline"&&n.push("tournament-chip--inline");const r=o(i.label),a=v(`View ${i.label} tournament details`),l=i.targetId?` data-highlight-modal="${v(i.targetId)}"`:"",s=i.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(i.targetId)}`:"tournament-highlights.html",m="a";return`
    <${m} class="${n.join(" ")}" href="${v(s)}"${l}${i.targetId?` aria-label="${a}"`:""}>
      <span class="tournament-chip-name">${r}</span>
    </${m}>
  `}function On(t){if(!t)return null;const e=W(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function ee(t){return`
    <div class="video-date-overlay" aria-label="${t.month} ${t.day}, ${t.year}">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function _n(t){return t?Tt(t.eventDate,t.endDate,{month:"long"}):""}function qn(t){if(!t)return[];const e=[],i=ft(t.score),n=ft(t.yardage);e.push(gt({key:"score",label:"Score",display:typeof i=="number"?String(i):"—",progress:Nn(i)})),e.push(gt({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:Rn(n,jn(t,n))}));const r=Vn(t);return e.push(gt({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),e.filter(Boolean)}function gt({key:t,label:e,display:i,secondary:n,progress:r}){const a=i!=null&&i!==""?String(i):"—",l=n?String(n):"",s=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:t,label:e,display:a,secondary:l,progress:Math.max(0,s)}}function ne(t,e,i){return t.label?t.label:i>1?`Day ${e+1}`:null}function ft(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function jn(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function Nn(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=Pt-wn;return(Pt-t)/e}function Rn(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function Xn(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const i=(e-t)/(e-1);return Math.max(0,Math.min(i,1))}function Vn(t){const e=ft(t==null?void 0:t.rankingPosition),i=ft(t==null?void 0:t.rankingOutOf),n=Xn(e,i);return typeof e=="number"?{display:String(e),secondary:typeof i=="number"?`of ${i}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function Un(t,e){const i=ae(t),n=t.thumbnailUrl||(i?`https://img.youtube.com/vi/${i}/hqdefault.jpg`:mt),r=t.thumbnailAlt||t.title||"Video highlight",a=t.title||"Video highlight",s=!!i?"":' disabled aria-disabled="true"',m=te(t,{variant:"card"}),c=On(t.eventDate),f=c?ee(c):"",d=vt(t),y=G(t.thumbnailFocalPoint||t.thumbnailHotspot),p=y?` style="object-position: ${v(y)};"`:"";return`
    <article class="video-gallery-card" data-motion="delay-${e+1}">
      <div class="video-frame" data-video-id="${o(i)}" data-video-title="${o(a)}">
        ${f}
        <img src="${v(n)}" alt="${o(r)}" loading="lazy"${p} />
        <button class="play-button" type="button"${s} aria-label="Play ${o(a)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h3>${o(t.title||"")}</h3>
        ${m?`<div class="card-chip-slot">${m}</div>`:""}
        <p>${o(t.description||"")}</p>
        ${d}
      </div>
    </article>
  `}function xt(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(i=>{if(i.dataset.playerReady==="true")return;const n=i.querySelector(".play-button"),r=i.dataset.videoId,a=i.dataset.videoTitle||"Samuel Masco golf video highlight";!n||!r||(n.addEventListener("click",()=>{Wn(r,a)}),i.dataset.playerReady="true")})}let U=null;function Gn(){if(U)return U;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&Dt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Dt()}),document.body.appendChild(t),U=t,t}function Wn(t,e){const i=Gn(),n=i.querySelector(".video-overlay-frame");if(!n)return;n.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${t}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",e),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",n.appendChild(r),i.classList.add("is-open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function Dt(){if(!U)return;const t=U.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),U.classList.remove("is-open"),U.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let R=null;function ie(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(i=>{i.dataset.photoPreviewReady!=="true"&&(i.addEventListener("click",n=>{n.target.closest(".tournament-chip")||Fn(i.getAttribute("data-photo-src"),i.getAttribute("data-photo-alt"),i.getAttribute("data-photo-title"))}),i.dataset.photoPreviewReady="true")})}function zn(){if(R)return R;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&Bt()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&Bt()}),document.body.appendChild(t),R=t,t}function Fn(t,e,i){if(!t)return;const n=zn(),r=n.querySelector("img"),a=n.querySelector("figcaption");!r||!a||(r.src=t,r.alt=e||i||"Gallery photo",a.textContent=i||e||"",n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function Bt(){if(!R)return;const t=R.querySelector("img"),e=R.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),R.classList.remove("is-open"),R.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function kt(t){return!Array.isArray(t)||!t.length?"":Ze(t)}function k(t){return t?document.querySelector(t):null}function H(t){return`<p class="placeholder-text">${o(t)}</p>`}function ht(t){document.body.dataset.contentLoading=String(t)}function Kn(t){const e=document.querySelector("main");e&&e.insertAdjacentHTML("afterbegin",`<div class="notification error">${o(t)}</div>`)}function Yt(t,e,i,n){const r=(t==null?void 0:t.label)||i,a=(t==null?void 0:t.href)||n;if(!r||!a)return"";const s=a.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${e}" href="${v(a)}"${s}>${o(r)}</a>`}function Zn(){document.addEventListener("click",t=>{const e=t.target.closest('a[data-scroll="true"]');if(!e)return;const i=e.getAttribute("href")||"";re(i)&&t.preventDefault()})}function re(t){if(!t||!t.startsWith("#")||t.length===1)return!1;const e=document.querySelector(t);return e?(e.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function Tt(t,e,{month:i="short"}={}){if(!t)return"";const n=W(t);if(!n)return o(t);if(!e)return n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});const r=W(e);if(!r)return`${n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"})} – ${o(e)}`;const a=n.getFullYear()===r.getFullYear(),l=a&&n.getMonth()===r.getMonth();if(a&&l)return`${n.toLocaleDateString("en-US",{month:i})} ${n.getDate()}–${r.getDate()}, ${n.getFullYear()}`;if(a){const c=n.toLocaleDateString("en-US",{month:i,day:"numeric"}),f=r.toLocaleDateString("en-US",{month:i,day:"numeric"});return`${c} – ${f}, ${n.getFullYear()}`}const s=n.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"}),m=r.toLocaleDateString("en-US",{month:i,day:"numeric",year:"numeric"});return`${s} – ${m}`}function ae(t){return t?Ot(t.youtubeId)||Ot(t.youtubeUrl):""}function Ot(t){if(!t)return"";const e=String(t).trim();if(!e)return"";if(ct.test(e))return e;let i;try{i=new URL(e)}catch{try{i=new URL(`https://${e}`)}catch{return""}}const n=i.hostname.replace(/^www\./,"").toLowerCase();if(n==="youtu.be"){const r=i.pathname.split("/").filter(Boolean)[0];return r&&ct.test(r)?r:""}if(n==="youtube.com"||n.endsWith(".youtube.com")){const r=i.searchParams.get("v");if(r&&ct.test(r))return r;const a=i.pathname.split("/").filter(Boolean);if(a.length>=2&&(a[0]==="embed"||a[0]==="shorts")){const l=a[1];return l&&ct.test(l)?l:""}}return""}function o(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function v(t){return o(t)}function G(t){if(!t||typeof t.x!="number"||typeof t.y!="number")return"";const e=r=>Math.max(0,Math.min(1,r)),i=Math.round(e(t.x)*1e3)/10,n=Math.round(e(t.y)*1e3)/10;return`${i}% ${n}%`}function Qn(t){if(!t)return"";const e=t.trim().split(/\s+/).filter(Boolean);return e.length?e.slice(0,2).map(i=>i.charAt(0).toUpperCase()).join(""):""}function Jn(t){if(!t)return[];const e=String(t).trim();return e?e.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:ti(r)})):[]}function ti(t){if(!t)return null;const e=t.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(t)?`tel:${e.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(t)?`mailto:${e}`:null}function ei(t){return t?Tt(t.eventDate,t.endDate,{month:"short"}):""}function ni(t){if(!t)return null;const e=W(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function yt(t,e="eventDate"){return Array.isArray(t)?[...t].sort((i,n)=>_t(n,e)-_t(i,e)):[]}function _t(t,e){if(!t)return 0;const i=t[e],n=W(i);if(n)return n.getTime();const r=W(t._createdAt);return r?r.getTime():0}function pt(t){return t?typeof t.showOnHomePage=="boolean"?t.showOnHomePage:typeof t.featured=="boolean"?t.featured:typeof t.pinToTop=="boolean"?t.pinToTop:!0:!1}function ii(t){if(t||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(i=>i.classList.add("is-visible"));return}const e=new IntersectionObserver(i=>{i.forEach(n=>{n.isIntersecting&&(n.target.classList.add("is-visible"),e.unobserve(n.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(i=>e.observe(i))}function ri(){if(window.matchMedia("(pointer: coarse)").matches)return;const e=document.createElement("div");e.className="golf-ball",e.setAttribute("aria-hidden","true"),document.body.appendChild(e);const i=18,n={x:Math.min(window.innerWidth-i-24,window.innerWidth*.78),y:Math.min(window.innerHeight-i-24,window.innerHeight*.25),vx:0,vy:0,textureOffsetX:0,textureOffsetY:0};let r=performance.now(),a=!1,l=!0,s=null,m=!1,c=!1,f=null,d=null,y=0,p=!1,w=!1,T=null;const C=document.querySelector(".site-header"),z=document.querySelector(".hero"),F=document.querySelector("[data-golf-hole]"),D=document.querySelector("[data-golf-scoreboard]"),X=D?D.querySelector("[data-golf-score-value]"):null,A={x:0,y:0,active:!1},nt=i+16,oe=[".nav",".hero-copy",".hero-photo",".hero-photo-frame",".hero-metrics",".metric-card",".about-card",".panel",".section-heading",".academics-card",".timeline-card",".video-card",".video-frame",".dual-card",".contact-card",".site-footer"].flatMap(u=>Array.from(document.querySelectorAll(u))).filter(u=>u!==null&&u.isConnected),it=document.querySelector(".hero-scroll"),se=it?it.querySelector("span"):null,St={x:.5,y:-32},At={x:0,y:10},le=-80;function K(){e.style.transform=`translate3d(${n.x-i}px, ${n.y-i}px, 0)`,e.classList.toggle("is-moving",a),e.style.setProperty("--texture-offset-x",`${n.textureOffsetX}px`),e.style.setProperty("--texture-offset-y",`${n.textureOffsetY}px`)}function ce(){var B;const u=document.querySelector(".hero-copy h1");if(!u)return null;const g="masco",b=(u.textContent||"").toLowerCase().lastIndexOf(g);if(b===-1)return null;const S=b+g.length-1,I=document.createTreeWalker(u,NodeFilter.SHOW_TEXT);let M=0,L=I.nextNode();for(;L;){const _=L.textContent||"",q=_.length;if(S<M+q){const Y=S-M;if(Y<0||Y>=q)return null;const j=_.charAt(Y);if(!j||!j.trim())return null;const P=document.createRange();P.setStart(L,Y),P.setEnd(L,Math.min(Y+1,q));const O=P.getBoundingClientRect();return(B=P.detach)==null||B.call(P),!O||!O.width&&!O.height?null:{left:O.left+window.scrollX,right:O.right+window.scrollX,top:O.top+window.scrollY,bottom:O.bottom+window.scrollY,width:O.width,height:O.height}}M+=q,L=I.nextNode()}return null}function rt(){m||(s={x:n.x,y:n.y},m=!0)}function de(){return s||{x:n.x,y:n.y}}function ue(){y=0,X&&(X.textContent=y)}function fe(){w||(y+=1,X&&(X.textContent=y),w=!0,clearTimeout(T),T=window.setTimeout(()=>{w=!1},500))}function Z(){w=!1,clearTimeout(T)}function me(){D&&(D.classList.add("is-visible"),D.setAttribute("aria-hidden","false"),clearTimeout(d),d=window.setTimeout(()=>ge(),3200))}function ge(){D&&(D.classList.remove("is-visible"),D.setAttribute("aria-hidden","true"),ue())}function he(){if(!F)return null;const u=F.getBoundingClientRect();if(!u.width||!u.height)return null;const g=window.scrollX,h=window.scrollY,$=i*.5,b=i*.2;return{centerX:u.left+g+u.width/2,centerY:u.top+h+u.height*.5,radiusX:u.width/2+$,radiusY:u.height/2+b}}function ye(u){if(!u)return!1;const g=n.x-u.centerX,h=n.y-u.centerY,$=g/u.radiusX,b=h/u.radiusY;return $*$+b*b<=1}function at(u){const g=u.top+i+le,h=i+4;return Math.max(g,h)}function pe(){if(!z)return!0;const u=window.getComputedStyle(z),g=parseFloat(u.getPropertyValue("column-gap")||u.getPropertyValue("gap"))||0,h=z.clientWidth;if(!h)return!1;const b=280*3+g*2;return h>=b-.5}function be(u={}){const g=ce();if(!g)return!1;const h=st(),$=g.left+g.width/3+St.x,b=g.top+g.height/30+St.y,S=h.left+i+12,I=h.right-i-12,M=at(h),L=h.bottom-i-12;return n.x=N($,S,I),n.y=N(b,M,L),n.vx=0,n.vy=0,K(),u.recordHome&&rt(),!0}function $e(u={}){if(!it)return!1;const g=jt(se||it),h=st(),$=g.left+g.width/2+At.x,b=g.bottom+i+At.y,S=h.left+i+12,I=h.right-i-12,M=at(h),L=h.bottom-i-12;return n.x=N($,S,I),n.y=N(b,M,L),n.vx=0,n.vy=0,K(),u.recordHome&&rt(),!0}function ot(u={}){const{recordHome:g=!1}=u;be({recordHome:g})||$e({recordHome:g})||(K(),g&&rt())}function Q(u={}){const{force:g=!1,skipReposition:h=!1}=u;if(c)return;const $=pe();if(!g&&$===l)return;const b=l;l=$,e.style.display=$?"":"none",$&&(!b||g)&&!h&&ot()}ot({recordHome:!0}),Q({force:!0}),window.addEventListener("load",()=>{ot(),Q({force:!0})},{once:!0}),requestAnimationFrame(()=>{ot(),Q({force:!0})});function ve(u,g){if(c||!A.active)return;const h=.42;n.vx+=u*h,n.vy+=g*h;const $=34,b=Math.hypot(n.vx,n.vy);if(b>$){const L=$/b;n.vx*=L,n.vy*=L}const S=n.x-A.x,I=n.y-A.y,M=Math.hypot(S,I);if(M<i){const L=i-M,B=S/(M||1),_=I/(M||1);n.x+=B*(L+.5),n.y+=_*(L+.5)}}function we(){const g=st(),h=g.left+i+8,$=g.right-i-8,b=at(g),S=g.bottom-i-8;n.x<h?(n.x=h,n.vx=Math.abs(n.vx)*.78):n.x>$&&(n.x=$,n.vx=-Math.abs(n.vx)*.78),n.y<b?(n.y=b,n.vy=Math.abs(n.vy)*.78):n.y>S&&(n.y=S,n.vy=-Math.abs(n.vy)*.78)}function xe(){for(const g of oe){if(!g.isConnected)continue;const h=g.getBoundingClientRect(),$=window.scrollX,b=window.scrollY,S={left:h.left+$,right:h.right+$,top:h.top+b,bottom:h.bottom+b};if(h.width===0||h.height===0||h.right<-40||h.left>window.innerWidth+40||h.bottom<-40||h.top>window.innerHeight+40)continue;const I=N(n.x,S.left,S.right),M=N(n.y,S.top,S.bottom),L=n.x-I,B=n.y-M,_=L*L+B*B;if(_>=i*i||L===0&&B===0)continue;const q=Math.sqrt(_)||1e-4,Y=L/q,j=B/q;n.x=I+Y*(i+.5),n.y=M+j*(i+.5);const P=n.vx*Y+n.vy*j;P>0||(n.vx-=(1+.72)*P*Y,n.vy-=(1+.72)*P*j)}}function st(){return C?jt(C):{left:window.scrollX,right:window.scrollX+window.innerWidth,top:window.scrollY,bottom:window.scrollY+window.innerHeight}}function ke(u){if(c)return;s||rt(),c=!0,A.active=!1,p=!1,Z(),a=!1,n.vx=0,n.vy=0,e.classList.remove("is-moving"),e.classList.add("is-sinking"),me();const g=u.centerX-i,h=u.centerY-i*.6,$=.6;clearTimeout(f),e.style.transition="transform 320ms ease-in, opacity 320ms ease-in, box-shadow 320ms ease-in",e.style.transform=`translate3d(${g}px, ${h}px, 0) scale(${$})`,e.style.opacity="0",e.style.boxShadow="0 10px 20px rgba(15, 29, 51, 0.2)",f=window.setTimeout(()=>{const b=de();n.x=b.x,n.y=b.y,n.vx=0,n.vy=0,e.style.transition="none",e.style.transform=`translate3d(${b.x-i}px, ${b.y-i}px, 0) scale(0.35)`,e.style.opacity="0",requestAnimationFrame(()=>{e.classList.remove("is-sinking"),e.classList.add("is-returning"),e.style.transition="transform 440ms cubic-bezier(0.18, 0.72, 0.22, 1.08), opacity 380ms ease-out, box-shadow 380ms ease-out",e.style.opacity="1",e.style.boxShadow="3px 4px 12px rgba(15, 29, 51, 0.25)",e.style.transform=`translate3d(${b.x-i}px, ${b.y-i}px, 0) scale(1)`}),f=window.setTimeout(()=>{e.classList.remove("is-returning","is-sinking"),e.style.transition="",e.style.opacity="",e.style.boxShadow="",K(),c=!1,Q({force:!0,skipReposition:!0})},520)},360)}function Mt(){if(requestAnimationFrame(Mt),c)return;const u=performance.now(),g=Math.min((u-r)/16.666,3);if(r=u,n.x+=n.vx*g,n.y+=n.vy*g,n.vx*=Math.pow(.985,g),n.vy*=Math.pow(.985,g),Math.abs(n.vx)<.02&&(n.vx=0),Math.abs(n.vy)<.02&&(n.vy=0),we(),xe(),a=Math.hypot(n.vx,n.vy)>.35,l){const h=he();if(h&&ye(h)){ke(h);return}}a&&(n.textureOffsetX=qt(n.textureOffsetX+n.vx*g*.32,12),n.textureOffsetY=qt(n.textureOffsetY+n.vy*g*.32,12)),K()}window.addEventListener("pointermove",u=>{if(u.pointerType&&u.pointerType!=="mouse"&&u.pointerType!=="pen")return;const g=A.x,h=A.y,$=A.active,b=u.clientX+window.scrollX,S=u.clientY+window.scrollY;A.x=b,A.y=S,A.active=!0;const I=$?b-g:0,M=$?S-h:0;if(!$)return;const L=n.x-A.x,B=n.y-A.y,_=Math.hypot(L,B),q=p;if(p=_<=nt,!p)return;const Y=Math.hypot(n.vx,n.vy);ve(I,M);const j=Math.hypot(n.vx,n.vy),P=j-Y;if(!q&&!w){const O=Math.hypot(I,M);(P>.35||j>1||O>1.2)&&fe()}},{passive:!0}),window.addEventListener("pointerleave",()=>{A.active=!1,p=!1,Z()}),window.addEventListener("pointerout",u=>{u.relatedTarget||(A.active=!1,p=!1,Z())}),window.addEventListener("blur",()=>{A.active=!1,p=!1,Z()}),window.addEventListener("scroll",()=>{A.active=!1,p=!1,Z()}),window.addEventListener("resize",()=>{if(!c){const u=st();n.x=N(n.x,u.left+i+8,u.right-i-8),n.y=N(n.y,at(u),u.bottom-i-8)}Q()}),requestAnimationFrame(Mt)}function N(t,e,i){return Math.min(Math.max(t,e),i)}function qt(t,e){const i=t%e;return i<0?i+e:i}function jt(t){const e=t.getBoundingClientRect();return{left:e.left+window.scrollX,right:e.right+window.scrollX,top:e.top+window.scrollY,bottom:e.bottom+window.scrollY,width:e.width,height:e.height}}
