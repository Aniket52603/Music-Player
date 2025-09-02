// Music Player Data
        const songs = [
            { id: 1, title: "Summer Vibes", artist: "Chill Beats", image: "https://picsum.photos/200/200?random=1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
            { id: 2, title: "Night Drive", artist: "Electronic Dreams", image: "https://picsum.photos/200/200?random=2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
            { id: 3, title: "Morning Coffee", artist: "Jazz Collective", image: "https://picsum.photos/200/200?random=3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
            { id: 4, title: "Ocean Waves", artist: "Nature Sounds", image: "https://picsum.photos/200/200?random=4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
            { id: 5, title: "City Lights", artist: "Urban Flow", image: "https://picsum.photos/200/200?random=5", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
            { id: 6, title: "Mountain High", artist: "Adventure Beats", image: "https://picsum.photos/200/200?random=6", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
            { id: 7, title: "Sunset Boulevard", artist: "Retro Wave", image: "https://picsum.photos/200/200?random=7", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
            { id: 8, title: "Rainy Day", artist: "Ambient Moods", image: "https://picsum.photos/200/200?random=8", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
            { id: 9, title: "Galaxy Explorer", artist: "Space Odyssey", image: "https://picsum.photos/200/200?random=9", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
            { id: 10, title: "Forest Path", artist: "Natural Harmony", image: "https://picsum.photos/200/200?random=10", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
            { id: 11, title: "Digital Dreams", artist: "Cyber Pulse", image: "https://picsum.photos/200/200?random=11", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
            { id: 12, title: "Tropical Paradise", artist: "Island Vibes", image: "https://picsum.photos/200/200?random=12", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
            { id: 13, title: "Midnight Jazz", artist: "Smooth Sessions", image: "https://picsum.photos/200/200?random=13", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
            { id: 14, title: "Arctic Aurora", artist: "Nordic Sounds", image: "https://picsum.photos/200/200?random=14", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
            { id: 15, title: "Desert Mirage", artist: "Eastern Winds", image: "https://picsum.photos/200/200?random=15", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" }
            
        ];

        // State Management
        let currentSongIndex = 0;
        let isPlaying = false;
        let isShuffled = false;
        let isRepeating = false;
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        let shuffledPlaylist = [...songs];

        // Audio Element
        const audio = new Audio();

        // DOM Elements
        const albumArt = document.getElementById('albumArt');
        const songTitle = document.getElementById('songTitle');
        const artistName = document.getElementById('artistName');
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');
        const progress = document.getElementById('progress');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumePercent = document.getElementById('volumePercent');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');
        const searchInput = document.getElementById('searchInput');
        const voiceSearchBtn = document.getElementById('voiceSearchBtn');

        // Initialize
        function init() {
            renderPlaylist();
            updateVisitorCount();
            audio.volume = 0.7;
        }

        // Render Playlist
        function renderPlaylist() {
            const playlistEl = document.getElementById('playlistSongs');
            playlistEl.innerHTML = '';
            
            songs.forEach((song, index) => {
                const li = createSongElement(song, index);
                playlistEl.appendChild(li);
            });
            
            updateRecentlyPlayed();
            updateFavorites();
        }

        // Create Song Element
        function createSongElement(song, index) {
            const li = document.createElement('li');
            li.className = 'song-item';
            if (index === currentSongIndex) li.classList.add('active');
            
            const isFavorited = favorites.includes(song.id);
            
            li.innerHTML = `
                <img src="${song.image}" alt="${song.title}" class="song-thumbnail">
                <div class="song-details">
                    <div class="song-name">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-actions">
                    <button class="action-btn favorite-btn ${isFavorited ? 'favorited' : ''}" data-id="${song.id}">
                        ${isFavorited ? '❤️' : '🤍'}
                    </button>
                </div>
            `;
            
            li.addEventListener('click', (e) => {
                if (!e.target.classList.contains('action-btn')) {
                    currentSongIndex = index;
                    loadSong(song);
                    playSong();
                }
            });
            
            const favoriteBtn = li.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(song.id);
            });
            
            return li;
        }

        // Load Song
        function loadSong(song) {
            audio.src = song.url;
            albumArt.src = song.image;
            songTitle.textContent = song.title;
            artistName.textContent = song.artist;
            
            // Add to recently played
            if (!recentlyPlayed.find(s => s.id === song.id)) {
                recentlyPlayed.unshift(song);
                if (recentlyPlayed.length > 10) recentlyPlayed.pop();
                localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
                updateRecentlyPlayed();
            }
            
            updateActiveSong();
        }

        // Play/Pause Song
        function playSong() {
            isPlaying = true;
            audio.play();
            playBtn.textContent = '⏸';
            albumArt.classList.add('playing');
        }

        function pauseSong() {
            isPlaying = false;
            audio.pause();
            playBtn.textContent = '▶';
            albumArt.classList.remove('playing');
        }

        // Controls
        playBtn.addEventListener('click', () => {
            if (isPlaying) pauseSong();
            else playSong();
        });

        prevBtn.addEventListener('click', () => {
            currentSongIndex--;
            if (currentSongIndex < 0) currentSongIndex = songs.length - 1;
            loadSong(songs[currentSongIndex]);
            playSong();
        });

        nextBtn.addEventListener('click', () => {
            if (isShuffled) {
                currentSongIndex = Math.floor(Math.random() * songs.length);
            } else {
                currentSongIndex++;
                if (currentSongIndex >= songs.length) currentSongIndex = 0;
            }
            loadSong(songs[currentSongIndex]);
            playSong();
        });

        // Progress Bar
        audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = progressPercent + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        });

        progressBar.addEventListener('click', (e) => {
            const width = progressBar.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            audio.currentTime = (clickX / width) * duration;
        });

        // Volume Control
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audio.volume = volume;
            volumePercent.textContent = e.target.value + '%';
        });

        // Shuffle & Repeat
        shuffleBtn.addEventListener('click', () => {
            isShuffled = !isShuffled;
            shuffleBtn.classList.toggle('active');
        });

        repeatBtn.addEventListener('click', () => {
            isRepeating = !isRepeating;
            repeatBtn.classList.toggle('active');
        });

        // Auto Play Next
        audio.addEventListener('ended', () => {
            if (isRepeating) {
                audio.currentTime = 0;
                playSong();
            } else {
                nextBtn.click();
            }
        });

        // Search
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const songItems = document.querySelectorAll('#playlistSongs .song-item');
            
            songItems.forEach(item => {
                const title = item.querySelector('.song-name').textContent.toLowerCase();
                const artist = item.querySelector('.song-artist').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Voice Search
        voiceSearchBtn.addEventListener('click', () => {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';
                
                voiceSearchBtn.classList.add('recording');
                
                recognition.start();
                
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    searchInput.value = transcript;
                    searchInput.dispatchEvent(new Event('input'));
                    voiceSearchBtn.classList.remove('recording');
                };
                
                recognition.onerror = () => {
                    voiceSearchBtn.classList.remove('recording');
                    alert('Voice search failed. Please try again.');
                };
                
                recognition.onend = () => {
                    voiceSearchBtn.classList.remove('recording');
                };
            } else {
                alert('Voice search is not supported in your browser.');
            }
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabName).classList.add('active');
            });
        });

        // Favorites
        function toggleFavorite(songId) {
            const index = favorites.indexOf(songId);
            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push(songId);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderPlaylist();
        }

        function updateFavorites() {
            const favoritesEl = document.getElementById('favoriteSongs');
            favoritesEl.innerHTML = '';
            
            const favoriteSongs = songs.filter(song => favorites.includes(song.id));
            favoriteSongs.forEach((song, index) => {
                const li = createSongElement(song, songs.indexOf(song));
                favoritesEl.appendChild(li);
            });
        }

        function updateRecentlyPlayed() {
            const recentEl = document.getElementById('recentSongs');
            recentEl.innerHTML = '';
            
            recentlyPlayed.forEach(song => {
                const originalIndex = songs.findIndex(s => s.id === song.id);
                const li = createSongElement(song, originalIndex);
                recentEl.appendChild(li);
            });
        }

        function updateActiveSong() {
            document.querySelectorAll('.song-item').forEach((item, index) => {
                item.classList.remove('active');
                if (index === currentSongIndex) {
                    item.classList.add('active');
                }
            });
        }

        // Visitor Counter
        function updateVisitorCount() {
            let count = parseInt(localStorage.getItem('visitorCount') || '0');
            count++;
            localStorage.setItem('visitorCount', count.toString());
            document.getElementById('visitorCount').textContent = count;
        }

        // Helper Functions
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // Initialize the player
        init();