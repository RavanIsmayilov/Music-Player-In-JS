const CLIENT_ID = '3116896738464e01b0e5caa3353d2956';
const CLIENT_SECRET = 'db607ef021a348edb1b06d6e98a141b8';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();
let musicIndex = 0;
let isPlaying = false;
let tracks = [];

async function getAccessToken() {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}



async function fetchTracks() {
    const token = await getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n/tracks', { // Replace with your playlist ID
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    console.log(data);
    

    tracks = data.items.map(item => ({
        path: item.track.preview_url, 
        displayName: item.track.name,
        cover: item.track.album.images[0].url,
        artist: item.track.artists[0].name,
    }));

    loadMusic(tracks[musicIndex]);
}

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.loop = true; 
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(track) {
    music.src = track.path;
    title.textContent = track.displayName;
    artist.textContent = track.artist;
    image.src = track.cover;
    background.src = track.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + tracks.length) % tracks.length;
    loadMusic(tracks[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
        durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    }
    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

fetchTracks();
