// =========================================
// ELEMENTS
// =========================================

const watchlistContainer = document.getElementById("watchlist-container");


// =========================================
// STATE
// =========================================

let watchlist =
    JSON.parse(localStorage.getItem("watchlist")) || [];


// =========================================
// INITIAL RENDER
// =========================================

renderWatchlist();


// =========================================
// REMOVE MOVIE
// =========================================

document.addEventListener("click", (e) => {

    const button = e.target.closest(".add-remove-btn");

    if (!button) return;

    const movieId = button.dataset.id;

    watchlist = watchlist.filter(
        movie => movie.imdbID !== movieId
    );

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

    showToast("Removed from Watchlist 🗑️");

    renderWatchlist();

});


// =========================================
// RENDER WATCHLIST
// =========================================

function renderWatchlist() {

    if (!watchlist.length) {

        renderEmptyWatchlist();

        return;

    }

    watchlistContainer.innerHTML = watchlist.map(movie => {

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
    <i class="fa-solid fa-trash"></i>
    Remove
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
// EMPTY WATCHLIST
// =========================================

function renderEmptyWatchlist() {

    watchlistContainer.innerHTML = `

        <div class="body-wrapper">

            <h2 class="no-data">

                🎬 Your Watchlist is Empty

            </h2>

            <p style="color:#94A3B8; margin-bottom:20px;">

                Search and save your favourite movies.

            </p>

            <a href="index.html" class="page-nav">

                ➕ Explore Movies

            </a>

        </div>

    `;

}


// =========================================
// TOAST
// =========================================

let toastTimeout;

function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    clearTimeout(toastTimeout);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}