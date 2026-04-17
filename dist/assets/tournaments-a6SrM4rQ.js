import{f as q,p as $}from"./sanityClient-CY0C8Q-b.js";const f={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"};let w=!1;const Y="images/samuel-placeholder.svg",V=/^[a-zA-Z0-9_-]{11}$/,o={events:[],activeYear:"all",searchQuery:"",videos:[],photos:[]};document.addEventListener("DOMContentLoaded",()=>{z()});async function z(){L("Loading the tournament library...");const t=await q();if(!t){L("Unable to load tournament highlights right now. Please try again soon.","error");return}o.events=ht(t.highlightEvents||[]),o.videos=Array.isArray(t.videos)?t.videos:[],o.photos=Array.isArray(t.galleryPhotos)?t.galleryPhotos:[],o.searchQuery="",G(t.site,"Tournament Highlights"),Q(t.highlightsSection,o.events.length),W(o.events),Z(),P(),L(""),vt()}function G(t,e){var n;t!=null&&t.siteTitle&&(document.title=`${t.siteTitle} | ${e}`);const r=y(f.brandText);r&&(t!=null&&t.siteTitle)&&(r.textContent=t.siteTitle);const a=y(f.brandMark);if(a)if((n=t==null?void 0:t.brandMarkImage)!=null&&n.url){const i=D(t.brandMarkImage.focalPoint||t.brandMarkImage.hotspot),s=i?` style="object-position: ${g(i)};"`:"";a.innerHTML=`<span class="brand-mark-image"><img src="${g(t.brandMarkImage.url)}" alt="${l(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy"${s} /></span>`,a.classList.add("has-image")}else a.textContent=(t==null?void 0:t.brandMarkInitials)||Vt(t==null?void 0:t.siteTitle)||a.textContent||"SM",a.classList.remove("has-image")}function Q(t,e){const r=y(f.heading);r&&(t!=null&&t.heading)&&(r.textContent=t.heading);const a=y(f.subheading);a&&(t!=null&&t.subheading)&&(a.textContent=t.subheading),k(e,e,o.activeYear)}function W(t){const e=y(f.filters);if(!e)return;const r=Array.from(new Set(t.map(i=>E(i)).filter(i=>i&&i!=="undated"))).sort((i,s)=>Number(s)-Number(i)),a=t.some(i=>E(i)==="undated"),n=["all",...r,...a?["undated"]:[]];if(n.length<=1){e.innerHTML="";return}e.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${n.map(i=>{const s=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===o.activeYear?" is-active":""}" type="button" data-year="${i}">${s}</button>`}).join("")}
    </div>
  `,e.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-year")||"all";s!==o.activeYear&&(o.activeYear=s,e.querySelectorAll(".video-filter-chip").forEach(c=>c.classList.remove("is-active")),i.classList.add("is-active"),P())})})}function Z(){const t=y(f.search);t&&(t.value=o.searchQuery,t.addEventListener("input",e=>{o.searchQuery=e.target.value.trim(),P()}))}function P(){const t=y(f.groups);if(!t)return;const e=X(o.events,o.activeYear),r=J(e,o.searchQuery),a=!!o.searchQuery;if(!r.length){const c=o.activeYear==="all"?"the library":o.activeYear==="undated"?"undated rounds":o.activeYear,d=a?`No highlights match “${o.searchQuery}”${o.activeYear==="all"?"":` in ${c}`}.`:`No highlights recorded for ${c} yet.`;t.innerHTML=renderPlaceholder(d),L(a?d:""),k(o.events.length,0,o.activeYear);return}L("");const n=K(r);let i=0;const s=n.map(({year:c,items:d})=>{const u=c==="undated"?"Undated Rounds":c,h=et(d).map(b=>tt(b,`${c}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${c}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${u}</span>
            <span class="highlight-year-count">${qt(d.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${h}
          </ul>
        </section>
      `}).join("");t.innerHTML=s,ft(t),k(o.events.length,r.length,o.activeYear)}function X(t,e){return e==="all"?[...t]:t.filter(r=>E(r)===e)}function J(t,e){if(!e)return[...t];const r=e.toLowerCase();return t.filter(a=>{const n=[a.title,a.summary,a.location,a.eventDate,a.endDate];return Array.isArray(a.days)&&a.days.forEach(s=>{n.push(s.label,s.score,s.notes)}),n.filter(Boolean).join(" ").toLowerCase().includes(r)})}function K(t){const e=new Map;return t.forEach(r=>{const a=E(r)||"undated";e.has(a)||e.set(a,[]),e.get(a).push(r)}),Array.from(e.entries()).sort(([r],[a])=>r==="undated"?1:a==="undated"?-1:Number(a)-Number(r)).map(([r,a])=>({year:r,items:a}))}function tt(t,e){const r=_(t),a=!r&&t.eventDate?l(t.eventDate):"",n=_t(t.eventDate),i=t.summary?`<p class="highlight-summary">${l(t.summary)}</p>`:"",s=Array.isArray(t.days)?t.days:[],c=U(s,{variant:"list"}),d=(e||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-"),u=(t==null?void 0:t._id)||d,h=!!t.pinToTop,b=h?'<span class="highlight-badge">Featured</span>':"",S=`
    <button class="highlight-toggle" type="button" data-highlight-modal="${g(u)}">
      View Details
    </button>
  `,A=`<div class="highlight-card-actions">${b}${S}</div>`;return`
    <li class="highlight-list-item${h?" is-featured":""}">
      ${n?yt(n):""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${r?`<span class="highlight-date">${r}</span>`:""}
          ${!r&&a?`<span class="highlight-date">${a}</span>`:""}
        </div>
        ${A}
        <div class="highlight-row highlight-row--title">
          <h3>${l(t.title||"Tournament highlight")}</h3>
        </div>
        ${c}
        ${i}
      </div>
    </li>
  `}function et(t){if(!Array.isArray(t))return[];const e=[],r=[];return t.forEach(a=>{a!=null&&a.pinToTop?e.push(a):r.push(a)}),[...e,...r]}function U(t=[],{variant:e="default",showLabels:r}={}){if(!Array.isArray(t)||!t.length)return"";const a=t.length,n=typeof r=="boolean"?r:a>1;return`
    <div class="${["day-stats",e==="list"?"day-stats--list":"",a===1?"day-stats--single":"",`day-stats--cols-${Math.min(a,3)}`].filter(Boolean).join(" ")}">
      ${t.map((s,c)=>at(s,c,{showLabels:n,total:a})).join("")}
    </div>
  `}const C=120,rt=57;function at(t,e,{showLabels:r,total:a}){if(!t)return"";const n=a===1,i=!n&&r?B(t,e,a):null,s=nt(t);return s?`
    <div class="day-stat${n?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${l(i)}</span>`:""}
      ${s}
    </div>
  `:""}function nt(t){const e=st(t);return e.length?`
    <div class="day-metrics">
      ${it(e)}
    </div>
  `:""}function it(t){return`
    <div class="day-metric-list">
      ${t.map(e=>{const r=e.secondary?`<span class="day-metric-secondary">${l(e.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${e.key}">
              <span class="day-metric-value">${l(e.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${l(e.label)}
                  ${r}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function st(t){if(!t)return[];const e=[],r=M(t.score),a=M(t.yardage);e.push(T({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:ct(r)})),e.push(T({key:"yards",label:"Yardage",display:typeof a=="number"?a.toLocaleString():"—",secondary:"",progress:dt(a,lt(t,a))}));const n=gt(t);return e.push(T({key:"rank",label:"Rank",display:n.display,secondary:n.secondary,progress:n.progress})),e.filter(Boolean)}function T({key:t,label:e,display:r,secondary:a,progress:n}){const i=r!=null&&r!==""?String(r):"—",s=a?String(a):"",c=typeof n=="number"&&!Number.isNaN(n)?n:0;return{key:t,label:e,display:i,secondary:s,progress:Math.max(0,c)}}function ot(t=[]){if(!Array.isArray(t))return"";const e=t.map((r,a)=>{if(!(r!=null&&r.notes))return"";const n=B(r,a,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${l(n)}</strong>
          <p>${l(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function B(t,e,r){return t!=null&&t.label?t.label:r>1?`Day ${e+1}`:null}function M(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function lt(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function ct(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=C-rt;return(C-t)/e}function dt(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function ut(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const r=(e-t)/(e-1);return Math.max(0,Math.min(r,1))}function gt(t){const e=M(t==null?void 0:t.rankingPosition),r=M(t==null?void 0:t.rankingOutOf),a=ut(e,r);return typeof e=="number"?{display:String(e),secondary:typeof r=="number"?`of ${r}`:"",progress:a}:{display:"—",secondary:"",progress:0}}function ht(t){return Array.isArray(t)?[...t].sort((e,r)=>H(r)-H(e)):[]}function H(t){if(!t)return 0;const e=$(t.eventDate);if(e)return e.getTime();const r=$(t._createdAt);return r?r.getTime():0}function ft(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",()=>{w=!1;const r=e.getAttribute("data-highlight-modal");O(r)}))})}function yt(t){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}let p=null;function mt(){if(p)return p;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&N()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&N()}),document.body.appendChild(t),p=t,t}function O(t){const e=mt(),r=e.querySelector("[data-highlight-overlay-body]");if(!r)return;const a=j(t);if(!a)return;const n=Pt(a),i=Dt(a);r.innerHTML=Mt(a,n,i),Rt(r),Ut(r),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function N(){if(!p)return;const t=p.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),p.classList.remove("is-open"),p.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay"),w&&window.history.length>1&&history.back()}function pt(t=null){try{const r=(t||new URL(window.location.href)).searchParams.get("tournament");if(r)return decodeURIComponent(r)}catch{}return window.location.hash?decodeURIComponent(window.location.hash.replace(/^#/,"")):null}function vt(){const t=bt(),e=pt(t);if(!e)return;w=$t(t);const r=j(e);r&&O(r._id||r.title||e)}function bt(){try{return new URL(window.location.href)}catch{return null}}function $t(t=null){const e=Lt(),r=St(t),a=e?["/video-highlights","/video-highlights.html","/gallery","/gallery.html"].some(i=>e.endsWith(i)):!1,n=r&&["video-highlights","videos","video","gallery"].some(i=>r.includes(i))&&(!document.referrer||a);return a||n}function Lt(){try{const t=new URL(document.referrer);return t.host&&t.host!==window.location.host?"":At(t.pathname.toLowerCase())}catch{return""}}function St(t=null){if(!t)return"";const e=t.searchParams.get("origin")||t.searchParams.get("from");return e?e.trim().toLowerCase():""}function At(t){return t.replace(/\/+$/,"")||"/"}function j(t){return t?o.events.find(e=>(e==null?void 0:e._id)===t)||o.events.find(e=>e.title===t)||null:o.events[0]||null}function Mt(t,e,r){const n=[_(t),t.location?l(t.location):null].filter(Boolean),i=n.length?`<div class="highlight-overlay-meta">
        ${n.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=U(t.days||[],{variant:"list"}),c=ot(t.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${l(t.title||"Tournament highlight")}</h2>
        ${i}
        ${t.summary?`<p class="highlight-overlay-summary">${l(t.summary)}</p>`:""}
      </header>
      ${s?`<section class="highlight-overlay-section">${s}</section>`:""}
      ${c?`<section class="highlight-overlay-section">${c}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${Et(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${kt(r)}
      </section>
    </div>
  `}function Et(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(Tt).join("")}
    </div>
  `}function Tt(t){const e=Ft(t),r=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:Y),a=t.thumbnailAlt||t.title||"Video highlight",n=t.title||"Video highlight",s=!!e?"":' disabled aria-disabled="true"',c=Nt(t),d=D(t.thumbnailFocalPoint||t.thumbnailHotspot),u=d?` style="object-position: ${g(d)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${l(e)}" data-video-title="${l(n)}">
        <img src="${g(r)}" alt="${l(a)}" loading="lazy"${u} />
        <button class="play-button" type="button"${s} aria-label="Play ${l(n)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${l(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${l(t.description)}</p>`:""}
        ${c}
      </div>
    </article>
  `}function kt(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(wt).join("")}
    </div>
  `}function wt(t){var u,h,b,S,A;const e=((u=t==null?void 0:t.image)==null?void 0:u.url)||Y,r=((h=t==null?void 0:t.image)==null?void 0:h.alt)||(t==null?void 0:t.title)||"Gallery photo",a=(b=t==null?void 0:t.image)!=null&&b.url?{src:e,alt:r,title:(t==null?void 0:t.title)||"Gallery photo"}:null,n=a?`data-photo-preview="true" data-photo-src="${g(a.src)}" data-photo-alt="${g(a.alt)}" data-photo-title="${g(a.title)}"`:"",i=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${l(t.photographer)}</div>`:"",s=xt(t==null?void 0:t.tags),c=D(((S=t==null?void 0:t.image)==null?void 0:S.focalPoint)||((A=t==null?void 0:t.image)==null?void 0:A.hotspot)),d=c?` style="object-position: ${g(c)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${n?` ${n}`:""}>
        <img src="${g(e)}" alt="${l(r)}" loading="lazy"${d} />
      </div>
      <div class="gallery-card-body">
        <h4>${l((t==null?void 0:t.title)||"Gallery photo")}</h4>
        ${s}
        ${t!=null&&t.description?`<p class="gallery-card-description">${l(t.description)}</p>`:""}
        ${i?`<div class="gallery-card-footer">${i}</div>`:""}
      </div>
    </article>
  `}function Pt(t){return!t||!Array.isArray(o.videos)?[]:o.videos.filter(e=>F(e,t))}function Dt(t){return!t||!Array.isArray(o.photos)?[]:o.photos.filter(e=>F(e,t))}function F(t,e){const r=Ct(t);return r?!!(r.id&&(e!=null&&e._id)&&r.id===e._id||r.title&&(e!=null&&e.title)&&r.title===e.title):!1}function Ct(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function Ht(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function Nt(t){const e=Ht(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(r=>`<span class="gallery-tag">${l(r)}</span>`).join("")}
    </div>
  `:""}function xt(t){if(!Array.isArray(t))return"";const e=t.map(r=>typeof r=="string"?r.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(r=>`<span class="gallery-tag">${l(r)}</span>`).join("")}
    </div>
  `:""}let v=null;function Rt(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(r=>{if(r.dataset.playerReady==="true")return;const a=r.querySelector(".play-button"),n=r.dataset.videoId,i=r.dataset.videoTitle||"Samuel Masco golf video highlight";!a||!n||(a.addEventListener("click",()=>{Yt(n,i)}),r.dataset.playerReady="true")})}function It(){if(v)return v;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&x()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&x()}),document.body.appendChild(t),v=t,t}function Yt(t,e){if(!t)return;const r=It(),a=r.querySelector(".video-overlay-frame");if(!a)return;a.innerHTML="";const n=document.createElement("iframe");n.src=`https://www.youtube.com/embed/${t}?autoplay=1&rel=0`,n.title=e,n.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,a.appendChild(n),r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function x(){if(!v)return;const t=v.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),v.classList.remove("is-open"),v.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let m=null;function Ut(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(r=>{r.dataset.photoPreviewReady!=="true"&&(r.addEventListener("click",()=>{Ot(r.getAttribute("data-photo-src"),r.getAttribute("data-photo-alt"),r.getAttribute("data-photo-title"))}),r.dataset.photoPreviewReady="true")})}function Bt(){if(m)return m;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&R()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&R()}),document.body.appendChild(t),m=t,t}function Ot(t,e,r){if(!t)return;const a=Bt(),n=a.querySelector("img"),i=a.querySelector("figcaption");!n||!i||(n.src=t,n.alt=e||r||"Gallery photo",i.textContent=r||e||"",a.classList.add("is-open"),a.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function R(){if(!m)return;const t=m.querySelector("img"),e=m.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),m.classList.remove("is-open"),m.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function _(t){return t?jt(t.eventDate,t.endDate,{month:"long"}):""}function jt(t,e,{month:r="long"}={}){if(!t)return"";const a=$(t);if(!a)return l(t);if(!e)return a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const n=$(e);if(!n)return`${a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${l(e)}`;const i=a.getFullYear()===n.getFullYear(),s=i&&a.getMonth()===n.getMonth();if(i&&s)return`${a.toLocaleDateString("en-US",{month:r})} ${a.getDate()}–${n.getDate()}, ${a.getFullYear()}`;if(i){const u=a.toLocaleDateString("en-US",{month:r,day:"numeric"}),h=n.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${u} – ${h}, ${a.getFullYear()}`}const c=a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),d=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${c} – ${d}`}function Ft(t){return t?I(t.youtubeId)||I(t.youtubeUrl):""}function I(t){if(!t)return"";const e=t.trim();if(V.test(e))return e;try{const r=new URL(e);if(r.hostname.includes("youtu.be"))return r.pathname.replace("/","")||"";if(r.hostname.includes("youtube.com")){if(r.pathname.startsWith("/embed/"))return r.pathname.replace("/embed/","")||"";const a=r.searchParams.get("v");if(a)return a}}catch{return""}return""}function _t(t){if(!t)return null;const e=$(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function k(t,e,r){const a=y(f.count);if(!a)return;const n=`${t} ${t===1?"highlight":"highlights"}`;if(r==="all"){a.textContent=n;return}const i=r==="undated"?"undated rounds":`${r}`,s=`${e} ${e===1?"entry":"entries"}`;a.textContent=`${n} · ${s} in ${i}`}function E(t){if(!(t!=null&&t.eventDate))return"undated";const e=$(t.eventDate);return e?e.getFullYear().toString():"undated"}function L(t,e="info"){const r=y(f.message);if(r){if(!t){r.textContent="",r.classList.remove("error"),r.hidden=!0;return}r.hidden=!1,r.textContent=t,e==="error"?r.classList.add("error"):r.classList.remove("error")}}function qt(t,e){return`${t} ${t===1?e:`${e}s`}`}function y(t){return t?document.querySelector(t):null}function l(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function g(t){return l(t).replace(/`/g,"&#96;")}function D(t){if(!t||typeof t.x!="number"||typeof t.y!="number")return"";const e=n=>Math.max(0,Math.min(1,n)),r=Math.round(e(t.x)*1e3)/10,a=Math.round(e(t.y)*1e3)/10;return`${r}% ${a}%`}function Vt(t){return t?t.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(""):""}
