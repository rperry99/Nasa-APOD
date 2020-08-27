const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirm = document.querySelector('.save-confirm');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];

// Update the DOM
function updateDOM() {
  resultsArray.forEach((item) => {
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');

    // Link that wraps the image
    const link = document.createElement('a');
    link.href = item.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';

    // Image
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = item.title;

    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add = 'clickable';
    saveText.textContent = 'Add To Favorites';

    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = item.explanation;

    // Footer Conatiner
    const footer = document.createElement('small');
    footer.classList.add('text-muted');

    // Date
    const date = document.createElement('strong');
    date.textContent = item.date;

    // Copyright
    const copyrightResult = item.copyright === undefined ? '' : item.copyright;
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

// Get 10 images from NASA API
async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM();
  } catch (error) {
    // Catch Error Here
  }
}

// On Load
getNasaPictures();
