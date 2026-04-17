import{f as Oe,p as I}from"./sanityClient-CY0C8Q-b.js";function R(e){return e._type==="span"&&"text"in e&&typeof e.text=="string"&&(typeof e.marks>"u"||Array.isArray(e.marks)&&e.marks.every(t=>typeof t=="string"))}function be(e){return typeof e._type=="string"&&e._type[0]!=="@"&&(!("markDefs"in e)||!e.markDefs||Array.isArray(e.markDefs)&&e.markDefs.every(t=>typeof t._key=="string"))&&"children"in e&&Array.isArray(e.children)&&e.children.every(t=>typeof t=="object"&&"_type"in t)}function $e(e){return be(e)&&"listItem"in e&&typeof e.listItem=="string"&&(typeof e.level>"u"||typeof e.level=="number")}function ve(e){return e._type==="@list"}function ke(e){return e._type==="@span"}function Le(e){return e._type==="@text"}const oe=["strong","em","code","underline","strike-through"];function je(e,t,n){if(!R(e)||!e.marks)return[];if(!e.marks.length)return[];const a=e.marks.slice(),r={};return a.forEach(i=>{r[i]=1;for(let o=t+1;o<n.length;o++){const l=n[o];if(l&&R(l)&&Array.isArray(l.marks)&&l.marks.indexOf(i)!==-1)r[i]++;else break}}),a.sort((i,o)=>Ue(r,i,o))}function Ue(e,t,n){const a=e[t],r=e[n];if(a!==r)return r-a;const i=oe.indexOf(t),o=oe.indexOf(n);return i!==o?i-o:t.localeCompare(n)}function qe(e){var o;const{children:t}=e,n=e.markDefs??[];if(!t||!t.length)return[];const a=t.map(je),r={_type:"@span",children:[],markType:"<unknown>"};let i=[r];for(let l=0;l<t.length;l++){const d=t[l];if(!d)continue;const c=a[l]||[];let u=1;if(i.length>1)for(u;u<i.length;u++){const g=((o=i[u])==null?void 0:o.markKey)||"",f=c.indexOf(g);if(f===-1)break;c.splice(f,1)}i=i.slice(0,u);let h=i[i.length-1];if(h){for(const g of c){const f=n==null?void 0:n.find(k=>k._key===g),y=f?f._type:g,m={_type:"@span",_key:d._key,children:[],markDef:f,markType:y,markKey:g};h.children.push(m),i.push(m),h=m}if(R(d)){const g=d.text.split(`
`);for(let f=g.length;f-- >1;)g.splice(f,0,`
`);h.children=h.children.concat(g.map(f=>({_type:"@text",text:f})))}else h.children=h.children.concat(d)}}return r.children}function Re(e,t){const n=[];let a;for(let r=0;r<e.length;r++){const i=e[r];if(i){if(!$e(i)){n.push(i),a=void 0;continue}if(!a){a=U(i,r,t),n.push(a);continue}if(Ye(i,a)){a.children.push(i);continue}if((i.level||1)>a.level){const o=U(i,r,t);{const l=a.children[a.children.length-1],d={...l,children:[...l.children,o]};a.children[a.children.length-1]=d}a=o;continue}if((i.level||1)<a.level){const o=n[n.length-1],l=o&&te(o,i);if(l){a=l,a.children.push(i);continue}a=U(i,r,t),n.push(a);continue}if(i.listItem!==a.listItem){const o=n[n.length-1],l=o&&te(o,{level:i.level||1});if(l&&l.listItem===i.listItem){a=l,a.children.push(i);continue}else{a=U(i,r,t),n.push(a);continue}}console.warn("Unknown state encountered for block",i),n.push(i)}}return n}function Ye(e,t){return(e.level||1)===t.level&&e.listItem===t.listItem}function U(e,t,n){return{_type:"@list",_key:`${e._key||`${t}`}-parent`,mode:n,level:e.level||1,listItem:e.listItem,children:[e]}}function te(e,t){const n=t.level||1,a=t.listItem||"normal",r=typeof t.listItem=="string";if(ve(e)&&(e.level||1)===n&&r&&(e.listItem||"normal")===a)return e;if(!("children"in e))return;const i=e.children[e.children.length-1];return i&&!R(i)?te(i,t):void 0}function Te(e){let t="";return e.children.forEach(n=>{Le(n)?t+=n.text:ke(n)&&(t+=Te(n))}),t}const Ge=["http","https","mailto","tel"],Fe={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Se(e){return Ve(e.replace(/[&<>"']/g,t=>`&${Fe[t]};`))}function Ve(e){return e.replace(/ {2,}/g,t=>`${"&nbsp;".repeat(t.length-1)} `)}function We(e){const t=(e||"").trim(),n=t.charAt(0);if(n==="#"||n==="/")return!0;const a=t.indexOf(":");if(a===-1)return!0;const r=t.slice(0,a).toLowerCase();if(Ge.indexOf(r)!==-1)return!0;const i=t.indexOf("?");if(i!==-1&&a>i)return!0;const o=t.indexOf("#");return o!==-1&&a>o}const ze={number:({children:e})=>`<ol>${e}</ol>`,bullet:({children:e})=>`<ul>${e}</ul>`},Ke=({children:e})=>`<li>${e}</li>`,Ze=({children:e,value:t})=>{const n=(t==null?void 0:t.href)||"";return We(n)?`<a href="${Se(n)}">${e}</a>`:e},Qe={em:({children:e})=>`<em>${e}</em>`,strong:({children:e})=>`<strong>${e}</strong>`,code:({children:e})=>`<code>${e}</code>`,underline:({children:e})=>`<span style="text-decoration:underline">${e}</span>`,"strike-through":({children:e})=>`<del>${e}</del>`,link:Ze},O=(e,t)=>`Unknown ${e}, specify a component for it in the \`components.${t}\` option`,Ae=e=>O(`block type "${e}"`,"types"),Xe=e=>O(`mark type "${e}"`,"marks"),Je=e=>O(`block style "${e}"`,"block"),et=e=>O(`list style "${e}"`,"list"),tt=e=>O(`list item style "${e}"`,"listItem");function nt(e){console.warn(e)}const at=({value:e,isInline:t})=>{const n=Ae(e._type);return t?`<span style="display:none">${n}</span>`:`<div style="display:none">${n}</div>`},rt=({markType:e,children:t})=>`<span class="unknown__pt__mark__${e}">${t}</span>`,it=({children:e})=>`<p>${e}</p>`,st=({children:e})=>`<ul>${e}</ul>`,lt=({children:e})=>`<li>${e}</li>`,ot=()=>"<br/>",ct={normal:({children:e})=>`<p>${e}</p>`,blockquote:({children:e})=>`<blockquote>${e}</blockquote>`,h1:({children:e})=>`<h1>${e}</h1>`,h2:({children:e})=>`<h2>${e}</h2>`,h3:({children:e})=>`<h3>${e}</h3>`,h4:({children:e})=>`<h4>${e}</h4>`,h5:({children:e})=>`<h5>${e}</h5>`,h6:({children:e})=>`<h6>${e}</h6>`},ce={types:{},block:ct,marks:Qe,list:ze,listItem:Ke,hardBreak:ot,escapeHTML:Se,unknownType:at,unknownMark:rt,unknownList:st,unknownListItem:lt,unknownBlockStyle:it};function dt(e,t){const{block:n,list:a,listItem:r,marks:i,types:o,...l}=t;return{...e,block:N(e,t,"block"),list:N(e,t,"list"),listItem:N(e,t,"listItem"),marks:N(e,t,"marks"),types:N(e,t,"types"),...l}}function N(e,t,n){const a=t[n],r=e[n];return typeof a=="function"||a&&typeof r=="function"?a:a?{...r,...a}:r}function ut(e,t={}){const{components:n,onMissingComponent:a=nt}=t,r=a||gt,i=Array.isArray(e)?e:[e],o=Re(i,"html"),l=n?dt(ce,n):ce,d=ft(l,r);return o.map((c,u)=>d({node:c,index:u,isInline:!1,renderNode:d})).join("")}const ft=(e,t)=>{function n(c){const{node:u,index:h,isInline:g}=c;return ve(u)?r(u,h):$e(u)?a(u,h):ke(u)?i(u):be(u)?o(u,h,g):Le(u)?l(u):d(u,h,g)}function a(c,u){const h=de({node:c,index:u,isInline:!1,renderNode:n}),g=e.listItem,f=(typeof g=="function"?g:g[c.listItem])||e.unknownListItem;if(f===e.unknownListItem){const m=c.listItem||"bullet";t(tt(m),{type:m,nodeType:"listItemStyle"})}let y=h.children;if(c.style&&c.style!=="normal"){const{listItem:m,...k}=c;y=n({node:k,index:u,isInline:!1})}return f({value:c,index:u,isInline:!1,renderNode:n,children:y})}function r(c,u){const h=c.children.map((y,m)=>n({node:y._key?y:{...y,_key:`li-${u}-${m}`},index:m,isInline:!1})),g=e.list,f=(typeof g=="function"?g:g[c.listItem])||e.unknownList;if(f===e.unknownList){const y=c.listItem||"bullet";t(et(y),{nodeType:"listStyle",type:y})}return f({value:c,index:u,isInline:!1,renderNode:n,children:h.join("")})}function i(c){const{markDef:u,markType:h,markKey:g}=c,f=e.marks[h]||e.unknownMark,y=c.children.map((m,k)=>n({node:m,index:k,isInline:!0}));return f===e.unknownMark&&t(Xe(h),{nodeType:"mark",type:h}),f({text:Te(c),value:u,markType:h,markKey:g,renderNode:n,children:y.join("")})}function o(c,u,h){const{_key:g,...f}=de({node:c,index:u,isInline:h,renderNode:n}),y=f.node.style||"normal",m=(typeof e.block=="function"?e.block:e.block[y])||e.unknownBlockStyle;return m===e.unknownBlockStyle&&t(Je(y),{nodeType:"blockStyle",type:y}),m({...f,value:f.node,renderNode:n})}function l(c){if(c.text===`
`){const u=e.hardBreak;return u?u():`
`}return e.escapeHTML(c.text)}function d(c,u,h){const g=e.types[c._type];return g||t(Ae(c._type),{nodeType:"block",type:c._type}),(g||e.unknownType)({value:c,isInline:h,index:u,renderNode:n})}return n};function de(e){const{node:t,index:n,isInline:a,renderNode:r}=e,i=qe(t).map((o,l)=>r({node:o,isInline:!0,index:l,renderNode:r}));return{_key:t._key||`block-${n}`,children:i.join(""),index:n,isInline:a,node:t}}function gt(){}const F="images/samuel-placeholder.svg",we=F,q=/^[a-zA-Z0-9_-]{11}$/,$={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',accoladesMarquee:'[data-template="accolades-marquee"]',workInterstitial:'[data-template="work-interstitial"]',workMindset:'[data-template="work-mindset"]',coachSnapshot:'[data-template="coach-snapshot"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',upcomingHeading:'[data-template="upcoming-heading"]',upcomingGrid:'[data-template="upcoming-grid"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},E={meta:null,allItems:[],items:[],videos:[],photos:[]},_={meta:null,items:[],totalCount:0},Y={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{mt(),An();const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await ht(),window.location.hash&&setTimeout(()=>Be(window.location.hash),100),xn(e),Bn(e),Dn()});function mt(){const e=document.querySelector(".nav-toggle"),t=document.querySelector(".nav-links");!e||!t||(e.addEventListener("click",()=>{const n=e.getAttribute("aria-expanded")==="true"?"false":"true";e.setAttribute("aria-expanded",n),t.classList.toggle("is-open")}),t.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{e.setAttribute("aria-expanded","false"),t.classList.remove("is-open")})}))}async function ht(){Z(!0);const e=await Oe();if(!e)return Sn("Unable to load the latest content. Please try again shortly."),Z(!1),null;pt(e.site),yt(e.hero,e.site),bt(e.resume,e.hero),St(e.coachSnapshot,{hero:e.hero,about:e.about}),wt(e.about,{academics:e.academics}),kt(e.about),Mt(e.resume),_t(e.academics);const t=Q(e.highlightEvents||[]),{past:n,future:a}=Hn(t);E.meta=e.highlightsSection,E.allItems=n,E.items=n.filter(X),Ot();const r=Array.isArray(e.upcomingTournaments)?e.upcomingTournaments:[],i=Pn(r,a);Et(e.upcomingTournamentsSection,i);const o=Q(e.videos||[],"eventDate");E.videos=o,_.meta=e.videosSection,_.items=o.filter(X),_.totalCount=o.length,jt();const l=Q(e.galleryPhotos||[],"shotDate");return E.photos=l,Y.meta=e.gallerySection,Y.items=l.filter(X),Ut(),Rt(e.dualSport),Yt(e.contact),Gt(e.footer,e.contact),Z(!1),ie(),e}function pt(e){var a;if(!e)return;if(e.siteTitle){document.title=e.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=e.siteTitle)}const t=document.querySelector('meta[name="description"]');t&&e.seoDescription&&t.setAttribute("content",e.seoDescription);const n=document.querySelector(".brand-mark");if(n)if((a=e.brandMarkImage)!=null&&a.url){const r=P(e.brandMarkImage.focalPoint||e.brandMarkImage.hotspot),i=r?` style="object-position: ${p(r)};"`:"";n.innerHTML=`<span class="brand-mark-image"><img src="${p(e.brandMarkImage.url)}" alt="${s(e.brandMarkImage.alt||e.siteTitle||"Site logo")}" loading="lazy"${i} /></span>`,n.classList.add("has-image")}else{const r=e.brandMarkInitials||wn(e.siteTitle)||n.textContent||"SM";n.textContent=r,n.classList.remove("has-image")}}function yt(e,t){var r,i,o,l;const n=v($.heroCopy),a=v($.heroPhoto);if(!e){n&&(n.innerHTML=w("Hero content coming soon."));return}if(n){const d=e.tagline?`<p class="hero-tag">${s(e.tagline)}</p>`:"",c=e.bio?`<p>${s(e.bio)}</p>`:"",u=[he(e.primaryCta,"primary","View Highlights","#highlights"),he(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join(""),h=Array.isArray(e.metrics)?e.metrics.filter(f=>f&&(f.label||f.value)).map(f=>{const y=f.value||"",m=String(y).trim().match(/^(-?\d+(?:\.\d+)?)(.*)$/);return`
              <li class="hero-snapshot-item">
                <span class="hero-snapshot-value"${m?` data-counter="${p(m[1])}" data-counter-suffix="${p(m[2]||"")}"`:""}>${s(y)}</span>
                <span class="hero-snapshot-label">${s(f.label||"")}</span>
              </li>
            `}).join(""):"",g=h?`<ul class="hero-snapshot" aria-label="Player snapshot">${h}</ul>`:"";n.innerHTML=`
      ${d}
      <h1>${s(e.headline||(t==null?void 0:t.siteTitle)||"")}</h1>
      ${g}
      ${c}
      <div class="hero-actions">
        ${u||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(a){const d=((r=e.headshot)==null?void 0:r.url)||F,c=((i=e.headshot)==null?void 0:i.alt)||"Portrait of Samuel Masco",u=P(((o=e.headshot)==null?void 0:o.focalPoint)||((l=e.headshot)==null?void 0:l.hotspot)),h=u?` style="object-position: ${p(u)};"`:"";a.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${d}" alt="${s(c)}" loading="lazy"${h} />
      </div>
    `}}function bt(e,t){const n=v($.accoladesMarquee);if(!n)return;let a=[];const i=(Array.isArray(t==null?void 0:t.accolades)?t.accolades:[]).map(d=>typeof d=="string"?d.trim():"").filter(Boolean);if(i.length?a=i:a=(Array.isArray(e==null?void 0:e.experienceList)?e.experienceList:[]).map($t).filter(Boolean),!a.length&&(t!=null&&t.tagline)&&a.push(t.tagline),!a.length){n.hidden=!0,n.innerHTML="";return}n.hidden=!1;const l=a.concat(a).map(d=>`
        <li class="accolades-marquee-item">
          <span class="accolades-marquee-text">${s(d)}</span>
          <span class="accolades-marquee-sep" aria-hidden="true">★</span>
        </li>
      `).join("");n.innerHTML=`
    <div class="accolades-marquee-track" aria-hidden="false">
      <ul class="accolades-marquee-list" role="list">
        ${l}
      </ul>
    </div>
  `}function $t(e){if(typeof e!="string")return null;const t=e.trim();if(!t)return null;const n=t.match(/"([^"]{3,80})"/);if(n)return n[1].trim();const a=/(\d+(?:st|nd|rd|th)\s+Place[^.,;()]*|Top\s*\d+[^.,;()]*|Rookie[^.,;()]*|Most Improved[^.,;()]*|Invitee[^.,;()]*|First Team[^.,;()]*|Champion[^.,;()]*|Winner[^.,;()]*|Ranked\s+\d+\/\d+[^.,;()]*)/i,r=t.match(a);if(r)return r[1].trim();const i=t.split(/[-–—•·]/)[0].trim();return i.length>60?i.slice(0,57)+"…":i}function vt(e){const t=v($.workInterstitial);if(!t)return;const n=(e==null?void 0:e.workInterstitial)||null,a=Array.isArray(e==null?void 0:e.quickHits)?e.quickHits:[],r=b=>a.find(S=>typeof(S==null?void 0:S.label)=="string"&&b.test(S.label)),i=r(/years?\s*playing/i),o=r(/train(ing)?/i),l=Lt(i==null?void 0:i.value)||null,d=Tt(o==null?void 0:o.value)||null,c=((n==null?void 0:n.kicker)||"The Work").trim(),u=((n==null?void 0:n.lineOneNumber)||l||"").trim(),h=((n==null?void 0:n.lineOneUnit)||(l?"years":"")).trim(),g=((n==null?void 0:n.lineTwoNumber)||d||"").trim(),f=((n==null?void 0:n.lineTwoUnit)||(d?"days a week":"")).trim(),y=((n==null?void 0:n.lineThreeNumber)||(n?"":"1")).trim(),m=((n==null?void 0:n.lineThreeUnit)||(n?"":"goal.")).trim(),k=[{number:u,unit:h},{number:g,unit:f},{number:y,unit:m}].filter(b=>b.number||b.unit);if(!k.length){t.hidden=!0;return}t.innerHTML=`
    <div class="interstitial-inner">
      <p class="interstitial-kicker">${s(c)}</p>
      ${k.map(b=>`
            <p class="interstitial-line">
              ${b.number?`<span class="interstitial-number">${s(b.number)}</span>`:""}
              ${b.unit?`<span class="interstitial-unit">${s(b.unit)}</span>`:""}
            </p>
          `).join("")}
    </div>
  `,t.hidden=!1}function kt(e){vt(e);const t=v($.workMindset);if(t){if(!(e!=null&&e.mindsetBody)){t.hidden=!0;return}t.hidden=!1,t.innerHTML=`
    <h3 class="work-mindset-title">${s(e.mindsetTitle||"Mindset & Goals")}</h3>
    <div class="work-mindset-body">${V(e.mindsetBody)}</div>
  `}}function Lt(e){if(typeof e!="string")return null;const t=e.match(/^\s*(\d+(?:\.\d+)?)/);return t?t[1]:null}function Tt(e){if(typeof e!="string")return null;const t=e.trim(),n=t.match(/^\s*(\d+)\s*[-–—]\s*(\d+)/);if(n)return`${n[1]}–${n[2]}`;const a=t.match(/^\s*(\d+)/);return a?a[1]:null}function St(e,t={}){const n=v($.coachSnapshot);if(!n)return;if(!(e&&[e.gpaWeighted,e.satScore,e.actScore,e.ncaaId,e.ncaaStatus,e.transcriptUrl,e.parentName,e.parentEmail,e.parentPhone,e.clubCoachName,e.clubCoachEmail,e.clubCoachPhone,e.hsCoachName,e.hsCoachEmail,e.hsCoachPhone].some(L=>typeof L=="string"&&L.trim()!==""))){n.hidden=!0,n.innerHTML="";return}const r=t.about||{},i=Array.isArray(r.profileFacts)?r.profileFacts:[],o=L=>{var T;return((T=i.find(M=>(M==null?void 0:M.label)&&L.test(M.label)))==null?void 0:T.value)||""},l=o(/graduat/i),d=(e==null?void 0:e.classYear)||(l?`Class of ${l}`:""),c={eyebrow:(e==null?void 0:e.eyebrow)||"Coach Snapshot",heading:(e==null?void 0:e.heading)||"The 30-second read",subheading:(e==null?void 0:e.subheading)||"",classYear:d,gpaWeighted:(e==null?void 0:e.gpaWeighted)||"",sat:(e==null?void 0:e.satScore)||"",act:(e==null?void 0:e.actScore)||"",ncaaId:(e==null?void 0:e.ncaaId)||"",ncaaStatus:(e==null?void 0:e.ncaaStatus)||"",transcriptLabel:(e==null?void 0:e.transcriptLabel)||"Download transcript",transcriptUrl:(e==null?void 0:e.transcriptUrl)||"",parentName:(e==null?void 0:e.parentName)||"",parentRole:(e==null?void 0:e.parentRole)||"",parentEmail:(e==null?void 0:e.parentEmail)||"",parentPhone:(e==null?void 0:e.parentPhone)||"",clubCoachName:(e==null?void 0:e.clubCoachName)||o(/private\s*coach|club\s*coach/i),clubCoachOrg:(e==null?void 0:e.clubCoachOrg)||"",clubCoachEmail:(e==null?void 0:e.clubCoachEmail)||"",clubCoachPhone:(e==null?void 0:e.clubCoachPhone)||"",hsCoachName:(e==null?void 0:e.hsCoachName)||"",hsCoachEmail:(e==null?void 0:e.hsCoachEmail)||"",hsCoachPhone:(e==null?void 0:e.hsCoachPhone)||"",verifiedAt:(e==null?void 0:e.verifiedAt)||o(/verified/i)},u=(L,T,M=!1)=>{if(!T)return"";const C=M?"coach-snapshot-fact-value coach-snapshot-fact-value--mono":"coach-snapshot-fact-value";return`
      <div class="coach-snapshot-fact">
        <span class="coach-snapshot-fact-label">${s(L)}</span>
        <span class="${C}">${s(T)}</span>
      </div>
    `},h=(L,T,M,C)=>{if(!L&&!M&&!C)return"";const W=T?`<span class="coach-snapshot-contact-role">${s(T)}</span>`:"",z=M?`<a href="tel:${p(M.replace(/[^0-9+]/g,""))}">${s(M)}</a>`:"",j=C?`<a href="mailto:${p(C)}">${s(C)}</a>`:"",B=[z,j].filter(Boolean).join('<span class="coach-snapshot-contact-divider" aria-hidden="true">·</span>');return`
      <div class="coach-snapshot-contact">
        <div class="coach-snapshot-contact-identity">
          <span class="coach-snapshot-contact-name">${s(L||"")}</span>
          ${W}
        </div>
        ${B?`<div class="coach-snapshot-contact-meta">${B}</div>`:""}
      </div>
    `},g=[u("Class",c.classYear),u("GPA (W)",c.gpaWeighted,!0),u("SAT",c.sat,!0),u("ACT",c.act,!0)].filter(Boolean).join(""),f=[u("NCAA ID",c.ncaaId,!0),u("NCAA Status",c.ncaaStatus),u("Verified",At(c.verifiedAt))].filter(Boolean).join(""),y=c.transcriptUrl?`<a class="btn subtle coach-snapshot-transcript" href="${p(c.transcriptUrl)}" target="_blank" rel="noopener">${s(c.transcriptLabel)}</a>`:"",m=[h(c.parentName,c.parentRole||"Parent / Guardian",c.parentPhone,c.parentEmail),h(c.clubCoachName,c.clubCoachOrg||"Private Coach",c.clubCoachPhone,c.clubCoachEmail),h(c.hsCoachName,"HS Coach",c.hsCoachPhone,c.hsCoachEmail)].filter(Boolean).join(""),k=[g?{title:"By the numbers",body:g}:null,f||y?{title:"Eligibility",body:`${f}${y?`<div class="coach-snapshot-transcript-wrap">${y}</div>`:""}`}:null,m?{title:"Recruiting contacts",body:m}:null].filter(Boolean);if(!k.length){n.hidden=!0;return}const b=`<p class="section-kicker">${s(c.eyebrow)}</p>`,S=`<h2 class="coach-snapshot-heading">${s(c.heading)}</h2>`,A=c.subheading?`<p class="coach-snapshot-subheading">${s(c.subheading)}</p>`:"";n.hidden=!1,n.innerHTML=`
    <header class="coach-snapshot-header" data-motion>
      ${b}
      ${S}
      ${A}
    </header>
    <div class="coach-snapshot-grid">
      ${k.map((L,T)=>`
            <section class="coach-snapshot-column" data-motion="delay-${T+1}">
              <h3 class="coach-snapshot-column-title">${s(L.title)}</h3>
              <div class="coach-snapshot-column-body">${L.body}</div>
            </section>
          `).join("")}
    </div>
  `}function At(e){if(!e)return"";const t=I(e);if(!t)return String(e);try{return t.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}catch{return String(e)}}function wt(e,t={}){const n=v($.aboutHeading),a=v($.aboutGrid),r=t.academics||null;if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"About")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:w("About section coming soon.")),!a)return;if(!e){a.innerHTML=w("About details coming soon.");return}const i=`
    <article class="about-card" data-motion="delay-1">
      <h3>${s(e.profileCardTitle||"Profile")}</h3>
      <div class="about-facts">
        ${(e.profileFacts||[]).map(d=>`
              <div class="about-fact">
                <span class="about-fact-label">${s(d.label||"")}</span>
                <span class="about-fact-value">${s(d.value||"")}</span>
              </div>
            `).join("")}
      </div>
    </article>
  `,o=`
    <article class="about-card about-highlight" data-motion="delay-3">
      <h3>${s(e.quickHitsTitle||"Quick Hits")}</h3>
      <div class="about-facts">
        ${(e.quickHits||[]).map(d=>`
              <div class="about-fact">
                <span class="about-fact-label">${s(d.label||"")}</span>
                <span class="about-fact-value">${s(d.value||"")}</span>
              </div>
            `).join("")}
      </div>
    </article>
  `;let l="";if(r){const d=[{label:"School",value:r.schoolCardTitle},{label:"GPA",value:r.gpa},{label:"Honors / AP",value:r.honors},{label:"AP / IB Status",value:r.apCourses}].filter(g=>g.value),c=d.length?`
          <div class="about-facts">
            ${d.map(g=>`
                  <div class="about-fact">
                    <span class="about-fact-label">${s(g.label)}</span>
                    <span class="about-fact-value">${s(g.value)}</span>
                  </div>
                `).join("")}
          </div>
        `:"",u=r.interestsBody?`<div class="about-academics-interests">${V(r.interestsBody)}</div>`:"",h=r.transcriptUrl?`<a class="btn subtle" href="${p(r.transcriptUrl)}" target="_blank" rel="noopener">${s(r.transcriptLabel||"Transcript")}</a>`:"";(c||u||h)&&(l=`
        <article class="about-card about-academics" data-motion="delay-4">
          <h3>${s(r.heading||"Academics")}</h3>
          ${c}
          ${u}
          ${h?`<div class="about-academics-actions">${h}</div>`:""}
        </article>
      `)}a.innerHTML=`
    ${i}
    ${o}
    ${l}
  `}function Mt(e){const t=v($.resumeHeading),n=v($.resumePanels);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Golf Resume")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:w("Golf resume coming soon.")),n){if(!e){n.innerHTML=w("Resume details coming soon.");return}const a=/^(handicap|gpa)$/i,r=Array.isArray(e.performanceStats)?e.performanceStats:[],i=[],o=[];r.forEach(f=>{Ht(f)?i.push(...Nt(f==null?void 0:f.value)):a.test(((f==null?void 0:f.label)||"").trim())||o.push(f)});const l=Array.isArray(e.clubYardages)?e.clubYardages:[],d=l.length?l:i,c=d.length>0,u=e.clubYardagesTitle||"Club Yardages",h=c?`
          <div class="performance-clubs">
            <h4 class="performance-section-title">${s(u)}</h4>
            ${Bt(d)}
          </div>
        `:"",g=o.map(f=>{const y=f.value||"",m=String(y).trim().match(/^(-?\d+(?:\.\d+)?)(.*)$/),k=m?` data-counter="${p(m[1])}" data-counter-suffix="${p(m[2]||"")}"`:"";return`
          <div class="performance-stat">
            <span class="performance-stat-label">${s(f.label||"")}</span>
            <span class="performance-stat-value"${k}>${s(y)}</span>
          </div>
        `}).join("");n.innerHTML=`
      <article class="panel performance-panel" data-motion="delay-1">
        <h3>${s(e.performanceTitle||"Performance Snapshot")}</h3>
        <div class="performance-content">
          <div class="performance-stats-grid" data-count="${o.length}">
            ${g}
          </div>
          ${h}
        </div>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${s(e.trainingTitle||"Training Routine")}</h3>
        ${V(e.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${s(e.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(e.experienceList||[]).map(f=>`<li>${s(f||"")}</li>`).join("")}
        </ul>
      </article>
    `}}function Et(e,t){const n=v($.upcomingHeading),a=v($.upcomingGrid);if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"Upcoming Tournaments")}</h2>
          ${e.subheading?`<p>${s(e.subheading)}</p>`:""}
        `:`
          <h2>Upcoming Tournaments</h2>
          <p>Next events on Samuel's competitive schedule.</p>
        `),!a)return;const r=Array.isArray(t)?t:[];if(!r.length){a.innerHTML=w("Upcoming tournaments coming soon.");return}const i=Math.max(1,(e==null?void 0:e.maxItems)||r.length),o=r.slice(0,i);a.innerHTML=o.map((l,d)=>Ct(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible"))}function Ct(e,t=0){if(!e)return"";const n=e.course||"Course TBD",a=e.location||"",r=se(e.eventDate,e.endDate,{month:"short"}),i=It(e.yardage);return`
    <article class="upcoming-card" data-motion="delay-${t%4+1}">
      <div class="upcoming-card-date">${r||"Date TBD"}</div>
      <h3 class="upcoming-card-course">${s(n)}</h3>
      <div class="upcoming-card-meta">
        ${a?`<span class="upcoming-card-location">${s(a)}</span>`:""}
        ${i?`<span class="upcoming-card-yardage">${s(i)}</span>`:""}
      </div>
    </article>
  `}function It(e){if(e==null)return"";const t=String(e).trim();return t?/yard|yd/i.test(t)?t:`${t} yds`:""}function Ht(e){return!e||typeof e.label!="string"?!1:/club\s*yardage/i.test(e.label)}const Pt=["Woods","Irons","Wedges","Putter","Other"];function xt(e){const t=(e||"").toLowerCase();return/putter/.test(t)?"Putter":/wedge/.test(t)?"Wedges":/iron/.test(t)?"Irons":/driver|wood|hybrid|\b\d+\s*w\b|\b\dw\b/.test(t)?"Woods":"Other"}function Dt(e){if(e==null)return"";const t=String(e).trim();return t?/yard|yd/i.test(t)?t:`${t} yds`:""}function Bt(e){const t=new Map;if(e.forEach(r=>{if(!r||!r.club)return;const i=xt(r.club);t.has(i)||t.set(i,[]),t.get(i).push(r)}),!t.size)return"";const n=Pt.filter(r=>t.has(r));Array.from(t.keys()).forEach(r=>{n.includes(r)||n.push(r)});const a=n.length>1;return`
    <div class="club-yardage-groups">
      ${n.map(r=>{const i=t.get(r)||[];return`
            <div class="club-yardage-group">
              ${a?`<h5 class="club-yardage-group-title">${s(r)}</h5>`:""}
              <ul class="club-yardage-list">
                ${i.map(o=>`
                      <li>
                        <span class="club-yardage-name">${s((o==null?void 0:o.club)||"")}</span>
                        <span class="club-yardage-value">${s(Dt(o==null?void 0:o.yardage))}</span>
                      </li>
                    `).join("")}
              </ul>
            </div>
          `}).join("")}
    </div>
  `}function Nt(e){return!e||typeof e!="string"?[]:e.split(/[,\n;]/).map(t=>t.trim()).filter(Boolean).map(t=>{const n=t.indexOf(":");if(n>-1)return{club:t.slice(0,n).trim(),yardage:t.slice(n+1).trim()};const a=t.match(/^(.*?)\s+(\d[\d,]*)(\s*(?:yds?|yards?)?)\s*$/i);return a?{club:a[1].trim(),yardage:`${a[2]}${a[3]?a[3].trim():""}`}:{club:t,yardage:""}}).filter(t=>t.club)}function _t(e){const t=v($.academicsHeading),n=v($.academicsGrid);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Academics")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:w("Academics section coming soon.")),n){if(!e){n.innerHTML=w("Academic details coming soon.");return}const a=e.transcriptLabel||"Transcript",r=e.transcriptUrl?`<a class="btn subtle" href="${p(e.transcriptUrl)}" target="_blank" rel="noopener">${s(a)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${s(a)}</span>`;n.innerHTML=`
      <article class="academics-card" data-motion="delay-1">
        <h3>${s(e.schoolCardTitle||"School")}</h3>
        <ul>
          ${e.gpa?`<li><strong>GPA:</strong> ${s(e.gpa)}</li>`:""}
          ${e.honors?`<li><strong>Honors:</strong> ${s(e.honors)}</li>`:""}
          ${e.apCourses?`<li><strong>AP / IB:</strong> ${s(e.apCourses)}</li>`:""}
        </ul>
        ${r}
      </article>
      <article class="academics-card" data-motion="delay-2">
        <h3>${s(e.interestsTitle||"Academic Interests")}</h3>
        ${V(e.interestsBody)}
      </article>
    `}}function Ot(){const e=E.meta,t=E.items||[],n=v($.highlightsHeading),a=v($.highlightsTimeline),r=v($.highlightsActions);if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"Highlights")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:w("Highlights coming soon.")),!a)return;const i=(e==null?void 0:e.maxItems)||5,o=t.slice(0,i);if(!o.length){a.innerHTML=w("Highlight events coming soon."),r&&(r.innerHTML="");return}a.innerHTML=o.map((l,d)=>Vt(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),re(a),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function jt(){const e=_.meta,t=_.items||[],n=v($.videosHeading),a=v($.videoGrid),r=v($.videosActions);if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"Videos")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:w("Videos coming soon.")),!a)return;const i=(e==null?void 0:e.maxItems)||3,o=t.slice(0,i);if(!o.length){a.innerHTML=w("Video highlights coming soon."),r&&(r.innerHTML="");return}a.innerHTML=o.map((l,d)=>$n(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),ie(),re(a),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function Ut(){const e=Y.meta,t=Y.items||[],n=v($.galleryHeading),a=v($.galleryGrid),r=v($.galleryActions);if(n){const l=(e==null?void 0:e.heading)||"Photo Gallery",d=(e==null?void 0:e.subheading)||"Tournament action and behind-the-scenes moments.";n.innerHTML=`
      <h2>${s(l)}</h2>
      ${`<p>${s(d)}</p>`}
    `}if(!a)return;const i=Math.max(1,(e==null?void 0:e.maxItems)||6),o=t.slice(0,i);if(!o.length){a.innerHTML=w("Gallery photos coming soon."),r&&(r.innerHTML="");return}if(a.innerHTML=o.map((l,d)=>qt(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),De(a),re(a),r){const l="gallery.html",d=(e==null?void 0:e.ctaLabel)||"Explore the full gallery";r.innerHTML=`<a class="btn ghost" href="${p(l)}">${s(d)}</a>`}}function qt(e,t=0){var S,A,L,T,M;const n=((S=e==null?void 0:e.image)==null?void 0:S.url)||F,a=((A=e==null?void 0:e.image)==null?void 0:A.alt)||(e==null?void 0:e.title)||"Gallery highlight",r=He(e,{variant:"card"}),i=In(e==null?void 0:e.shotDate),o=i?Pe(i):"",l=(L=e==null?void 0:e.image)!=null&&L.url?{src:n,alt:a,title:(e==null?void 0:e.title)||"Gallery highlight"}:null,d=l?`data-photo-src="${p(l.src)}" data-photo-alt="${p(l.alt)}" data-photo-title="${p(l.title)}"`:"",c=[];e!=null&&e.location&&c.push(e.location);const u=c.map(C=>`<span>${s(C)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),h=u?`<div class="gallery-card-meta">${u}</div>`:"",g=e!=null&&e.description?`<p class="gallery-card-description">${s(e.description)}</p>`:"",f=e!=null&&e.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${s(e.photographer)}</div>`:"",y=f?`<div class="gallery-card-footer">${f}</div>`:"",m=l?`data-photo-preview="true" ${d}`:"",k=P(((T=e==null?void 0:e.image)==null?void 0:T.focalPoint)||((M=e==null?void 0:e.image)==null?void 0:M.hotspot)),b=k?` style="object-position: ${p(k)};"`:"";return`
    <article class="gallery-card gallery-card--overlaid" data-motion="delay-${t%3+1}">
      <div class="gallery-card-media"${m?` ${m}`:""}>
        ${o}
        <img src="${p(n)}" alt="${s(a)}" loading="lazy"${b} />
        <div class="gallery-card-scrim" aria-hidden="true"></div>
        <div class="gallery-card-overlay">
          ${h}
          <h3 class="gallery-card-title">${s((e==null?void 0:e.title)||"Gallery highlight")}</h3>
          ${r?`<div class="card-chip-slot">${r}</div>`:""}
        </div>
      </div>
      <div class="gallery-card-body gallery-card-body--hidden" aria-hidden="true">
        ${g}
        ${ne(e==null?void 0:e.tags)}
        ${y}
      </div>
    </article>
  `}function ne(e){if(!Array.isArray(e)||!e.length)return"";const t=e.map(n=>typeof n=="string"?n.trim():"").filter(Boolean);return t.length?`
    <div class="gallery-card-tags">
      ${t.map(n=>`<span class="gallery-tag">${s(n)}</span>`).join("")}
    </div>
  `:""}function Rt(e){const t=v($.dualHeading),n=v($.dualGrid);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Dual-Sport Athlete")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:w("Dual-sport content coming soon.")),n){if(!e||!Array.isArray(e.cards)||!e.cards.length){n.innerHTML=w("Dual-sport cards coming soon.");return}n.innerHTML=e.cards.map((a,r)=>{var d,c,u;const i=P(((d=a==null?void 0:a.image)==null?void 0:d.focalPoint)||((c=a==null?void 0:a.image)==null?void 0:c.hotspot)),o=i?` style="object-position: ${p(i)};"`:"",l=(u=a==null?void 0:a.image)!=null&&u.url?`
              <div class="dual-card-media">
                <img
                  src="${p(a.image.url)}"
                  alt="${s(a.image.alt||a.title||"Dual-sport card image")}"
                  loading="lazy"${o}
                />
              </div>
            `:"";return`
          <article class="dual-card" data-motion="delay-${r+1}">
            ${l}
            <div class="dual-card-content">
              <h3>${s(a.title||"")}</h3>
              ${a.body?`<p>${s(a.body)}</p>`:""}
              ${Array.isArray(a.bulletPoints)&&a.bulletPoints.length?`<ul>${a.bulletPoints.map(h=>`<li>${s(h||"")}</li>`).join("")}</ul>`:""}
            </div>
          </article>
        `}).join("")}}function Yt(e){const t=v($.contactHeading),n=v($.contactGrid);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Let's Connect")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:w("Contact section coming soon.")),!!n){if(!e||!Array.isArray(e.cards)||!e.cards.length){n.innerHTML=w("Contact cards coming soon.");return}n.innerHTML=e.cards.map((a,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${s(a.title||"")}</h3>
          <ul>
            ${(a.entries||[]).map(i=>`<li>${Ft(i)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function Gt(e,t){const n=document.querySelector(".site-footer");if(!n)return;const a={kicker:"05 — Open For Recruiting",headline:"Let’s|Talk.",ctaLabel:"Get in touch",playerLabel:"Player",playerName:"Samuel Masco",playerClassYear:"Class of 2029",playerLocation:"Evergreen, Colorado",exploreLabel:"Explore",exploreLinks:[{label:"Resume",href:"#golf-resume"},{label:"Highlights",href:"#highlights"},{label:"Media",href:"#videos"},{label:"About",href:"#about"}],directLabel:"Direct",baseLine:"Built with care for the recruiting journey of Samuel Masco · Class of 2029.",copyrightName:"Samuel Masco"},r=b=>{const S=e==null?void 0:e[b];return typeof S=="string"&&S.trim()?S.trim():a[b]},i=Array.isArray(e==null?void 0:e.exploreLinks)&&e.exploreLinks.length?e.exploreLinks:a.exploreLinks,o=((t==null?void 0:t.cards)||[])[0],l=Array.isArray(o==null?void 0:o.entries)?o.entries:[],d=(b,S)=>l.find(A=>{if(!A)return!1;const L=typeof A.label=="string"?A.label.toLowerCase():"",T=typeof A.link=="string"?A.link:"";return!!(b&&b.test(L)||S&&S.test(T))}),c=d(/email/,/^mailto:/i),u=d(/phone|cell|mobile/,/^tel:/i),h=[];if(c!=null&&c.value){const b=c.link||`mailto:${c.value}`;h.push(`<a class="site-footer-direct-link" href="${p(b)}">${s(c.value)}</a>`)}if(u!=null&&u.value){const b=u.link||`tel:${u.value.replace(/[^\d+]/g,"")}`;h.push(`<a class="site-footer-direct-link" href="${p(b)}">${s(u.value)}</a>`)}const g=h.length?`<p class="site-footer-value">${h.join("<br />")}</p>`:'<p class="site-footer-value site-footer-contact-placeholder">See the contact section above for email, phone, and coach references.</p>',f=s(r("headline")).replace(/\|/g,"<br />"),y=c!=null&&c.value?c.link||`mailto:${c.value}`:"#contact",m=[r("playerName")?`<strong>${s(r("playerName"))}</strong>`:"",r("playerClassYear")?s(r("playerClassYear")):"",r("playerLocation")?s(r("playerLocation")):""].filter(Boolean).join("<br />"),k=i.filter(b=>(b==null?void 0:b.label)&&(b==null?void 0:b.href)).map(b=>`
        <li><a href="${p(b.href)}">${s(b.label)}</a></li>
      `).join("");n.innerHTML=`
    <div class="site-footer-inner">
      <div class="site-footer-primary">
        <p class="site-footer-kicker">${s(r("kicker"))}</p>
        <h2 class="site-footer-headline">${f}</h2>
        <a class="site-footer-cta" href="${p(y)}">
          <span>${s(r("ctaLabel"))}</span>
          <span class="site-footer-cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <div class="site-footer-columns">
        <div class="site-footer-column">
          <p class="site-footer-label">${s(r("playerLabel"))}</p>
          <p class="site-footer-value">${m}</p>
        </div>
        <div class="site-footer-column">
          <p class="site-footer-label">${s(r("exploreLabel"))}</p>
          <ul class="site-footer-links">${k}</ul>
        </div>
        <div class="site-footer-column site-footer-contact">
          <p class="site-footer-label">${s(r("directLabel"))}</p>
          ${g}
        </div>
      </div>
    </div>
    <div class="site-footer-rule"></div>
    <div class="site-footer-base">
      <p>&copy; ${new Date().getFullYear()} ${s(r("copyrightName"))}. Recruiting portfolio.</p>
      <p>${s(r("baseLine"))}</p>
    </div>
  `}function Ft(e){var r;if(!e)return"";const t=e.label?`<strong>${s(e.label)}:</strong> `:"",n=Mn(e.value),a=(r=e.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return e.link&&n.length<=1?`${t}<a href="${p(e.link)}"${a}>${s(e.value||e.link)}</a>`:n.length?`${t}${n.map((i,o)=>{const l=o===0&&e.link?e.link:i.link;if(l){const c=l.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${p(l)}"${c}>${s(i.text)}</a>`}return s(i.text)}).join(" · ")}`:`${t}${s(e.value||"")}`}function Vt(e,t){var B,le;const n=Cn(e),a=e.summary?`<p class="case-study-summary">${s(e.summary)}</p>`:"",r=Array.isArray(e.days)?e.days:[],i=`home-highlight-${t}`,o=(e==null?void 0:e._id)||(e==null?void 0:e.title)||i,l=(B=e==null?void 0:e.coverImage)!=null&&B.url?e.coverImage:null,c=(le=Ee(e)[0])==null?void 0:le.image,u=l||c,h=(u==null?void 0:u.url)||"",g=(u==null?void 0:u.alt)||(e==null?void 0:e.title)||"Tournament photo",f=P((u==null?void 0:u.focalPoint)||(u==null?void 0:u.hotspot)),y=f?` style="object-position: ${p(f)};"`:"",m=Wt(r),k=(m==null?void 0:m.score)!=null?String(m.score):"",b=(m==null?void 0:m.rank)!=null&&(m==null?void 0:m.rank)!==""?String(m.rank):"",S=(m==null?void 0:m.fieldSize)!=null&&(m==null?void 0:m.fieldSize)!==""?String(m.fieldSize):"",A=(m==null?void 0:m.yardage)!=null&&(m==null?void 0:m.yardage)!==""?String(m.yardage):"",L=e!=null&&e.location?String(e.location):"",T=!!(e!=null&&e.pinToTop||e!=null&&e.featured),M=`
    <button class="case-study-cta" type="button" data-highlight-modal="${p(o)}">
      <span>Read the round</span>
      <span class="case-study-cta-arrow" aria-hidden="true">→</span>
    </button>
  `,C=[];if(b){const _e=S?` / ${s(S)}`:"";C.push(`<div class="case-study-chip"><span class="case-study-chip-label">Finish</span><span class="case-study-chip-value">${s(b)}${_e}</span></div>`)}A&&C.push(`<div class="case-study-chip"><span class="case-study-chip-label">Yardage</span><span class="case-study-chip-value">${s(A)}</span></div>`),r.length>1&&C.push(`<div class="case-study-chip"><span class="case-study-chip-label">Rounds</span><span class="case-study-chip-value">${r.length}</span></div>`);const W=C.length?`<div class="case-study-chips">${C.join("")}</div>`:"",z=h?`
        <img
          src="${p(h)}"
          alt="${s(g)}"
          loading="lazy"
          ${y}
        />
      `:`<div class="case-study-media-placeholder" aria-hidden="true"><span>${s(((e==null?void 0:e.title)||"TOUR").slice(0,2).toUpperCase())}</span></div>`,j=String(t+1).padStart(2,"0");return`
    <article class="case-study-card${T?" is-featured":""}" data-motion="delay-${t+1}" data-index="${j}">
      <div class="case-study-media">
        ${z}
        <div class="case-study-media-overlay" aria-hidden="true"></div>
        ${T?'<span class="case-study-badge">Featured</span>':""}
      </div>
      <div class="case-study-body">
        <div class="case-study-meta">
          <span class="case-study-index">${j}</span>
          ${n?`<span class="case-study-date">${s(n)}</span>`:""}
          ${L?`<span class="case-study-location">${s(L)}</span>`:""}
        </div>
        <h3 class="case-study-title">${s(e.title||"")}</h3>
        ${k?`
              <div class="case-study-headline-score">
                <span class="case-study-score-value">${s(k)}</span>
                <span class="case-study-score-label">${r.length>1?"Best Round":"Final Score"}</span>
              </div>
            `:""}
        ${W}
        ${a}
        ${M}
      </div>
    </article>
  `}function Wt(e){if(!Array.isArray(e)||!e.length)return null;const t=e.map(n=>{const a=Number(n==null?void 0:n.score);return Number.isFinite(a)?{day:n,numeric:a}:null}).filter(Boolean);return t.length?(t.sort((n,a)=>n.numeric-a.numeric),t[0].day):e[0]}function zt(e=[],{variant:t="default",showLabels:n}={}){if(!Array.isArray(e)||!e.length)return"";const a=e.length,r=typeof n=="boolean"?n:a>1;return`
    <div class="${["day-stats",t==="compact"?"day-stats--compact":"",t==="list"?"day-stats--list":"",a===1?"day-stats--single":"",`day-stats--cols-${Math.min(a,3)}`].filter(Boolean).join(" ")}">
      ${e.map((o,l)=>Zt(o,l,{showLabels:r,total:a})).join("")}
    </div>
  `}const ue=120,Kt=57;function Zt(e,t,{showLabels:n,total:a}){if(!e)return"";const r=a===1,i=!r&&n?xe(e,t,a):null,o=Qt(e);return o?`
    <div class="day-stat${r?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${s(i)}</span>`:""}
      ${o}
    </div>
  `:""}function Qt(e){const t=gn(e);return t.length?`
    <div class="day-metrics">
      ${Xt(t)}
    </div>
  `:""}function Xt(e){return`
    <div class="day-metric-list">
      ${e.map(t=>{const n=t.secondary?`<span class="day-metric-secondary">${s(t.secondary)}</span>`:"";return`
            <div class="day-metric" data-metric="${t.key}">
              <span class="day-metric-value">${s(t.display)}</span>
              <div class="day-metric-meta">
                <span class="day-metric-label">
                  ${s(t.label)}
                  ${n}
                </span>
              </div>
            </div>
          `}).join("")}
    </div>
  `}function Jt(e=[]){if(!Array.isArray(e))return"";const t=e.map((n,a)=>{if(!(n!=null&&n.notes))return"";const r=xe(n,a,e.length)||"Notes";return`
        <div class="day-note">
          <strong>${s(r)}</strong>
          <p>${s(n.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return t?`<div class="day-notes">${t}</div>`:""}function re(e){e&&e.querySelectorAll("[data-highlight-modal]").forEach(t=>{t.dataset.modalBound!=="true"&&(t.dataset.modalBound="true",t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const a=t.getAttribute("data-highlight-modal");tn(a)}))})}let x=null;function en(){if(x)return x;const e=document.createElement("div");return e.className="highlight-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-highlight-overlay-close]")&&fe()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&fe()}),document.body.appendChild(e),x=e,e}function tn(e){const t=en(),n=t.querySelector("[data-highlight-overlay-body]");if(!n)return;const a=Me(e);if(!a)return;const r=on(a),i=Ee(a);n.innerHTML=nn(a,r,i),ie(n),De(n),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function fe(){if(!x)return;const e=x.querySelector("[data-highlight-overlay-body]");e&&(e.innerHTML=""),x.classList.remove("is-open"),x.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Me(e){const t=[];if(Array.isArray(E.items)&&t.push(E.items),Array.isArray(E.allItems)&&t.push(E.allItems),!e)return t[0]&&t[0][0]||t[1]&&t[1][0]||null;for(const n of t){const a=n.find(i=>((i==null?void 0:i._id)||"")===e);if(a)return a;const r=n.find(i=>(i==null?void 0:i.title)===e);if(r)return r}return null}function nn(e,t,n){const r=[fn(e),e.location?s(e.location):null].filter(Boolean),i=r.length?`<div class="highlight-overlay-meta">
        ${r.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",o=zt(e.days||[],{variant:"list"}),l=Jt(e.days||[]);return`
    <div class="highlight-overlay-content">
      <header class="highlight-overlay-header">
        <p class="eyebrow">Tournament</p>
        <h2>${s(e.title||"Tournament highlight")}</h2>
        ${i}
        ${e.summary?`<p class="highlight-overlay-summary">${s(e.summary)}</p>`:""}
      </header>
      ${o?`<section class="highlight-overlay-section">${o}</section>`:""}
      ${l?`<section class="highlight-overlay-section">${l}</section>`:""}
      <section class="highlight-overlay-section">
        <h3>Videos</h3>
        ${an(t)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${sn(n)}
      </section>
    </div>
  `}function an(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${e.map(rn).join("")}
    </div>
  `}function rn(e){const t=Ne(e),n=e.thumbnailUrl||(t?`https://img.youtube.com/vi/${t}/hqdefault.jpg`:we),a=e.thumbnailAlt||e.title||"Video highlight",r=e.title||"Video highlight",o=!!t?"":' disabled aria-disabled="true"',l=ae?ae(e):"",d=P(e.thumbnailFocalPoint||e.thumbnailHotspot),c=d?` style="object-position: ${p(d)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${s(t)}" data-video-title="${s(r)}">
        <img src="${p(n)}" alt="${s(a)}" loading="lazy"${c} />
        <button class="play-button" type="button"${o} aria-label="Play ${s(r)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h4>${s(e.title||"Video highlight")}</h4>
        ${e.description?`<p>${s(e.description)}</p>`:""}
        ${l}
      </div>
    </article>
  `}function sn(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${e.map(ln).join("")}
    </div>
  `}function ln(e){var d,c,u,h,g;const t=((d=e==null?void 0:e.image)==null?void 0:d.url)||we,n=((c=e==null?void 0:e.image)==null?void 0:c.alt)||(e==null?void 0:e.title)||"Gallery photo",a=(u=e==null?void 0:e.image)!=null&&u.url?{src:t,alt:n,title:(e==null?void 0:e.title)||"Gallery photo"}:null,r=a?`data-photo-preview="true" data-photo-src="${p(a.src)}" data-photo-alt="${p(a.alt)}" data-photo-title="${p(a.title)}"`:"",i=e!=null&&e.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${s(e.photographer)}</div>`:"",o=P(((h=e==null?void 0:e.image)==null?void 0:h.focalPoint)||((g=e==null?void 0:e.image)==null?void 0:g.hotspot)),l=o?` style="object-position: ${p(o)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${r?` ${r}`:""}>
        <img src="${p(t)}" alt="${s(n)}" loading="lazy"${l} />
      </div>
      <div class="gallery-card-body">
        <h4>${s((e==null?void 0:e.title)||"Gallery photo")}</h4>
        ${e!=null&&e.description?`<p class="gallery-card-description">${s(e.description)}</p>`:""}
        ${ne?ne(e==null?void 0:e.tags):""}
        ${i?`<div class="gallery-card-footer">${i}</div>`:""}
      </div>
    </article>
  `}function on(e){return!e||!Array.isArray(E.videos)?[]:E.videos.filter(t=>Ce(t,e))}function Ee(e){return!e||!Array.isArray(E.photos)?[]:E.photos.filter(t=>Ce(t,e))}function Ce(e,t){const n=Ie(e);return n?!!(n.id&&(t!=null&&t._id)&&n.id===t._id||n.title&&(t!=null&&t.title)&&n.title===t.title):!1}function Ie(e){return e?e.tournament&&typeof e.tournament=="object"&&e.tournament.title?{id:e.tournament._id||e.tournament._ref||e.tournament.id||null,title:e.tournament.title}:typeof e.tournament=="string"&&e.tournament?{id:e.tournament,title:e.tournament}:null:null}function cn(e){return!e||!Array.isArray(e.tags)?[]:e.tags.map(t=>typeof t=="string"?t.trim():"").filter(Boolean)}function ae(e){const t=cn(e);return t.length?`
    <div class="gallery-card-tags video-card-tags">
      ${t.map(n=>`<span class="gallery-tag">${s(n)}</span>`).join("")}
    </div>
  `:""}function dn(e){const t=Ie(e);if(!t||!t.title)return null;const n=t.id||t.title,a=n?Me(n):null,r=a?a._id||a.title:null;return{label:(a==null?void 0:a.title)||t.title,targetId:r}}function He(e,{variant:t="inline"}={}){const n=dn(e);if(!(n!=null&&n.label))return"";const a=["tournament-chip"];t==="card"&&a.push("tournament-chip--on-card"),t==="inline"&&a.push("tournament-chip--inline");const r=s(n.label),i=p(`View ${n.label} tournament details`),o=n.targetId?` data-highlight-modal="${p(n.targetId)}"`:"",l=n.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(n.targetId)}`:"tournament-highlights.html",d="a";return`
    <${d} class="${a.join(" ")}" href="${p(l)}"${o}${n.targetId?` aria-label="${i}"`:""}>
      <span class="tournament-chip-name">${r}</span>
    </${d}>
  `}function un(e){if(!e)return null;const t=I(e);return t?{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}:null}function Pe(e){return`
    <div class="video-date-overlay" aria-label="${e.month} ${e.day}, ${e.year}">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}function fn(e){return e?se(e.eventDate,e.endDate,{month:"long"}):""}function gn(e){if(!e)return[];const t=[],n=G(e.score),a=G(e.yardage);t.push(K({key:"score",label:"Score",display:typeof n=="number"?String(n):"—",progress:hn(n)})),t.push(K({key:"yards",label:"Yardage",display:typeof a=="number"?a.toLocaleString():"—",secondary:"",progress:pn(a,mn(e,a))}));const r=bn(e);return t.push(K({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),t.filter(Boolean)}function K({key:e,label:t,display:n,secondary:a,progress:r}){const i=n!=null&&n!==""?String(n):"—",o=a?String(a):"",l=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:e,label:t,display:i,secondary:o,progress:Math.max(0,l)}}function xe(e,t,n){return e.label?e.label:n>1?`Day ${t+1}`:null}function G(e){return typeof e=="number"&&!Number.isNaN(e)?e:null}function mn(e,t){return typeof t=="number"&&t>0?Math.max(7200,Math.round(t/50)*50):7200}function hn(e){if(typeof e!="number"||Number.isNaN(e))return 0;const t=ue-Kt;return(ue-e)/t}function pn(e,t){return typeof e!="number"||Number.isNaN(e)||!t||t<=0?0:e/t}function yn(e,t){if(typeof e!="number"||Number.isNaN(e)||typeof t!="number"||t<=0)return 0;if(t===1)return 1;const n=(t-e)/(t-1);return Math.max(0,Math.min(n,1))}function bn(e){const t=G(e==null?void 0:e.rankingPosition),n=G(e==null?void 0:e.rankingOutOf),a=yn(t,n);return typeof t=="number"?{display:String(t),secondary:typeof n=="number"?`of ${n}`:"",progress:a}:{display:"—",secondary:"",progress:0}}function $n(e,t){const n=Ne(e),a=e.thumbnailUrl||(n?`https://img.youtube.com/vi/${n}/hqdefault.jpg`:F),r=e.thumbnailAlt||e.title||"Video highlight",i=e.title||"Video highlight",l=!!n?"":' disabled aria-disabled="true"',d=He(e,{variant:"card"}),c=un(e.eventDate),u=c?Pe(c):"",h=ae(e),g=P(e.thumbnailFocalPoint||e.thumbnailHotspot),f=g?` style="object-position: ${p(g)};"`:"";return`
    <article class="video-gallery-card" data-motion="delay-${t+1}">
      <div class="video-frame" data-video-id="${s(n)}" data-video-title="${s(i)}">
        ${u}
        <img src="${p(a)}" alt="${s(r)}" loading="lazy"${f} />
        <button class="play-button" type="button"${l} aria-label="Play ${s(i)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h3>${s(e.title||"")}</h3>
        ${d?`<div class="card-chip-slot">${d}</div>`:""}
        <p>${s(e.description||"")}</p>
        ${h}
      </div>
    </article>
  `}function ie(e=document){(e instanceof Element?e:document).querySelectorAll(".video-frame").forEach(n=>{if(n.dataset.playerReady==="true")return;const a=n.querySelector(".play-button"),r=n.dataset.videoId,i=n.dataset.videoTitle||"Samuel Masco golf video highlight";!a||!r||(a.addEventListener("click",()=>{kn(r,i)}),n.dataset.playerReady="true")})}let D=null;function vn(){if(D)return D;const e=document.createElement("div");return e.className="video-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-overlay-close]")&&ge()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&ge()}),document.body.appendChild(e),D=e,e}function kn(e,t){const n=vn(),a=n.querySelector(".video-overlay-frame");if(!a)return;a.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${e}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",t),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",a.appendChild(r),n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function ge(){if(!D)return;const e=D.querySelector(".video-overlay-frame");e&&(e.innerHTML=""),D.classList.remove("is-open"),D.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let H=null;function De(e=document){if(!e)return;(e instanceof Element?e:document).querySelectorAll("[data-photo-preview]").forEach(n=>{n.dataset.photoPreviewReady!=="true"&&(n.addEventListener("click",a=>{a.target.closest(".tournament-chip")||Tn(n.getAttribute("data-photo-src"),n.getAttribute("data-photo-alt"),n.getAttribute("data-photo-title"))}),n.dataset.photoPreviewReady="true")})}function Ln(){if(H)return H;const e=document.createElement("div");return e.className="photo-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
  `,e.addEventListener("click",t=>{t.target.closest("[data-photo-overlay-close]")&&me()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&me()}),document.body.appendChild(e),H=e,e}function Tn(e,t,n){if(!e)return;const a=Ln(),r=a.querySelector("img"),i=a.querySelector("figcaption");!r||!i||(r.src=e,r.alt=t||n||"Gallery photo",i.textContent=n||t||"",a.classList.add("is-open"),a.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function me(){if(!H)return;const e=H.querySelector("img"),t=H.querySelector("figcaption");e&&(e.src="",e.alt=""),t&&(t.textContent=""),H.classList.remove("is-open"),H.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function V(e){return!Array.isArray(e)||!e.length?"":ut(e)}function v(e){return e?document.querySelector(e):null}function w(e){return`<p class="placeholder-text">${s(e)}</p>`}function Z(e){document.body.dataset.contentLoading=String(e)}function Sn(e){const t=document.querySelector("main");t&&t.insertAdjacentHTML("afterbegin",`<div class="notification error">${s(e)}</div>`)}function he(e,t,n,a){const r=(e==null?void 0:e.label)||n,i=(e==null?void 0:e.href)||a;if(!r||!i)return"";const l=i.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${t}" href="${p(i)}"${l}>${s(r)}</a>`}function An(){document.addEventListener("click",e=>{const t=e.target.closest('a[data-scroll="true"]');if(!t)return;const n=t.getAttribute("href")||"";Be(n)&&e.preventDefault()})}function Be(e){if(!e||!e.startsWith("#")||e.length===1)return!1;const t=document.querySelector(e);return t?(t.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function se(e,t,{month:n="short"}={}){if(!e)return"";const a=I(e);if(!a)return s(e);if(!t)return a.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});const r=I(t);if(!r)return`${a.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"})} – ${s(t)}`;const i=a.getFullYear()===r.getFullYear(),o=i&&a.getMonth()===r.getMonth();if(i&&o)return`${a.toLocaleDateString("en-US",{month:n})} ${a.getDate()}–${r.getDate()}, ${a.getFullYear()}`;if(i){const c=a.toLocaleDateString("en-US",{month:n,day:"numeric"}),u=r.toLocaleDateString("en-US",{month:n,day:"numeric"});return`${c} – ${u}, ${a.getFullYear()}`}const l=a.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"}),d=r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});return`${l} – ${d}`}function Ne(e){return e?pe(e.youtubeId)||pe(e.youtubeUrl):""}function pe(e){if(!e)return"";const t=String(e).trim();if(!t)return"";if(q.test(t))return t;let n;try{n=new URL(t)}catch{try{n=new URL(`https://${t}`)}catch{return""}}const a=n.hostname.replace(/^www\./,"").toLowerCase();if(a==="youtu.be"){const r=n.pathname.split("/").filter(Boolean)[0];return r&&q.test(r)?r:""}if(a==="youtube.com"||a.endsWith(".youtube.com")){const r=n.searchParams.get("v");if(r&&q.test(r))return r;const i=n.pathname.split("/").filter(Boolean);if(i.length>=2&&(i[0]==="embed"||i[0]==="shorts")){const o=i[1];return o&&q.test(o)?o:""}}return""}function s(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function p(e){return s(e)}function P(e){if(!e||typeof e.x!="number"||typeof e.y!="number")return"";const t=r=>Math.max(0,Math.min(1,r)),n=Math.round(t(e.x)*1e3)/10,a=Math.round(t(e.y)*1e3)/10;return`${n}% ${a}%`}function wn(e){if(!e)return"";const t=e.trim().split(/\s+/).filter(Boolean);return t.length?t.slice(0,2).map(n=>n.charAt(0).toUpperCase()).join(""):""}function Mn(e){if(!e)return[];const t=String(e).trim();return t?t.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:En(r)})):[]}function En(e){if(!e)return null;const t=e.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(e)?`tel:${t.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(e)?`mailto:${t}`:null}function Cn(e){return e?se(e.eventDate,e.endDate,{month:"short"}):""}function In(e){if(!e)return null;const t=I(e);return t?{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}:null}function Q(e,t="eventDate"){return Array.isArray(e)?[...e].sort((n,a)=>ye(a,t)-ye(n,t)):[]}function ye(e,t){if(!e)return 0;const n=e[t],a=I(n);if(a)return a.getTime();const r=I(e._createdAt);return r?r.getTime():0}function X(e){return e?typeof e.showOnHomePage=="boolean"?e.showOnHomePage:typeof e.featured=="boolean"?e.featured:typeof e.pinToTop=="boolean"?e.pinToTop:!0:!1}function Hn(e){const t=[],n=[];if(!Array.isArray(e))return{past:t,future:n};const a=new Date,r=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return e.forEach(i=>{if(!i)return;const o=I(i.endDate),l=I(i.eventDate),d=o||l;d&&d.getTime()>=r?n.push(i):t.push(i)}),{past:t,future:n}}function Pn(e,t){const n=new Set,a=[],r=i=>{if(!i)return;const o=i._id||i.id||`${i.course||""}|${i.eventDate||""}`;n.has(o)||(n.add(o),a.push(i))};return e.forEach(r),t.forEach(i=>{var o,l;i&&r({_id:i._id,course:i.course||i.title||i.headline||"",location:i.location||i.city||"",eventDate:i.eventDate,endDate:i.endDate,yardage:i.yardage||((l=(o=i.days)==null?void 0:o[0])==null?void 0:l.yardage)||""})}),a.sort((i,o)=>{var c,u;const l=((c=I(i==null?void 0:i.eventDate))==null?void 0:c.getTime())??Number.POSITIVE_INFINITY,d=((u=I(o==null?void 0:o.eventDate))==null?void 0:u.getTime())??Number.POSITIVE_INFINITY;return l-d}),a}function xn(e){if(e||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(n=>n.classList.add("is-visible"));return}const t=new IntersectionObserver(n=>{n.forEach(a=>{a.isIntersecting&&(a.target.classList.add("is-visible"),t.unobserve(a.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(n=>t.observe(n))}function Dn(){const e=document.querySelector('[data-panel="resume"]'),t=document.querySelector('[data-panel="highlights"]'),n=document.querySelector('[data-panel="media"]'),a=document.querySelector('[data-panel="dual"]');if(!e||!t||!n||!a)return;const r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,i=document.body,o=(g,f,y)=>Math.max(f,Math.min(y,g)),l=g=>o(1-3*g,0,1),d=g=>o(3*g-2,0,1);let c=!1;const u=()=>{c=!1;const g=window.innerHeight,f=e.getBoundingClientRect(),y=t.getBoundingClientRect(),m=n.getBoundingClientRect(),k=a.getBoundingClientRect(),b=y.top-f.bottom,S=k.top-m.bottom,A=o((g-f.bottom)/Math.max(1,g+b),0,1),L=o((g-m.bottom)/Math.max(1,g+S),0,1),T=A*(1-L);i.style.setProperty("--theme-t",r?T>=.5?"1":"0":T.toFixed(4)),T>=.5?i.dataset.theme!=="dark"&&(i.dataset.theme="dark"):i.dataset.theme==="dark"&&delete i.dataset.theme,r||(e.style.opacity=String(l(A)),t.style.opacity=String(d(A)),n.style.opacity=String(l(L)),a.style.opacity=String(d(L)))},h=()=>{c||(requestAnimationFrame(u),c=!0)};window.addEventListener("scroll",h,{passive:!0}),window.addEventListener("resize",h,{passive:!0}),u()}function Bn(e){const t=Array.from(document.querySelectorAll("[data-counter]"));if(!t.length)return;const n=l=>{const d=Number(l.getAttribute("data-counter")),c=l.getAttribute("data-counter-suffix")||"";if(!Number.isFinite(d))return;const u=J(l.getAttribute("data-counter"));l.textContent=ee(d,u)+c,l.dataset.counterDone="true"};if(e){t.forEach(n);return}t.forEach(l=>{const d=J(l.getAttribute("data-counter"));l.textContent=ee(0,d)+(l.getAttribute("data-counter-suffix")||"")});const a=l=>{if(l.dataset.counterDone==="true")return;l.dataset.counterDone="true";const d=Number(l.getAttribute("data-counter")),c=l.getAttribute("data-counter-suffix")||"";if(!Number.isFinite(d)){n(l);return}const u=J(l.getAttribute("data-counter")),h=1200,g=Date.now(),f=setInterval(()=>{const y=Date.now()-g,m=Math.min(1,y/h),k=1-Math.pow(1-m,3),b=d*k;l.textContent=ee(b,u)+c,m>=1&&(clearInterval(f),n(l))},16)},r=l=>{const d=l.getBoundingClientRect(),c=window.innerHeight||document.documentElement.clientHeight;return d.top<c*.9&&d.bottom>0},i=()=>{let l=0;return t.forEach(d=>{d.dataset.counterDone!=="true"&&(r(d)?a(d):l+=1)}),l};i();const o=()=>{i()===0&&(window.removeEventListener("scroll",o,{passive:!0}),window.removeEventListener("resize",o))};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o)}function J(e){if(typeof e!="string")return 0;const t=e.indexOf(".");return t>=0?e.length-t-1:0}function ee(e,t){return t>0?e.toFixed(t):String(Math.round(e))}
