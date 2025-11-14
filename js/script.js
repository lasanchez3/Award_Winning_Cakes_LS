// Array of cake objects with their model paths, names, and descriptions
const cakes = [
    { 
        src: "models/blackforest.glb", 
        name: "Black Forest Cake", 
        description: "A classic German dessert featuring layers of chocolate sponge cake, cherries, and whipped cream, topped with chocolate shavings." 
    },
    { 
        src: "models/carousel.glb", 
        name: "Carousel Cake", 
        description: "An elegant multi-tiered cake with intricate decorative details, perfect for special celebrations." 
    },
    { 
        src: "models/chocolate.glb", 
        name: "Chocolate Cake", 
        description: "Rich chocolate sponge covered with dark chocolate ganache and delicate chocolate decorations." 
    },
    { 
        src: "models/flower-25.glb", 
        name: "Flower 25 Cake", 
        description: "A beautiful cake adorned with delicate sugar flowers arranged in an artistic pattern." 
    },
    { 
        src: "models/flower-cake.glb", 
        name: "Flower Cake", 
        description: "A stunning floral design cake with handcrafted edible flowers and elegant piping work." 
    },
    { 
        src: "models/strawberry.glb", 
        name: "Strawberry Cake", 
        description: "A delicate layered cake with fresh strawberry glaze and sugar flowers, light and refreshing." 
    }
];

// Track the current cake index
let currentCakeIndex = 0;

// Variables to store DOM elements
let mainModel;
let cakeTitle;
let cakeDescription;
let nextBtn;
let featuredTitle;
let thumbnails;

// Function to update the displayed cake
function updateCake(cakeIndex) {
    // Make sure the index is within bounds
    if (cakeIndex < 0) {
        cakeIndex = cakes.length - 1;
    } else if (cakeIndex >= cakes.length) {
        cakeIndex = 0;
    }
    
    // Update the current index
    currentCakeIndex = cakeIndex;
    
    // Get the cake object
    const cake = cakes[cakeIndex];
    
    // Update the 3D model source using setAttribute for model-viewer
    if (mainModel) {
        mainModel.setAttribute('src', cake.src);
    }
    
    // Update the title
    if (cakeTitle) {
        cakeTitle.textContent = cake.name;
    }
    
    // Update the description
    if (cakeDescription) {
        cakeDescription.textContent = cake.description;
    }
    
    // Update the featured title below the model
    if (featuredTitle) {
        featuredTitle.textContent = cake.name;
    }
}

// Function to move to the next cake
function nextCake() {
    const nextIndex = currentCakeIndex + 1;
    updateCake(nextIndex);
}

// Wait for DOM to be fully loaded before setting up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    mainModel = document.getElementById('featured-viewer');
    cakeTitle = document.getElementById('cakeTitle');
    cakeDescription = document.getElementById('cakeDescription');
    nextBtn = document.getElementById('nextCakeBtn');
    featuredTitle = document.getElementById('featured-title');
    thumbnails = document.querySelectorAll('.thumbnail');
    
    // Check if elements exist
    if (!mainModel || !cakeTitle || !cakeDescription || !nextBtn) {
        console.error('Some required elements are missing from the page');
        return;
    }
    
    // Add click event listener to the "Next Cake" button
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextCake();
    });
    
    // Add click event listeners to each thumbnail
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', function() {
            // Get the model path from the data attribute
            const modelPath = thumbnail.getAttribute('data-model');
            
            // Find the cake object that matches this model path
            const cakeIndex = cakes.findIndex(cake => cake.src === modelPath);
            
            // If we found a matching cake, update to it
            if (cakeIndex !== -1) {
                updateCake(cakeIndex);
                
                // Add active class to the clicked thumbnail
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
            }
        });
    });
    
    // Set the first thumbnail as active on page load
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
    }
});

