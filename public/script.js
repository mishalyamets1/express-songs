const API_BASE = '/api/songs';

const songsList = document.getElementById('songsList');
const songForm = document.getElementById('songForm');
const inputTitle = document.getElementById('title');
const inputArtist = document.getElementById('artist');
const inputGenre = document.getElementById('genre');

const filterArtist = document.getElementById('filterArtist');
const filterGenre = document.getElementById('filterGenre');
const applyFilterBtn = document.getElementById('applyFilter');
const resetFilterBtn = document.getElementById('resetFilter');

async function fetchSongs(params = {}) {
  const url = new URL(API_BASE, window.location.origin);

  if (params.artist) url.searchParams.set('artist', params.artist);
  if (params.genre) url.searchParams.set('genre', params.genre);

  const res = await fetch(url);
  const data = await res.json();
  renderSongs(data);
}

function renderSongs(songs) {
  songsList.innerHTML = '';

  if (!Array.isArray(songs) || songs.length === 0) {
    songsList.innerHTML = '<li>Песен пока нет</li>';
    return;
  }

  songs.forEach((song) => {
    const li = document.createElement('li');
    li.className = 'song-item';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'song-info';

    const titleEl = document.createElement('span');
    titleEl.className = 'song-title';
    titleEl.textContent = song.title;

    const metaEl = document.createElement('span');
    metaEl.className = 'song-meta';
    metaEl.textContent = `${song.artist} · ${song.genre || 'unknown'}`;

    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(metaEl);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'song-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => deleteSong(song.id));

    actionsDiv.appendChild(deleteBtn);

    li.appendChild(infoDiv);
    li.appendChild(actionsDiv);

    songsList.appendChild(li);
  });
}

async function deleteSong(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    alert('Ошибка при удалении песни');
    return;
  }

  await fetchSongs({
    artist: filterArtist.value.trim(),
    genre: filterGenre.value.trim()
  });
}

songForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = inputTitle.value.trim();
  const artist = inputArtist.value.trim();
  const genre = inputGenre.value.trim();

  if (!title || !artist) {
    alert('Название и исполнитель обязательны');
    return;
  }

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, artist, genre })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert('Ошибка при добавлении песни: ' + (err.error || res.status));
    return;
  }

  inputTitle.value = '';
  inputArtist.value = '';
  inputGenre.value = '';

  await fetchSongs({
    artist: filterArtist.value.trim(),
    genre: filterGenre.value.trim()
  });
});

applyFilterBtn.addEventListener('click', () => {
  fetchSongs({
    artist: filterArtist.value.trim(),
    genre: filterGenre.value.trim()
  });
});

resetFilterBtn.addEventListener('click', () => {
  filterArtist.value = '';
  filterGenre.value = '';
  fetchSongs();
});


fetchSongs();
