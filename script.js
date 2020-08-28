const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

// SHow Content
function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
  loader.classList.add('hidden');
}

// Create DOM Nodes
function createDOMNodes(page) {
  const currentArray =
    page === 'results' ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');

    // Link that wraps the image
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';

    // Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;

    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add To Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }

    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;

    // Footer Conatiner
    const footer = document.createElement('small');
    footer.classList.add('text-muted');

    // Date
    const date = document.createElement('strong');
    date.textContent = result.date;

    // Copyright
    const copyrightResult =
      result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;

    // Append everything together
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);

    // Append to image container
    imagesContainer.appendChild(card);
  });
}

// Update the DOM
function updateDOM(page) {
  // Get favorites from local storage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
  // Show Loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM('results');
  } catch (error) {
    // Catch Error Here
  }
}

// Add result to favorites
function saveFavorite(itemUrl) {
  // Loop through the results array to seelct favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show save confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favorites in Local Storage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  });
}

// Remove item from favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

// On Load
getNasaPictures();
