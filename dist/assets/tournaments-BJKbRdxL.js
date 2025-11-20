import{f as _}from"./sanityClient-Drid7qza.js";const g={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"},q=/video-highlights\.html|gallery\.html/.test((document.referrer||"").toLowerCase()),C="images/samuel-placeholder.svg",j=/^[a-zA-Z0-9_-]{11}$/,o={events:[],activeYear:"all",searchQuery:"",videos:[],photos:[]};document.addEventListener("DOMContentLoaded",()=>{V()});async function V(){b("Loading the tournament library...");const e=await _();if(!e){b("Unable to load tournament highlights right now. Please try again soon.","error");return}o.events=he(e.highlightEvents||[]),o.videos=Array.isArray(e.videos)?e.videos:[],o.photos=Array.isArray(e.galleryPhotos)?e.galleryPhotos:[],o.searchQuery="",z(e.site,"Tournament Highlights"),G(e.highlightsSection,o.events.length),Q(o.events),Z(),E(),b(""),pe()}function z(e,t){var n;e!=null&&e.siteTitle&&(document.title=`${e.siteTitle} | ${t}`);const r=y(g.brandText);r&&(e!=null&&e.siteTitle)&&(r.textContent=e.siteTitle);const a=y(g.brandMark);a&&((n=e==null?void 0:e.brandMarkImage)!=null&&n.url?(a.innerHTML=`<span class="brand-mark-image"><img src="${v(e.brandMarkImage.url)}" alt="${c(e.brandMarkImage.alt||e.siteTitle||"Site logo")}" loading="lazy" /></span>`,a.classList.add("has-image")):(a.textContent=(e==null?void 0:e.brandMarkInitials)||Ue(e==null?void 0:e.siteTitle)||a.textContent||"SM",a.classList.remove("has-image")))}function G(e,t){const r=y(g.heading);r&&(e!=null&&e.heading)&&(r.textContent=e.heading);const a=y(g.subheading);a&&(e!=null&&e.subheading)&&(a.textContent=e.subheading),A(t,t,o.activeYear)}function Q(e){const t=y(g.filters);if(!t)return;const r=Array.from(new Set(e.map(i=>L(i)).filter(i=>i&&i!=="undated"))).sort((i,s)=>Number(s)-Number(i)),a=e.some(i=>L(i)==="undated"),n=["all",...r,...a?["undated"]:[]];if(n.length<=1){t.innerHTML="";return}t.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${n.map(i=>{const s=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===o.activeYear?" is-active":""}" type="button" data-year="${i}">${s}</button>`}).join("")}
    </div>
  `,t.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-year")||"all";s!==o.activeYear&&(o.activeYear=s,t.querySelectorAll(".video-filter-chip").forEach(l=>l.classList.remove("is-active")),i.classList.add("is-active"),E())})})}function Z(){const e=y(g.search);e&&(e.value=o.searchQuery,e.addEventListener("input",t=>{o.searchQuery=t.target.value.trim(),E()}))}function E(){const e=y(g.groups);if(!e)return;const t=W(o.events,o.activeYear),r=X(t,o.searchQuery),a=!!o.searchQuery;if(!r.length){const l=o.activeYear==="all"?"the library":o.activeYear==="undated"?"undated rounds":o.activeYear,d=a?`No highlights match “${o.searchQuery}”${o.activeYear==="all"?"":` in ${l}`}.`:`No highlights recorded for ${l} yet.`;e.innerHTML=renderPlaceholder(d),b(a?d:""),A(o.events.length,0,o.activeYear);return}b("");const n=J(r);let i=0;const s=n.map(({year:l,items:d})=>{const u=l==="undated"?"Undated Rounds":l,h=ee(d).map(S=>K(S,`${l}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${l}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${u}</span>
            <span class="highlight-year-count">${U(d.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${h}
          </ul>
        </section>
      `}).join("");e.innerHTML=s,ge(e),A(o.events.length,r.length,o.activeYear)}function W(e,t){return t==="all"?[...e]:e.filter(r=>L(r)===t)}function X(e,t){if(!t)return[...e];const r=t.toLowerCase();return e.filter(a=>{const n=[a.title,a.summary,a.location,a.eventDate,a.endDate];return Array.isArray(a.days)&&a.days.forEach(s=>{n.push(s.label,s.score,s.notes)}),n.filter(Boolean).join(" ").toLowerCase().includes(r)})}function J(e){const t=new Map;return e.forEach(r=>{const a=L(r)||"undated";t.has(a)||t.set(a,[]),t.get(a).push(r)}),Array.from(t.entries()).sort(([r],[a])=>r==="undated"?1:a==="undated"?-1:Number(a)-Number(r)).map(([r,a])=>({year:r,items:a}))}function K(e,t){const r=R(e),a=!r&&e.eventDate?c(e.eventDate):"",n=Re(e.eventDate),i=e.summary?`<p class="highlight-summary">${c(e.summary)}</p>`:"",s=Array.isArray(e.days)?e.days:[],l=H(s,{variant:"list"}),d=(t||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-"),u=(e==null?void 0:e._id)||d,h=!!e.pinToTop,S=h?'<span class="highlight-badge">Featured</span>':"",B=`
    <button class="highlight-toggle" type="button" data-highlight-modal="${v(u)}">
      View Details
    </button>
  `,F=`<div class="highlight-row-actions">${S}${B}</div>`;return`
    <li class="highlight-list-item${h?" is-featured":""}">
      ${n?ye(n):""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${r?`<span class="highlight-date">${r}</span>`:""}
          ${!r&&a?`<span class="highlight-date">${a}</span>`:""}
        </div>
        <div class="highlight-row">
          <h3>${c(e.title||"Tournament highlight")}</h3>
          ${F}
        </div>
        ${l}
        ${i}
      </div>
    </li>
  `}function ee(e){if(!Array.isArray(e))return[];const t=[],r=[];return e.forEach(a=>{a!=null&&a.pinToTop?t.push(a):r.push(a)}),[...t,...r]}function H(e=[],{variant:t="default",showLabels:r}={}){if(!Array.isArray(e)||!e.length)return"";const a=e.length,n=typeof r=="boolean"?r:a>1;return`
    <div class="${["day-stats",t==="list"?"day-stats--list":"",a===1?"day-stats--single":"",`day-stats--cols-${Math.min(a,3)}`].filter(Boolean).join(" ")}">
      ${e.map((s,l)=>re(s,l,{showLabels:n,total:a})).join("")}
    </div>
  `}const N=120,te=57;function re(e,t,{showLabels:r,total:a}){if(!e)return"";const n=a===1,i=!n&&r?Y(e,t,a):null,s=ae(e);return s?`
    <div class="day-stat${n?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${c(i)}</span>`:""}
      ${s}
    </div>
  `:""}function ae(e){const t=ie(e);return t.length?`
    <div class="day-metrics">
      ${ne(t)}
    </div>
  `:""}function ne(e){return`
    <div class="day-metric-list">
      ${e.map(t=>{const r=t.secondary?`<span class="day-metric-secondary">${c(t.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${t.key}">
              <span class="day-metric-value">${c(t.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${c(t.label)}
                  ${r}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function ie(e){if(!e)return[];const t=[],r=$(e.score),a=$(e.yardage);t.push(D({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:le(r)})),t.push(D({key:"yards",label:"Yardage",display:typeof a=="number"?a.toLocaleString():"—",secondary:"",progress:ce(a,oe(e,a))}));const n=ue(e);return t.push(D({key:"rank",label:"Rank",display:n.display,secondary:n.secondary,progress:n.progress})),t.filter(Boolean)}function D({key:e,label:t,display:r,secondary:a,progress:n}){const i=r!=null&&r!==""?String(r):"—",s=a?String(a):"",l=typeof n=="number"&&!Number.isNaN(n)?n:0;return{key:e,label:t,display:i,secondary:s,progress:Math.max(0,l)}}function se(e=[]){if(!Array.isArray(e))return"";const t=e.map((r,a)=>{if(!(r!=null&&r.notes))return"";const n=Y(r,a,e.length)||"Notes";return`
        <div class="day-note">
          <strong>${c(n)}</strong>
          <p>${c(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return t?`<div class="day-notes">${t}</div>`:""}function Y(e,t,r){return e!=null&&e.label?e.label:r>1?`Day ${t+1}`:null}function $(e){return typeof e=="number"&&!Number.isNaN(e)?e:null}function oe(e,t){return typeof t=="number"&&t>0?Math.max(7200,Math.round(t/50)*50):7200}function le(e){if(typeof e!="number"||Number.isNaN(e))return 0;const t=N-te;return(N-e)/t}function ce(e,t){return typeof e!="number"||Number.isNaN(e)||!t||t<=0?0:e/t}function de(e,t){if(typeof e!="number"||Number.isNaN(e)||typeof t!="number"||t<=0)return 0;if(t===1)return 1;const r=(t-e)/(t-1);return Math.max(0,Math.min(r,1))}function ue(e){const t=$(e==null?void 0:e.rankingPosition),r=$(e==null?void 0:e.rankingOutOf),a=de(t,r);return typeof t=="number"?{display:String(t),secondary:typeof r=="number"?`of ${r}`:"",progress:a}:{display:"—",secondary:"",progress:0}}function he(e){return Array.isArray(e)?[...e].sort((t,r)=>T(r)-T(t)):[]}function T(e){if(!e)return 0;if(e.eventDate){const t=Date.parse(e.eventDate);if(!Number.isNaN(t))return t}if(e._createdAt){const t=Date.parse(e._createdAt);if(!Number.isNaN(t))return t}return 0}function ge(e){e&&e.querySelectorAll("[data-highlight-modal]").forEach(t=>{t.dataset.modalBound!=="true"&&(t.dataset.modalBound="true",t.addEventListener("click",()=>{const r=t.getAttribute("data-highlight-modal");x(r)}))})}function ye(e){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}let m=null;function fe(){if(m)return m;const e=document.createElement("div");return e.className="highlight-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-highlight-overlay-close]")&&M()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&M()}),document.body.appendChild(e),m=e,e}function x(e){const t=fe(),r=t.querySelector("[data-highlight-overlay-body]");if(!r)return;const a=I(e);if(!a)return;const n=De(a),i=Ae(a);r.innerHTML=ve(a,n,i),we(r),He(r),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function M(){if(!m)return;const e=m.querySelector("[data-highlight-overlay-body]");e&&(e.innerHTML=""),m.classList.remove("is-open"),m.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay"),q&&window.history.length>1&&history.back()}function me(){try{const t=new URL(window.location.href).searchParams.get("tournament");if(t)return decodeURIComponent(t)}catch{}return window.location.hash?decodeURIComponent(window.location.hash.replace(/^#/,"")):null}function pe(){const e=me();if(!e)return;const t=I(e);t&&x(t._id||t.title||e)}function I(e){return e?o.events.find(t=>(t==null?void 0:t._id)===e)||o.events.find(t=>t.title===e)||null:o.events[0]||null}function ve(e,t,r){const n=[R(e),e.location?c(e.location):null].filter(Boolean),i=n.length?`<div class="highlight-overlay-meta">
        ${n.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=H(e.days||[],{variant:"list"}),l=se(e.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${c(e.title||"Tournament highlight")}</h2>
        ${i}
        ${e.summary?`<p class="highlight-overlay-summary">${c(e.summary)}</p>`:""}
      </header>
      ${s?`<section class="highlight-overlay-section">${s}</section>`:""}
      ${l?`<section class="highlight-overlay-section">${l}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${be(t)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Le(r)}
      </section>
    </div>
  `}function be(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${e.map($e).join("")}
    </div>
  `}function $e(e){const t=Oe(e),r=e.thumbnailUrl||(t?`https://img.youtube.com/vi/${t}/hqdefault.jpg`:C),a=e.thumbnailAlt||e.title||"Video highlight",n=e.title||"Video highlight",s=!!t?"":' disabled aria-disabled="true"',l=Ne(e.eventDate),d=l?Te(l):"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${c(t)}" data-video-title="${c(n)}">
        ${d}
        <img src="${v(r)}" alt="${c(a)}" loading="lazy" />
        <button class="play-button" type="button"${s} aria-label="Play ${c(n)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${c(e.title||"Video highlight")}</h4>
        ${e.description?`<p>${c(e.description)}</p>`:""}
      </div>
    </article>
  `}function Le(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${e.map(Se).join("")}
    </div>
  `}function Se(e){var d,u,h;const t=((d=e==null?void 0:e.image)==null?void 0:d.url)||C,r=((u=e==null?void 0:e.image)==null?void 0:u.alt)||(e==null?void 0:e.title)||"Gallery photo",a=Me(e==null?void 0:e.shotDate),n=a?ke(a):"",i=(h=e==null?void 0:e.image)!=null&&h.url?{src:t,alt:r,title:(e==null?void 0:e.title)||"Gallery photo"}:null,s=i?`data-photo-preview="true" data-photo-src="${v(i.src)}" data-photo-alt="${v(i.alt)}" data-photo-title="${v(i.title)}"`:"",l=e!=null&&e.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${c(e.photographer)}</div>`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${s?` ${s}`:""}>
        ${n}
        <img src="${v(t)}" alt="${c(r)}" loading="lazy" />
      </div>
      <div class="gallery-card-body">
        <h4>${c((e==null?void 0:e.title)||"Gallery photo")}</h4>
        ${e!=null&&e.description?`<p class="gallery-card-description">${c(e.description)}</p>`:""}
        ${l?`<div class="gallery-card-footer">${l}</div>`:""}
      </div>
    </article>
  `}function De(e){return!e||!Array.isArray(o.videos)?[]:o.videos.filter(t=>O(t,e))}function Ae(e){return!e||!Array.isArray(o.photos)?[]:o.photos.filter(t=>O(t,e))}function O(e,t){const r=Ee(e);return r?!!(r.id&&(t!=null&&t._id)&&r.id===t._id||r.title&&(t!=null&&t.title)&&r.title===t.title):!1}function Ee(e){return e?e.tournament&&typeof e.tournament=="object"&&e.tournament.title?{id:e.tournament._id||e.tournament._ref||e.tournament.id||null,title:e.tournament.title}:typeof e.tournament=="string"&&e.tournament?{id:e.tournament,title:e.tournament}:null:null}function Ne(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}}function Te(e){return`
    <div class="video-date-overlay" aria-label="${e.month} ${e.day}, ${e.year}">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}function Me(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}}function ke(e){return`
    <div class="video-date-overlay" aria-label="${e.month} ${e.day}, ${e.year}">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}let p=null;function we(e=document){(e instanceof Element?e:document).querySelectorAll(".video-frame").forEach(r=>{if(r.dataset.playerReady==="true")return;const a=r.querySelector(".play-button"),n=r.dataset.videoId,i=r.dataset.videoTitle||"Samuel Masco golf video highlight";!a||!n||(a.addEventListener("click",()=>{Ce(n,i)}),r.dataset.playerReady="true")})}function Pe(){if(p)return p;const e=document.createElement("div");return e.className="video-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-overlay-close]")&&k()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&k()}),document.body.appendChild(e),p=e,e}function Ce(e,t){if(!e)return;const r=Pe(),a=r.querySelector(".video-overlay-frame");if(!a)return;a.innerHTML="";const n=document.createElement("iframe");n.src=`https://www.youtube.com/embed/${e}?autoplay=1&rel=0`,n.title=t,n.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,a.appendChild(n),r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function k(){if(!p)return;const e=p.querySelector(".video-overlay-frame");e&&(e.innerHTML=""),p.classList.remove("is-open"),p.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let f=null;function He(e=document){if(!e)return;(e instanceof Element?e:document).querySelectorAll("[data-photo-preview]").forEach(r=>{r.dataset.photoPreviewReady!=="true"&&(r.addEventListener("click",()=>{xe(r.getAttribute("data-photo-src"),r.getAttribute("data-photo-alt"),r.getAttribute("data-photo-title"))}),r.dataset.photoPreviewReady="true")})}function Ye(){if(f)return f;const e=document.createElement("div");return e.className="photo-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
  `,e.addEventListener("click",t=>{t.target.closest("[data-photo-overlay-close]")&&w()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&w()}),document.body.appendChild(e),f=e,e}function xe(e,t,r){if(!e)return;const a=Ye(),n=a.querySelector("img"),i=a.querySelector("figcaption");!n||!i||(n.src=e,n.alt=t||r||"Gallery photo",i.textContent=r||t||"",a.classList.add("is-open"),a.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function w(){if(!f)return;const e=f.querySelector("img"),t=f.querySelector("figcaption");e&&(e.src="",e.alt=""),t&&(t.textContent=""),f.classList.remove("is-open"),f.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function R(e){return e?Ie(e.eventDate,e.endDate,{month:"long"}):""}function Ie(e,t,{month:r="long"}={}){if(!e)return"";const a=new Date(e);if(Number.isNaN(a.getTime()))return c(e);if(!t)return a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const n=new Date(t);if(Number.isNaN(n.getTime()))return`${a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${c(t)}`;const i=a.getFullYear()===n.getFullYear(),s=i&&a.getMonth()===n.getMonth();if(i&&s)return`${a.toLocaleDateString("en-US",{month:r})} ${a.getDate()}–${n.getDate()}, ${a.getFullYear()}`;if(i){const u=a.toLocaleDateString("en-US",{month:r,day:"numeric"}),h=n.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${u} – ${h}, ${a.getFullYear()}`}const l=a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),d=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${l} – ${d}`}function Oe(e){return e?P(e.youtubeId)||P(e.youtubeUrl):""}function P(e){if(!e)return"";const t=e.trim();if(j.test(t))return t;try{const r=new URL(t);if(r.hostname.includes("youtu.be"))return r.pathname.replace("/","")||"";if(r.hostname.includes("youtube.com")){if(r.pathname.startsWith("/embed/"))return r.pathname.replace("/embed/","")||"";const a=r.searchParams.get("v");if(a)return a}}catch{return""}return""}function Re(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}}function A(e,t,r){const a=y(g.count);if(!a)return;const n=`${e} recorded ${U(e,"highlight")}`;if(r==="all"){a.textContent=n;return}const i=r==="undated"?"undated rounds":`${r}`,s=`${t} ${t===1?"entry":"entries"}`;a.textContent=`${n} · ${s} in ${i}`}function L(e){if(!(e!=null&&e.eventDate))return"undated";const t=new Date(e.eventDate);return Number.isNaN(t.getTime())?"undated":t.getFullYear().toString()}function b(e,t="info"){const r=y(g.message);if(r){if(!e){r.textContent="",r.classList.remove("error"),r.hidden=!0;return}r.hidden=!1,r.textContent=e,t==="error"?r.classList.add("error"):r.classList.remove("error")}}function U(e,t){return`${e} ${e===1?t:`${t}s`}`}function y(e){return e?document.querySelector(e):null}function c(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function v(e){return c(e).replace(/`/g,"&#96;")}function Ue(e){return e?e.split(/\s+/).filter(Boolean).slice(0,2).map(t=>t.charAt(0).toUpperCase()).join(""):""}
