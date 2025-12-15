

const API_KEY = 'f3a77333';
const search = document.getElementById('search');
const results = document.getElementById('results');
const error = document.getElementById('error');
const modal = document.getElementById('modal');

search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies();
});

async function searchMovies() {
    const query = search.value.trim();
    error.classList.remove('show');
    if (!query) {
        showError('Please enter a movie name');
        return;
    }

    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
        const data = await res.json();

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            showError('No movies found');
            results.innerHTML = '';
        }
    } catch (err) {
        showError('Error searching movies');
    }
}

function displayMovies(movies) {
    results.innerHTML = movies.map(m => `
                <div class="card">
                    <img src="${m.Poster !== 'N/A' ? m.Poster : 'https://via.placeholder.com/300x400?text=No+Poster'}" alt="${m.Title}">
                    <div class="card-info">
                        <div class="title">${m.Title}</div>
                        <span class="badge">${m.Year}</span>
                        <span class="badge">${m.Type.toUpperCase()}</span>
                        <button class="info-btn" onclick="getMovieDetails('${m.imdbID}')">More Info</button>
                    </div>
                </div>
            `).join('');
}

async function getMovieDetails(id) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
        const movie = await res.json();

        document.getElementById('modalBody').innerHTML = `
                    <h2 class="modal-title">${movie.Title}</h2>
                    <span class="rating">⭐ ${movie.imdbRating}/10</span>
                    <div class="info-row"><span class="info-label">Year:</span> ${movie.Year}</div>
                    <div class="info-row"><span class="info-label">Genre:</span> ${movie.Genre}</div>
                    <div class="info-row"><span class="info-label">Director:</span> ${movie.Director}</div>
                    <div class="info-row"><span class="info-label">Actors:</span> ${movie.Actors}</div>
                    <div class="info-row"><span class="info-label">Runtime:</span> ${movie.Runtime}</div>
                    <div class="plot"><span class="info-label">Plot:</span><br><br>${movie.Plot}</div>
                `;

        modal.classList.add('show');
    } catch (error) {

        showError('Error fetching details');
    }
}
function closeModal(event) {
    if (!event || event.target === modal) {
        modal.classList.remove('show');
    }
}

function showError(msg) {
    error.textContent = msg;
    error.classList.add('show');
}
