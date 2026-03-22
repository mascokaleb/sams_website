import{f as V,p as $}from"./sanityClient-bKf_BX8y.js";const f={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"};let k=!1;const R="images/samuel-placeholder.svg",z=/^[a-zA-Z0-9_-]{11}$/,o={events:[],activeYear:"all",searchQuery:"",videos:[],photos:[]};document.addEventListener("DOMContentLoaded",()=>{G()});async function G(){L("Loading the tournament library...");const t=await V();if(!t){L("Unable to load tournament highlights right now. Please try again soon.","error");return}o.events=ft(t.highlightEvents||[]),o.videos=Array.isArray(t.videos)?t.videos:[],o.photos=Array.isArray(t.galleryPhotos)?t.galleryPhotos:[],o.searchQuery="",Q(t.site,"Tournament Highlights"),W(t.highlightsSection,o.events.length),Z(o.events),X(),w(),L(""),bt()}function Q(t,e){var n;t!=null&&t.siteTitle&&(document.title=`${t.siteTitle} | ${e}`);const r=y(f.brandText);r&&(t!=null&&t.siteTitle)&&(r.textContent=t.siteTitle);const a=y(f.brandMark);a&&((n=t==null?void 0:t.brandMarkImage)!=null&&n.url?(a.innerHTML=`<span class="brand-mark-image"><img src="${h(t.brandMarkImage.url)}" alt="${l(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,a.classList.add("has-image")):(a.textContent=(t==null?void 0:t.brandMarkInitials)||Vt(t==null?void 0:t.siteTitle)||a.textContent||"SM",a.classList.remove("has-image")))}function W(t,e){const r=y(f.heading);r&&(t!=null&&t.heading)&&(r.textContent=t.heading);const a=y(f.subheading);a&&(t!=null&&t.subheading)&&(a.textContent=t.subheading),T(e,e,o.activeYear)}function Z(t){const e=y(f.filters);if(!e)return;const r=Array.from(new Set(t.map(i=>M(i)).filter(i=>i&&i!=="undated"))).sort((i,s)=>Number(s)-Number(i)),a=t.some(i=>M(i)==="undated"),n=["all",...r,...a?["undated"]:[]];if(n.length<=1){e.innerHTML="";return}e.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${n.map(i=>{const s=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===o.activeYear?" is-active":""}" type="button" data-year="${i}">${s}</button>`}).join("")}
    </div>
  `,e.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-year")||"all";s!==o.activeYear&&(o.activeYear=s,e.querySelectorAll(".video-filter-chip").forEach(c=>c.classList.remove("is-active")),i.classList.add("is-active"),w())})})}function X(){const t=y(f.search);t&&(t.value=o.searchQuery,t.addEventListener("input",e=>{o.searchQuery=e.target.value.trim(),w()}))}function w(){const t=y(f.groups);if(!t)return;const e=J(o.events,o.activeYear),r=K(e,o.searchQuery),a=!!o.searchQuery;if(!r.length){const c=o.activeYear==="all"?"the library":o.activeYear==="undated"?"undated rounds":o.activeYear,d=a?`No highlights match “${o.searchQuery}”${o.activeYear==="all"?"":` in ${c}`}.`:`No highlights recorded for ${c} yet.`;t.innerHTML=renderPlaceholder(d),L(a?d:""),T(o.events.length,0,o.activeYear);return}L("");const n=tt(r);let i=0;const s=n.map(({year:c,items:d})=>{const u=c==="undated"?"Undated Rounds":c,g=rt(d).map(b=>et(b,`${c}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${c}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${u}</span>
            <span class="highlight-year-count">${F(d.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${g}
          </ul>
        </section>
      `}).join("");t.innerHTML=s,yt(t),T(o.events.length,r.length,o.activeYear)}function J(t,e){return e==="all"?[...t]:t.filter(r=>M(r)===e)}function K(t,e){if(!e)return[...t];const r=e.toLowerCase();return t.filter(a=>{const n=[a.title,a.summary,a.location,a.eventDate,a.endDate];return Array.isArray(a.days)&&a.days.forEach(s=>{n.push(s.label,s.score,s.notes)}),n.filter(Boolean).join(" ").toLowerCase().includes(r)})}function tt(t){const e=new Map;return t.forEach(r=>{const a=M(r)||"undated";e.has(a)||e.set(a,[]),e.get(a).push(r)}),Array.from(e.entries()).sort(([r],[a])=>r==="undated"?1:a==="undated"?-1:Number(a)-Number(r)).map(([r,a])=>({year:r,items:a}))}function et(t,e){const r=j(t),a=!r&&t.eventDate?l(t.eventDate):"",n=qt(t.eventDate),i=t.summary?`<p class="highlight-summary">${l(t.summary)}</p>`:"",s=Array.isArray(t.days)?t.days:[],c=I(s,{variant:"list"}),d=(e||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-"),u=(t==null?void 0:t._id)||d,g=!!t.pinToTop,b=g?'<span class="highlight-badge">Featured</span>':"",S=`
    <button class="highlight-toggle" type="button" data-highlight-modal="${h(u)}">
      View Details
    </button>
  `,q=`<div class="highlight-card-actions">${b}${S}</div>`;return`
    <li class="highlight-list-item${g?" is-featured":""}">
      ${n?mt(n):""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${r?`<span class="highlight-date">${r}</span>`:""}
          ${!r&&a?`<span class="highlight-date">${a}</span>`:""}
        </div>
        ${q}
        <div class="highlight-row highlight-row--title">
          <h3>${l(t.title||"Tournament highlight")}</h3>
        </div>
        ${c}
        ${i}
      </div>
    </li>
  `}function rt(t){if(!Array.isArray(t))return[];const e=[],r=[];return t.forEach(a=>{a!=null&&a.pinToTop?e.push(a):r.push(a)}),[...e,...r]}function I(t=[],{variant:e="default",showLabels:r}={}){if(!Array.isArray(t)||!t.length)return"";const a=t.length,n=typeof r=="boolean"?r:a>1;return`
    <div class="${["day-stats",e==="list"?"day-stats--list":"",a===1?"day-stats--single":"",`day-stats--cols-${Math.min(a,3)}`].filter(Boolean).join(" ")}">
      ${t.map((s,c)=>nt(s,c,{showLabels:n,total:a})).join("")}
    </div>
  `}const D=120,at=57;function nt(t,e,{showLabels:r,total:a}){if(!t)return"";const n=a===1,i=!n&&r?Y(t,e,a):null,s=it(t);return s?`
    <div class="day-stat${n?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${l(i)}</span>`:""}
      ${s}
    </div>
  `:""}function it(t){const e=ot(t);return e.length?`
    <div class="day-metrics">
      ${st(e)}
    </div>
  `:""}function st(t){return`
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
  `}function ot(t){if(!t)return[];const e=[],r=A(t.score),a=A(t.yardage);e.push(E({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:dt(r)})),e.push(E({key:"yards",label:"Yardage",display:typeof a=="number"?a.toLocaleString():"—",secondary:"",progress:ut(a,ct(t,a))}));const n=ht(t);return e.push(E({key:"rank",label:"Rank",display:n.display,secondary:n.secondary,progress:n.progress})),e.filter(Boolean)}function E({key:t,label:e,display:r,secondary:a,progress:n}){const i=r!=null&&r!==""?String(r):"—",s=a?String(a):"",c=typeof n=="number"&&!Number.isNaN(n)?n:0;return{key:t,label:e,display:i,secondary:s,progress:Math.max(0,c)}}function lt(t=[]){if(!Array.isArray(t))return"";const e=t.map((r,a)=>{if(!(r!=null&&r.notes))return"";const n=Y(r,a,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${l(n)}</strong>
          <p>${l(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function Y(t,e,r){return t!=null&&t.label?t.label:r>1?`Day ${e+1}`:null}function A(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function ct(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function dt(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=D-at;return(D-t)/e}function ut(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function gt(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const r=(e-t)/(e-1);return Math.max(0,Math.min(r,1))}function ht(t){const e=A(t==null?void 0:t.rankingPosition),r=A(t==null?void 0:t.rankingOutOf),a=gt(e,r);return typeof e=="number"?{display:String(e),secondary:typeof r=="number"?`of ${r}`:"",progress:a}:{display:"—",secondary:"",progress:0}}function ft(t){return Array.isArray(t)?[...t].sort((e,r)=>P(r)-P(e)):[]}function P(t){if(!t)return 0;const e=$(t.eventDate);if(e)return e.getTime();const r=$(t._createdAt);return r?r.getTime():0}function yt(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",()=>{k=!1;const r=e.getAttribute("data-highlight-modal");U(r)}))})}function mt(t){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}let p=null;function pt(){if(p)return p;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&C()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&C()}),document.body.appendChild(t),p=t,t}function U(t){const e=pt(),r=e.querySelector("[data-highlight-overlay-body]");if(!r)return;const a=B(t);if(!a)return;const n=Pt(a),i=Ct(a);r.innerHTML=Et(a,n,i),It(r),Bt(r),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function C(){if(!p)return;const t=p.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),p.classList.remove("is-open"),p.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay"),k&&window.history.length>1&&history.back()}function vt(t=null){try{const r=(t||new URL(window.location.href)).searchParams.get("tournament");if(r)return decodeURIComponent(r)}catch{}return window.location.hash?decodeURIComponent(window.location.hash.replace(/^#/,"")):null}function bt(){const t=$t(),e=vt(t);if(!e)return;k=Lt(t);const r=B(e);r&&U(r._id||r.title||e)}function $t(){try{return new URL(window.location.href)}catch{return null}}function Lt(t=null){const e=St(),r=At(t),a=e?["/video-highlights","/video-highlights.html","/gallery","/gallery.html"].some(i=>e.endsWith(i)):!1,n=r&&["video-highlights","videos","video","gallery"].some(i=>r.includes(i))&&(!document.referrer||a);return a||n}function St(){try{const t=new URL(document.referrer);return t.host&&t.host!==window.location.host?"":Mt(t.pathname.toLowerCase())}catch{return""}}function At(t=null){if(!t)return"";const e=t.searchParams.get("origin")||t.searchParams.get("from");return e?e.trim().toLowerCase():""}function Mt(t){return t.replace(/\/+$/,"")||"/"}function B(t){return t?o.events.find(e=>(e==null?void 0:e._id)===t)||o.events.find(e=>e.title===t)||null:o.events[0]||null}function Et(t,e,r){const n=[j(t),t.location?l(t.location):null].filter(Boolean),i=n.length?`<div class="highlight-overlay-meta">
        ${n.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=I(t.days||[],{variant:"list"}),c=lt(t.days||[]);return`
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
        ${Tt(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${wt(r)}
      </section>
    </div>
  `}function Tt(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(kt).join("")}
    </div>
  `}function kt(t){const e=_t(t),r=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:R),a=t.thumbnailAlt||t.title||"Video highlight",n=t.title||"Video highlight",s=!!e?"":' disabled aria-disabled="true"',c=xt(t),d=_(t.thumbnailHotspot),u=d?` style="object-position: ${h(d)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${l(e)}" data-video-title="${l(n)}">
        <img src="${h(r)}" alt="${l(a)}" loading="lazy"${u} />
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
  `}function wt(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(Dt).join("")}
    </div>
  `}function Dt(t){var u,g,b,S;const e=((u=t==null?void 0:t.image)==null?void 0:u.url)||R,r=((g=t==null?void 0:t.image)==null?void 0:g.alt)||(t==null?void 0:t.title)||"Gallery photo",a=(b=t==null?void 0:t.image)!=null&&b.url?{src:e,alt:r,title:(t==null?void 0:t.title)||"Gallery photo"}:null,n=a?`data-photo-preview="true" data-photo-src="${h(a.src)}" data-photo-alt="${h(a.alt)}" data-photo-title="${h(a.title)}"`:"",i=t!=null&&t.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${l(t.photographer)}</div>`:"",s=Rt(t==null?void 0:t.tags),c=_((S=t==null?void 0:t.image)==null?void 0:S.hotspot),d=c?` style="object-position: ${h(c)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${n?` ${n}`:""}>
        <img src="${h(e)}" alt="${l(r)}" loading="lazy"${d} />
      </div>
      <div class="gallery-card-body">
        <h4>${l((t==null?void 0:t.title)||"Gallery photo")}</h4>
        ${s}
        ${t!=null&&t.description?`<p class="gallery-card-description">${l(t.description)}</p>`:""}
        ${i?`<div class="gallery-card-footer">${i}</div>`:""}
      </div>
    </article>
  `}function Pt(t){return!t||!Array.isArray(o.videos)?[]:o.videos.filter(e=>O(e,t))}function Ct(t){return!t||!Array.isArray(o.photos)?[]:o.photos.filter(e=>O(e,t))}function O(t,e){const r=Ht(t);return r?!!(r.id&&(e!=null&&e._id)&&r.id===e._id||r.title&&(e!=null&&e.title)&&r.title===e.title):!1}function Ht(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function Nt(t){return!t||!Array.isArray(t.tags)?[]:t.tags.map(e=>typeof e=="string"?e.trim():"").filter(Boolean)}function xt(t){const e=Nt(t);return e.length?`
    <div class="gallery-card-tags video-card-tags">
      ${e.map(r=>`<span class="gallery-tag">${l(r)}</span>`).join("")}
    </div>
  `:""}function Rt(t){if(!Array.isArray(t))return"";const e=t.map(r=>typeof r=="string"?r.trim():"").filter(Boolean);return e.length?`
    <div class="gallery-card-tags">
      ${e.map(r=>`<span class="gallery-tag">${l(r)}</span>`).join("")}
    </div>
  `:""}let v=null;function It(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(r=>{if(r.dataset.playerReady==="true")return;const a=r.querySelector(".play-button"),n=r.dataset.videoId,i=r.dataset.videoTitle||"Samuel Masco golf video highlight";!a||!n||(a.addEventListener("click",()=>{Ut(n,i)}),r.dataset.playerReady="true")})}function Yt(){if(v)return v;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&H()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&H()}),document.body.appendChild(t),v=t,t}function Ut(t,e){if(!t)return;const r=Yt(),a=r.querySelector(".video-overlay-frame");if(!a)return;a.innerHTML="";const n=document.createElement("iframe");n.src=`https://www.youtube.com/embed/${t}?autoplay=1&rel=0`,n.title=e,n.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,a.appendChild(n),r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function H(){if(!v)return;const t=v.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),v.classList.remove("is-open"),v.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let m=null;function Bt(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(r=>{r.dataset.photoPreviewReady!=="true"&&(r.addEventListener("click",()=>{jt(r.getAttribute("data-photo-src"),r.getAttribute("data-photo-alt"),r.getAttribute("data-photo-title"))}),r.dataset.photoPreviewReady="true")})}function Ot(){if(m)return m;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&N()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&N()}),document.body.appendChild(t),m=t,t}function jt(t,e,r){if(!t)return;const a=Ot(),n=a.querySelector("img"),i=a.querySelector("figcaption");!n||!i||(n.src=t,n.alt=e||r||"Gallery photo",i.textContent=r||e||"",a.classList.add("is-open"),a.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function N(){if(!m)return;const t=m.querySelector("img"),e=m.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),m.classList.remove("is-open"),m.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function j(t){return t?Ft(t.eventDate,t.endDate,{month:"long"}):""}function Ft(t,e,{month:r="long"}={}){if(!t)return"";const a=$(t);if(!a)return l(t);if(!e)return a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const n=$(e);if(!n)return`${a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${l(e)}`;const i=a.getFullYear()===n.getFullYear(),s=i&&a.getMonth()===n.getMonth();if(i&&s)return`${a.toLocaleDateString("en-US",{month:r})} ${a.getDate()}–${n.getDate()}, ${a.getFullYear()}`;if(i){const u=a.toLocaleDateString("en-US",{month:r,day:"numeric"}),g=n.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${u} – ${g}, ${a.getFullYear()}`}const c=a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),d=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${c} – ${d}`}function _t(t){return t?x(t.youtubeId)||x(t.youtubeUrl):""}function x(t){if(!t)return"";const e=t.trim();if(z.test(e))return e;try{const r=new URL(e);if(r.hostname.includes("youtu.be"))return r.pathname.replace("/","")||"";if(r.hostname.includes("youtube.com")){if(r.pathname.startsWith("/embed/"))return r.pathname.replace("/embed/","")||"";const a=r.searchParams.get("v");if(a)return a}}catch{return""}return""}function qt(t){if(!t)return null;const e=$(t);return e?{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}:null}function T(t,e,r){const a=y(f.count);if(!a)return;const n=`${t} recorded ${F(t,"highlight")}`;if(r==="all"){a.textContent=n;return}const i=r==="undated"?"undated rounds":`${r}`,s=`${e} ${e===1?"entry":"entries"}`;a.textContent=`${n} · ${s} in ${i}`}function M(t){if(!(t!=null&&t.eventDate))return"undated";const e=$(t.eventDate);return e?e.getFullYear().toString():"undated"}function L(t,e="info"){const r=y(f.message);if(r){if(!t){r.textContent="",r.classList.remove("error"),r.hidden=!0;return}r.hidden=!1,r.textContent=t,e==="error"?r.classList.add("error"):r.classList.remove("error")}}function F(t,e){return`${t} ${t===1?e:`${e}s`}`}function y(t){return t?document.querySelector(t):null}function l(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function h(t){return l(t).replace(/`/g,"&#96;")}function _(t){if(!t||typeof t.x!="number"||typeof t.y!="number")return"";const e=n=>Math.max(0,Math.min(1,n)),r=Math.round(e(t.x)*1e3)/10,a=Math.round(e(t.y)*1e3)/10;return`${r}% ${a}%`}function Vt(t){return t?t.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(""):""}
