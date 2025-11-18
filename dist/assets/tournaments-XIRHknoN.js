import{f as P}from"./sanityClient-kAGhWdKW.js";const d={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"},S="images/samuel-placeholder.svg",s={events:[],activeYear:"all",searchQuery:"",videos:[],photos:[]};document.addEventListener("DOMContentLoaded",()=>{w()});async function w(){m("Loading the tournament library...");const t=await P();if(!t){m("Unable to load tournament highlights right now. Please try again soon.","error");return}s.events=nt(t.highlightEvents||[]),s.videos=Array.isArray(t.videos)?t.videos:[],s.photos=Array.isArray(t.galleryPhotos)?t.galleryPhotos:[],s.searchQuery="",B(t.site,"Tournament Highlights"),U(t.highlightsSection,s.events.length),_(s.events),j(),N(),m("")}function B(t,e){var a;t!=null&&t.siteTitle&&(document.title=`${t.siteTitle} | ${e}`);const r=g(d.brandText);r&&(t!=null&&t.siteTitle)&&(r.textContent=t.siteTitle);const n=g(d.brandMark);n&&((a=t==null?void 0:t.brandMarkImage)!=null&&a.url?(n.innerHTML=`<span class="brand-mark-image"><img src="${p(t.brandMarkImage.url)}" alt="${c(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,n.classList.add("has-image")):(n.textContent=(t==null?void 0:t.brandMarkInitials)||Lt(t==null?void 0:t.siteTitle)||n.textContent||"SM",n.classList.remove("has-image")))}function U(t,e){const r=g(d.heading);r&&(t!=null&&t.heading)&&(r.textContent=t.heading);const n=g(d.subheading);n&&(t!=null&&t.subheading)&&(n.textContent=t.subheading),D(e,e,s.activeYear)}function _(t){const e=g(d.filters);if(!e)return;const r=Array.from(new Set(t.map(i=>$(i)).filter(i=>i&&i!=="undated"))).sort((i,l)=>Number(l)-Number(i)),n=t.some(i=>$(i)==="undated"),a=["all",...r,...n?["undated"]:[]];if(a.length<=1){e.innerHTML="";return}e.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${a.map(i=>{const l=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===s.activeYear?" is-active":""}" type="button" data-year="${i}">${l}</button>`}).join("")}
    </div>
  `,e.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const l=i.getAttribute("data-year")||"all";l!==s.activeYear&&(s.activeYear=l,e.querySelectorAll(".video-filter-chip").forEach(o=>o.classList.remove("is-active")),i.classList.add("is-active"),N())})})}function j(){const t=g(d.search);t&&(t.value=s.searchQuery,t.addEventListener("input",e=>{s.searchQuery=e.target.value.trim(),N()}))}function N(){const t=g(d.groups);if(!t)return;const e=F(s.events,s.activeYear),r=R(e,s.searchQuery),n=!!s.searchQuery;if(!r.length){const o=s.activeYear==="all"?"the library":s.activeYear==="undated"?"undated rounds":s.activeYear,u=n?`No highlights match “${s.searchQuery}”${s.activeYear==="all"?"":` in ${o}`}.`:`No highlights recorded for ${o} yet.`;t.innerHTML=renderPlaceholder(u),m(n?u:""),D(s.events.length,0,s.activeYear);return}m("");const a=O(r);let i=0;const l=a.map(({year:o,items:u})=>{const h=o==="undated"?"Undated Rounds":o,y=q(u).map(v=>V(v,`${o}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${o}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${h}</span>
            <span class="highlight-year-count">${C(u.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${y}
          </ul>
        </section>
      `}).join("");t.innerHTML=l,at(t),D(s.events.length,r.length,s.activeYear)}function F(t,e){return e==="all"?[...t]:t.filter(r=>$(r)===e)}function R(t,e){if(!e)return[...t];const r=e.toLowerCase();return t.filter(n=>{const a=[n.title,n.summary,n.location,n.eventDate,n.endDate];return Array.isArray(n.days)&&n.days.forEach(l=>{a.push(l.label,l.score,l.notes)}),a.filter(Boolean).join(" ").toLowerCase().includes(r)})}function O(t){const e=new Map;return t.forEach(r=>{const n=$(r)||"undated";e.has(n)||e.set(n,[]),e.get(n).push(r)}),Array.from(e.entries()).sort(([r],[n])=>r==="undated"?1:n==="undated"?-1:Number(n)-Number(r)).map(([r,n])=>({year:r,items:n}))}function V(t,e){const r=x(t),n=!r&&t.eventDate?c(t.eventDate):"",a=vt(t.eventDate),i=t.summary?`<p class="highlight-summary">${c(t.summary)}</p>`:"",l=Array.isArray(t.days)?t.days:[],o=k(l,{variant:"list"}),u=(e||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-"),h=(t==null?void 0:t._id)||u,y=!!t.pinToTop,v=y?'<span class="highlight-badge">Featured</span>':"",Y=`
    <button class="highlight-toggle" type="button" data-highlight-modal="${p(h)}">
      View Details
    </button>
  `,I=`<div class="highlight-row-actions">${v}${Y}</div>`;return`
    <li class="highlight-list-item${y?" is-featured":""}">
      ${a?it(a):""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${r?`<span class="highlight-date">${r}</span>`:""}
          ${!r&&n?`<span class="highlight-date">${n}</span>`:""}
        </div>
        <div class="highlight-row">
          <h3>${c(t.title||"Tournament highlight")}</h3>
          ${I}
        </div>
        ${o}
        ${i}
      </div>
    </li>
  `}function q(t){if(!Array.isArray(t))return[];const e=[],r=[];return t.forEach(n=>{n!=null&&n.pinToTop?e.push(n):r.push(n)}),[...e,...r]}function k(t=[],{variant:e="default",showLabels:r}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,a=typeof r=="boolean"?r:n>1;return`
    <div class="${["day-stats",e==="list"?"day-stats--list":"",n===1?"day-stats--single":"",`day-stats--cols-${Math.min(n,3)}`].filter(Boolean).join(" ")}">
      ${t.map((l,o)=>Q(l,o,{showLabels:a,total:n})).join("")}
    </div>
  `}const A=120,z=57;function Q(t,e,{showLabels:r,total:n}){if(!t)return"";const a=n===1,i=!a&&r?E(t,e,n):null,l=G(t);return l?`
    <div class="day-stat${a?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${c(i)}</span>`:""}
      ${l}
    </div>
  `:""}function G(t){const e=X(t);return e.length?`
    <div class="day-metrics">
      ${W(e)}
    </div>
  `:""}function W(t){return`
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
  `}function X(t){if(!t)return[];const e=[],r=b(t.score),n=b(t.yardage);e.push(L({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:K(r)})),e.push(L({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:tt(n,J(t,n))}));const a=rt(t);return e.push(L({key:"rank",label:"Rank",display:a.display,secondary:a.secondary,progress:a.progress})),e.filter(Boolean)}function L({key:t,label:e,display:r,secondary:n,progress:a}){const i=r!=null&&r!==""?String(r):"—",l=n?String(n):"",o=typeof a=="number"&&!Number.isNaN(a)?a:0;return{key:t,label:e,display:i,secondary:l,progress:Math.max(0,o)}}function Z(t=[]){if(!Array.isArray(t))return"";const e=t.map((r,n)=>{if(!(r!=null&&r.notes))return"";const a=E(r,n,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${c(a)}</strong>
          <p>${c(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function E(t,e,r){return t!=null&&t.label?t.label:r>1?`Day ${e+1}`:null}function b(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function J(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function K(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=A-z;return(A-t)/e}function tt(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function et(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const r=(e-t)/(e-1);return Math.max(0,Math.min(r,1))}function rt(t){const e=b(t==null?void 0:t.rankingPosition),r=b(t==null?void 0:t.rankingOutOf),n=et(e,r);return typeof e=="number"?{display:String(e),secondary:typeof r=="number"?`of ${r}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function nt(t){return Array.isArray(t)?[...t].sort((e,r)=>M(r)-M(e)):[]}function M(t){if(!t)return 0;if(t.eventDate){const e=Date.parse(t.eventDate);if(!Number.isNaN(e))return e}if(t._createdAt){const e=Date.parse(t._createdAt);if(!Number.isNaN(e))return e}return 0}function at(t){t&&t.querySelectorAll("[data-highlight-modal]").forEach(e=>{e.dataset.modalBound!=="true"&&(e.dataset.modalBound="true",e.addEventListener("click",()=>{const r=e.getAttribute("data-highlight-modal");lt(r)}))})}function it(t){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}let f=null;function st(){if(f)return f;const t=document.createElement("div");return t.className="highlight-overlay",t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,t.addEventListener("click",e=>{e.target.closest("[data-highlight-overlay-close]")&&T()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&t.classList.contains("is-open")&&T()}),document.body.appendChild(t),f=t,t}function lt(t){const e=st(),r=e.querySelector("[data-highlight-overlay-body]");if(!r)return;const n=ot(t);if(!n)return;const a=ft(n),i=yt(n);r.innerHTML=ct(n,a,i),e.classList.add("is-open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function T(){if(!f)return;const t=f.querySelector("[data-highlight-overlay-body]");t&&(t.innerHTML=""),f.classList.remove("is-open"),f.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function ot(t){return t?s.events.find(e=>(e==null?void 0:e._id)===t)||s.events.find(e=>e.title===t)||null:s.events[0]||null}function ct(t,e,r){const a=[x(t),t.location?c(t.location):null].filter(Boolean),i=a.length?`<div class="highlight-overlay-meta">
        ${a.map(u=>`<span>${u}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",l=k(t.days||[],{variant:"list"}),o=Z(t.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${c(t.title||"Tournament highlight")}</h2>
        ${i}
        ${t.summary?`<p class="highlight-overlay-summary">${c(t.summary)}</p>`:""}
      </header>
      ${l?`<section class="highlight-overlay-section">${l}</section>`:""}
      ${o?`<section class="highlight-overlay-section">${o}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${ut(e)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${gt(r)}
      </section>
    </div>
  `}function ut(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${t.map(dt).join("")}
    </div>
  `}function dt(t){const e=pt(t),r=t.thumbnailAlt||t.title||"Video highlight",n=bt(t);return`
    <article class="overlay-media-card">
      <div class="overlay-media-thumb">
        <img src="${p(e)}" alt="${c(r)}" loading="lazy" />
      </div>
      <div class="overlay-media-copy">
        <h4>${c(t.title||"Video highlight")}</h4>
        ${t.description?`<p>${c(t.description)}</p>`:""}
        ${n?`<a class="btn subtle" href="${p(n)}" target="_blank" rel="noopener">Watch</a>`:""}
      </div>
    </article>
  `}function gt(t){return!Array.isArray(t)||!t.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${t.map(ht).join("")}
    </div>
  `}function ht(t){var a,i;const e=((a=t==null?void 0:t.image)==null?void 0:a.url)||S,r=((i=t==null?void 0:t.image)==null?void 0:i.alt)||(t==null?void 0:t.title)||"Gallery photo",n=[t==null?void 0:t.title,t==null?void 0:t.description,t!=null&&t.photographer?`Photo: ${t.photographer}`:""].map(l=>l?c(l):"").filter(Boolean);return`
    <figure class="overlay-photo-card">
      <div class="overlay-media-thumb">
        <img src="${p(e)}" alt="${c(r)}" loading="lazy" />
      </div>
      ${n.length?`<figcaption>${n.join(" • ")}</figcaption>`:""}
    </figure>
  `}function ft(t){return!t||!Array.isArray(s.videos)?[]:s.videos.filter(e=>H(e,t))}function yt(t){return!t||!Array.isArray(s.photos)?[]:s.photos.filter(e=>H(e,t))}function H(t,e){const r=mt(t);return r?!!(r.id&&(e!=null&&e._id)&&r.id===e._id||r.title&&(e!=null&&e.title)&&r.title===e.title):!1}function mt(t){return t?t.tournament&&typeof t.tournament=="object"&&t.tournament.title?{id:t.tournament._id||t.tournament._ref||t.tournament.id||null,title:t.tournament.title}:typeof t.tournament=="string"&&t.tournament?{id:t.tournament,title:t.tournament}:null:null}function pt(t){return t?t.thumbnailUrl?t.thumbnailUrl:t.youtubeId?`https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`:S:S}function bt(t){return t?t.youtubeUrl?t.youtubeUrl:t.youtubeId?`https://youtu.be/${t.youtubeId}`:"":""}function x(t){return t?$t(t.eventDate,t.endDate,{month:"long"}):""}function $t(t,e,{month:r="long"}={}){if(!t)return"";const n=new Date(t);if(Number.isNaN(n.getTime()))return c(t);if(!e)return n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const a=new Date(e);if(Number.isNaN(a.getTime()))return`${n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${c(e)}`;const i=n.getFullYear()===a.getFullYear(),l=i&&n.getMonth()===a.getMonth();if(i&&l)return`${n.toLocaleDateString("en-US",{month:r})} ${n.getDate()}–${a.getDate()}, ${n.getFullYear()}`;if(i){const h=n.toLocaleDateString("en-US",{month:r,day:"numeric"}),y=a.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${h} – ${y}, ${n.getFullYear()}`}const o=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),u=a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${o} – ${u}`}function vt(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function D(t,e,r){const n=g(d.count);if(!n)return;const a=`${t} recorded ${C(t,"highlight")}`;if(r==="all"){n.textContent=a;return}const i=r==="undated"?"undated rounds":`${r}`,l=`${e} ${e===1?"entry":"entries"}`;n.textContent=`${a} · ${l} in ${i}`}function $(t){if(!(t!=null&&t.eventDate))return"undated";const e=new Date(t.eventDate);return Number.isNaN(e.getTime())?"undated":e.getFullYear().toString()}function m(t,e="info"){const r=g(d.message);if(r){if(!t){r.textContent="",r.classList.remove("error"),r.hidden=!0;return}r.hidden=!1,r.textContent=t,e==="error"?r.classList.add("error"):r.classList.remove("error")}}function C(t,e){return`${t} ${t===1?e:`${e}s`}`}function g(t){return t?document.querySelector(t):null}function c(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function p(t){return c(t).replace(/`/g,"&#96;")}function Lt(t){return t?t.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(""):""}
