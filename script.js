// =========================================
// ELEMENTS
// =========================================

const form = document.getElementById("form");
const searchInput = document.getElementById("search-input");
const moviesContainer = document.getElementById("movies-container");

const loader = document.getElementById("loader");
const toast = document.getElementById("toast");


// =========================================
// APP STATE
// =========================================

let movies = [];

let watchlist =
    JSON.parse(localStorage.getItem("watchlist")) || [];

const API_KEY = "6a616cc4";


// =========================================
// EVENT LISTENERS
// =========================================

form.addEventListener("submit", handleSearch);

document.addEventListener("click", handleMovieActions);


// =========================================
// SEARCH MOVIES
// =========================================

async function handleSearch(e) {

    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) return;

    showLoader();

    try {

        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&type=movie`
        );

        const data = await response.json();

        if (data.Response === "False") {

            hideLoader();

            renderEmptyState();

            return;
        }

        movies = await fetchMovieDetails(data.Search);

        renderMovies(movies);

    }

    catch (error) {

        console.error(error);

        renderError();

    }

    finally {

        hideLoader();

    }

}


// =========================================
// FETCH COMPLETE MOVIE DETAILS
// =========================================

async function fetchMovieDetails(movieList) {

    const requests = movieList.map(movie =>

        fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
        )

        .then(res => res.json())

    );

    return Promise.all(requests);

}


// =========================================
// HANDLE WATCHLIST
// =========================================

function handleMovieActions(e) {

    const button = e.target.closest(".add-remove-btn");

    if (!button) return;

    const movieId = button.dataset.id;

    const selectedMovie = movies.find(
        movie => movie.imdbID === movieId
    );

    if (!selectedMovie) return;

    const alreadyExists = watchlist.some(
        movie => movie.imdbID === movieId
    );

    if (alreadyExists) {

        showToast("Movie already in Watchlist ❤️");

        return;

    }

    watchlist.push(selectedMovie);

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

    showToast("Added to Watchlist 🎉");

}

// =========================================
// RENDER MOVIES
// =========================================

function renderMovies(movieList) {

    moviesContainer.innerHTML = movieList.map(movie => {

        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "images/no-poster.png";

        return `

        <div class="movie">

            <div class="movie-poster">

                <img
                    src="${poster}"
                    alt="${movie.Title}"
                >

            </div>

            <div class="movie-body">

                <div class="movie-data">

                    <h2 class="movie-title">
                        ${movie.Title}
                    </h2>

                    <span class="movie-rating">
                        ⭐ ${movie.imdbRating}
                    </span>

                </div>

                <div class="movie-details">

                    <span class="movie-runtime">
                        ${movie.Runtime}
                    </span>

                    <span class="movie-genres">
                        ${movie.Genre}
                    </span>

                    <button
    class="add-remove-btn"
    data-id="${movie.imdbID}"
>
    <i class="fa-solid fa-heart"></i>
    Watchlist
</button>

                </div>

                <p class="movie-description">

                    ${movie.Plot}

                </p>

            </div>

        </div>

        `;

    }).join("");

}


// =========================================
// EMPTY SEARCH
// =========================================

function renderEmptyState() {

    moviesContainer.innerHTML = `

        <div class="body-wrapper">

            <h2 class="no-data">

                😔 No movies found.

            </h2>

            <p style="color:#94A3B8; margin-top:10px;">

                Try another movie title.

            </p>

        </div>

    `;

}


// =========================================
// ERROR
// =========================================

function renderError() {

    moviesContainer.innerHTML = `

        <div class="body-wrapper">

            <h2 class="no-data">

                ⚠️ Something went wrong.

            </h2>

            <p style="color:#94A3B8; margin-top:10px;">

                Please try again later.

            </p>

        </div>

    `;

}


// =========================================
// LOADER
// =========================================

function showLoader() {

    loader.classList.remove("hidden");

    moviesContainer.innerHTML = "";

}

function hideLoader() {

    loader.classList.add("hidden");

}


// =========================================
// TOAST
// =========================================

let toastTimeout;

function showToast(message) {

    clearTimeout(toastTimeout);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// =========================================
// OPTIONAL
// Search when pressing Enter only
// Clear previous results on empty input
// =========================================

searchInput.addEventListener("input", () => {

    if (!searchInput.value.trim()) {

        moviesContainer.innerHTML = "";

    }

});