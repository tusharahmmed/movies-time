/**
 * Project Name: Movie Web Application using API
 * Author: Tushar Ahmmed
 * API Partner: TMDB
 * Date: 8/30/2021
 */

//handle
const formBtn = document.getElementById('form-btn');
const inputField = document.getElementById('input-value');
const generationUl = document.getElementById('gen-ul');
const mainSection = document.getElementById('main-section');
const moviesContainer = document.getElementById('movie-container');
const movies = document.getElementsByClassName('movies-item');
// api key
const apiKey = 'api_key=4e06ca1de4ca703fadba0a145b9cd1ce';

/**
 *  Functions
 */

// set api url
const getUrl = (gen = '', query = '') => {

    // set api url
    if (gen) {
        // if have generation id
        let url = `HTTPS://api.themoviedb.org/3/discover/movie/?with_genres=${gen}&${apiKey}`;
        // return url
        return url;

    } else if (query) {
        // if have search value
        let url = `HTTPS://api.themoviedb.org/3/search/movie?language=en-US&include_adult=false&query=${query}&${apiKey}`;
        // return url
        return url;

    } else {
        // default base url
        let url = `HTTPS://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&language=en-US&${apiKey}`;
        // return url
        return url;
    }
}

// call the api url
const getMovies = (gen, query) => {

    // get the url
    let url = getUrl(gen, query);

    //fetch
    fetch(url)
        .then(response => response.json())
        .then(movieList => extractMovies(movieList));
}

// collect data from object
const extractMovies = data => {
    //console.log(data);
    for (let result of data.results) {
        // get values
        let { original_title, poster_path, release_date, id } = result;
        let img = `HTTPS://image.tmdb.org/t/p/original${poster_path}`;
        //console.log(result);
        showMovies(original_title, img, release_date, id);
    }
}

// generate html to show results
const showMovies = (title, img, year, id) => {
    // create items
    let movieItem = document.createElement('div');
    movieItem.classList = 'movies-item mx-auto  pb-4 rounded w-full bg-black cursor-pointer mb-6 sm:mb-0 sm:mx-0';
    // set attribute
    movieItem.setAttribute("data_id", id);
    // items inner html
    movieItem.innerHTML = `<a class="movie-thumbnail block relative h-auto overflow-hidden">
                            <img alt="movie" class="object-cover object-center w-full h-full block"
                                src="${img}">
                            </a>
                            <div class="movie-info mt-4">
                            <p class="text-white text-center font-medium text-lg title-font mb-1">Download ${title} (${year.slice(0, 7)}) {English
                                With Subtitles} Web-DL 480p [450MB] || 720p [950MB] || 1080p [1.9GB]</p>
                            </div>`;

    // append items
    moviesContainer.appendChild(movieItem);
}

// video dialog box html
const openBox = (key) => {

    // create box
    let section = document.createElement('section');
    section.classList = 'bg-gray-700 bg-opacity-75 fixed top-0 z-50 flex items-center justify-center w-screen h-screen shadow-2xl';
    section.innerHTML = `<div id="video-box" class=" w-full sm:w-4/5 md:w-8/12 lg:w-6/12 xl:w-4/12">
                            <div>
                                <span class="float-right text-gray-100">
                                <svg id="cros-btn" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                                </span>
                                <iframe class="video-iframe w-full h-60	md:h-72 lg:h-72 " src="https://www.youtube.com/embed/${key}?rel=0&wmode=transparent&autoplay=true&iv_load_policy=3" allowfullscreen frameborder="0" allow="autoplay; fullscreen"></iframe>
                            </div>
                            </div>`;

    mainSection.insertBefore(section, mainSection.childNodes[0]);
}

// process video form movie id
const videoBox = (data) => {
    // if have trailer
    let object = data.results.find(item => item.name.indexOf('Official') != -1);

    if (object) {
        let { key } = object;
        // open video box
        openBox(key);

        // close player
        const closeBtn = document.getElementById('cros-btn');
        closeBtn.addEventListener('click', (e) => {
            const section = document.getElementById('video-box');
            section.parentElement.remove();
        })
    }
}
// get video from click movie
const getVideo = (id) => {
    let url = `HTTPS://api.themoviedb.org/3/movie/${id}/videos?${apiKey}&language=en-US`;
    // call api
    fetch(url)
        .then(res => res.json())
        .then(data => videoBox(data));
}


// default call on page load
getMovies();

/**
 * Event listner
 */

// search event
formBtn.addEventListener('click', (e) => {

    e.preventDefault();
    let val = inputField.value;
    let query = val.toLowerCase();

    // clear curren data
    moviesContainer.textContent = '';

    // search data 
    getMovies('', query);
})


// generation event

generationUl.addEventListener('click', event => {
    if (event.target.tagName == 'LI') {
        let generationId = event.target.id;
        console.log(generationId)
        // clear prev data
        moviesContainer.textContent = '';
        // get movies by generation
        getMovies(generationId);
    }
})

// movie click event for get video
moviesContainer.addEventListener('click', (event) => {
    if (event.target.tagName == 'IMG' || event.target.tagName == 'P') {
        // get movie id
        let movieId = event.target.parentNode.parentNode.getAttribute('data_id');
        // get the video
        getVideo(movieId);
    }
})

