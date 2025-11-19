import{f as U}from"./sanityClient-DuEQPEgi.js";const h={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"},C="images/samuel-placeholder.svg",_=/^[a-zA-Z0-9_-]{11}$/,o={events:[],activeYear:"all",searchQuery:"",videos:[],photos:[]};document.addEventListener("DOMContentLoaded",()=>{q()});async function q(){v("Loading the tournament library...");const t=await U();if(!t){v("Unable to load tournament highlights right now. Please try again soon.","error");return}o.events=ct(t.highlightEvents||[]),o.videos=Array.isArray(t.videos)?t.videos:[],o.photos=Array.isArray(t.galleryPhotos)?t.galleryPhotos:[],o.searchQuery="",F(t.site,"Tournament Highlights"),j(t.highlightsSection,o.events.length),V(o.events),z(),D(),v("")}function F(t,e){var n;t!=null&&t.siteTitle&&(document.title=`${t.siteTitle} | ${e}`);const r=g(h.brandText);r&&(t!=null&&t.siteTitle)&&(r.textContent=t.siteTitle);const a=g(h.brandMark);a&&((n=t==null?void 0:t.brandMarkImage)!=null&&n.url?(a.innerHTML=`<span class="brand-mark-image"><img src="${p(t.brandMarkImage.url)}" alt="${c(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,a.classList.add("has-image")):(a.textContent=(t==null?void 0:t.brandMarkInitials)||Ct(t==null?void 0:t.siteTitle)||a.textContent||"SM",a.classList.remove("has-image")))}function j(t,e){const r=g(h.heading);r&&(t!=null&&t.heading)&&(r.textContent=t.heading);const a=g(h.subheading);a&&(t!=null&&t.subheading)&&(a.textContent=t.subheading),E(e,e,o.activeYear)}function V(t){const e=g(h.filters);if(!e)return;const r=Array.from(new Set(t.map(i=>L(i)).filter(i=>i&&i!=="undated"))).sort((i,s)=>Number(s)-Number(i)),a=t.some(i=>L(i)==="undated"),n=["all",...r,...a?["undated"]:[]];if(n.length<=1){e.innerHTML="";return}e.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${n.map(i=>{const s=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===o.activeYear?" is-active":""}" type="button" data-year="${i}">${s}</button>`}).join("")}
    </div>
  `,e.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-year")||"all";s!==o.activeYear&&(o.activeYear=s,e.querySelectorAll(".video-filter-chip").forEach(l=>l.classList.remove("is-active")),i.classList.add("is-active"),D())})})}function z(){const t=g(h.search);t&&(t.value=o.searchQuery,t.addEventListener("input",e=>{o.searchQuery=e.target.value.trim(),D()}))}function D(){const t=g(h.groups);if(!t)return;const e=G(o.events,o.activeYear),r=Q(e,o.searchQuery),a=!!o.searchQuery;if(!r.length){const l=o.activeYear==="all"?"the library":o.activeYear==="undated"?"undated rounds":o.activeYear,d=a?`No highlights match “${o.searchQuery}”${o.activeYear==="all"?"":` in ${l}`}.`:`No highlights recorded for ${l} yet.`;t.innerHTML=renderPlaceholder(d),v(a?d:""),E(o.events.length,0,o.activeYear);return}v("");const n=Z(r);let i=0;const s=n.map(({year:l,items:d})=>{const u=l==="undated"?"Undated Rounds":l,b=X(d).map(S=>W(S,`${l}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${l}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${u}</span>
            <span class="highlight-year-count">${B(d.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${b}
          </ul>
        </section>
      `}).join("");t.innerHTML=s,dt(t),E(o.events.length,r.length,o.activeYear)}function G(t,e){return e==="all"?[...t]:t.filter(r=>L(r)===e)}function Q(t,e){if(!e)return[...t];const r=e.toLowerCase();return t.filter(a=>{const n=[a.title,a.summary,a.location,a.eventDate,a.endDate];return Array.isArray(a.days)&&a.days.forEach(s=>{n.push(s.label,s.score,s.notes)}),n.filter(Boolean).join(" ").toLowerCase().includes(r)})}function Z(t){const e=new Map;return t.forEach(r=>{const a=L(r)||"undated";e.has(a)||e.set(a,[]),e.get(a).push(r)}),Array.from(e.entries()).sort(([r],[a])=>r==="undated"?1:a==="undated"?-1:Number(a)-Number(r)).map(([r,a])=>({year:r,items:a}))}function W(t,e){const r=I(t),a=!r&&t.eventDate?c(t.eventDate):"",n=Pt(t.eventDate),i=t.summary?`<p class="highlight-summary">${c(t.summary)}</p>`:"",s=Array.isArray(t.days)?t.days:[],l=H(s,{variant:"list"}),d=(e||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-"),u=(t==null?void 0:t._id)||d,b=!!t.pinToTop,S=b?'<span class="highlight-badge">Featured</span>':"",O=`
    <button class="highlight-toggle" type="button" data-highlight-modal="${p(u)}">
      View Details
    </button>
  `,R=`<div class="highlight-row-actions">${S}${O}</div>`;return`
    <li class="highlight-list-item${b?" is-featured":""}">
      ${n?ut(n):""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${r?`<span class="highlight-date">${r}</span>`:""}
          ${!r&&a?`<span class="highlight-date">${a}</span>`:""}
        </div>
        <div class="highlight-row">
          <h3>${c(t.title||"Tournament highlight")}</h3>
          ${R}
        </div>
        ${l}
        ${i}
      </div>
    </li>
  `}function X(t){if(!Array.isArray(t))return[];const e=[],r=[];return t.forEach(a=>{a!=null&&a.pinToTop?e.push(a):r.push(a)}),[...e,...r]}function H(t=[],{variant:e="default",showLabels:r}={}){if(!Array.isArray(t)||!t.length)return"";const a=t.length,n=typeof r=="boolean"?r:a>1;return`
    <div class="${["day-stats",e==="list"?"day-stats--list":"",a===1?"day-stats--single":"",`day-stats--cols-${Math.min(a,3)}`].filter(Boolean).join(" ")}">
      ${t.map((s,l)=>K(s,l,{showLabels:n,total:a})).join("")}
    </div>
  `}const N=120,J=57;function K(t,e,{showLabels:r,total:a}){if(!t)return"";const n=a===1,i=!n&&r?x(t,e,a):null,s=tt(t);return s?`
    <div class="day-stat${n?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${c(i)}</span>`:""}
      ${s}
    </div>
  `:""}function tt(t){const e=rt(t);return e.length?`
    <div class="day-metrics">
      ${et(e)}
    </div>
  `:""}function et(t){return`
    <div class="day-metric-list">
      ${t.map(e=>{const r=e.secondary?`<span class="day-metric-secondary">${c(e.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${e.key}">
              <span class="day-metric-value">${c(e.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${c(e.label)}
                  ${r}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function rt(t){if(!t)return[];const e=[],r=$(t.score),a=$(t.yardage);e.push(A({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:it(r)})),e.push(A({key:"yards",label:"Yardage",display:typeof a=="number"?a.toLocaleString():"—",secondary:"",progress:st(a,nt(t,a))}));const n=lt(t);return e.push(A({key:"rank",label:"Rank",display:n.display,secondary:n.secondary,progress:n.progress})),e.filter(Boolean)}function A({key:t,label:e,display:r,secondary:a,progress:n}){const i=r!=null&&r!==""?String(r):"—",s=a?String(a):"",l=typeof n=="number"&&!Number.isNaN(n)?n:0;return{key:t,label:e,display:i,secondary:s,progress:Math.max(0,l)}}function at(t=[]){if(!Array.isArray(t))return"";const e=t.map((r,a)=>{if(!(r!=null&&r.notes))return"";const n=x(r,a,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${c(n)}</strong>
          <p>${c(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function x(t,e,r){return t!=null&&t.label?t.label:r>1?`Day ${e+1}`:null}function $(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function nt(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function it(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=N-J;return(N-t)/e}function st(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function ot(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const r=(e-t)/(e-1);return Math.max(0,Math.min(r,1))}function lt(t){const e=$(t==null?void 0:t.rankingPosition),r=$(t==null?void 0:t.rankingOutOf),a=ot(e,r);return typeof e=="number"?{display:String(e),secondary:typeof r=="number"?`of ${r}`:"",progress:a}:{display:"—",secondary:"",progress:0}}function ct(t){return Array.isArray(t)?[...t].sort((e,r)=>M(r)-M(e)):[]}function M(t){if(!t)return 0;if(t.eventDate){const e=Date.parse(t.eventDate);if(!Number.isNaN(e))return e}if(t._createdAt){const e=Date.parse(t._createdAt);if(!Number.isNaN(e))return e}return 0}function dt(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",()=>{const r=e.getAttribute("data-highlight-modal");gt(r)}))})}function ut(t){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}let y=null;function ht(){if(y)return y;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&T()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&T()}),document.body.appendChild(t),y=t,t}function gt(t){const e=ht(),r=e.querySelector("[data-highlight-overlay-body]");if(!r)return;const a=ft(t);if(!a)return;const n=$t(a),i=Lt(a);r.innerHTML=yt(a,n,i),At(r),Nt(r),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function T(){if(!y)return;const t=y.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),y.classList.remove("is-open"),y.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function ft(t){return t?o.events.find(e=>(e==null?void 0:e._id)===t)||o.events.find(e=>e.title===t)||null:o.events[0]||null}function yt(t,e,r){const n=[I(t),t.location?c(t.location):null].filter(Boolean),i=n.length?`<div class="highlight-overlay-meta">
        ${n.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",s=H(t.days||[],{variant:"list"}),l=at(t.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${c(t.title||"Tournament highlight")}</h2>
        ${i}
        ${t.summary?`<p class="highlight-overlay-summary">${c(t.summary)}</p>`:""}
      </header>
      ${s?`<section class="highlight-overlay-section">${s}</section>`:""}
      ${l?`<section class="highlight-overlay-section">${l}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${mt(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${bt(r)}
      </section>
    </div>
  `}function mt(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(pt).join("")}
    </div>
  `}function pt(t){const e=wt(t),r=t.thumbnailUrl||(e?`https://img.youtube.com/vi/${e}/hqdefault.jpg`:C),a=t.thumbnailAlt||t.title||"Video highlight",n=t.ctaLabel||"Play",i=t.title||"Video highlight",l=!!e?"":' disabled aria-disabled="true"';return`
    <article class="overlay-media-card overlay-video-card">
      <div class="video-frame" data-video-id="${c(e)}" data-video-title="${c(i)}">
        <img src="${p(r)}" alt="${c(a)}" loading="lazy" />
        <button class="play-button" type="button"${l} aria-label="Play ${c(i)}">
          <span class="play-icon" aria-hidden="true"></span>
          <span>${c(n)}</span>
        </button>
      </div>
      <div class="overlay-media-copy">
        <h4>${c(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${c(t.description)}</p>`:""}
      </div>
    </article>
  `}function bt(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(vt).join("")}
    </div>
  `}function vt(t){var s,l,d;const e=((s=t==null?void 0:t.image)==null?void 0:s.url)||C,r=((l=t==null?void 0:t.image)==null?void 0:l.alt)||(t==null?void 0:t.title)||"Gallery photo",a=[t==null?void 0:t.title,t==null?void 0:t.description,t!=null&&t.photographer?`Photo: ${t.photographer}`:""].map(u=>u?c(u):"").filter(Boolean),n=(d=t==null?void 0:t.image)!=null&&d.url?{src:e,alt:r,title:(t==null?void 0:t.title)||"Gallery photo"}:null,i=n?`data-photo-preview="true" data-photo-src="${p(n.src)}" data-photo-alt="${p(n.alt)}" data-photo-title="${p(n.title)}"`:"";return`
    <figure class="overlay-photo-card">
      <div class="overlay-media-thumb"${i?` ${i}`:""}>
        <img src="${p(e)}" alt="${c(r)}" loading="lazy" />
      </div>
      ${a.length?`<figcaption>${a.join(" • ")}</figcaption>`:""}
    </figure>
  `}function $t(t){return!t||!Array.isArray(o.videos)?[]:o.videos.filter(e=>Y(e,t))}function Lt(t){return!t||!Array.isArray(o.photos)?[]:o.photos.filter(e=>Y(e,t))}function Y(t,e){const r=St(t);return r?!!(r.id&&(e!=null&&e._id)&&r.id===e._id||r.title&&(e!=null&&e.title)&&r.title===e.title):!1}function St(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}let m=null;function At(t=document){(t instanceof Element?t:document).querySelectorAll(".video-frame").forEach(r=>{if(r.dataset.playerReady==="true")return;const a=r.querySelector(".play-button"),n=r.dataset.videoId,i=r.dataset.videoTitle||"Samuel Masco golf video highlight";!a||!n||(a.addEventListener("click",()=>{Dt(n,i)}),r.dataset.playerReady="true")})}function Et(){if(m)return m;const t=document.createElement("div");return t.className="video-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-overlay-close]")&&k()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&k()}),document.body.appendChild(t),m=t,t}function Dt(t,e){if(!t)return;const r=Et(),a=r.querySelector(".video-overlay-frame");if(!a)return;a.innerHTML="";const n=document.createElement("iframe");n.src=`https://www.youtube.com/embed/${t}?autoplay=1&rel=0`,n.title=e,n.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,a.appendChild(n),r.classList.add("is-open"),r.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function k(){if(!m)return;const t=m.querySelector(".video-overlay-frame");t&&(t.innerHTML=""),m.classList.remove("is-open"),m.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let f=null;function Nt(t=document){if(!t)return;(t instanceof Element?t:document).querySelectorAll("[data-photo-preview]").forEach(r=>{r.dataset.photoPreviewReady!=="true"&&(r.addEventListener("click",()=>{Tt(r.getAttribute("data-photo-src"),r.getAttribute("data-photo-alt"),r.getAttribute("data-photo-title"))}),r.dataset.photoPreviewReady="true")})}function Mt(){if(f)return f;const t=document.createElement("div");return t.className="photo-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
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
  `,t.addEventListener("click",e=>{e.target.closest("[data-photo-overlay-close]")&&w()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&w()}),document.body.appendChild(t),f=t,t}function Tt(t,e,r){if(!t)return;const a=Mt(),n=a.querySelector("img"),i=a.querySelector("figcaption");!n||!i||(n.src=t,n.alt=e||r||"Gallery photo",i.textContent=r||e||"",a.classList.add("is-open"),a.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function w(){if(!f)return;const t=f.querySelector("img"),e=f.querySelector("figcaption");t&&(t.src="",t.alt=""),e&&(e.textContent=""),f.classList.remove("is-open"),f.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function I(t){return t?kt(t.eventDate,t.endDate,{month:"long"}):""}function kt(t,e,{month:r="long"}={}){if(!t)return"";const a=new Date(t);if(Number.isNaN(a.getTime()))return c(t);if(!e)return a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const n=new Date(e);if(Number.isNaN(n.getTime()))return`${a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${c(e)}`;const i=a.getFullYear()===n.getFullYear(),s=i&&a.getMonth()===n.getMonth();if(i&&s)return`${a.toLocaleDateString("en-US",{month:r})} ${a.getDate()}–${n.getDate()}, ${a.getFullYear()}`;if(i){const u=a.toLocaleDateString("en-US",{month:r,day:"numeric"}),b=n.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${u} – ${b}, ${a.getFullYear()}`}const l=a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),d=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${l} – ${d}`}function wt(t){return t?P(t.youtubeId)||P(t.youtubeUrl):""}function P(t){if(!t)return"";const e=t.trim();if(_.test(e))return e;try{const r=new URL(e);if(r.hostname.includes("youtu.be"))return r.pathname.replace("/","")||"";if(r.hostname.includes("youtube.com")){if(r.pathname.startsWith("/embed/"))return r.pathname.replace("/embed/","")||"";const a=r.searchParams.get("v");if(a)return a}}catch{return""}return""}function Pt(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function E(t,e,r){const a=g(h.count);if(!a)return;const n=`${t} recorded ${B(t,"highlight")}`;if(r==="all"){a.textContent=n;return}const i=r==="undated"?"undated rounds":`${r}`,s=`${e} ${e===1?"entry":"entries"}`;a.textContent=`${n} · ${s} in ${i}`}function L(t){if(!(t!=null&&t.eventDate))return"undated";const e=new Date(t.eventDate);return Number.isNaN(e.getTime())?"undated":e.getFullYear().toString()}function v(t,e="info"){const r=g(h.message);if(r){if(!t){r.textContent="",r.classList.remove("error"),r.hidden=!0;return}r.hidden=!1,r.textContent=t,e==="error"?r.classList.add("error"):r.classList.remove("error")}}function B(t,e){return`${t} ${t===1?e:`${e}s`}`}function g(t){return t?document.querySelector(t):null}function c(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function p(t){return c(t).replace(/`/g,"&#96;")}function Ct(t){return t?t.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(""):""}
