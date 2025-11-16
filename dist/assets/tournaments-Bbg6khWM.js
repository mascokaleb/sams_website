import{f as H}from"./sanityClient-DzwMick1.js";const d={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"},n={events:[],activeYear:"all",searchQuery:""};document.addEventListener("DOMContentLoaded",()=>{C()});async function C(){f("Loading the tournament library...");const t=await H();if(!t){f("Unable to load tournament highlights right now. Please try again soon.","error");return}n.events=j(t.highlightEvents||[]),n.searchQuery="",M(t.site,"Tournament Highlights"),Y(t.highlightsSection,n.events.length),x(n.events),k(),y(),f("")}function M(t,e){var s;t!=null&&t.siteTitle&&(document.title=`${t.siteTitle} | ${e}`);const a=c(d.brandText);a&&(t!=null&&t.siteTitle)&&(a.textContent=t.siteTitle);const r=c(d.brandMark);r&&((s=t==null?void 0:t.brandMarkImage)!=null&&s.url?(r.innerHTML=`<span class="brand-mark-image"><img src="${z(t.brandMarkImage.url)}" alt="${h(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,r.classList.add("has-image")):(r.textContent=(t==null?void 0:t.brandMarkInitials)||R(t==null?void 0:t.siteTitle)||r.textContent||"SM",r.classList.remove("has-image")))}function Y(t,e){const a=c(d.heading);a&&(t!=null&&t.heading)&&(a.textContent=t.heading);const r=c(d.subheading);r&&(t!=null&&t.subheading)&&(r.textContent=t.subheading),$(e,e,n.activeYear)}function x(t){const e=c(d.filters);if(!e)return;const a=Array.from(new Set(t.map(i=>b(i)).filter(i=>i&&i!=="undated"))).sort((i,l)=>Number(l)-Number(i)),r=t.some(i=>b(i)==="undated"),s=["all",...a,...r?["undated"]:[]];if(s.length<=1){e.innerHTML="";return}e.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${s.map(i=>{const l=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===n.activeYear?" is-active":""}" type="button" data-year="${i}">${l}</button>`}).join("")}
    </div>
  `,e.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const l=i.getAttribute("data-year")||"all";l!==n.activeYear&&(n.activeYear=l,e.querySelectorAll(".video-filter-chip").forEach(o=>o.classList.remove("is-active")),i.classList.add("is-active"),y())})})}function k(){const t=c(d.search);t&&(t.value=n.searchQuery,t.addEventListener("input",e=>{n.searchQuery=e.target.value.trim(),y()}))}function y(){const t=c(d.groups);if(!t)return;const e=v(n.events,n.activeYear),a=w(e,n.searchQuery),r=!!n.searchQuery;if(!a.length){const o=n.activeYear==="all"?"the library":n.activeYear==="undated"?"undated rounds":n.activeYear,g=r?`No highlights match “${n.searchQuery}”${n.activeYear==="all"?"":` in ${o}`}.`:`No highlights recorded for ${o} yet.`;t.innerHTML=renderPlaceholder(g),f(r?g:""),$(n.events.length,0,n.activeYear);return}f("");const s=I(a);let i=0;const l=s.map(({year:o,items:g})=>{const u=o==="undated"?"Undated Rounds":o,p=F(g).map(m=>B(m,`${o}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${o}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${u}</span>
            <span class="highlight-year-count">${S(g.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${p}
          </ul>
        </section>
      `}).join("");t.innerHTML=l,Q(t),$(n.events.length,a.length,n.activeYear)}function v(t,e){return e==="all"?[...t]:t.filter(a=>b(a)===e)}function w(t,e){if(!e)return[...t];const a=e.toLowerCase();return t.filter(r=>{const s=[r.title,r.summary,r.location,r.dateLabel];return Array.isArray(r.results)&&s.push(r.results.map(l=>l.description||"").join(" ")),s.filter(Boolean).join(" ").toLowerCase().includes(a)})}function I(t){const e=new Map;return t.forEach(a=>{const r=b(a)||"undated";e.has(r)||e.set(r,[]),e.get(r).push(a)}),Array.from(e.entries()).sort(([a],[r])=>a==="undated"?1:r==="undated"?-1:Number(r)-Number(a)).map(([a,r])=>({year:a,items:r}))}function B(t,e){const a=P(t),r=!a&&t.dateLabel?h(t.dateLabel):"",s=a&&t.dateLabel?h(t.dateLabel):"",i=q(t.eventDate),l=t.summary?`<p class="highlight-summary">${h(t.summary)}</p>`:"",o=Array.isArray(t.results)&&t.results.length?`<ul class="highlight-results">${t.results.map(N=>`<li>${h(N.description||"")}</li>`).join("")}</ul>`:"",u=`highlight-details-${(e||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-")}`,p=!!(l||o),m=!!t.pinToTop,L=m?'<span class="highlight-badge">Featured</span>':"",T=p?`<button class="highlight-toggle" type="button" data-highlight-toggle data-target="${u}" aria-expanded="false">View Details</button>`:"",D=p?`<div class="highlight-details" data-highlight-details="${u}" id="${u}" hidden>
        ${l}
        ${o}
      </div>`:"",E=L||T?`<div class="highlight-row-actions">${L}${T}</div>`:"";return`
    <li class="highlight-list-item${m?" is-featured":""}">
      ${i?U(i):""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${a?`<span class="highlight-date">${a}</span>`:""}
          ${!a&&r?`<span class="highlight-date">${r}</span>`:""}
          ${s?`<span class="highlight-chip">${s}</span>`:""}
        </div>
        <div class="highlight-row">
          <h3>${h(t.title||"Tournament highlight")}</h3>
          ${E}
        </div>
        ${D}
      </div>
    </li>
  `}function F(t){if(!Array.isArray(t))return[];const e=[],a=[];return t.forEach(r=>{r!=null&&r.pinToTop?e.push(r):a.push(r)}),[...e,...a]}function j(t){return Array.isArray(t)?[...t].sort((e,a)=>A(a)-A(e)):[]}function A(t){if(!t)return 0;if(t.eventDate){const e=Date.parse(t.eventDate);if(!Number.isNaN(e))return e}if(t._createdAt){const e=Date.parse(t._createdAt);if(!Number.isNaN(e))return e}return 0}function Q(t){t&&t.querySelectorAll("[data-highlight-toggle]").forEach(e=>{e.dataset.toggleBound!=="true"&&(e.dataset.toggleBound="true",e.addEventListener("click",()=>{const a=e.getAttribute("data-target"),r=e.closest(".highlight-list-item"),s=r==null?void 0:r.querySelector(`[data-highlight-details="${a}"]`);if(!s)return;const i=s.hasAttribute("hidden");i?s.removeAttribute("hidden"):s.setAttribute("hidden",""),e.setAttribute("aria-expanded",i?"true":"false"),e.classList.toggle("is-open",i),e.textContent=i?"Hide Details":"View Details"}))})}function U(t){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function P(t){if(!(t!=null&&t.eventDate))return"";const e=new Date(t.eventDate);return Number.isNaN(e.getTime())?"":e.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}function q(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function $(t,e,a){const r=c(d.count);if(!r)return;const s=`${t} recorded ${S(t,"highlight")}`;if(a==="all"){r.textContent=s;return}const i=a==="undated"?"undated rounds":`${a}`,l=`${e} ${e===1?"entry":"entries"}`;r.textContent=`${s} · ${l} in ${i}`}function b(t){if(!(t!=null&&t.eventDate))return"undated";const e=new Date(t.eventDate);return Number.isNaN(e.getTime())?"undated":e.getFullYear().toString()}function f(t,e="info"){const a=c(d.message);if(a){if(!t){a.textContent="",a.classList.remove("error"),a.hidden=!0;return}a.hidden=!1,a.textContent=t,e==="error"?a.classList.add("error"):a.classList.remove("error")}}function S(t,e){return`${t} ${t===1?e:`${e}s`}`}function c(t){return t?document.querySelector(t):null}function h(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function z(t){return h(t).replace(/`/g,"&#96;")}function R(t){return t?t.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(""):""}
