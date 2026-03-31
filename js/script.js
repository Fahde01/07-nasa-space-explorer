// Find our date picker inputs and button on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getButton = document.querySelector('button');
const gallery = document.getElementById('gallery');
const spaceFactText = document.getElementById('spaceFactText');

// Get references to the modal elements
const modal = document.getElementById('imageModal');
const closeButton = document.querySelector('.close-button');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// NASA APOD API key and endpoint
const apiKey = '5Syhv2htOjMx7lKcaa1Jg6jH725eE65eJniajvns';
const apiUrl = 'https://api.nasa.gov/planetary/apod';

// A list of fun space facts to show on each page load
const spaceFacts = [
  'A day on Venus is longer than a year on Venus.',
  'Neutron stars can spin at a rate of 600 rotations per second.',
  'Jupiter has at least 95 moons confirmed by astronomers.',
  'One million Earths could fit inside the Sun.',
  'Saturn would float in water because it is mostly made of gas.',
  'The footprints left on the Moon can last for millions of years.',
  'The International Space Station travels around Earth about every 90 minutes.',
  'Mars has the tallest volcano in the solar system: Olympus Mons.'
];

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Show one random fact each time the page loads
showRandomSpaceFact();

// Handle the "Get Space Images" button click
getButton.addEventListener('click', fetchSpaceImages);

// Handle closing the modal when the X button is clicked
closeButton.addEventListener('click', closeModal);

// Handle closing the modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Function to fetch images from NASA's APOD API
async function fetchSpaceImages() {
  try {
    // Get the selected start and end dates from the inputs
    const startDate = startInput.value;
    const endDate = endInput.value;

    // Show a loading message to the user
    gallery.innerHTML = '<div class="placeholder"><p>Loading space images...</p></div>';

    // Build the API request URL with the date range and API key
    const requestUrl = `${apiUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    // Fetch the data from NASA's APOD API
    const response = await fetch(requestUrl);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch images from NASA API');
    }

    // Convert the response to JSON format
    const images = await response.json();

    // Display the images in the gallery
    displayImages(images);
  } catch (error) {
    // If something goes wrong, show an error message
    console.error('Error fetching space images:', error);
    gallery.innerHTML = '<div class="placeholder"><p>Oops! Could not load images. Please try again.</p></div>';
  }
}

// Function to display the fetched images in the gallery
function displayImages(images) {
  // Clear any previous content from the gallery
  gallery.innerHTML = '';

  // Loop through each image and create HTML elements to display it
  images.forEach((image) => {
    // Create a container div for each image
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';

    // Add the image, title, and date to the card
    imageCard.innerHTML = `
      <img src="${image.url}" alt="${image.title}" class="image" />
      <h3>${image.title}</h3>
      <p class="date">${image.date}</p>
    `;

    // Add a click event listener to open the modal
    imageCard.addEventListener('click', () => {
      openModal(image);
    });

    // Add the card to the gallery
    gallery.appendChild(imageCard);
  });
}

// Function to open the modal and populate it with image details
function openModal(image) {
  // Update modal content with the image data
  modalImage.src = image.url;
  modalImage.alt = image.title;
  modalTitle.textContent = image.title;
  modalDate.textContent = image.date;
  modalExplanation.textContent = image.explanation;

  // Display the modal
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Pick and display one random fact in the fact section
function showRandomSpaceFact() {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  spaceFactText.textContent = spaceFacts[randomIndex];
}
