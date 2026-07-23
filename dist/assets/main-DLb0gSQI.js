import{f as _e,p as I}from"./sanityClient-CZcwtr9M.js";/* empty css               */function F(e){return e._type==="span"&&"text"in e&&typeof e.text=="string"&&(typeof e.marks>"u"||Array.isArray(e.marks)&&e.marks.every(t=>typeof t=="string"))}function $e(e){return typeof e._type=="string"&&e._type[0]!=="@"&&(!("markDefs"in e)||!e.markDefs||Array.isArray(e.markDefs)&&e.markDefs.every(t=>typeof t._key=="string"))&&"children"in e&&Array.isArray(e.children)&&e.children.every(t=>typeof t=="object"&&"_type"in t)}function ve(e){return $e(e)&&"listItem"in e&&typeof e.listItem=="string"&&(typeof e.level>"u"||typeof e.level=="number")}function ke(e){return e._type==="@list"}function Le(e){return e._type==="@span"}function Te(e){return e._type==="@text"}const ce=["strong","em","code","underline","strike-through"];function je(e,t,n){if(!F(e)||!e.marks)return[];if(!e.marks.length)return[];const a=e.marks.slice(),r={};return a.forEach(i=>{r[i]=1;for(let o=t+1;o<n.length;o++){const l=n[o];if(l&&F(l)&&Array.isArray(l.marks)&&l.marks.indexOf(i)!==-1)r[i]++;else break}}),a.sort((i,o)=>Ue(r,i,o))}function Ue(e,t,n){const a=e[t],r=e[n];if(a!==r)return r-a;const i=ce.indexOf(t),o=ce.indexOf(n);return i!==o?i-o:t.localeCompare(n)}function qe(e){var o;const{children:t}=e,n=e.markDefs??[];if(!t||!t.length)return[];const a=t.map(je),r={_type:"@span",children:[],markType:"<unknown>"};let i=[r];for(let l=0;l<t.length;l++){const d=t[l];if(!d)continue;const c=a[l]||[];let u=1;if(i.length>1)for(u;u<i.length;u++){const m=((o=i[u])==null?void 0:o.markKey)||"",f=c.indexOf(m);if(f===-1)break;c.splice(f,1)}i=i.slice(0,u);let g=i[i.length-1];if(g){for(const m of c){const f=n==null?void 0:n.find(L=>L._key===m),b=f?f._type:m,h={_type:"@span",_key:d._key,children:[],markDef:f,markType:b,markKey:m};g.children.push(h),i.push(h),g=h}if(F(d)){const m=d.text.split(`
`);for(let f=m.length;f-- >1;)m.splice(f,0,`
`);g.children=g.children.concat(m.map(f=>({_type:"@text",text:f})))}else g.children=g.children.concat(d)}}return r.children}function Re(e,t){const n=[];let a;for(let r=0;r<e.length;r++){const i=e[r];if(i){if(!ve(i)){n.push(i),a=void 0;continue}if(!a){a=Y(i,r,t),n.push(a);continue}if(Ye(i,a)){a.children.push(i);continue}if((i.level||1)>a.level){const o=Y(i,r,t);{const l=a.children[a.children.length-1],d={...l,children:[...l.children,o]};a.children[a.children.length-1]=d}a=o;continue}if((i.level||1)<a.level){const o=n[n.length-1],l=o&&ne(o,i);if(l){a=l,a.children.push(i);continue}a=Y(i,r,t),n.push(a);continue}if(i.listItem!==a.listItem){const o=n[n.length-1],l=o&&ne(o,{level:i.level||1});if(l&&l.listItem===i.listItem){a=l,a.children.push(i);continue}else{a=Y(i,r,t),n.push(a);continue}}console.warn("Unknown state encountered for block",i),n.push(i)}}return n}function Ye(e,t){return(e.level||1)===t.level&&e.listItem===t.listItem}function Y(e,t,n){return{_type:"@list",_key:`${e._key||`${t}`}-parent`,mode:n,level:e.level||1,listItem:e.listItem,children:[e]}}function ne(e,t){const n=t.level||1,a=t.listItem||"normal",r=typeof t.listItem=="string";if(ke(e)&&(e.level||1)===n&&r&&(e.listItem||"normal")===a)return e;if(!("children"in e))return;const i=e.children[e.children.length-1];return i&&!F(i)?ne(i,t):void 0}function Ae(e){let t="";return e.children.forEach(n=>{Te(n)?t+=n.text:Le(n)&&(t+=Ae(n))}),t}const Ve=["http","https","mailto","tel"],Fe={"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#x27"};function Se(e){return Ge(e.replace(/[&<>"']/g,t=>`&${Fe[t]};`))}function Ge(e){return e.replace(/ {2,}/g,t=>`${"&nbsp;".repeat(t.length-1)} `)}function We(e){const t=(e||"").trim(),n=t.charAt(0);if(n==="#"||n==="/")return!0;const a=t.indexOf(":");if(a===-1)return!0;const r=t.slice(0,a).toLowerCase();if(Ve.indexOf(r)!==-1)return!0;const i=t.indexOf("?");if(i!==-1&&a>i)return!0;const o=t.indexOf("#");return o!==-1&&a>o}const ze={number:({children:e})=>`<ol>${e}</ol>`,bullet:({children:e})=>`<ul>${e}</ul>`},Ke=({children:e})=>`<li>${e}</li>`,Ze=({children:e,value:t})=>{const n=(t==null?void 0:t.href)||"";return We(n)?`<a href="${Se(n)}">${e}</a>`:e},Qe={em:({children:e})=>`<em>${e}</em>`,strong:({children:e})=>`<strong>${e}</strong>`,code:({children:e})=>`<code>${e}</code>`,underline:({children:e})=>`<span style="text-decoration:underline">${e}</span>`,"strike-through":({children:e})=>`<del>${e}</del>`,link:Ze},R=(e,t)=>`Unknown ${e}, specify a component for it in the \`components.${t}\` option`,we=e=>R(`block type "${e}"`,"types"),Xe=e=>R(`mark type "${e}"`,"marks"),Je=e=>R(`block style "${e}"`,"block"),et=e=>R(`list style "${e}"`,"list"),tt=e=>R(`list item style "${e}"`,"listItem");function nt(e){console.warn(e)}const at=({value:e,isInline:t})=>{const n=we(e._type);return t?`<span style="display:none">${n}</span>`:`<div style="display:none">${n}</div>`},rt=({markType:e,children:t})=>`<span class="unknown__pt__mark__${e}">${t}</span>`,it=({children:e})=>`<p>${e}</p>`,st=({children:e})=>`<ul>${e}</ul>`,lt=({children:e})=>`<li>${e}</li>`,ot=()=>"<br/>",ct={normal:({children:e})=>`<p>${e}</p>`,blockquote:({children:e})=>`<blockquote>${e}</blockquote>`,h1:({children:e})=>`<h1>${e}</h1>`,h2:({children:e})=>`<h2>${e}</h2>`,h3:({children:e})=>`<h3>${e}</h3>`,h4:({children:e})=>`<h4>${e}</h4>`,h5:({children:e})=>`<h5>${e}</h5>`,h6:({children:e})=>`<h6>${e}</h6>`},de={types:{},block:ct,marks:Qe,list:ze,listItem:Ke,hardBreak:ot,escapeHTML:Se,unknownType:at,unknownMark:rt,unknownList:st,unknownListItem:lt,unknownBlockStyle:it};function dt(e,t){const{block:n,list:a,listItem:r,marks:i,types:o,...l}=t;return{...e,block:U(e,t,"block"),list:U(e,t,"list"),listItem:U(e,t,"listItem"),marks:U(e,t,"marks"),types:U(e,t,"types"),...l}}function U(e,t,n){const a=t[n],r=e[n];return typeof a=="function"||a&&typeof r=="function"?a:a?{...r,...a}:r}function ut(e,t={}){const{components:n,onMissingComponent:a=nt}=t,r=a||gt,i=Array.isArray(e)?e:[e],o=Re(i,"html"),l=n?dt(de,n):de,d=ft(l,r);return o.map((c,u)=>d({node:c,index:u,isInline:!1,renderNode:d})).join("")}const ft=(e,t)=>{function n(c){const{node:u,index:g,isInline:m}=c;return ke(u)?r(u,g):ve(u)?a(u,g):Le(u)?i(u):$e(u)?o(u,g,m):Te(u)?l(u):d(u,g,m)}function a(c,u){const g=ue({node:c,index:u,isInline:!1,renderNode:n}),m=e.listItem,f=(typeof m=="function"?m:m[c.listItem])||e.unknownListItem;if(f===e.unknownListItem){const h=c.listItem||"bullet";t(tt(h),{type:h,nodeType:"listItemStyle"})}let b=g.children;if(c.style&&c.style!=="normal"){const{listItem:h,...L}=c;b=n({node:L,index:u,isInline:!1})}return f({value:c,index:u,isInline:!1,renderNode:n,children:b})}function r(c,u){const g=c.children.map((b,h)=>n({node:b._key?b:{...b,_key:`li-${u}-${h}`},index:h,isInline:!1})),m=e.list,f=(typeof m=="function"?m:m[c.listItem])||e.unknownList;if(f===e.unknownList){const b=c.listItem||"bullet";t(et(b),{nodeType:"listStyle",type:b})}return f({value:c,index:u,isInline:!1,renderNode:n,children:g.join("")})}function i(c){const{markDef:u,markType:g,markKey:m}=c,f=e.marks[g]||e.unknownMark,b=c.children.map((h,L)=>n({node:h,index:L,isInline:!0}));return f===e.unknownMark&&t(Xe(g),{nodeType:"mark",type:g}),f({text:Ae(c),value:u,markType:g,markKey:m,renderNode:n,children:b.join("")})}function o(c,u,g){const{_key:m,...f}=ue({node:c,index:u,isInline:g,renderNode:n}),b=f.node.style||"normal",h=(typeof e.block=="function"?e.block:e.block[b])||e.unknownBlockStyle;return h===e.unknownBlockStyle&&t(Je(b),{nodeType:"blockStyle",type:b}),h({...f,value:f.node,renderNode:n})}function l(c){if(c.text===`
`){const u=e.hardBreak;return u?u():`
`}return e.escapeHTML(c.text)}function d(c,u,g){const m=e.types[c._type];return m||t(we(c._type),{nodeType:"block",type:c._type}),(m||e.unknownType)({value:c,isInline:g,index:u,renderNode:n})}return n};function ue(e){const{node:t,index:n,isInline:a,renderNode:r}=e,i=qe(t).map((o,l)=>r({node:o,isInline:!0,index:l,renderNode:r}));return{_key:t._key||`block-${n}`,children:i.join(""),index:n,isInline:a,node:t}}function gt(){}const z="images/samuel-placeholder.svg",Me=z,V=/^[a-zA-Z0-9_-]{11}$/,v={heroCopy:'[data-template="hero-copy"]',heroPhoto:'[data-template="hero-photo"]',accoladesMarquee:'[data-template="accolades-marquee"]',workInterstitial:'[data-template="work-interstitial"]',workMindset:'[data-template="work-mindset"]',coachSnapshot:'[data-template="coach-snapshot"]',aboutHeading:'[data-template="about-heading"]',aboutGrid:'[data-template="about-grid"]',resumeHeading:'[data-template="resume-heading"]',resumePanels:'[data-template="resume-panels"]',academicsHeading:'[data-template="academics-heading"]',academicsGrid:'[data-template="academics-grid"]',highlightsHeading:'[data-template="highlights-heading"]',highlightsTimeline:'[data-template="timeline"]',upcomingHeading:'[data-template="upcoming-heading"]',upcomingGrid:'[data-template="upcoming-grid"]',videosHeading:'[data-template="videos-heading"]',videoGrid:'[data-template="video-grid"]',videosActions:'[data-template="videos-actions"]',galleryHeading:'[data-template="gallery-heading"]',galleryGrid:'[data-template="gallery-grid"]',galleryActions:'[data-template="gallery-actions"]',dualHeading:'[data-template="dual-heading"]',dualGrid:'[data-template="dual-grid"]',contactHeading:'[data-template="contact-heading"]',contactGrid:'[data-template="contact-grid"]',highlightsActions:'[data-template="highlights-actions"]'},E={meta:null,allItems:[],items:[],videos:[],photos:[]},q={meta:null,items:[],totalCount:0},G={meta:null,items:[]};document.addEventListener("DOMContentLoaded",async()=>{mt(),Cn();const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches;await ht(),window.location.hash&&setTimeout(()=>Ne(window.location.hash),100),Nn(e),_n(e),On()});function mt(){const e=document.querySelector(".nav-toggle"),t=document.querySelector(".nav-links");!e||!t||(e.addEventListener("click",()=>{const n=e.getAttribute("aria-expanded")==="true"?"false":"true";e.setAttribute("aria-expanded",n),t.classList.toggle("is-open")}),t.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{e.setAttribute("aria-expanded","false"),t.classList.remove("is-open")})}))}async function ht(){Q(!0);const e=await _e();if(!e)return Mn("Unable to load the latest content. Please try again shortly."),Q(!1),null;pt(e.site),yt(e.hero,e.site),bt(e.resume,e.hero),At(e.coachSnapshot,{hero:e.hero,about:e.about}),wt(e.about,{academics:e.academics}),kt(e.about,e.highlightEvents),Mt(e.resume),_t(e.academics);const t=X(e.highlightEvents||[]),{past:n,future:a}=xn(t);E.meta=e.highlightsSection,E.allItems=n,E.items=n.filter(J),jt();const r=Array.isArray(e.upcomingTournaments)?e.upcomingTournaments:[],i=Bn(r,a);Et(e.upcomingTournamentsSection,i);const o=X(e.videos||[],"eventDate");E.videos=o,q.meta=e.videosSection,q.items=o.filter(J),q.totalCount=o.length,Ut();const l=X(e.galleryPhotos||[],"shotDate");return E.photos=l,G.meta=e.gallerySection,G.items=l.filter(J),qt(),Yt(e.dualSport),Ft(e.contact),Gt(e.footer,e.contact),Q(!1),se(),e}function pt(e){var a;if(!e)return;if(e.siteTitle){document.title=e.siteTitle;const r=document.querySelector(".brand-text");r&&(r.textContent=e.siteTitle)}const t=document.querySelector('meta[name="description"]');t&&e.seoDescription&&t.setAttribute("content",e.seoDescription);const n=document.querySelector(".brand-mark");if(n)if((a=e.brandMarkImage)!=null&&a.url){const r=B(e.brandMarkImage.focalPoint||e.brandMarkImage.hotspot),i=r?` style="object-position: ${y(r)};"`:"";n.innerHTML=`<span class="brand-mark-image"><img src="${y(e.brandMarkImage.url)}" alt="${s(e.brandMarkImage.alt||e.siteTitle||"Site logo")}" loading="lazy"${i} /></span>`,n.classList.add("has-image")}else{const r=e.brandMarkInitials||En(e.siteTitle)||n.textContent||"SM";n.textContent=r,n.classList.remove("has-image")}}function yt(e,t){var r,i,o,l;const n=k(v.heroCopy),a=k(v.heroPhoto);if(!e){n&&(n.innerHTML=C("Hero content coming soon."));return}if(n){const d=e.tagline?`<p class="hero-tag">${s(e.tagline)}</p>`:"",c=e.bio?`<p>${s(e.bio)}</p>`:"",u=[pe(e.primaryCta,"primary","View Highlights","#highlights"),pe(null,"ghost","Schedule a Conversation","#contact")].filter(Boolean).join(""),g=Array.isArray(e.metrics)?e.metrics.filter(f=>f&&(f.label||f.value)).map(f=>{const b=f.value||"",h=String(b).trim().match(/^(-?\d+(?:\.\d+)?)(.*)$/);return`
              <li class="hero-snapshot-item">
                <span class="hero-snapshot-value"${h?` data-counter="${y(h[1])}" data-counter-suffix="${y(h[2]||"")}"`:""}>${s(b)}</span>
                <span class="hero-snapshot-label">${s(f.label||"")}</span>
              </li>
            `}).join(""):"",m=g?`<ul class="hero-snapshot" aria-label="Player snapshot">${g}</ul>`:"";n.innerHTML=`
      ${d}
      <h1>${s(e.headline||(t==null?void 0:t.siteTitle)||"")}</h1>
      ${m}
      ${c}
      <div class="hero-actions">
        ${u||'<span class="placeholder-text">Actions coming soon.</span>'}
      </div>
    `}if(a){const d=((r=e.headshot)==null?void 0:r.url)||z,c=((i=e.headshot)==null?void 0:i.alt)||"Portrait of Samuel Masco",u=B(((o=e.headshot)==null?void 0:o.focalPoint)||((l=e.headshot)==null?void 0:l.hotspot)),g=u?` style="object-position: ${y(u)};"`:"";a.innerHTML=`
      <div class="hero-photo-frame">
        <img src="${d}" alt="${s(c)}" loading="lazy"${g} />
      </div>
    `}}function bt(e,t){const n=k(v.accoladesMarquee);if(!n)return;let a=[];const i=(Array.isArray(t==null?void 0:t.accolades)?t.accolades:[]).map(d=>typeof d=="string"?d.trim():"").filter(Boolean);if(i.length?a=i:a=(Array.isArray(e==null?void 0:e.experienceList)?e.experienceList:[]).map($t).filter(Boolean),!a.length&&(t!=null&&t.tagline)&&a.push(t.tagline),!a.length){n.hidden=!0,n.innerHTML="";return}n.hidden=!1;const l=a.concat(a).map(d=>`
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
  `}function $t(e){if(typeof e!="string")return null;const t=e.trim();if(!t)return null;const n=t.match(/"([^"]{3,80})"/);if(n)return n[1].trim();const a=/(\d+(?:st|nd|rd|th)\s+Place[^.,;()]*|Top\s*\d+[^.,;()]*|Rookie[^.,;()]*|Most Improved[^.,;()]*|Invitee[^.,;()]*|First Team[^.,;()]*|Champion[^.,;()]*|Winner[^.,;()]*|Ranked\s+\d+\/\d+[^.,;()]*)/i,r=t.match(a);if(r)return r[1].trim();const i=t.split(/[-–—•·]/)[0].trim();return i.length>60?i.slice(0,57)+"…":i}function vt(e,t){const n=k(v.workInterstitial);if(!n)return;const a=(e==null?void 0:e.workInterstitial)||null,r=Array.isArray(e==null?void 0:e.quickHits)?e.quickHits:[],i=$=>r.find(S=>typeof(S==null?void 0:S.label)=="string"&&$.test(S.label)),o=i(/years?\s*playing/i),l=i(/train(ing)?/i),d=Lt(o==null?void 0:o.value)||null,c=Tt(l==null?void 0:l.value)||null,u=Array.isArray(t)?t:[],g=u.map($=>{var S;return(S=I($==null?void 0:$.eventDate))==null?void 0:S.getFullYear()}).filter($=>Number.isFinite($)),m=u.length?String(u.length):null,f=g.length?`tournaments since ${Math.min(...g)}`:"tournaments",b=((a==null?void 0:a.kicker)||"The Work").trim(),h=((a==null?void 0:a.lineOneNumber)||d||"").trim(),L=((a==null?void 0:a.lineOneUnit)||(d?"years playing":"")).trim(),p=((a==null?void 0:a.lineTwoNumber)||c||"").trim(),A=((a==null?void 0:a.lineTwoUnit)||(c?"days a week training":"")).trim(),M=((a==null?void 0:a.lineThreeNumber)||(a?"":m||"")).trim(),T=((a==null?void 0:a.lineThreeUnit)||(a||!m?"":f)).trim(),w=[{number:h,unit:L},{number:p,unit:A},{number:M,unit:T}].filter($=>$.number||$.unit);if(!w.length){n.hidden=!0;return}n.innerHTML=`
    <div class="interstitial-inner">
      <p class="interstitial-kicker">${s(b)}</p>
      ${w.map($=>`
            <p class="interstitial-line">
              ${$.number?`<span class="interstitial-number">${s($.number)}</span>`:""}
              ${$.unit?`<span class="interstitial-unit">${s($.unit)}</span>`:""}
            </p>
          `).join("")}
    </div>
  `,n.hidden=!1}function kt(e,t){vt(e,t);const n=k(v.workMindset);if(n){if(!(e!=null&&e.mindsetBody)){n.hidden=!0;return}n.hidden=!1,n.innerHTML=`
    <h3 class="work-mindset-title">${s(e.mindsetTitle||"Mindset & Goals")}</h3>
    <div class="work-mindset-body">${K(e.mindsetBody)}</div>
  `}}function Lt(e){if(typeof e!="string")return null;const t=e.match(/^\s*(\d+(?:\.\d+)?)/);return t?t[1]:null}function Tt(e){if(typeof e!="string")return null;const t=e.trim(),n=t.match(/^\s*(\d+)\s*[-–—]\s*(\d+)/);if(n)return`${n[1]}–${n[2]}`;const a=t.match(/^\s*(\d+)/);return a?a[1]:null}function At(e,t={}){const n=k(v.coachSnapshot);if(!n)return;if(!(e&&[e.gpaWeighted,e.satScore,e.actScore,e.ncaaId,e.ncaaStatus,e.transcriptUrl,e.parentName,e.parentEmail,e.parentPhone,e.clubCoachName,e.clubCoachEmail,e.clubCoachPhone,e.hsCoachName,e.hsCoachEmail,e.hsCoachPhone].some(T=>typeof T=="string"&&T.trim()!==""))){n.hidden=!0,n.innerHTML="";return}const r=t.about||{},i=Array.isArray(r.profileFacts)?r.profileFacts:[],o=T=>{var w;return((w=i.find($=>($==null?void 0:$.label)&&T.test($.label)))==null?void 0:w.value)||""},l=o(/graduat/i),d=(e==null?void 0:e.classYear)||(l?`Class of ${l}`:""),c={eyebrow:(e==null?void 0:e.eyebrow)||"Coach Snapshot",heading:(e==null?void 0:e.heading)||"The 30-second read",subheading:(e==null?void 0:e.subheading)||"",classYear:d,gpaWeighted:(e==null?void 0:e.gpaWeighted)||"",sat:(e==null?void 0:e.satScore)||"",act:(e==null?void 0:e.actScore)||"",ncaaId:(e==null?void 0:e.ncaaId)||"",ncaaStatus:(e==null?void 0:e.ncaaStatus)||"",transcriptLabel:(e==null?void 0:e.transcriptLabel)||"Download transcript",transcriptUrl:(e==null?void 0:e.transcriptUrl)||"",parentName:(e==null?void 0:e.parentName)||"",parentRole:(e==null?void 0:e.parentRole)||"",parentEmail:(e==null?void 0:e.parentEmail)||"",parentPhone:(e==null?void 0:e.parentPhone)||"",clubCoachName:(e==null?void 0:e.clubCoachName)||o(/private\s*coach|club\s*coach/i),clubCoachOrg:(e==null?void 0:e.clubCoachOrg)||"",clubCoachEmail:(e==null?void 0:e.clubCoachEmail)||"",clubCoachPhone:(e==null?void 0:e.clubCoachPhone)||"",hsCoachName:(e==null?void 0:e.hsCoachName)||"",hsCoachEmail:(e==null?void 0:e.hsCoachEmail)||"",hsCoachPhone:(e==null?void 0:e.hsCoachPhone)||"",verifiedAt:(e==null?void 0:e.verifiedAt)||o(/verified/i)},u=(T,w,$=!1)=>{if(!w)return"";const S=$?"coach-snapshot-fact-value coach-snapshot-fact-value--mono":"coach-snapshot-fact-value";return`
      <div class="coach-snapshot-fact">
        <span class="coach-snapshot-fact-label">${s(T)}</span>
        <span class="${S}">${s(w)}</span>
      </div>
    `},g=(T,w,$,S)=>{if(!T&&!$&&!S)return"";const H=w?`<span class="coach-snapshot-contact-role">${s(w)}</span>`:"",P=$?`<a href="tel:${y($.replace(/[^0-9+]/g,""))}">${s($)}</a>`:"",D=S?`<a href="mailto:${y(S)}">${s(S)}</a>`:"",j=[P,D].filter(Boolean).join('<span class="coach-snapshot-contact-divider" aria-hidden="true">·</span>');return`
      <div class="coach-snapshot-contact">
        <div class="coach-snapshot-contact-identity">
          <span class="coach-snapshot-contact-name">${s(T||"")}</span>
          ${H}
        </div>
        ${j?`<div class="coach-snapshot-contact-meta">${j}</div>`:""}
      </div>
    `},m=[u("Class",c.classYear),u("GPA (W)",c.gpaWeighted,!0),u("SAT",c.sat,!0),u("ACT",c.act,!0)].filter(Boolean).join(""),f=[u("NCAA ID",c.ncaaId,!0),u("NCAA Status",c.ncaaStatus),u("Verified",St(c.verifiedAt))].filter(Boolean).join(""),b=c.transcriptUrl?`<a class="btn subtle coach-snapshot-transcript" href="${y(c.transcriptUrl)}" target="_blank" rel="noopener">${s(c.transcriptLabel)}</a>`:"",h=[g(c.parentName,c.parentRole||"Parent / Guardian",c.parentPhone,c.parentEmail),g(c.clubCoachName,c.clubCoachOrg||"Private Coach",c.clubCoachPhone,c.clubCoachEmail),g(c.hsCoachName,"HS Coach",c.hsCoachPhone,c.hsCoachEmail)].filter(Boolean).join(""),L=[m?{title:"By the numbers",body:m}:null,f||b?{title:"Eligibility",body:`${f}${b?`<div class="coach-snapshot-transcript-wrap">${b}</div>`:""}`}:null,h?{title:"Recruiting contacts",body:h}:null].filter(Boolean);if(!L.length){n.hidden=!0;return}const p=`<p class="section-kicker">${s(c.eyebrow)}</p>`,A=`<h2 class="coach-snapshot-heading">${s(c.heading)}</h2>`,M=c.subheading?`<p class="coach-snapshot-subheading">${s(c.subheading)}</p>`:"";n.hidden=!1,n.innerHTML=`
    <header class="coach-snapshot-header" data-motion>
      ${p}
      ${A}
      ${M}
    </header>
    <div class="coach-snapshot-grid">
      ${L.map((T,w)=>`
            <section class="coach-snapshot-column" data-motion="delay-${w+1}">
              <h3 class="coach-snapshot-column-title">${s(T.title)}</h3>
              <div class="coach-snapshot-column-body">${T.body}</div>
            </section>
          `).join("")}
    </div>
  `}function St(e){if(!e)return"";const t=I(e);if(!t)return String(e);try{return t.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}catch{return String(e)}}function wt(e,t={}){const n=k(v.aboutHeading),a=k(v.aboutGrid),r=t.academics||null;if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"About")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:C("About section coming soon.")),!a)return;if(!e){a.innerHTML=C("About details coming soon.");return}const i=`
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
  `;let l="";if(r){const d=[{label:"School",value:r.schoolCardTitle},{label:"GPA",value:r.gpa},{label:"Honors / AP",value:r.honors},{label:"AP / IB Status",value:r.apCourses}].filter(m=>m.value),c=d.length?`
          <div class="about-facts">
            ${d.map(m=>`
                  <div class="about-fact">
                    <span class="about-fact-label">${s(m.label)}</span>
                    <span class="about-fact-value">${s(m.value)}</span>
                  </div>
                `).join("")}
          </div>
        `:"",u=r.interestsBody?`<div class="about-academics-interests">${K(r.interestsBody)}</div>`:"",g=r.transcriptUrl?`<a class="btn subtle" href="${y(r.transcriptUrl)}" target="_blank" rel="noopener">${s(r.transcriptLabel||"Transcript")}</a>`:"";(c||u||g)&&(l=`
        <article class="about-card about-academics" data-motion="delay-4">
          <h3>${s(r.heading||"Academics")}</h3>
          ${c}
          ${u}
          ${g?`<div class="about-academics-actions">${g}</div>`:""}
        </article>
      `)}a.innerHTML=`
    ${i}
    ${o}
    ${l}
  `}function Mt(e){const t=k(v.resumeHeading),n=k(v.resumePanels);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Golf Resume")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:C("Golf resume coming soon.")),n){if(!e){n.innerHTML=C("Resume details coming soon.");return}const a=/^(handicap|gpa)$/i,r=Array.isArray(e.performanceStats)?e.performanceStats:[],i=[],o=[];r.forEach(f=>{Pt(f)?i.push(...Ot(f==null?void 0:f.value)):a.test(((f==null?void 0:f.label)||"").trim())||o.push(f)});const l=Array.isArray(e.clubYardages)?e.clubYardages:[],d=l.length?l:i,c=d.length>0,u=e.clubYardagesTitle||"Club Yardages",g=c?`
          <div class="performance-clubs">
            <h4 class="performance-section-title">${s(u)}</h4>
            ${Nt(d)}
          </div>
        `:"",m=o.map(f=>{const b=f.value||"",h=String(b).trim().match(/^(-?\d+(?:\.\d+)?)(.*)$/),L=h?` data-counter="${y(h[1])}" data-counter-suffix="${y(h[2]||"")}"`:"";return`
          <div class="performance-stat">
            <span class="performance-stat-label">${s(f.label||"")}</span>
            <span class="performance-stat-value"${L}>${s(b)}</span>
          </div>
        `}).join("");n.innerHTML=`
      <article class="panel performance-panel" data-motion="delay-1">
        <h3>${s(e.performanceTitle||"Performance Snapshot")}</h3>
        <div class="performance-content">
          <div class="performance-stats-grid" data-count="${o.length}">
            ${m}
          </div>
          ${g}
        </div>
      </article>
      <article class="panel" data-motion="delay-2">
        <h3>${s(e.trainingTitle||"Training Routine")}</h3>
        ${K(e.trainingBody)}
      </article>
      <article class="panel" data-motion="delay-3">
        <h3>${s(e.experienceTitle||"Playing Experience")}</h3>
        <ul>
          ${(e.experienceList||[]).map(f=>`<li>${s(f||"")}</li>`).join("")}
        </ul>
      </article>
      ${Ct(e)}
    `}}function Ct(e){const t=(Array.isArray(e.volunteering)?e.volunteering:[]).filter(a=>a&&a.role);if(!t.length)return"";const n=t.map(a=>{const r=[a.organization,a.location].filter(Boolean).join(" · "),i=[a.timeframe,a.program].filter(Boolean).join(" · ");return`
        <div class="volunteer-entry">
          <p class="volunteer-role">${s(a.role)}</p>
          ${r?`<p class="volunteer-org">${s(r)}</p>`:""}
          ${i?`<p class="volunteer-meta">${s(i)}</p>`:""}
          ${a.description?`<p class="volunteer-desc">${s(a.description)}</p>`:""}
          ${a.hours?`<p class="volunteer-hours"><span class="volunteer-hours-label">Hours completed</span><span class="volunteer-hours-value">${s(a.hours)}</span></p>`:""}
        </div>
      `}).join("");return`
    <article class="panel volunteer-panel" data-motion="delay-4">
      <h3>${s(e.volunteeringTitle||"Volunteering & Leadership")}</h3>
      ${n}
    </article>
  `}function Et(e,t){const n=k(v.upcomingHeading),a=k(v.upcomingGrid);if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"Upcoming Tournaments")}</h2>
          ${e.subheading?`<p>${s(e.subheading)}</p>`:""}
        `:`
          <h2>Upcoming Tournaments</h2>
          <p>Next events on Samuel's competitive schedule.</p>
        `),!a)return;const r=Array.isArray(t)?t:[];if(!r.length){a.innerHTML=C("Upcoming tournaments coming soon.");return}const i=Math.max(1,(e==null?void 0:e.maxItems)||r.length),o=r.slice(0,i);a.innerHTML=o.map((l,d)=>It(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible"))}function It(e,t=0){if(!e)return"";const n=e.course||"Course TBD",a=e.location||"",r=le(e.eventDate,e.endDate,{month:"short"}),i=Ht(e.yardage);return`
    <article class="upcoming-card" data-motion="delay-${t%4+1}">
      <div class="upcoming-card-date">${r||"Date TBD"}</div>
      <h3 class="upcoming-card-course">${s(n)}</h3>
      <div class="upcoming-card-meta">
        ${a?`<span class="upcoming-card-location">${s(a)}</span>`:""}
        ${i?`<span class="upcoming-card-yardage">${s(i)}</span>`:""}
      </div>
    </article>
  `}function Ht(e){if(e==null)return"";const t=String(e).trim();return t?/yard|yd/i.test(t)?t:`${t} yds`:""}function Pt(e){return!e||typeof e.label!="string"?!1:/club\s*yardage/i.test(e.label)}const Dt=["Woods","Irons","Wedges","Putter","Other"];function xt(e){const t=(e||"").toLowerCase();return/putter/.test(t)?"Putter":/wedge/.test(t)?"Wedges":/iron/.test(t)?"Irons":/driver|wood|hybrid|\b\d+\s*w\b|\b\dw\b/.test(t)?"Woods":"Other"}function Bt(e){if(e==null)return"";const t=String(e).trim();return t?/yard|yd/i.test(t)?t:`${t} yds`:""}function Nt(e){const t=new Map;if(e.forEach(r=>{if(!r||!r.club)return;const i=xt(r.club);t.has(i)||t.set(i,[]),t.get(i).push(r)}),!t.size)return"";const n=Dt.filter(r=>t.has(r));Array.from(t.keys()).forEach(r=>{n.includes(r)||n.push(r)});const a=n.length>1;return`
    <div class="club-yardage-groups">
      ${n.map(r=>{const i=t.get(r)||[];return`
            <div class="club-yardage-group">
              ${a?`<h5 class="club-yardage-group-title">${s(r)}</h5>`:""}
              <ul class="club-yardage-list">
                ${i.map(o=>`
                      <li>
                        <span class="club-yardage-name">${s((o==null?void 0:o.club)||"")}</span>
                        <span class="club-yardage-value">${s(Bt(o==null?void 0:o.yardage))}</span>
                      </li>
                    `).join("")}
              </ul>
            </div>
          `}).join("")}
    </div>
  `}function Ot(e){return!e||typeof e!="string"?[]:e.split(/[,\n;]/).map(t=>t.trim()).filter(Boolean).map(t=>{const n=t.indexOf(":");if(n>-1)return{club:t.slice(0,n).trim(),yardage:t.slice(n+1).trim()};const a=t.match(/^(.*?)\s+(\d[\d,]*)(\s*(?:yds?|yards?)?)\s*$/i);return a?{club:a[1].trim(),yardage:`${a[2]}${a[3]?a[3].trim():""}`}:{club:t,yardage:""}}).filter(t=>t.club)}function _t(e){const t=k(v.academicsHeading),n=k(v.academicsGrid);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Academics")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:C("Academics section coming soon.")),n){if(!e){n.innerHTML=C("Academic details coming soon.");return}const a=e.transcriptLabel||"Transcript",r=e.transcriptUrl?`<a class="btn subtle" href="${y(e.transcriptUrl)}" target="_blank" rel="noopener">${s(a)}</a>`:`<span class="btn subtle is-disabled" aria-disabled="true">${s(a)}</span>`;n.innerHTML=`
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
        ${K(e.interestsBody)}
      </article>
    `}}function jt(){const e=E.meta,t=E.items||[],n=k(v.highlightsHeading),a=k(v.highlightsTimeline),r=k(v.highlightsActions);if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"Highlights")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:C("Highlights coming soon.")),!a)return;const i=(e==null?void 0:e.maxItems)||5,o=t.slice(0,i);if(!o.length){a.innerHTML=C("Highlight events coming soon."),r&&(r.innerHTML="");return}a.innerHTML=o.map((l,d)=>zt(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),ie(a),r&&(r.innerHTML=`
      <a class="btn ghost" href="tournament-highlights.html">
        See More
      </a>
    `)}function Ut(){const e=q.meta,t=q.items||[],n=k(v.videosHeading),a=k(v.videoGrid),r=k(v.videosActions);if(n&&(n.innerHTML=e?`
          <h2>${s(e.heading||"Videos")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:C("Videos coming soon.")),!a)return;const i=(e==null?void 0:e.maxItems)||3,o=t.slice(0,i);if(!o.length){a.innerHTML=C("Video highlights coming soon."),r&&(r.innerHTML="");return}a.innerHTML=o.map((l,d)=>Ln(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),se(),ie(a),r&&(r.innerHTML=`
      <a class="btn ghost" href="video-highlights.html">
        See More
      </a>
    `)}function qt(){const e=G.meta,t=G.items||[],n=k(v.galleryHeading),a=k(v.galleryGrid),r=k(v.galleryActions);if(n){const l=(e==null?void 0:e.heading)||"Photo Gallery",d=(e==null?void 0:e.subheading)||"Tournament action and behind-the-scenes moments.";n.innerHTML=`
      <h2>${s(l)}</h2>
      ${`<p>${s(d)}</p>`}
    `}if(!a)return;const i=Math.max(1,(e==null?void 0:e.maxItems)||6),o=t.slice(0,i);if(!o.length){a.innerHTML=C("Gallery photos coming soon."),r&&(r.innerHTML="");return}if(a.innerHTML=o.map((l,d)=>Rt(l,d)).join(""),a.querySelectorAll("[data-motion]").forEach(l=>l.classList.add("is-visible")),Be(a),ie(a),r){const l="gallery.html",d=(e==null?void 0:e.ctaLabel)||"Explore the full gallery";r.innerHTML=`<a class="btn ghost" href="${y(l)}">${s(d)}</a>`}}function Rt(e,t=0){var A,M,T,w,$;const n=((A=e==null?void 0:e.image)==null?void 0:A.url)||z,a=((M=e==null?void 0:e.image)==null?void 0:M.alt)||(e==null?void 0:e.title)||"Gallery highlight",r=Pe(e,{variant:"card"}),i=Dn(e==null?void 0:e.shotDate),o=i?De(i):"",l=(T=e==null?void 0:e.image)!=null&&T.url?{src:n,alt:a,title:(e==null?void 0:e.title)||"Gallery highlight"}:null,d=l?`data-photo-src="${y(l.src)}" data-photo-alt="${y(l.alt)}" data-photo-title="${y(l.title)}"`:"",c=[];e!=null&&e.location&&c.push(e.location);const u=c.map(S=>`<span>${s(S)}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>'),g=u?`<div class="gallery-card-meta">${u}</div>`:"",m=e!=null&&e.description?`<p class="gallery-card-description">${s(e.description)}</p>`:"",f=e!=null&&e.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${s(e.photographer)}</div>`:"",b=f?`<div class="gallery-card-footer">${f}</div>`:"",h=l?`data-photo-preview="true" ${d}`:"",L=B(((w=e==null?void 0:e.image)==null?void 0:w.focalPoint)||(($=e==null?void 0:e.image)==null?void 0:$.hotspot)),p=L?` style="object-position: ${y(L)};"`:"";return`
    <article class="gallery-card gallery-card--overlaid" data-motion="delay-${t%3+1}">
      <div class="gallery-card-media"${h?` ${h}`:""}>
        ${o}
        <img src="${y(n)}" alt="${s(a)}" loading="lazy"${p} />
        <div class="gallery-card-scrim" aria-hidden="true"></div>
        <div class="gallery-card-overlay">
          ${g}
          <h3 class="gallery-card-title">${s((e==null?void 0:e.title)||"Gallery highlight")}</h3>
          ${r?`<div class="card-chip-slot">${r}</div>`:""}
        </div>
      </div>
      <div class="gallery-card-body gallery-card-body--hidden" aria-hidden="true">
        ${m}
        ${ae(e==null?void 0:e.tags)}
        ${b}
      </div>
    </article>
  `}function ae(e){if(!Array.isArray(e)||!e.length)return"";const t=e.map(n=>typeof n=="string"?n.trim():"").filter(Boolean);return t.length?`
    <div class="gallery-card-tags">
      ${t.map(n=>`<span class="gallery-tag">${s(n)}</span>`).join("")}
    </div>
  `:""}function Yt(e){const t=k(v.dualHeading),n=k(v.dualGrid);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Dual-Sport Athlete")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:C("Dual-sport content coming soon.")),n){if(!e||!Array.isArray(e.cards)||!e.cards.length){n.innerHTML=C("Dual-sport cards coming soon.");return}n.innerHTML=e.cards.map((a,r)=>{var d,c,u;const i=B(((d=a==null?void 0:a.image)==null?void 0:d.focalPoint)||((c=a==null?void 0:a.image)==null?void 0:c.hotspot)),o=i?` style="object-position: ${y(i)};"`:"",l=(u=a==null?void 0:a.image)!=null&&u.url?`
              <div class="dual-card-media">
                <img
                  src="${y(a.image.url)}"
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
              ${Vt(a.bulletPoints)}
            </div>
          </article>
        `}).join("")}}function Vt(e){if(!Array.isArray(e)||!e.length)return"";const t=[],n=[],a=[];e.forEach(l=>{const d=(l||"").trim();if(!d)return;const c=d.split(/\s+-\s+/);if(c.length>=2){n.push({team:c[0],role:c[1]||"",seasons:c.slice(2).join(" - ")});return}if(d.includes(":")){t.push(...d.split(":").map(u=>u.trim()).filter(Boolean));return}a.push(d)});const r=t.length?`<div class="dual-facts">${t.map(l=>`<span class="dual-fact">${s(l)}</span>`).join('<span class="dual-fact-dot" aria-hidden="true">·</span>')}</div>`:"",i=n.length?`
        <div class="dual-history">
          <p class="dual-history-label">Team History</p>
          ${n.map(l=>`
                <div class="dual-history-entry">
                  <div class="dual-history-main">
                    <span class="dual-history-team">${s(l.team)}</span>
                    ${l.role?`<span class="dual-history-role">${s(l.role)}</span>`:""}
                  </div>
                  ${l.seasons?`<span class="dual-history-season">${s(l.seasons)}</span>`:""}
                </div>
              `).join("")}
        </div>
      `:"",o=a.length?`<ul>${a.map(l=>`<li>${s(l)}</li>`).join("")}</ul>`:"";return r+i+o}function Ft(e){const t=k(v.contactHeading),n=k(v.contactGrid);if(t&&(t.innerHTML=e?`
          <h2>${s(e.heading||"Let's Connect")}</h2>
          <p>${s(e.subheading||"")}</p>
        `:C("Contact section coming soon.")),!!n){if(!e||!Array.isArray(e.cards)||!e.cards.length){n.innerHTML=C("Contact cards coming soon.");return}n.innerHTML=e.cards.map((a,r)=>`
        <article class="contact-card" data-motion="delay-${r+1}">
          <h3>${s(a.title||"")}</h3>
          <ul>
            ${(a.entries||[]).map(i=>`<li>${Wt(i)}</li>`).join("")}
          </ul>
        </article>
      `).join("")}}function Gt(e,t){const n=document.querySelector(".site-footer");if(!n)return;const a={kicker:"05 - Open For Recruiting",headline:"Let’s|Talk.",ctaLabel:"Get in touch",playerLabel:"Player",playerName:"Samuel Masco",playerClassYear:"Class of 2029",playerLocation:"Evergreen, Colorado",exploreLabel:"Explore",exploreLinks:[{label:"Resume",href:"#golf-resume"},{label:"Highlights",href:"#highlights"},{label:"Media",href:"#videos"},{label:"About",href:"#about"}],directLabel:"Direct",baseLine:"Built with care for the recruiting journey of Samuel Masco · Class of 2029.",copyrightName:"Samuel Masco"},r=p=>{const A=e==null?void 0:e[p];return typeof A=="string"&&A.trim()?A.trim():a[p]},i=Array.isArray(e==null?void 0:e.exploreLinks)&&e.exploreLinks.length?e.exploreLinks:a.exploreLinks,o=((t==null?void 0:t.cards)||[])[0],l=Array.isArray(o==null?void 0:o.entries)?o.entries:[],d=(p,A)=>l.find(M=>{if(!M)return!1;const T=typeof M.label=="string"?M.label.toLowerCase():"",w=typeof M.link=="string"?M.link:"";return!!(p&&p.test(T)||A&&A.test(w))}),c=d(/email/,/^mailto:/i),u=d(/phone|cell|mobile/,/^tel:/i),g=[];if(c!=null&&c.value){const p=c.link||`mailto:${c.value}`;g.push(`<a class="site-footer-direct-link" href="${y(p)}">${s(c.value)}</a>`)}if(u!=null&&u.value){const p=u.link||`tel:${u.value.replace(/[^\d+]/g,"")}`;g.push(`<a class="site-footer-direct-link" href="${y(p)}">${s(u.value)}</a>`)}const m=g.length?`<p class="site-footer-value">${g.join("<br />")}</p>`:'<p class="site-footer-value site-footer-contact-placeholder">See the contact section above for email, phone, and coach references.</p>',f=s(r("headline")).replace(/\|/g,"<br />"),b=c!=null&&c.value?c.link||`mailto:${c.value}`:"#contact",h=[r("playerName")?`<strong>${s(r("playerName"))}</strong>`:"",r("playerClassYear")?s(r("playerClassYear")):"",r("playerLocation")?s(r("playerLocation")):""].filter(Boolean).join("<br />"),L=i.filter(p=>(p==null?void 0:p.label)&&(p==null?void 0:p.href)).map(p=>`
        <li><a href="${y(p.href)}">${s(p.label)}</a></li>
      `).join("");n.innerHTML=`
    <div class="site-footer-inner">
      <div class="site-footer-primary">
        <p class="site-footer-kicker">${s(r("kicker"))}</p>
        <h2 class="site-footer-headline">${f}</h2>
        <a class="site-footer-cta" href="${y(b)}">
          <span>${s(r("ctaLabel"))}</span>
          <span class="site-footer-cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <div class="site-footer-columns">
        <div class="site-footer-column">
          <p class="site-footer-label">${s(r("playerLabel"))}</p>
          <p class="site-footer-value">${h}</p>
        </div>
        <div class="site-footer-column">
          <p class="site-footer-label">${s(r("exploreLabel"))}</p>
          <ul class="site-footer-links">${L}</ul>
        </div>
        <div class="site-footer-column site-footer-contact">
          <p class="site-footer-label">${s(r("directLabel"))}</p>
          ${m}
        </div>
      </div>
    </div>
    <div class="site-footer-rule"></div>
    <div class="site-footer-base">
      <p>&copy; ${new Date().getFullYear()} ${s(r("copyrightName"))}. Recruiting portfolio.</p>
      <p>${s(r("baseLine"))}</p>
    </div>
  `}function Wt(e){var r;if(!e)return"";const t=e.label?`<strong>${s(e.label)}:</strong> `:"",n=In(e.value),a=(r=e.link)!=null&&r.startsWith("http")?' target="_blank" rel="noopener"':"";return e.link&&n.length<=1?`${t}<a href="${y(e.link)}"${a}>${s(e.value||e.link)}</a>`:n.length?`${t}${n.map((i,o)=>{const l=o===0&&e.link?e.link:i.link;if(l){const c=l.startsWith("http")?' target="_blank" rel="noopener"':"";return`<a href="${y(l)}"${c}>${s(i.text)}</a>`}return s(i.text)}).join(" · ")}`:`${t}${s(e.value||"")}`}function zt(e,t){var j,oe;const n=Pn(e),a=e.summary?`<p class="case-study-summary">${s(e.summary)}</p>`:"",r=Array.isArray(e.days)?e.days:[],i=`home-highlight-${t}`,o=(e==null?void 0:e._id)||(e==null?void 0:e.title)||i,l=(j=e==null?void 0:e.coverImage)!=null&&j.url?e.coverImage:null,c=(oe=Ee(e)[0])==null?void 0:oe.image,u=l||c,g=(u==null?void 0:u.url)||"",m=(u==null?void 0:u.alt)||(e==null?void 0:e.title)||"Tournament photo",f=B((u==null?void 0:u.focalPoint)||(u==null?void 0:u.hotspot)),b=f?` style="object-position: ${y(f)};"`:"",h=Zt(r),L=(h==null?void 0:h.score)!=null?String(h.score):"",p=[...r].reverse().find(_=>(_==null?void 0:_.rankingPosition)!=null||((_==null?void 0:_.rankingLabel)||"").trim()!==""),A=p?p.rankingPosition!=null?`${p.rankingPosition}${p.rankingOutOf!=null?` / ${p.rankingOutOf}`:""}`:p.rankingLabel.trim():"",M=(h==null?void 0:h.yardage)!=null&&(h==null?void 0:h.yardage)!==""?String(h.yardage):"",T=e!=null&&e.location?String(e.location):"",w=!!(e!=null&&e.pinToTop||e!=null&&e.featured),$=`
    <button class="case-study-cta" type="button" data-highlight-modal="${y(o)}">
      <span>Read the round</span>
      <span class="case-study-cta-arrow" aria-hidden="true">→</span>
    </button>
  `,S=[];A&&S.push(`<div class="case-study-chip case-study-chip--finish"><span class="case-study-chip-label">Finish</span><span class="case-study-chip-value">${s(A)}</span></div>`),M&&S.push(`<div class="case-study-chip"><span class="case-study-chip-label">Yardage</span><span class="case-study-chip-value">${s(M)}</span></div>`),r.length>1&&S.push(`<div class="case-study-chip"><span class="case-study-chip-label">Rounds</span><span class="case-study-chip-value">${r.length}</span></div>`);const H=S.length?`<div class="case-study-chips">${S.join("")}</div>`:"",P=g?`
        <img
          src="${y(g)}"
          alt="${s(m)}"
          loading="lazy"
          ${b}
        />
      `:Kt(e),D=String(t+1).padStart(2,"0");return`
    <article class="case-study-card${w?" is-featured":""}" data-motion="delay-${t+1}" data-index="${D}">
      <div class="case-study-media">
        ${P}
        <div class="case-study-media-overlay" aria-hidden="true"></div>
        ${w?'<span class="case-study-badge">Featured</span>':""}
      </div>
      <div class="case-study-body">
        <div class="case-study-meta">
          <span class="case-study-index">${D}</span>
          ${n?`<span class="case-study-date">${s(n)}</span>`:""}
          ${T?`<span class="case-study-location">${s(T)}</span>`:""}
        </div>
        <h3 class="case-study-title">${s(e.title||"")}</h3>
        ${L?`
              <div class="case-study-headline-score">
                <span class="case-study-score-value">${s(L)}</span>
                <span class="case-study-score-label">${r.length>1?"Best Round":"Final Score"}</span>
              </div>
            `:""}
        ${H}
        ${a}
        ${$}
      </div>
    </article>
  `}function Kt(e){const t=((e==null?void 0:e.title)||"").trim(),n=t.indexOf("@"),a=n>0?t.slice(0,n).trim().replace(/[:\-–]\s*$/,""):"",r=n>=0?t.slice(n+1).trim():t,i=l=>{const d=(l||"").match(/\bin\s+([A-Za-z .'-]+,\s*[A-Za-z]{2})\s*$/);return d?d[1].replace(/\s+/g," "):""},o=i(e==null?void 0:e.location)||i(e==null?void 0:e.summary);return`
    <div class="case-study-media-placeholder is-plate" aria-hidden="true">
      ${a?`<span class="cover-plate-series">${s(a)}</span>`:""}
      <span class="cover-plate-venue">${s(r||"Tournament")}</span>
      <span class="cover-plate-rule"></span>
      ${o?`<span class="cover-plate-city">${s(o)}</span>`:""}
    </div>
  `}function Zt(e){if(!Array.isArray(e)||!e.length)return null;const t=e.map(n=>{const a=Number(n==null?void 0:n.score);return Number.isFinite(a)?{day:n,numeric:a}:null}).filter(Boolean);return t.length?(t.sort((n,a)=>n.numeric-a.numeric),t[0].day):e[0]}function Qt(e=[],{variant:t="default",showLabels:n}={}){if(!Array.isArray(e)||!e.length)return"";const a=e.length,r=typeof n=="boolean"?n:a>1;return`
    <div class="${["day-stats",t==="compact"?"day-stats--compact":"",t==="list"?"day-stats--list":"",a===1?"day-stats--single":"",`day-stats--cols-${Math.min(a,3)}`].filter(Boolean).join(" ")}">
      ${e.map((o,l)=>Jt(o,l,{showLabels:r,total:a})).join("")}
    </div>
  `}const fe=120,Xt=57;function Jt(e,t,{showLabels:n,total:a}){if(!e)return"";const r=a===1,i=!r&&n?xe(e,t,a):null,o=en(e);return o?`
    <div class="day-stat${r?" day-stat--single":""}">
      ${i?`<span class="day-stat-label">${s(i)}</span>`:""}
      ${o}
    </div>
  `:""}function en(e){const t=pn(e);return t.length?`
    <div class="day-metrics">
      ${tn(t)}
    </div>
  `:""}function tn(e){return`
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
  `}function nn(e=[]){if(!Array.isArray(e))return"";const t=e.map((n,a)=>{if(!(n!=null&&n.notes))return"";const r=xe(n,a,e.length)||"Notes";return`
        <div class="day-note">
          <strong>${s(r)}</strong>
          <p>${s(n.notes)}</p>
        </div>
      `}).filter(Boolean).join("");return t?`<div class="day-notes">${t}</div>`:""}function ie(e){e&&e.querySelectorAll("[data-highlight-modal]").forEach(t=>{t.dataset.modalBound!=="true"&&(t.dataset.modalBound="true",t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const a=t.getAttribute("data-highlight-modal");rn(a)}))})}let N=null;function an(){if(N)return N;const e=document.createElement("div");return e.className="highlight-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="highlight-overlay-backdrop" data-highlight-overlay-close></div>
    <div class="highlight-overlay-dialog" role="dialog" aria-modal="true">
      <button class="highlight-overlay-close" type="button" data-highlight-overlay-close>
        <span class="sr-only">Close tournament details</span>
        ×
      </button>
      <div class="highlight-overlay-body" data-highlight-overlay-body></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-highlight-overlay-close]")&&ge()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&ge()}),document.body.appendChild(e),N=e,e}function rn(e){const t=an(),n=t.querySelector("[data-highlight-overlay-body]");if(!n)return;const a=Ce(e);if(!a)return;const r=un(a),i=Ee(a);n.innerHTML=sn(a,r,i),se(n),Be(n),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-highlight-overlay")}function ge(){if(!N)return;const e=N.querySelector("[data-highlight-overlay-body]");e&&(e.innerHTML=""),N.classList.remove("is-open"),N.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-highlight-overlay")}function Ce(e){const t=[];if(Array.isArray(E.items)&&t.push(E.items),Array.isArray(E.allItems)&&t.push(E.allItems),!e)return t[0]&&t[0][0]||t[1]&&t[1][0]||null;for(const n of t){const a=n.find(i=>((i==null?void 0:i._id)||"")===e);if(a)return a;const r=n.find(i=>(i==null?void 0:i.title)===e);if(r)return r}return null}function sn(e,t,n){const r=[hn(e),e.location?s(e.location):null].filter(Boolean),i=r.length?`<div class="highlight-overlay-meta">
        ${r.map(d=>`<span>${d}</span>`).join('<span class="meta-dot" aria-hidden="true">•</span>')}
      </div>`:"",o=Qt(e.days||[],{variant:"list"}),l=nn(e.days||[]);return`
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
        ${ln(t)}
      </section>
      <section class="highlight-overlay-section">
        <h3>Photos</h3>
        ${cn(n)}
      </section>
    </div>
  `}function ln(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No videos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid">
      ${e.map(on).join("")}
    </div>
  `}function on(e){const t=Oe(e),n=e.thumbnailUrl||(t?`https://img.youtube.com/vi/${t}/hqdefault.jpg`:Me),a=e.thumbnailAlt||e.title||"Video highlight",r=e.title||"Video highlight",o=!!t?"":' disabled aria-disabled="true"',l=re?re(e):"",d=B(e.thumbnailFocalPoint||e.thumbnailHotspot),c=d?` style="object-position: ${y(d)};"`:"";return`
    <article class="video-gallery-card">
      <div class="video-frame" data-video-id="${s(t)}" data-video-title="${s(r)}">
        <img src="${y(n)}" alt="${s(a)}" loading="lazy"${c} />
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
  `}function cn(e){return!Array.isArray(e)||!e.length?'<p class="placeholder-text">No photos linked to this tournament yet.</p>':`
    <div class="overlay-media-grid overlay-photo-grid">
      ${e.map(dn).join("")}
    </div>
  `}function dn(e){var d,c,u,g,m;const t=((d=e==null?void 0:e.image)==null?void 0:d.url)||Me,n=((c=e==null?void 0:e.image)==null?void 0:c.alt)||(e==null?void 0:e.title)||"Gallery photo",a=(u=e==null?void 0:e.image)!=null&&u.url?{src:t,alt:n,title:(e==null?void 0:e.title)||"Gallery photo"}:null,r=a?`data-photo-preview="true" data-photo-src="${y(a.src)}" data-photo-alt="${y(a.alt)}" data-photo-title="${y(a.title)}"`:"",i=e!=null&&e.photographer?`<div class="gallery-card-meta gallery-card-meta--secondary">Photo: ${s(e.photographer)}</div>`:"",o=B(((g=e==null?void 0:e.image)==null?void 0:g.focalPoint)||((m=e==null?void 0:e.image)==null?void 0:m.hotspot)),l=o?` style="object-position: ${y(o)};"`:"";return`
    <article class="gallery-card">
      <div class="gallery-card-media"${r?` ${r}`:""}>
        <img src="${y(t)}" alt="${s(n)}" loading="lazy"${l} />
      </div>
      <div class="gallery-card-body">
        <h4>${s((e==null?void 0:e.title)||"Gallery photo")}</h4>
        ${e!=null&&e.description?`<p class="gallery-card-description">${s(e.description)}</p>`:""}
        ${ae?ae(e==null?void 0:e.tags):""}
        ${i?`<div class="gallery-card-footer">${i}</div>`:""}
      </div>
    </article>
  `}function un(e){return!e||!Array.isArray(E.videos)?[]:E.videos.filter(t=>Ie(t,e))}function Ee(e){return!e||!Array.isArray(E.photos)?[]:E.photos.filter(t=>Ie(t,e))}function Ie(e,t){const n=He(e);return n?!!(n.id&&(t!=null&&t._id)&&n.id===t._id||n.title&&(t!=null&&t.title)&&n.title===t.title):!1}function He(e){return e?e.tournament&&typeof e.tournament=="object"&&e.tournament.title?{id:e.tournament._id||e.tournament._ref||e.tournament.id||null,title:e.tournament.title}:typeof e.tournament=="string"&&e.tournament?{id:e.tournament,title:e.tournament}:null:null}function fn(e){return!e||!Array.isArray(e.tags)?[]:e.tags.map(t=>typeof t=="string"?t.trim():"").filter(Boolean)}function re(e){const t=fn(e);return t.length?`
    <div class="gallery-card-tags video-card-tags">
      ${t.map(n=>`<span class="gallery-tag">${s(n)}</span>`).join("")}
    </div>
  `:""}function gn(e){const t=He(e);if(!t||!t.title)return null;const n=t.id||t.title,a=n?Ce(n):null,r=a?a._id||a.title:null;return{label:(a==null?void 0:a.title)||t.title,targetId:r}}function Pe(e,{variant:t="inline"}={}){const n=gn(e);if(!(n!=null&&n.label))return"";const a=["tournament-chip"];t==="card"&&a.push("tournament-chip--on-card"),t==="inline"&&a.push("tournament-chip--inline");const r=s(n.label),i=y(`View ${n.label} tournament details`),o=n.targetId?` data-highlight-modal="${y(n.targetId)}"`:"",l=n.targetId?`tournament-highlights.html?tournament=${encodeURIComponent(n.targetId)}`:"tournament-highlights.html",d="a";return`
    <${d} class="${a.join(" ")}" href="${y(l)}"${o}${n.targetId?` aria-label="${i}"`:""}>
      <span class="tournament-chip-name">${r}</span>
    </${d}>
  `}function mn(e){if(!e)return null;const t=I(e);return t?{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}:null}function De(e){return`
    <div class="video-date-overlay" aria-label="${e.month} ${e.day}, ${e.year}">
      <span class="month">${e.month}</span>
      <strong>${e.day}</strong>
      <span class="year">${e.year}</span>
    </div>
  `}function hn(e){return e?le(e.eventDate,e.endDate,{month:"long"}):""}function pn(e){if(!e)return[];const t=[],n=W(e.score),a=W(e.yardage);t.push(Z({key:"score",label:"Score",display:typeof n=="number"?String(n):"-",progress:bn(n)})),t.push(Z({key:"yards",label:"Yardage",display:typeof a=="number"?a.toLocaleString():"-",secondary:"",progress:$n(a,yn(e,a))}));const r=kn(e);return t.push(Z({key:"rank",label:"Rank",display:r.display,secondary:r.secondary,progress:r.progress})),t.filter(Boolean)}function Z({key:e,label:t,display:n,secondary:a,progress:r}){const i=n!=null&&n!==""?String(n):"-",o=a?String(a):"",l=typeof r=="number"&&!Number.isNaN(r)?r:0;return{key:e,label:t,display:i,secondary:o,progress:Math.max(0,l)}}function xe(e,t,n){return e.label?e.label:n>1?`Day ${t+1}`:null}function W(e){return typeof e=="number"&&!Number.isNaN(e)?e:null}function yn(e,t){return typeof t=="number"&&t>0?Math.max(7200,Math.round(t/50)*50):7200}function bn(e){if(typeof e!="number"||Number.isNaN(e))return 0;const t=fe-Xt;return(fe-e)/t}function $n(e,t){return typeof e!="number"||Number.isNaN(e)||!t||t<=0?0:e/t}function vn(e,t){if(typeof e!="number"||Number.isNaN(e)||typeof t!="number"||t<=0)return 0;if(t===1)return 1;const n=(t-e)/(t-1);return Math.max(0,Math.min(n,1))}function kn(e){const t=W(e==null?void 0:e.rankingPosition),n=W(e==null?void 0:e.rankingOutOf),a=vn(t,n);return typeof t=="number"?{display:String(t),secondary:typeof n=="number"?`of ${n}`:"",progress:a}:{display:"-",secondary:"",progress:0}}function Ln(e,t){const n=Oe(e),a=e.thumbnailUrl||(n?`https://img.youtube.com/vi/${n}/hqdefault.jpg`:z),r=e.thumbnailAlt||e.title||"Video highlight",i=e.title||"Video highlight",l=!!n?"":' disabled aria-disabled="true"',d=Pe(e,{variant:"card"}),c=mn(e.eventDate),u=c?De(c):"",g=re(e),m=B(e.thumbnailFocalPoint||e.thumbnailHotspot),f=m?` style="object-position: ${y(m)};"`:"";return`
    <article class="video-gallery-card" data-motion="delay-${t+1}">
      <div class="video-frame" data-video-id="${s(n)}" data-video-title="${s(i)}">
        ${u}
        <img src="${y(a)}" alt="${s(r)}" loading="lazy"${f} />
        <button class="play-button" type="button"${l} aria-label="Play ${s(i)}">
          <span class="play-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div class="video-gallery-copy">
        <h3>${s(e.title||"")}</h3>
        ${d?`<div class="card-chip-slot">${d}</div>`:""}
        <p>${s(e.description||"")}</p>
        ${g}
      </div>
    </article>
  `}function se(e=document){(e instanceof Element?e:document).querySelectorAll(".video-frame").forEach(n=>{if(n.dataset.playerReady==="true")return;const a=n.querySelector(".play-button"),r=n.dataset.videoId,i=n.dataset.videoTitle||"Samuel Masco golf video highlight";!a||!r||(a.addEventListener("click",()=>{An(r,i)}),n.dataset.playerReady="true")})}let O=null;function Tn(){if(O)return O;const e=document.createElement("div");return e.className="video-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="video-overlay-backdrop" data-overlay-close></div>
    <div class="video-overlay-dialog" role="dialog" aria-modal="true">
      <button class="video-overlay-close" type="button" data-overlay-close>
        <span class="sr-only">Close video</span>
        ×
      </button>
      <div class="video-overlay-frame"></div>
    </div>
  `,e.addEventListener("click",t=>{t.target.closest("[data-overlay-close]")&&me()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&me()}),document.body.appendChild(e),O=e,e}function An(e,t){const n=Tn(),a=n.querySelector(".video-overlay-frame");if(!a)return;a.innerHTML="";const r=document.createElement("iframe");r.setAttribute("src",`https://www.youtube.com/embed/${e}?autoplay=1&rel=0&modestbranding=1`),r.setAttribute("title",t),r.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),r.setAttribute("allowfullscreen",""),r.loading="lazy",a.appendChild(r),n.classList.add("is-open"),n.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-video")}function me(){if(!O)return;const e=O.querySelector(".video-overlay-frame");e&&(e.innerHTML=""),O.classList.remove("is-open"),O.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-video")}let x=null;function Be(e=document){if(!e)return;(e instanceof Element?e:document).querySelectorAll("[data-photo-preview]").forEach(n=>{n.dataset.photoPreviewReady!=="true"&&(n.addEventListener("click",a=>{a.target.closest(".tournament-chip")||wn(n.getAttribute("data-photo-src"),n.getAttribute("data-photo-alt"),n.getAttribute("data-photo-title"))}),n.dataset.photoPreviewReady="true")})}function Sn(){if(x)return x;const e=document.createElement("div");return e.className="photo-overlay",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
  `,e.addEventListener("click",t=>{t.target.closest("[data-photo-overlay-close]")&&he()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&e.classList.contains("is-open")&&he()}),document.body.appendChild(e),x=e,e}function wn(e,t,n){if(!e)return;const a=Sn(),r=a.querySelector("img"),i=a.querySelector("figcaption");!r||!i||(r.src=e,r.alt=t||n||"Gallery photo",i.textContent=n||t||"",a.classList.add("is-open"),a.setAttribute("aria-hidden","false"),document.body.classList.add("is-showing-photo"))}function he(){if(!x)return;const e=x.querySelector("img"),t=x.querySelector("figcaption");e&&(e.src="",e.alt=""),t&&(t.textContent=""),x.classList.remove("is-open"),x.setAttribute("aria-hidden","true"),document.body.classList.remove("is-showing-photo")}function K(e){return!Array.isArray(e)||!e.length?"":ut(e)}function k(e){return e?document.querySelector(e):null}function C(e){return`<p class="placeholder-text">${s(e)}</p>`}function Q(e){document.body.dataset.contentLoading=String(e)}function Mn(e){const t=document.querySelector("main");t&&t.insertAdjacentHTML("afterbegin",`<div class="notification error">${s(e)}</div>`)}function pe(e,t,n,a){const r=(e==null?void 0:e.label)||n,i=(e==null?void 0:e.href)||a;if(!r||!i)return"";const l=i.startsWith("#")?' data-scroll="true"':' target="_blank" rel="noopener"';return`<a class="btn ${t}" href="${y(i)}"${l}>${s(r)}</a>`}function Cn(){document.addEventListener("click",e=>{const t=e.target.closest('a[data-scroll="true"]');if(!t)return;const n=t.getAttribute("href")||"";Ne(n)&&e.preventDefault()})}function Ne(e){if(!e||!e.startsWith("#")||e.length===1)return!1;const t=document.querySelector(e);return t?(t.scrollIntoView({behavior:"smooth",block:"start"}),!0):!1}function le(e,t,{month:n="short"}={}){if(!e)return"";const a=I(e);if(!a)return s(e);if(!t)return a.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});const r=I(t);if(!r)return`${a.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"})} – ${s(t)}`;const i=a.getFullYear()===r.getFullYear(),o=i&&a.getMonth()===r.getMonth();if(i&&o)return`${a.toLocaleDateString("en-US",{month:n})} ${a.getDate()}–${r.getDate()}, ${a.getFullYear()}`;if(i){const c=a.toLocaleDateString("en-US",{month:n,day:"numeric"}),u=r.toLocaleDateString("en-US",{month:n,day:"numeric"});return`${c} – ${u}, ${a.getFullYear()}`}const l=a.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"}),d=r.toLocaleDateString("en-US",{month:n,day:"numeric",year:"numeric"});return`${l} – ${d}`}function Oe(e){return e?ye(e.youtubeId)||ye(e.youtubeUrl):""}function ye(e){if(!e)return"";const t=String(e).trim();if(!t)return"";if(V.test(t))return t;let n;try{n=new URL(t)}catch{try{n=new URL(`https://${t}`)}catch{return""}}const a=n.hostname.replace(/^www\./,"").toLowerCase();if(a==="youtu.be"){const r=n.pathname.split("/").filter(Boolean)[0];return r&&V.test(r)?r:""}if(a==="youtube.com"||a.endsWith(".youtube.com")){const r=n.searchParams.get("v");if(r&&V.test(r))return r;const i=n.pathname.split("/").filter(Boolean);if(i.length>=2&&(i[0]==="embed"||i[0]==="shorts")){const o=i[1];return o&&V.test(o)?o:""}}return""}function s(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function y(e){return s(e)}function B(e){if(!e||typeof e.x!="number"||typeof e.y!="number")return"";const t=r=>Math.max(0,Math.min(1,r)),n=Math.round(t(e.x)*1e3)/10,a=Math.round(t(e.y)*1e3)/10;return`${n}% ${a}%`}function En(e){if(!e)return"";const t=e.trim().split(/\s+/).filter(Boolean);return t.length?t.slice(0,2).map(n=>n.charAt(0).toUpperCase()).join(""):""}function In(e){if(!e)return[];const t=String(e).trim();return t?t.replace(/\s[-–—]\s/g,"|").split(/·|\|/g).map(r=>r.trim()).filter(Boolean).map(r=>({text:r,link:Hn(r)})):[]}function Hn(e){if(!e)return null;const t=e.replace(/\s+/g,"");return/^\(?\+?\d[\d\-()\s\.]+$/.test(e)?`tel:${t.replace(/[^\d+]/g,"")}`:/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(e)?`mailto:${t}`:null}function Pn(e){return e?le(e.eventDate,e.endDate,{month:"short"}):""}function Dn(e){if(!e)return null;const t=I(e);return t?{month:t.toLocaleString("en-US",{month:"short"}),day:t.getDate().toString().padStart(2,"0"),year:t.getFullYear()}:null}function X(e,t="eventDate"){return Array.isArray(e)?[...e].sort((n,a)=>be(a,t)-be(n,t)):[]}function be(e,t){if(!e)return 0;const n=e[t],a=I(n);if(a)return a.getTime();const r=I(e._createdAt);return r?r.getTime():0}function J(e){return e?typeof e.showOnHomePage=="boolean"?e.showOnHomePage:typeof e.featured=="boolean"?e.featured:typeof e.pinToTop=="boolean"?e.pinToTop:!0:!1}function xn(e){const t=[],n=[];if(!Array.isArray(e))return{past:t,future:n};const a=new Date,r=new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime();return e.forEach(i=>{if(!i)return;const o=I(i.endDate),l=I(i.eventDate),d=o||l;d&&d.getTime()>=r?n.push(i):t.push(i)}),{past:t,future:n}}function Bn(e,t){const n=new Set,a=[],r=i=>{if(!i)return;const o=i._id||i.id||`${i.course||""}|${i.eventDate||""}`;n.has(o)||(n.add(o),a.push(i))};return e.forEach(r),t.forEach(i=>{var o,l;i&&r({_id:i._id,course:i.course||i.title||i.headline||"",location:i.location||i.city||"",eventDate:i.eventDate,endDate:i.endDate,yardage:i.yardage||((l=(o=i.days)==null?void 0:o[0])==null?void 0:l.yardage)||""})}),a.sort((i,o)=>{var c,u;const l=((c=I(i==null?void 0:i.eventDate))==null?void 0:c.getTime())??Number.POSITIVE_INFINITY,d=((u=I(o==null?void 0:o.eventDate))==null?void 0:u.getTime())??Number.POSITIVE_INFINITY;return l-d}),a}function Nn(e){if(e||!("IntersectionObserver"in window)){document.querySelectorAll("[data-motion]").forEach(n=>n.classList.add("is-visible"));return}const t=new IntersectionObserver(n=>{n.forEach(a=>{a.isIntersecting&&(a.target.classList.add("is-visible"),t.unobserve(a.target))})},{threshold:.2});document.querySelectorAll("[data-motion]").forEach(n=>t.observe(n))}function On(){const e=Array.from(document.querySelectorAll(".scroll-panel")),t=e.findIndex(p=>p.dataset.theme==="dark");if(t<=0)return;let n=t;for(;n+1<e.length&&e[n+1].dataset.theme==="dark";)n+=1;const a=e[t-1],r=e[t],i=e[n],o=e[n+1];if(!a||!o)return;const l=window.matchMedia("(prefers-reduced-motion: reduce)").matches,d=document.body,c=document.documentElement,u=(p,A,M)=>Math.max(A,Math.min(M,p)),g=p=>u(1-3*p,0,1),m=p=>u(3*p-2,0,1);let f=-1,b=-1;const h=()=>{const p=window.innerHeight,A=a.getBoundingClientRect(),M=r.getBoundingClientRect(),T=i.getBoundingClientRect(),w=o.getBoundingClientRect(),$=M.top-A.bottom,S=w.top-T.bottom,H=u((p-A.bottom)/Math.max(1,p+$),0,1),P=u((p-T.bottom)/Math.max(1,p+S),0,1),D=H*(1-P);c.style.setProperty("--theme-t",l?D>=.5?"1":"0":D.toFixed(4)),D>=.5?d.dataset.theme!=="dark"&&(d.dataset.theme="dark"):d.dataset.theme==="dark"&&delete d.dataset.theme,l||(a.style.opacity=String(g(H)),o.style.opacity=String(m(P)),r===i?r.style.opacity=String(Math.min(m(H),g(P))):(r.style.opacity=String(m(H)),i.style.opacity=String(g(P))))},L=()=>{const p=window.scrollY,A=window.innerHeight;(p!==f||A!==b)&&(f=p,b=A,h()),requestAnimationFrame(L)};h(),requestAnimationFrame(L)}function _n(e){const t=Array.from(document.querySelectorAll("[data-counter]"));if(!t.length)return;const n=l=>{const d=Number(l.getAttribute("data-counter")),c=l.getAttribute("data-counter-suffix")||"";if(!Number.isFinite(d))return;const u=ee(l.getAttribute("data-counter"));l.textContent=te(d,u)+c,l.dataset.counterDone="true"};if(e){t.forEach(n);return}t.forEach(l=>{const d=ee(l.getAttribute("data-counter"));l.textContent=te(0,d)+(l.getAttribute("data-counter-suffix")||"")});const a=l=>{if(l.dataset.counterDone==="true")return;l.dataset.counterDone="true";const d=Number(l.getAttribute("data-counter")),c=l.getAttribute("data-counter-suffix")||"";if(!Number.isFinite(d)){n(l);return}const u=ee(l.getAttribute("data-counter")),g=1200,m=Date.now(),f=setInterval(()=>{const b=Date.now()-m,h=Math.min(1,b/g),L=1-Math.pow(1-h,3),p=d*L;l.textContent=te(p,u)+c,h>=1&&(clearInterval(f),n(l))},16)},r=l=>{const d=l.getBoundingClientRect(),c=window.innerHeight||document.documentElement.clientHeight;return d.top<c*.9&&d.bottom>0},i=()=>{let l=0;return t.forEach(d=>{d.dataset.counterDone!=="true"&&(r(d)?a(d):l+=1)}),l};i();const o=()=>{i()===0&&(window.removeEventListener("scroll",o,{passive:!0}),window.removeEventListener("resize",o))};window.addEventListener("scroll",o,{passive:!0}),window.addEventListener("resize",o)}function ee(e){if(typeof e!="string")return 0;const t=e.indexOf(".");return t>=0?e.length-t-1:0}function te(e,t){return t>0?e.toFixed(t):String(Math.round(e))}
