const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('#main-nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');document.body.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false')}))}document.querySelectorAll('#year').forEach(year=>year.textContent=new Date().getFullYear());

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets=document.querySelectorAll('.section-heading,.welcome-grid,.identity-card,.history-feature,.schedule-grid article,.ministry-list article,.gallery-grid figure,.location-card,.quick-paths a,.next-service-card,.verse-inner,.belief-grid article,.ministry-detail,.timeline-tree article,.collection-card,.photo-collection');
revealTargets.forEach((element,index)=>{element.classList.add('reveal');element.style.transitionDelay=`${Math.min(index%5,4)*70}ms`});
if(reduceMotion){revealTargets.forEach(element=>element.classList.add('visible'))}else{const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.12});revealTargets.forEach(element=>observer.observe(element));const heroImage=document.querySelector('.hero>img');if(heroImage)window.addEventListener('scroll',()=>{if(window.scrollY<window.innerHeight)heroImage.style.transform=`scale(1.04) translateY(${window.scrollY*.09}px)`},{passive:true})}
const siteHeader=document.querySelector('.site-header');const updateHeader=()=>siteHeader.classList.toggle('scrolled',window.scrollY>48);updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});

// Orientación y microinteracciones
const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.prepend(progress);
const topButton=document.createElement('button');topButton.className='back-to-top';topButton.type='button';topButton.setAttribute('aria-label','Volver al inicio');topButton.innerHTML='↑';document.body.append(topButton);topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));
const updateScrollUI=()=>{const available=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${available>0?scrollY/available:0})`;topButton.classList.toggle('visible',scrollY>650)};updateScrollUI();window.addEventListener('scroll',updateScrollUI,{passive:true});
if(nav&&(location.pathname.endsWith('index.html')||location.pathname.endsWith('/'))){const sections=[...document.querySelectorAll('main section[id]')];const sectionLinks=[...nav.querySelectorAll('a[href^="#"]')];if(sections.length&&sectionLinks.length){const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)sectionLinks.forEach(link=>link.classList.toggle('section-active',link.getAttribute('href')===`#${entry.target.id}`))})},{rootMargin:'-35% 0px -55%'});sections.forEach(section=>sectionObserver.observe(section))}}
if(!reduceMotion&&matchMedia('(pointer:fine)').matches){document.querySelectorAll('.identity-card,.collection-card,.belief-grid article').forEach(card=>{card.addEventListener('pointermove',event=>{const box=card.getBoundingClientRect();card.style.setProperty('--mx',`${event.clientX-box.left}px`);card.style.setProperty('--my',`${event.clientY-box.top}px`)});card.addEventListener('pointerleave',()=>{card.style.removeProperty('--mx');card.style.removeProperty('--my')})})}
document.querySelectorAll('.masonry-gallery img,.photo-wall img').forEach(image=>{image.tabIndex=0;image.setAttribute('role','button');image.addEventListener('click',()=>openLightbox(image));image.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')openLightbox(image)})});
function openLightbox(image){const modal=document.createElement('div');modal.className='lightbox';modal.innerHTML=`<button aria-label="Cerrar imagen">×</button><img src="${image.currentSrc||image.src}" alt="${image.alt}"><p>${image.alt}</p>`;document.body.append(modal);requestAnimationFrame(()=>modal.classList.add('open'));const close=()=>{modal.classList.remove('open');setTimeout(()=>modal.remove(),220)};modal.addEventListener('click',event=>{if(event.target===modal||event.target.tagName==='BUTTON')close()});document.addEventListener('keydown',function esc(event){if(event.key==='Escape'){close();document.removeEventListener('keydown',esc)}})}

// Selector de sedes y mapa interactivo.
const locationButtons=[...document.querySelectorAll('[data-location]')];
if(locationButtons.length){
  const locations={
    guayaquil:{
      label:'Guayaquil',
      address:'Misión Cristiana Camino al Cielo Guayaquil',
      city:'35 y Colombia (esquina) · Guayaquil, Ecuador',
      status:'',
      query:'Mision Cristiana Camino al Cielo, R329+3JH, 090415 Guayaquil, Ecuador',
      link:'https://maps.app.goo.gl/MqLcbDUxTGVeMiTD8',
      photo:'fachada-iglesia.webp',
      photoAlt:'Fachada de la sede Guayaquil de Misión Cristiana Camino al Cielo',
      photoTitle:'Esta es nuestra casa',
      photoCaption:'35 y Colombia (esquina)'
    },
    chongon:{
      label:'Chongón',
      address:'Misión Cristiana Camino al Cielo Chongón',
      city:'QW37+9GH, Guayaquil, Ecuador',
      status:'',
      query:'-2.2465556,-80.0861389',
      link:'https://maps.app.goo.gl/i6rm6wjLV7Azu1Dy7',
      photo:'sede-chongon.webp',
      photoAlt:'Fachada de la sede Chongón de Misión Cristiana Camino al Cielo',
      photoTitle:'Sede Chongón',
      photoCaption:'QW37+9GH, Chongón'
    }
  };
  const mapFrame=document.querySelector('[data-location-map]');
  const addressLabel=document.querySelector('[data-location-address]');
  const cityLabel=document.querySelector('[data-location-city]');
  const statusLabel=document.querySelector('[data-location-status]');
  const mapLinks=[...document.querySelectorAll('[data-location-link],[data-location-map-link]')];
  const photoLink=document.querySelector('[data-location-photo-link]');
  const photo=document.querySelector('[data-location-photo]');
  const photoTitle=document.querySelector('[data-location-photo-title]');
  const photoCaption=document.querySelector('[data-location-photo-caption]');
  locationButtons.forEach(button=>button.addEventListener('click',()=>{
    const selected=locations[button.dataset.location];
    if(!selected)return;
    locationButtons.forEach(option=>{
      const active=option===button;
      option.classList.toggle('active',active);
      option.setAttribute('aria-pressed',String(active));
    });
    addressLabel.textContent=selected.address;
    cityLabel.textContent=selected.city;
    statusLabel.textContent=selected.status;
    mapLinks.forEach(link=>link.href=selected.link);
    photoLink.href=selected.link;
    photoLink.setAttribute('aria-label',`Ver la sede ${selected.label} en Google Maps`);
    photo.src=selected.photo;
    photo.alt=selected.photoAlt;
    photoTitle.textContent=selected.photoTitle;
    photoCaption.textContent=selected.photoCaption;
    mapFrame.title=`Ubicación de la sede ${selected.label} de Misión Cristiana Camino al Cielo en Google Maps`;
    mapFrame.src=`https://www.google.com/maps?q=${encodeURIComponent(selected.query)}&output=embed&hl=es`;
  }));
}

// Próximo culto: el cálculo usa la hora fija de Ecuador continental (UTC-5).
const nextServiceName=document.querySelector('[data-next-service-name]');
if(nextServiceName){
  const services=[
    {day:0,time:'09:00',name:'Culto Devocional'},
    {day:0,time:'11:00',name:'Culto Devocional y Escuela Dominical'},
    {day:1,time:'08:00',name:'Tiempo de Oración'},
    {day:1,time:'20:00',name:'Ministerio de Caballeros'},
    {day:3,time:'08:00',name:'Tiempo de Oración'},
    {day:3,time:'20:00',name:'Crecimiento Cristiano'},
    {day:4,time:'17:00',name:'Ministerio de Damas'},
    {day:5,time:'08:00',name:'Tiempo de Oración'},
    {day:5,time:'20:00',name:'Testimonio y Oración'},
    {day:6,time:'14:30',name:'Ministerio de Niños'},
    {day:6,time:'18:30',name:'Ministerio de Jóvenes'}
  ];
  const partsFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Guayaquil',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const dateFormatter=new Intl.DateTimeFormat('es-EC',{timeZone:'America/Guayaquil',weekday:'long',day:'numeric',month:'long',hour:'numeric',minute:'2-digit',hour12:true});
  const readGuayaquilParts=date=>Object.fromEntries(partsFormatter.formatToParts(date).filter(part=>part.type!=='literal').map(part=>[part.type,Number(part.value)]));
  const findNextService=now=>{
    const local=readGuayaquilParts(now);
    const localDate=Date.UTC(local.year,local.month-1,local.day);
    const localWeekday=new Date(localDate).getUTCDay();
    let next=null;
    services.forEach(service=>{
      let daysAhead=(service.day-localWeekday+7)%7;
      const dateParts=new Date(localDate+daysAhead*86400000);
      const year=dateParts.getUTCFullYear();
      const month=String(dateParts.getUTCMonth()+1).padStart(2,'0');
      const day=String(dateParts.getUTCDate()).padStart(2,'0');
      let startsAt=new Date(`${year}-${month}-${day}T${service.time}:00-05:00`);
      if(startsAt<=now)startsAt=new Date(startsAt.getTime()+7*86400000);
      if(!next||startsAt<next.startsAt)next={...service,startsAt};
    });
    return next;
  };
  const fields={
    days:document.querySelector('[data-countdown-days]'),
    hours:document.querySelector('[data-countdown-hours]'),
    minutes:document.querySelector('[data-countdown-minutes]'),
    seconds:document.querySelector('[data-countdown-seconds]')
  };
  const dateLabel=document.querySelector('[data-next-service-date]');
  const accessibleLabel=document.querySelector('[data-countdown-accessible]');
  let nextService=findNextService(new Date());
  let lastAccessibleMinute=-1;
  const presentService=()=>{
    nextServiceName.textContent=nextService.name;
    const formatted=dateFormatter.format(nextService.startsAt);
    dateLabel.textContent=formatted.charAt(0).toUpperCase()+formatted.slice(1)+' · Guayaquil';
  };
  const updateCountdown=()=>{
    const now=new Date();
    let remaining=nextService.startsAt-now;
    if(remaining<=0){
      nextService=findNextService(now);
      presentService();
      remaining=nextService.startsAt-now;
    }
    const totalSeconds=Math.max(0,Math.floor(remaining/1000));
    const days=Math.floor(totalSeconds/86400);
    const hours=Math.floor(totalSeconds%86400/3600);
    const minutes=Math.floor(totalSeconds%3600/60);
    const seconds=totalSeconds%60;
    fields.days.textContent=String(days).padStart(2,'0');
    fields.hours.textContent=String(hours).padStart(2,'0');
    fields.minutes.textContent=String(minutes).padStart(2,'0');
    fields.seconds.textContent=String(seconds).padStart(2,'0');
    if(minutes!==lastAccessibleMinute){
      accessibleLabel.textContent=`Faltan ${days} días, ${hours} horas y ${minutes} minutos para ${nextService.name}.`;
      lastAccessibleMinute=minutes;
    }
  };
  presentService();
  updateCountdown();
  setInterval(updateCountdown,1000);
}
