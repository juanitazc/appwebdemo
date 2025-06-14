const defaultEvents = [
  {
    id: 1,
    name: 'CrossFit Challenge',
    category: 'CrossFit',
    date: '2024-05-15',
    time: '10:00',
    closing: '2024-05-10',
    location: { city: 'Madrid', place: 'Centro Deportivo' },
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    description: 'Evento de fuerza y resistencia.',
    rating: 4.2,
    ratings: [ {name:'Ana',stars:4,comment:'Muy bueno'} ],
    athletes: [ {name:'Carlos',email:'c@example.com',avatar:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='} ],
    trainings:['Entrenamiento 1','Entrenamiento 2']
  },
  {
    id: 2,
    name: 'Maratón Ciudad',
    category: 'Running',
    date: '2024-06-20',
    time: '08:00',
    closing: '2024-06-15',
    location: { city: 'Barcelona', place: 'Avenida Principal' },
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    description: 'Recorre las calles de la ciudad.',
    rating: 4.5,
    ratings: [],
    athletes: [],
    trainings:[]
  },
  {
    id: 3,
    name: 'Travesía a nado',
    category: 'Natación',
    date: '2024-07-05',
    time: '09:00',
    closing: '2024-07-01',
    location: { city: 'Valencia', place: 'Playa Central' },
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    description: 'Competencia en aguas abiertas.',
    rating: 4.0,
    ratings: [],
    athletes: [],
    trainings:['Calentamiento en playa']
  }
];

function loadEvents(){
  const stored = localStorage.getItem('eventsData');
  if(stored){
    return JSON.parse(stored);
  }else{
    localStorage.setItem('eventsData', JSON.stringify(defaultEvents));
    return defaultEvents;
  }
}

function saveEvents(data){
  localStorage.setItem('eventsData', JSON.stringify(data));
}

let events = loadEvents();

function renderFilters(){
  const catSelect = document.getElementById('filterCategory');
  const locSelect = document.getElementById('filterLocation');
  const categories = [...new Set(events.map(e=>e.category))];
  const locations = [...new Set(events.map(e=>e.location.city))];
  categories.forEach(c=>{
    const op = document.createElement('option');
    op.value = c; op.textContent = c; catSelect.appendChild(op);
  });
  locations.forEach(l=>{
    const op = document.createElement('option');
    op.value = l; op.textContent = l; locSelect.appendChild(op);
  });
}

function starString(n){
  const full = '★'.repeat(Math.round(n));
  const empty = '☆'.repeat(5-Math.round(n));
  return full+empty;
}

function renderEvents(list){
  const container = document.getElementById('events');
  container.innerHTML = '';
  list.forEach(ev=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${ev.image}" alt="${ev.name}">
      <h3>${ev.name}</h3>
      <p>${ev.date} - ${ev.location.city}</p>
      <div class="rating">${starString(ev.rating)}</div>
      <button data-id="${ev.id}">Ver más</button>
    `;
    card.querySelector('button').addEventListener('click',()=>showDetail(ev.id));
    container.appendChild(card);
  });
}

function showDetail(id){
  const ev = events.find(e=>e.id===id);
  if(!ev) return;
  const modal = document.getElementById('detailModal');
  modal.classList.remove('hidden');
  modal.innerHTML = `
    <div class="modal-content">
      <button onclick="closeModal()">Cerrar</button>
      <img src="${ev.image}" alt="${ev.name}">
      <h2>${ev.name}</h2>
      <p>${ev.description}</p>
      <p><strong>Categoría:</strong> ${ev.category}</p>
      <p><strong>Fecha:</strong> ${ev.date} ${ev.time}</p>
      <p><strong>Localización:</strong> ${ev.location.city} - ${ev.location.place}</p>
      <h3>Atletas inscritos</h3>
      <ul>${ev.athletes.map(a=>`<li>${a.name}</li>`).join('')}</ul>
      <h3>Entrenamientos</h3>
      <ul>${ev.trainings.map(t=>`<li>${t}</li>`).join('')}</ul>
      <h3>Valoraciones (${ev.ratings.length})</h3>
      <ul>${ev.ratings.map(r=>`<li>${starString(r.stars)} ${r.comment} - ${r.name}</li>`).join('')}</ul>
      <div>
        <h4>Reservar plaza</h4>
        <form id="reserveForm">
          <input type="text" name="name" placeholder="Nombre" required>
          <input type="email" name="email" placeholder="Correo" required>
          <button type="submit">Reservar</button>
        </form>
      </div>
      <div>
        <h4>Valorar evento</h4>
        <form id="ratingForm">
          <input type="number" name="stars" min="1" max="5" required>
          <textarea name="comment" placeholder="Comentario"></textarea>
          <input type="text" name="name" placeholder="Nombre" required>
          <button type="submit">Enviar valoración</button>
        </form>
      </div>
    </div>
  `;
  document.getElementById('reserveForm').addEventListener('submit',e=>{
    e.preventDefault();
    const f = e.target;
    ev.athletes.push({name:f.name.value,email:f.email.value,avatar:''});
    saveEvents(events);
    alert('Reserva realizada');
    showDetail(id);
  });
  document.getElementById('ratingForm').addEventListener('submit',e=>{
    e.preventDefault();
    const f = e.target;
    ev.ratings.push({name:f.name.value,stars:Number(f.stars.value),comment:f.comment.value});
    ev.rating = ev.ratings.reduce((sum,r)=>sum+r.stars,0)/ev.ratings.length;
    saveEvents(events);
    alert('Gracias por valorar');
    showDetail(id);
  });
}

function closeModal(){
  document.getElementById('detailModal').classList.add('hidden');
}

function applyFilters(){
  const cat = document.getElementById('filterCategory').value;
  const loc = document.getElementById('filterLocation').value;
  let list = [...events];
  if(cat) list = list.filter(e=>e.category===cat);
  if(loc) list = list.filter(e=>e.location.city===loc);
  renderEvents(list);
}

document.getElementById('filterCategory').addEventListener('change',applyFilters);
document.getElementById('filterLocation').addEventListener('change',applyFilters);
document.getElementById('sortRating').addEventListener('click',()=>{
  const list = [...events].sort((a,b)=>b.rating-a.rating);
  renderEvents(list);
});
document.getElementById('sortClosing').addEventListener('click',()=>{
  const list = [...events].sort((a,b)=>new Date(a.closing)-new Date(b.closing));
  renderEvents(list);
});

function renderRanking(){
  const rankR = document.getElementById('rankRating');
  const rankC = document.getElementById('rankClosing');
  rankR.innerHTML = '';
  rankC.innerHTML = '';
  [...events].sort((a,b)=>b.rating-a.rating).forEach(ev=>{
    const li = document.createElement('li');
    li.textContent = `${ev.name} - ${ev.rating.toFixed(1)} estrellas`;
    rankR.appendChild(li);
  });
  [...events].sort((a,b)=>new Date(a.closing)-new Date(b.closing)).forEach(ev=>{
    const li = document.createElement('li');
    li.textContent = `${ev.name} - cierra ${ev.closing}`;
    rankC.appendChild(li);
  });
}

renderFilters();
renderEvents(events);
renderRanking();
