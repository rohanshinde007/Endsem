const movieApiUrl = 'http://www.omdbapi.com/?i=tt3896198&apikey=941ac08a'; // Replace with your own OMDb API key and query
const movieGrid = document.getElementById('movie-grid');
const videoModal = document.getElementById('video-modal');
const moviePlayer = document.getElementById('movie-player');
const movieSource = document.getElementById('movie-source');
const closeModal = document.getElementById('close-modal');
const playPauseBtn = document.getElementById('playPauseBtn');
const forwardBtn = document.getElementById('forwardBtn');
const backwardBtn = document.getElementById('backwardBtn');

// For toggling play/pause button
let isPlaying = false;

// Fetch movie data from OMDb API
async function fetchMovies() {
    try {
        const response = await fetch(movieApiUrl);
        const data = await response.json();
        
        if (data.Response === 'True' && data.Search) {
            displayMovies(data.Search); // Display the movie grid
        } else {
            console.error('No movies found');
            displayError('No movies found');
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
        displayError('Error fetching movies');
    }
}

// Display movies in grid format
function displayMovies(movies) {
    movieGrid.innerHTML = ''; // Clear existing grid

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        
        const movieThumbnail = document.createElement('img');
        movieThumbnail.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300';
        movieThumbnail.alt = movie.Title;

        movieItem.appendChild(movieThumbnail);
        movieItem.addEventListener('click', () => openMovie(movie));

        movieGrid.appendChild(movieItem);
    });
}

// Display error message
function displayError(message) {
    movieGrid.innerHTML = `<p>${message}</p>`;
}

// Open the video modal and load the movie
function openMovie(movie) {
    // Set the video source (this could be a real URL if available)
    const movieUrl = movie.Poster !== 'N/A' ? movie.Poster : ''; // In a real-world scenario, you'd need a direct video URL
    movieSource.src = movieUrl;
    moviePlayer.load(); // Reload the video player with the new source
    videoModal.style.display = 'flex'; // Show the video modal
    playPauseBtn.textContent = 'Play';
    isPlaying = false;
}

// Close the video modal
closeModal.addEventListener('click', () => {
    videoModal.style.display = 'none';
    moviePlayer.pause();
    playPauseBtn.textContent = 'Play';
    isPlaying = false;
});

// Toggle play/pause
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        moviePlayer.pause();
        playPauseBtn.textContent = 'Play';
    } else {
        moviePlayer.play();
        playPauseBtn.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
});

// Forward 10 seconds
forwardBtn.addEventListener('click', () => {
    moviePlayer.currentTime += 10;
});

// Backward 10 seconds
backwardBtn.addEventListener('click', () => {
    moviePlayer.currentTime -= 10;
});

// Fetch movies when the page loads
fetchMovies();
