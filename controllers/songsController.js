
let songs = [
  {
    id: 1,
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    genre: 'rock'
  },
  {
    id: 2,
    title: 'Come As You Are',
    artist: 'Nirvana',
    genre: 'rock'
  }
];


exports.getAll = (req, res) => {
  const { genre, artist } = req.query;

  let result = [...songs];

  if (genre) {
    result = result.filter((s) => s.genre?.toLowerCase() === genre.toLowerCase());
  }

  if (artist) {
    result = result.filter((s) => s.artist?.toLowerCase() === artist.toLowerCase());
  }

  res.json(result);
};


exports.getOne = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const song = songs.find((s) => s.id === id);
  if (!song) {
    return res.status(404).json({ error: 'Song not found' });
  }

  res.json(song);
};


exports.addOne = (req, res) => {
  const { title, artist, genre } = req.body;

  if (!title || !artist) {
    return res.status(400).json({
      error: 'Fields "title" and "artist" are required'
    });
  }

  const newSong = {
    id: Date.now(), 
    title: String(title),
    artist: String(artist),
    genre: genre ? String(genre) : 'unknown'
  };

  songs.push(newSong);
  res.status(201).json(newSong);
};


exports.updateOne = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const song = songs.find((s) => s.id === id);
  if (!song) {
    return res.status(404).json({ error: 'Song not found' });
  }

  const { title, artist, genre } = req.body;

  if (title !== undefined) song.title = String(title);
  if (artist !== undefined) song.artist = String(artist);
  if (genre !== undefined) song.genre = String(genre);

  res.json(song);
};

exports.deleteOne = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const oldLength = songs.length;
  songs = songs.filter((s) => s.id !== id);

  if (songs.length === oldLength) {
    return res.status(404).json({ error: 'Song not found' });
  }

  res.json({ message: 'Deleted successfully' });
};
