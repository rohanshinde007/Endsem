// TMDB Movie API
const API_KEY = "api_key=5397b7cab4b1207b4e384089bb1286ec"; // API Key
const BASE_URL = "https://api.themoviedb.org/3";
// const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`; // Template literal
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`;

const genres = [
	{
		id: 28,
		name: "Action",
	},
	{
		id: 12,
		name: "Adventure",
	},
	{
		id: 16,
		name: "Animation",
	},
	{
		id: 35,
		name: "Comedy",
	},
	{
		id: 80,
		name: "Crime",
	},
	{
		id: 99,
		name: "Documentary",
	},
	{
		id: 18,
		name: "Drama",
	},
	{
		id: 10751,
		name: "Family",
	},
	{
		id: 14,
		name: "Fantasy",
	},
	{
		id: 36,
		name: "History",
	},
	{
		id: 27,
		name: "Horror",
	},
	{
		id: 10402,
		name: "Music",
	},
	{
		id: 9648,
		name: "Mystery",
	},
	{
		id: 10749,
		name: "Romance",
	},
	{
		id: 878,
		name: "Science Fiction",
	},
	{
		id: 10770,
		name: "TV Movie",
	},
	{
		id: 53,
		name: "Thriller",
	},
	{
		id: 10752,
		name: "War",
	},
	{
		id: 37,
		name: "Western",
	},
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPages = 100;

window.addEventListener("load", function () {
	let loader = document.querySelector(".loader");
	loader.style.display = "none"; // Hide the loader when the window finishes loading
});

let selectedGenre = [];
setGenre();
function setGenre() {
	tagsEl.innerHTML = "";
	genres.slice(0, 5).forEach((genre) => { // Limit to first 5 genres
		const t = document.createElement("div");
		t.classList.add("tag");
		t.id = genre.id;
		t.innerText = genre.name;
		t.addEventListener("click", () => {
			if (selectedGenre.length == 0) {
				selectedGenre.push(genre.id);
			} else {
				if (selectedGenre.includes(genre.id)) {
					selectedGenre.forEach((id, idx) => {
						if (id == genre.id) {
							selectedGenre.splice(idx, 1);
						}
					});
				} else {
					selectedGenre.push(genre.id);
				}
			}
			console.log(selectedGenre);
			getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
			highlightSelection();
		});
		tagsEl.append(t);
	});
}

function highlightSelection() {
	const tags = document.querySelectorAll(".tag");
	tags.forEach((tag) => {
		tag.classList.remove("highlight");
	});
	clearBtn();
	if (selectedGenre.length != 0) {
		selectedGenre.forEach((id) => {
			const hightlightedTag = document.getElementById(id);
			hightlightedTag.classList.add("highlight");
		});
	}
}

function clearBtn() {
	let clearBtn = document.getElementById("clear");
	if (clearBtn) {
		clearBtn.remove(); // Remove the clear button if it exists
	}
}

getMovies(API_URL);

function getMovies(url) {
	lastUrl = url;
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			console.log(data.results);
			if (data.results.length !== 0) {
				showMovies(data.results);
				currentPage = data.page;
				nextPage = currentPage + 1;
				prevPage = currentPage - 1;
				totalPages = data.total_pages;

				current.innerText = currentPage;

				if (currentPage <= 1) {
					prev.classList.add("disabled");
					next.classList.remove("disabled");
				} else if (currentPage >= totalPages) {
					prev.classList.remove("disabled");
					next.classList.add("disabled");
				} else {
					prev.classList.remove("disabled");
					next.classList.remove("disabled");
				}

				tagsEl.scrollIntoView({ behavior: "smooth" });
			} else {
				main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
			}
		});
}

function showMovies(data) {
	main.innerHTML = "";

	data.forEach((movie) => {
		const { title, poster_path, vote_average, overview, id } = movie;
		const movieEl = document.createElement("div");
		movieEl.classList.add("movie");
		movieEl.innerHTML = `
             <img src="${
								poster_path
									? IMAGE_URL + poster_path
									: "http://via.placeholder.com/1080x1580"
							}" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <button class="know-more" id="${id}">Know More</button
            </div>
        
        `;

		main.appendChild(movieEl);

		document.getElementById(id).addEventListener("click", () => {
			console.log(id);
			openNav(movie);
		});
	});
}

const overlayContent = document.getElementById("overlay-content");
/* Open when someone clicks on the span element */
function openNav(movie) {
	let id = movie.id;
	fetch(`${BASE_URL}/movie/${id}/videos?${API_KEY}`)
		.then((res) => res.json())
		.then((videoData) => {
			if (videoData.results.length > 0) {
				const video = videoData.results.find(video => video.site === "YouTube");
				if (video) {
					const { key } = video;
					// Redirect to video.html with movie id and video key as query parameters
					window.location.href = `video.html?id=${id}&key=${key}`;
				} else {
					alert("No Trailer Found");
				}
			} else {
				alert("No Trailer Found");
			}
		});
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
	document.getElementById("myNav").style.width = "0%";
}

let activeSlide = 0;
let totalVideos = 0;

function showVideos() {
	let embedClasses = document.querySelectorAll(".embed");
	let dots = document.querySelectorAll(".dot");

	totalVideos = embedClasses.length;
	embedClasses.forEach((embedTag, idx) => {
		if (activeSlide == idx) {
			embedTag.classList.add("show");
			embedTag.classList.remove("hide");
		} else {
			embedTag.classList.add("hide");
			embedTag.classList.remove("show");
		}
	});

	dots.forEach((dot, indx) => {
		if (activeSlide == indx) {
			dot.classList.add("active");
		} else {
			dot.classList.remove("active");
		}
	});
}

const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
	if (activeSlide > 0) {
		activeSlide--;
	} else {
		activeSlide = totalVideos - 1;
	}

	showVideos();
});

rightArrow.addEventListener("click", () => {
	if (activeSlide < totalVideos - 1) {
		activeSlide++;
	} else {
		activeSlide = 0;
	}
	showVideos();
});

function getColor(vote) {
	if (vote >= 8) {
		return "green";
	} else if (vote >= 5) {
		return "orange";
	} else {
		return "red";
	}
}

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const searchTerm = search.value;
	selectedGenre = [];
	setGenre();
	if (searchTerm) {
		getMovies(SEARCH_URL + "&query=" + searchTerm);
	} else {
		getMovies(API_URL);
	}
});

prev.addEventListener("click", () => {
	if (prevPage > 0) {
		pageCall(prevPage);
	}
});

next.addEventListener("click", () => {
	if (nextPage <= totalPages) {
		pageCall(nextPage);
	}
});

function pageCall(page) {
	let urlSplit = lastUrl.split("?");
	let queryParams = urlSplit[1].split("&");
	let key = queryParams[queryParams.length - 1].split("=");
	if (key[0] != "page") {
		let url = lastUrl + "&page=" + page;
		getMovies(url);
	} else {
		key[1] = page.toString();
		let a = key.join("=");
		queryParams[queryParams.length - 1] = a;
		let b = queryParams.join("&");
		let url = urlSplit[0] + "?" + b;
		getMovies(url);
	}
	// Prevent scrolling to the top of the page
	window.scrollTo({ top: 0, behavior: "smooth" });
}
