import{f as Y}from"./sanityClient-DCfdcAoN.js";const d={heading:"[data-page-heading]",subheading:"[data-page-subheading]",brandText:"[data-brand-text]",brandMark:"[data-brand-mark]",count:"[data-highlight-count]",filters:"[data-year-filters]",groups:"[data-highlights-grid]",message:"[data-page-message]",search:"[data-highlight-search]"},o={events:[],activeYear:"all",searchQuery:""};document.addEventListener("DOMContentLoaded",()=>{C()});async function C(){p("Loading the tournament library...");const t=await Y();if(!t){p("Unable to load tournament highlights right now. Please try again soon.","error");return}o.events=tt(t.highlightEvents||[]),o.searchQuery="",H(t.site,"Tournament Highlights"),I(t.highlightsSection,o.events.length),B(o.events),w(),D(),p("")}function H(t,e){var a;t!=null&&t.siteTitle&&(document.title=`${t.siteTitle} | ${e}`);const r=g(d.brandText);r&&(t!=null&&t.siteTitle)&&(r.textContent=t.siteTitle);const n=g(d.brandMark);n&&((a=t==null?void 0:t.brandMarkImage)!=null&&a.url?(n.innerHTML=`<span class="brand-mark-image"><img src="${st(t.brandMarkImage.url)}" alt="${c(t.brandMarkImage.alt||t.siteTitle||"Site logo")}" loading="lazy" /></span>`,n.classList.add("has-image")):(n.textContent=(t==null?void 0:t.brandMarkInitials)||ot(t==null?void 0:t.siteTitle)||n.textContent||"SM",n.classList.remove("has-image")))}function I(t,e){const r=g(d.heading);r&&(t!=null&&t.heading)&&(r.textContent=t.heading);const n=g(d.subheading);n&&(t!=null&&t.subheading)&&(n.textContent=t.subheading),S(e,e,o.activeYear)}function B(t){const e=g(d.filters);if(!e)return;const r=Array.from(new Set(t.map(i=>b(i)).filter(i=>i&&i!=="undated"))).sort((i,s)=>Number(s)-Number(i)),n=t.some(i=>b(i)==="undated"),a=["all",...r,...n?["undated"]:[]];if(a.length<=1){e.innerHTML="";return}e.innerHTML=`
    <div class="filter-heading">Filter by season</div>
    <div class="video-filter-chips">
      ${a.map(i=>{const s=i==="all"?"All":i==="undated"?"Undated":i;return`<button class="video-filter-chip${i===o.activeYear?" is-active":""}" type="button" data-year="${i}">${s}</button>`}).join("")}
    </div>
  `,e.querySelectorAll("[data-year]").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-year")||"all";s!==o.activeYear&&(o.activeYear=s,e.querySelectorAll(".video-filter-chip").forEach(l=>l.classList.remove("is-active")),i.classList.add("is-active"),D())})})}function w(){const t=g(d.search);t&&(t.value=o.searchQuery,t.addEventListener("input",e=>{o.searchQuery=e.target.value.trim(),D()}))}function D(){const t=g(d.groups);if(!t)return;const e=R(o.events,o.activeYear),r=U(e,o.searchQuery),n=!!o.searchQuery;if(!r.length){const l=o.activeYear==="all"?"the library":o.activeYear==="undated"?"undated rounds":o.activeYear,u=n?`No highlights match “${o.searchQuery}”${o.activeYear==="all"?"":` in ${l}`}.`:`No highlights recorded for ${l} yet.`;t.innerHTML=renderPlaceholder(u),p(n?u:""),S(o.events.length,0,o.activeYear);return}p("");const a=F(r);let i=0;const s=a.map(({year:l,items:u})=>{const f=l==="undated"?"Undated Rounds":l,h=j(u).map(m=>P(m,`${l}-${i++}`)).join("");return`
        <section class="highlight-year-group" id="year-${l}">
          <div class="highlight-year-header">
            <span class="highlight-year-badge">${f}</span>
            <span class="highlight-year-count">${k(u.length,"highlight")}</span>
          </div>
          <ul class="highlight-list">
            ${h}
          </ul>
        </section>
      `}).join("");t.innerHTML=s,et(t),S(o.events.length,r.length,o.activeYear)}function R(t,e){return e==="all"?[...t]:t.filter(r=>b(r)===e)}function U(t,e){if(!e)return[...t];const r=e.toLowerCase();return t.filter(n=>{const a=[n.title,n.summary,n.location,n.eventDate,n.endDate];return Array.isArray(n.days)&&n.days.forEach(s=>{a.push(s.label,s.score,s.notes)}),a.filter(Boolean).join(" ").toLowerCase().includes(r)})}function F(t){const e=new Map;return t.forEach(r=>{const n=b(r)||"undated";e.has(n)||e.set(n,[]),e.get(n).push(r)}),Array.from(e.entries()).sort(([r],[n])=>r==="undated"?1:n==="undated"?-1:Number(n)-Number(r)).map(([r,n])=>({year:r,items:n}))}function P(t,e){const r=nt(t),n=!r&&t.eventDate?c(t.eventDate):"",a=it(t.eventDate),i=t.summary?`<p class="highlight-summary">${c(t.summary)}</p>`:"",s=Array.isArray(t.days)?t.days:[],l=Q(s,{variant:"list"}),u=V(s),h=`highlight-details-${(e||Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g,"-")}`,m=!!(i||u),N=!!t.pinToTop,L=N?'<span class="highlight-badge">Featured</span>':"",v=m?`<button class="highlight-toggle" type="button" data-highlight-toggle data-target="${h}" aria-expanded="false">View Details</button>`:"",x=m?`<div class="highlight-details" data-highlight-details="${h}" id="${h}" hidden>
        ${i}
        ${u}
      </div>`:"",E=L||v?`<div class="highlight-row-actions">${L}${v}</div>`:"";return`
    <li class="highlight-list-item${N?" is-featured":""}">
      ${a?rt(a):""}
      <div class="highlight-card-body">
        <div class="highlight-card-meta">
          ${r?`<span class="highlight-date">${r}</span>`:""}
          ${!r&&n?`<span class="highlight-date">${n}</span>`:""}
        </div>
        <div class="highlight-row">
          <h3>${c(t.title||"Tournament highlight")}</h3>
          ${E}
        </div>
        ${l}
        ${x}
      </div>
    </li>
  `}function j(t){if(!Array.isArray(t))return[];const e=[],r=[];return t.forEach(n=>{n!=null&&n.pinToTop?e.push(n):r.push(n)}),[...e,...r]}function Q(t=[],{variant:e="default",showLabels:r}={}){if(!Array.isArray(t)||!t.length)return"";const n=t.length,a=typeof r=="boolean"?r:n>1;return`
    <div class="${["day-stats",e==="list"?"day-stats--list":""].filter(Boolean).join(" ")}">
      ${t.map((s,l)=>q(s,l,{showLabels:a,total:n})).join("")}
    </div>
  `}const M=120,_=57;function q(t,e,{showLabels:r,total:n}){if(!t)return"";const a=r?A(t,e,n):null,i=z(t);return i?`
    <div class="day-stat">
      ${a?`<span class="day-stat-label">${c(a)}</span>`:""}
      ${i}
    </div>
  `:""}function z(t){const e=O(t);return e.length?`
    <div class="day-metrics">
      ${G(e)}
    </div>
  `:""}function G(t){return`
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
  `}function O(t){if(!t)return[];const e=[],r=y(t.score),n=y(t.yardage);e.push($({key:"score",label:"Score",display:typeof r=="number"?String(r):"—",progress:Z(r)})),e.push($({key:"yards",label:"Yardage",display:typeof n=="number"?n.toLocaleString():"—",secondary:"",progress:J(n,X(t,n))}));const a=W(t);return e.push($({key:"rank",label:"Rank",display:a.display,secondary:a.secondary,progress:a.progress})),e.filter(Boolean)}function $({key:t,label:e,display:r,secondary:n,progress:a}){const i=r!=null&&r!==""?String(r):"—",s=n?String(n):"",l=typeof a=="number"&&!Number.isNaN(a)?a:0;return{key:t,label:e,display:i,secondary:s,progress:Math.max(0,l)}}function V(t=[]){if(!Array.isArray(t))return"";const e=t.map((r,n)=>{if(!(r!=null&&r.notes))return"";const a=A(r,n,t.length)||"Notes";return`
        <div class="day-note">
          <strong>${c(a)}</strong>
          <p>${c(r.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return e?`<div class="day-notes">${e}</div>`:""}function A(t,e,r){return t!=null&&t.label?t.label:r>1?`Day ${e+1}`:null}function y(t){return typeof t=="number"&&!Number.isNaN(t)?t:null}function X(t,e){return typeof e=="number"&&e>0?Math.max(7200,Math.round(e/50)*50):7200}function Z(t){if(typeof t!="number"||Number.isNaN(t))return 0;const e=M-_;return(M-t)/e}function J(t,e){return typeof t!="number"||Number.isNaN(t)||!e||e<=0?0:t/e}function K(t,e){if(typeof t!="number"||Number.isNaN(t)||typeof e!="number"||e<=0)return 0;if(e===1)return 1;const r=(e-t)/(e-1);return Math.max(0,Math.min(r,1))}function W(t){const e=y(t==null?void 0:t.rankingPosition),r=y(t==null?void 0:t.rankingOutOf),n=K(e,r);return typeof e=="number"?{display:String(e),secondary:typeof r=="number"?`of ${r}`:"",progress:n}:{display:"—",secondary:"",progress:0}}function tt(t){return Array.isArray(t)?[...t].sort((e,r)=>T(r)-T(e)):[]}function T(t){if(!t)return 0;if(t.eventDate){const e=Date.parse(t.eventDate);if(!Number.isNaN(e))return e}if(t._createdAt){const e=Date.parse(t._createdAt);if(!Number.isNaN(e))return e}return 0}function et(t){t&&t.querySelectorAll("[data-highlight-toggle]").forEach(e=>{e.dataset.toggleBound!=="true"&&(e.dataset.toggleBound="true",e.addEventListener("click",()=>{const r=e.getAttribute("data-target"),n=e.closest(".highlight-list-item"),a=n==null?void 0:n.querySelector(`[data-highlight-details="${r}"]`);if(!a)return;const i=a.hasAttribute("hidden");i?a.removeAttribute("hidden"):a.setAttribute("hidden",""),e.setAttribute("aria-expanded",i?"true":"false"),e.classList.toggle("is-open",i),e.textContent=i?"Hide Details":"View Details"}))})}function rt(t){return`
    <div class="highlight-date-badge" aria-hidden="true">
      <span class="month">${t.month}</span>
      <strong>${t.day}</strong>
      <span class="year">${t.year}</span>
    </div>
  `}function nt(t){return t?at(t.eventDate,t.endDate,{month:"long"}):""}function at(t,e,{month:r="long"}={}){if(!t)return"";const n=new Date(t);if(Number.isNaN(n.getTime()))return c(t);if(!e)return n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});const a=new Date(e);if(Number.isNaN(a.getTime()))return`${n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"})} – ${c(e)}`;const i=n.getFullYear()===a.getFullYear(),s=i&&n.getMonth()===a.getMonth();if(i&&s)return`${n.toLocaleDateString("en-US",{month:r})} ${n.getDate()}–${a.getDate()}, ${n.getFullYear()}`;if(i){const f=n.toLocaleDateString("en-US",{month:r,day:"numeric"}),h=a.toLocaleDateString("en-US",{month:r,day:"numeric"});return`${f} – ${h}, ${n.getFullYear()}`}const l=n.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"}),u=a.toLocaleDateString("en-US",{month:r,day:"numeric",year:"numeric"});return`${l} – ${u}`}function it(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:{month:e.toLocaleString("en-US",{month:"short"}),day:e.getDate().toString().padStart(2,"0"),year:e.getFullYear()}}function S(t,e,r){const n=g(d.count);if(!n)return;const a=`${t} recorded ${k(t,"highlight")}`;if(r==="all"){n.textContent=a;return}const i=r==="undated"?"undated rounds":`${r}`,s=`${e} ${e===1?"entry":"entries"}`;n.textContent=`${a} · ${s} in ${i}`}function b(t){if(!(t!=null&&t.eventDate))return"undated";const e=new Date(t.eventDate);return Number.isNaN(e.getTime())?"undated":e.getFullYear().toString()}function p(t,e="info"){const r=g(d.message);if(r){if(!t){r.textContent="",r.classList.remove("error"),r.hidden=!0;return}r.hidden=!1,r.textContent=t,e==="error"?r.classList.add("error"):r.classList.remove("error")}}function k(t,e){return`${t} ${t===1?e:`${e}s`}`}function g(t){return t?document.querySelector(t):null}function c(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function st(t){return c(t).replace(/`/g,"&#96;")}function ot(t){return t?t.split(/\s+/).filter(Boolean).slice(0,2).map(e=>e.charAt(0).toUpperCase()).join(""):""}
