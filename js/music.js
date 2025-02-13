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


const proxyUrls = [
    "https://api.codetabs.com/v1/proxy?quest="
];

async function fetchDeezerTracks() {
    const TRACK_IDS = [3135556, 1109731, 647056, 78598850];

    for (const TRACK_ID of TRACK_IDS) {
        try {
            const response = await fetch(`/api/deezer/track/${TRACK_ID}`);
            if (!response.ok) {
                throw new Error(`API xətası: ${response.status}`);
            }
            const data = await response.json();

            if (data.preview) {
                tracks.push({
                    path: data.preview,
                    displayName: data.title,
                    cover: data.album.cover_big,
                    artist: data.artist.name,
                });
            } else {
                console.warn(`Track ${TRACK_ID} üçün preview_url tapılmadı.`);
            }
        } catch (error) {
            console.error("Xəta baş verdi:", error);
        }
    }

    if (tracks.length === 0) {
        alert("Musiqilər açılmır, çünki `preview_url` mövcud deyil!");
    } else {
        loadMusic(tracks[musicIndex]);
    }
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

fetchDeezerTracks();
