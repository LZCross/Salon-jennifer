const LISTA = document.getElementById('comentarios');
const FORM = document.getElementById('form-comentario');
const KEY = 'comentariosSalonDJ';

async function cargarBase() {
  try {
    const res = await fetch('data/comentarios.json', { cache: 'no-store' });
    return await res.json();
  } catch (e) {
    console.warn('No se pudo cargar comentarios base', e);
    return [];
  }
}
function getLocales() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
function setLocales(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}
function render(lista) {
  LISTA.innerHTML = '';
  lista.forEach(c => {
    const estrellas = '⭐'.repeat(Math.max(0, Math.min(5, Number(c.estrellas)||0)));
    const item = document.createElement('div');
    item.className = 'list-group-item';
    item.innerHTML = `<h5>${c.nombre} - ${estrellas}</h5><p>${c.comentario}</p>`;
    LISTA.appendChild(item);
  });
}

async function init() {
  const base = await cargarBase();
  const locales = getLocales();
  render([...base, ...locales]);
}
init();

if (FORM) {
  FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim() || 'Cliente';
    const comentario = document.getElementById('comentario').value.trim();
    const estrellas = parseInt(document.getElementById('estrellas').value, 10) || 5;
    const nuevo = { nombre, comentario, estrellas };
    const actuales = getLocales();
    actuales.push(nuevo);
    setLocales(actuales);
    init();
    FORM.reset();
  });

  document.getElementById('clearLocal').addEventListener('click', () => {
    if (confirm('¿Borrar tus reseñas guardadas en este navegador?')) {
      setLocales([]);
      init();
    }
  });
}
