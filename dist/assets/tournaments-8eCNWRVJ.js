import{f as V}from"./sanityClient-CrohJ30J.js";const y={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"};let E=!1;const Y="images/samuel-placeholder.svg",z=/^[a-zA-Z0-9_-]{11}$/,o={events:[],activeYear:"all",searchQuery:"",videos:[],photos:[]};document.addEventListener("DOMContentLoaded",()=>{G()});async function G(){$("Loading the tournament library...");const e=await V();if(!e){$("Unable to load tournament highlights right now. Please try again soon.","error");return}o.events=ye(e.highlightEvents||[]),o.videos=Array.isArray(e.videos)?e.videos:[],o.photos=Array.isArray(e.galleryPhotos)?e.galleryPhotos:[],o.searchQuery="",Q(e.site,"Tournament Highlights"),W(e.highlightsSection,o.events.length),Z(o.events),X(),M(),$(""),be()}function Q(e,t){var n;e!=null&&e.siteTitle&&(document.title=`${e.siteTitle} | ${t}`);const r=f(y.brandText);r&&(e!=null&&e.siteTitle)&&(r.textContent=e.siteTitle);const a=f(y.brandMark);a&&((n=e==null?void 0:e.brandMarkImage)!=null&&n.url?(a.innerHTML=`<span class="brand-mark-image"><img src="${h(e.brandMarkImage.url)}" alt="${l(e.brandMarkImage.alt||e.siteTitle||"Site logo")}" loading="lazy" /></span>`,a.classList.add("has-image")):(a.textContent=(e==null?void 0:e.brandMarkInitials)||We(e==null?void 0:e.siteTitle)||a.textContent||"SM",a.classList.remove("has-image")))}function W(e,t){const r=f(y.heading);r&&(e!=null&&e.heading)&&(r.textContent=e.heading);const a=f(y.subheading);a&&(e!=null&&e.subheading)&&(a.textContent=e.subheading),w(t,t,o.activeYear)}function Z(e){const t=f(y.filters);if(!t)return;const r=Array.from(new Set(e.map(i=>D(i)).filter(i=>i&&i!=="undated"))).sort((i,s)=>Number(s)-Number(i)),a=e.some(i=>D(i)==="undated"),n=["all",...r,...a?["undated"]:[]];if(n.length<=1){t.innerHTML="";return}t.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${n.map(i=>{const s=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===o.activeYear?" is-active":""}" type="button" data-year="${i}">${s}</button>`}).join("")}
    </div>
  `,t.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-year")||"all";s!==o.activeYear&&(o.activeYear=s,t.querySelectorAll(".video-filter-chip").forEach(c=>c.classList.remove("is-active")),i.classList.add("is-active"),M())})})}function X(){const e=f(y.search);e&&(e.value=o.searchQuery,e.addEventListener("input",t=>{o.searchQuery=t.target.value.trim(),M()}))}function M(){const e=f(y.groups);if(!e)return;const t=J(o.events,o.activeYear),r=K(t,o.searchQuery),a=!!o.searchQuery;if(!r.length){const c=o.activeYear==="all"?"the library":o.activeYear==="undated"?"undated rounds":o.activeYear,d=a?`No highlights match “${o.searchQuery}”${o.activeYear==="all"?"":` in ${c}`}.`:`No highlights recorded for ${c} yet.`;e.innerHTML=renderPlaceholder(d),$(a?d:""),w(o.events.length,0,o.activeYear);return}$("");const n=ee(r);let i=0;const s=n.map(({year:c,items:d})=>{const u=c==="undated"?"Undated Rounds":c,g=re(d).map(m=>te(m,`${c}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${c}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${u}</span>
            <span class="highlight-year-count">${_(d.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${g}
          </ul>
        </section>
      `}).join("");e.innerHTML=s,fe(e),w(o.events.length,r.length,o.activeYear)}function J(e,t){return t==="all"?[...e]:e.filter(r=>D(r)===t)}function K(e,t){if(!t)return[...e];const r=t.toLowerCase();return e.filter(a=>{const n=[a.title,a.summary,a.location,a.eventDate,a.endDate];return Array.isArray(a.days)&&a.days.forEach(s=>{n.push(s.label,s.score,s.notes)}),n.filter(Boolean).join(" ").toLowerCase().includes(r)})}function ee(e){const t=new Map;return e.forEach(r=>{const a=D(r)||"undated";t.has(a)||t.set(a,[]),t.get(a).push(r)}),Array.from(t.entries()).sort(([r],[a])=>r==="undated"?1:a==="undated"?-1:Number(a)-Number(r)).map(([r,a])=>({year:r,items:a}))}function te(e,t){const r=j(e),a=!r&&e.eventDate?l(e.eventDate):"",n=Qe(e.eventDate),i=e.summary?`<p class="highlight-summary">${l(e.summary)}</p>`:"",s=Array.isArray(e.days)?e.days:[],c=I(s,{variant:"list"}),d=(t||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-"),u=(e==null?void 0:e._id)||d,g=!!e.pinToTop,m=g?'<span class="highlight-badge">Featured</span>':"",L=`
    <button class="highlight-toggle" type="button" data-highlight-modal="${h(u)}">
      View Details
    </button>
  `,S=`<div class="highlight-row-actions">${m}${L}</div>`;return`
    <li class="highlight-list-item${g?" is-featured":""}">
      ${n?me(n):""}
      <div class="highlight-card-body">
        <div class="highlight-row highlight-row--title">
          <h3>${l(e.title||"Tournament highlight")}</h3>
        </div>
        ${i}
        ${c}
        <div class="highlight-row highlight-row--stackable">
          ${S}
          <div class="highlight-card-meta">
            ${r?`<span class="highlight-date">${r}</span>`:""}
            ${!r&&a?`<span class="highlight-date">${a}</span>`:""}
          </div>
        </div>
      </div>
    </li>
  `}function re(e){if(!Array.isArray(e))return[];const t=[],r=[];return e.forEach(a=>{a!=null&&a.pinToTop?t.push(a):r.push(a)}),[...t,...r]}function I(e=[],{variant:t="default",showLabels:r}={}){if(!Array.isArray(e)||!e.length)return"";const a=e.length,n=typeof r=="boolean"?r:a>1;return`
    <div class="${["day-stats",t==="list"?"day-stats--list":"",a===1?"day-stats--single":"",`day-stats--cols-${Math.min(a,3)}`].filter(Boolean).join(" ")}">
      ${e.map((s,c)=>ne(s,c,{showLabels:n,total:a})).join("")}
    </div>
  `}const k=120,ae=57;function ne(e,t,{showLabels:r,total:a}){if(!e)return"";const n=a===1,i=!n&&r?U(e,t,a):null,s=ie(e);return s?`
    <div class="day-stat${n?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${l(i)}</span>`:""}
      ${s}
    </div>
  `:""}function ie(e){const t=oe(e);return t.length?`
    <div class="day-metrics">
      ${se(t)}
    </div>
  `:""}function se(e){return`
    <div class="day-metric-list">
      ${e.map(t=>{const r=t.secondary?`<span class="day-metric-secondary">${l(t.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${t.key}">
              <span class="day-metric-value">${l(t.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${l(t.label)}
                  ${r}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function oe(e){if(!e)return[];const t=[],r=A(e.score),a=A(e.yardage);t.push(T({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:de(r)})),t.push(T({key:"yards",label:"Yardage",display:typeof a=="number"?a.toLocaleString():"—",secondary:"",progress:ue(a,ce(e,a))}));const n=he(e);return t.push(T({key:"rank",label:"Rank",display:n.display,secondary:n.secondary,progress:n.progress})),t.filter(Boolean)}function T({key:e,label:t,display:r,secondary:a,progress:n}){const i=r!=null&&r!==""?String(r):"—",s=a?String(a):"",c=typeof n=="number"&&!Number.isNaN(n)?n:0;return{key:e,label:t,display:i,secondary:s,progress:Math.max(0,c)}}function le(e=[]){if(!Array.isArray(e))return"";const t=e.map((r,a)=>{if(!(r!=null&&r.notes))return"";const n=U(r,a,e.length)||"Notes";return`
        <div class="day-note">
          <strong>${l(n)}</strong>
          <p>${l(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return t?`<div class="day-notes">${t}</div>`:""}function U(e,t,r){return e!=null&&e.label?e.label:r>1?`Day ${t+1}`:null}function A(e){return typeof e=="number"&&!Number.isNaN(e)?e:null}function ce(e,t){return typeof t=="number"&&t>0?Math.max(7200,Math.round(t/50)*50):7200}function de(e){if(typeof e!="number"||Number.isNaN(e))return 0;const t=k-ae;return(k-e)/t}function ue(e,t){return typeof e!="number"||Number.isNaN(e)||!t||t<=0?0:e/t}function ge(e,t){if(typeof e!="number"||Number.isNaN(e)||typeof t!="number"||t<=0)return 0;if(t===1)return 1;const r=(t-e)/(t-1);return Math.max(0,Math.min(r,1))}function he(e){const t=A(e==null?void 0:e.rankingPosition),r=A(e==null?void 0:e.rankingOutOf),a=ge(t,r);return typeof t=="number"?{display:String(t),secondary:typeof r=="number"?`of ${r}`:"",progress:a}:{display:"—",secondary:"",progress:0}}function ye(e){return Array.isArray(e)?[...e].sort((t,r)=>P(r)-P(t)):[]}function P(e){if(!e)return 0;if(e.eventDate){const t=Date.parse(e.eventDate);if(!Number.isNaN(t))return t}if(e._createdAt){const t=Date.parse(e._createdAt);if(!Number.isNaN(t))return t}return 0}function fe(e){e&&e.querySelectorAll("[data-highlight-modal]").forEach(t=>{t.dataset.modalBound!=="true"&&(t.dataset.modalBound="true",t.addEventListener("click",()=>{E=!1;const r=t.getAttribute("data-highlight-modal");O(r)}))})}function me(e){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}let v=null;function pe(){if(v)return v;const e=document.createElement("div");return e.className="highlight-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-highlight-overlay-close]")&&C()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&C()}),document.body.appendChild(e),v=e,e}function O(e){const t=pe(),r=t.querySelector("[data-highlight-overlay-body]");if(!r)return;const a=B(e);if(!a)return;const n=ke(a),i=Pe(a);r.innerHTML=Te(a,n,i),Be(r),_e(r),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function C(){if(!v)return;const e=v.querySelector("[data-highlight-overlay-body]");e&&(e.innerHTML=""),v.classList.remove("is-open"),v.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay"),E&&window.history.length>1&&history.back()}function ve(e=null){try{const r=(e||new URL(window.location.href)).searchParams.get("tournament");if(r)return decodeURIComponent(r)}catch{}return window.location.hash?decodeURIComponent(window.location.hash.replace(/^#/,"")):null}function be(){const e=$e(),t=ve(e);if(!t)return;E=Le(e);const r=B(t);r&&O(r._id||r.title||t)}function $e(){try{return new URL(window.location.href)}catch{return null}}function Le(e=null){const t=Se(),r=Ae(e),a=t?["/video-highlights","/video-highlights.html","/gallery","/gallery.html"].some(i=>t.endsWith(i)):!1,n=r&&["video-highlights","videos","video","gallery"].some(i=>r.includes(i))&&(!document.referrer||a);return a||n}function Se(){try{const e=new URL(document.referrer);return e.host&&e.host!==window.location.host?"":De(e.pathname.toLowerCase())}catch{return""}}function Ae(e=null){if(!e)return"";const t=e.searchParams.get("origin")||e.searchParams.get("from");return t?t.trim().toLowerCase():""}function De(e){return e.replace(/\/+$/,"")||"/"}function B(e){return e?o.events.find(t=>(t==null?void 0:t._id)===e)||o.events.find(t=>t.title===e)||null:o.events[0]||null}function Te(e,t,r){const n=[j(e),e.location?l(e.location):null].filter(Boolean),i=n.length?`<div class="highlight-overlay-meta">
        ${n.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=I(e.days||[],{variant:"list"}),c=le(e.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${l(e.title||"Tournament highlight")}</h2>
        ${i}
        ${e.summary?`<p class="highlight-overlay-summary">${l(e.summary)}</p>`:""}
      </header>
      ${s?`<section class="highlight-overlay-section">${s}</section>`:""}
      ${c?`<section class="highlight-overlay-section">${c}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${we(t)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${Me(r)}
      </section>
    </div>
  `}function we(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${e.map(Ee).join("")}
    </div>
  `}function Ee(e){const t=Ge(e),r=e.thumbnailUrl||(t?`https://img.youtube.com/vi/${t}/hqdefault.jpg`:Y),a=e.thumbnailAlt||e.title||"Video highlight",n=e.title||"Video highlight",s=!!t?"":' disabled aria-disabled="true"',c=Ye(e.eventDate),d=c?Ie(c):"",u=xe(e),g=q(e.thumbnailHotspot),m=g?` style="object-position: ${h(g)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${l(t)}" data-video-title="${l(n)}">
        ${d}
        <img src="${h(r)}" alt="${l(a)}" loading="lazy"${m} />
        <button class="play-button" type="button"${s} aria-label="Play ${l(n)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${l(e.title||"Video highlight")}</h4>
        ${e.description?`<p>${l(e.description)}</p>`:""}
        ${u}
      </div>
    </article>
  `}function Me(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${e.map(Ne).join("")}
    </div>
  `}function Ne(e){var m,L,S,N;const t=((m=e==null?void 0:e.image)==null?void 0:m.url)||Y,r=((L=e==null?void 0:e.image)==null?void 0:L.alt)||(e==null?void 0:e.title)||"Gallery photo",a=Ue(e==null?void 0:e.shotDate),n=a?Oe(a):"",i=(S=e==null?void 0:e.image)!=null&&S.url?{src:t,alt:r,title:(e==null?void 0:e.title)||"Gallery photo"}:null,s=i?`data-photo-preview="true" data-photo-src="${h(i.src)}" data-photo-alt="${h(i.alt)}" data-photo-title="${h(i.title)}"`:"",c=e!=null&&e.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${l(e.photographer)}</div>`:"",d=Re(e==null?void 0:e.tags),u=q((N=e==null?void 0:e.image)==null?void 0:N.hotspot),g=u?` style="object-position: ${h(u)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${s?` ${s}`:""}>
        ${n}
        <img src="${h(t)}" alt="${l(r)}" loading="lazy"${g} />
      </div>
      <div class="gallery-card-body">
        <h4>${l((e==null?void 0:e.title)||"Gallery photo")}</h4>
        ${d}
        ${e!=null&&e.description?`<p class="gallery-card-description">${l(e.description)}</p>`:""}
        ${c?`<div class="gallery-card-footer">${c}</div>`:""}
      </div>
    </article>
  `}function ke(e){return!e||!Array.isArray(o.videos)?[]:o.videos.filter(t=>F(t,e))}function Pe(e){return!e||!Array.isArray(o.photos)?[]:o.photos.filter(t=>F(t,e))}function F(e,t){const r=Ce(e);return r?!!(r.id&&(t!=null&&t._id)&&r.id===t._id||r.title&&(t!=null&&t.title)&&r.title===t.title):!1}function Ce(e){return e?e.tournament&&typeof e.tournament=="object"&&e.tournament.title?{id:e.tournament._id||e.tournament._ref||e.tournament.id||null,title:e.tournament.title}:typeof e.tournament=="string"&&e.tournament?{id:e.tournament,title:e.tournament}:null:null}function He(e){return!e||!Array.isArray(e.tags)?[]:e.tags.map(t=>typeof t=="string"?t.trim():"").filter(Boolean)}function xe(e){const t=He(e);return t.length?`
    <div class="gallery-card-tags video-card-tags">
      ${t.map(r=>`<span class="gallery-tag">${l(r)}</span>`).join("")}
    </div>
  `:""}function Re(e){if(!Array.isArray(e))return"";const t=e.map(r=>typeof r=="string"?r.trim():"").filter(Boolean);return t.length?`
    <div class="gallery-card-tags">
      ${t.map(r=>`<span class="gallery-tag">${l(r)}</span>`).join("")}
    </div>
  `:""}function Ye(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}}function Ie(e){return`
    <div class="video-date-overlay" aria-label="${e.month} ${e.day}, ${e.year}">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}function Ue(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}}function Oe(e){return`
    <div class="video-date-overlay" aria-label="${e.month} ${e.day}, ${e.year}">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}let b=null;function Be(e=document){(e instanceof Element?e:document).querySelectorAll(".video-frame").forEach(r=>{if(r.dataset.playerReady==="true")return;const a=r.querySelector(".play-button"),n=r.dataset.videoId,i=r.dataset.videoTitle||"Samuel Masco golf video highlight";!a||!n||(a.addEventListener("click",()=>{je(n,i)}),r.dataset.playerReady="true")})}function Fe(){if(b)return b;const e=document.createElement("div");return e.className="video-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-overlay-close]")&&H()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&H()}),document.body.appendChild(e),b=e,e}function je(e,t){if(!e)return;const r=Fe(),a=r.querySelector(".video-overlay-frame");if(!a)return;a.innerHTML="";const n=document.createElement("iframe");n.src=`https://www.youtube.com/embed/${e}?autoplay=1&rel=0`,n.title=t,n.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,a.appendChild(n),r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function H(){if(!b)return;const e=b.querySelector(".video-overlay-frame");e&&(e.innerHTML=""),b.classList.remove("is-open"),b.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let p=null;function _e(e=document){if(!e)return;(e instanceof Element?e:document).querySelectorAll("[data-photo-preview]").forEach(r=>{r.dataset.photoPreviewReady!=="true"&&(r.addEventListener("click",()=>{Ve(r.getAttribute("data-photo-src"),r.getAttribute("data-photo-alt"),r.getAttribute("data-photo-title"))}),r.dataset.photoPreviewReady="true")})}function qe(){if(p)return p;const e=document.createElement("div");return e.className="photo-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
  `,e.addEventListener("click",t=>{t.target.closest("[data-photo-overlay-close]")&&x()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&x()}),document.body.appendChild(e),p=e,e}function Ve(e,t,r){if(!e)return;const a=qe(),n=a.querySelector("img"),i=a.querySelector("figcaption");!n||!i||(n.src=e,n.alt=t||r||"Gallery photo",i.textContent=r||t||"",a.classList.add("is-open"),a.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function x(){if(!p)return;const e=p.querySelector("img"),t=p.querySelector("figcaption");e&&(e.src="",e.alt=""),t&&(t.textContent=""),p.classList.remove("is-open"),p.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function j(e){return e?ze(e.eventDate,e.endDate,{month:"long"}):""}function ze(e,t,{month:r="long"}={}){if(!e)return"";const a=new Date(e);if(Number.isNaN(a.getTime()))return l(e);if(!t)return a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const n=new Date(t);if(Number.isNaN(n.getTime()))return`${a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${l(t)}`;const i=a.getFullYear()===n.getFullYear(),s=i&&a.getMonth()===n.getMonth();if(i&&s)return`${a.toLocaleDateString("en-US",{month:r})} ${a.getDate()}–${n.getDate()}, ${a.getFullYear()}`;if(i){const u=a.toLocaleDateString("en-US",{month:r,day:"numeric"}),g=n.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${u} – ${g}, ${a.getFullYear()}`}const c=a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),d=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${c} – ${d}`}function Ge(e){return e?R(e.youtubeId)||R(e.youtubeUrl):""}function R(e){if(!e)return"";const t=e.trim();if(z.test(t))return t;try{const r=new URL(t);if(r.hostname.includes("youtu.be"))return r.pathname.replace("/","")||"";if(r.hostname.includes("youtube.com")){if(r.pathname.startsWith("/embed/"))return r.pathname.replace("/embed/","")||"";const a=r.searchParams.get("v");if(a)return a}}catch{return""}return""}function Qe(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}}function w(e,t,r){const a=f(y.count);if(!a)return;const n=`${e} recorded ${_(e,"highlight")}`;if(r==="all"){a.textContent=n;return}const i=r==="undated"?"undated rounds":`${r}`,s=`${t} ${t===1?"entry":"entries"}`;a.textContent=`${n} · ${s} in ${i}`}function D(e){if(!(e!=null&&e.eventDate))return"undated";const t=new Date(e.eventDate);return Number.isNaN(t.getTime())?"undated":t.getFullYear().toString()}function $(e,t="info"){const r=f(y.message);if(r){if(!e){r.textContent="",r.classList.remove("error"),r.hidden=!0;return}r.hidden=!1,r.textContent=e,t==="error"?r.classList.add("error"):r.classList.remove("error")}}function _(e,t){return`${e} ${e===1?t:`${t}s`}`}function f(e){return e?document.querySelector(e):null}function l(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function h(e){return l(e).replace(/`/g,"&#96;")}function q(e){if(!e||typeof e.x!="number"||typeof e.y!="number")return"";const t=n=>Math.max(0,Math.min(1,n)),r=Math.round(t(e.x)*1e3)/10,a=Math.round(t(e.y)*1e3)/10;return`${r}% ${a}%`}function We(e){return e?e.split(/\s+/).filter(Boolean).slice(0,2).map(t=>t.charAt(0).toUpperCase()).join(""):""}
