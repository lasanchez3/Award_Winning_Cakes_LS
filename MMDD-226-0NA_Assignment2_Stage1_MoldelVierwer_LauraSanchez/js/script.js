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

// Configuration for the scroll-driven PNG sequence
const sequenceConfig = {
    totalFrames: 40,
    folder: 'models/videocake',
    prefix: 'Cakefloor_',
    extension: '.png',
    canvasId: 'heroCanvas'
};

// State tracking for the PNG sequence
let heroCanvas;
let heroCtx;
let sequenceImages = [];
let currentSequenceFrame = 0;
let sequenceReady = false;

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

// Preload all PNG frames so scrolling feels instant
function preloadSequenceImages() {
    const loaders = [];

    for (let i = 0; i < sequenceConfig.totalFrames; i++) {
        const frameNumber = String(i).padStart(5, '0');
        const img = new Image();
        img.src = `${sequenceConfig.folder}/${sequenceConfig.prefix}${frameNumber}${sequenceConfig.extension}`;

        loaders.push(new Promise((resolve, reject) => {
            img.onload = () => {
                sequenceImages[i] = img;
                resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load frame ${frameNumber}`));
        }));
    }

    return Promise.all(loaders);
}

// Keep the canvas crisp and locked to a 9:16 ratio
function resizeSequenceCanvas() {
    if (!heroCanvas || !heroCtx) {
        return;
    }

    const wrapper = heroCanvas.parentElement;

    if (!wrapper) {
        return;
    }

    const deviceRatio = window.devicePixelRatio || 1;
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;

    heroCanvas.width = width * deviceRatio;
    heroCanvas.height = height * deviceRatio;
    heroCanvas.style.width = `${width}px`;
    heroCanvas.style.height = `${height}px`;

    heroCtx.setTransform(1, 0, 0, 1, 0, 0);
    heroCtx.scale(deviceRatio, deviceRatio);

    if (sequenceReady) {
        drawSequenceFrame(currentSequenceFrame);
    }
}

// Draw a specific frame onto the canvas, centered and scaled
function drawSequenceFrame(frameIndex) {
    if (!heroCtx || !sequenceImages[frameIndex]) {
        return;
    }

    const canvasWidth = heroCanvas.clientWidth;
    const canvasHeight = heroCanvas.clientHeight;
    const image = sequenceImages[frameIndex];
    const scale = Math.min(canvasWidth / image.width, canvasHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    heroCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    heroCtx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

// Convert overall scroll progress into a frame number
function handleScrollSequence() {
    if (!sequenceReady) {
        return;
    }

    const scrollableHeight = document.body.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    const nextFrame = Math.min(
        sequenceConfig.totalFrames - 1,
        Math.max(0, Math.round(progress * (sequenceConfig.totalFrames - 1)))
    );

    if (nextFrame !== currentSequenceFrame) {
        currentSequenceFrame = nextFrame;
        drawSequenceFrame(currentSequenceFrame);
    }
}

// Wire up the canvas logic once the DOM is ready
function setupScrollSequence() {
    heroCanvas = document.getElementById(sequenceConfig.canvasId);

    if (!heroCanvas) {
        return;
    }

    heroCtx = heroCanvas.getContext('2d');

    resizeSequenceCanvas();

    preloadSequenceImages()
        .then(() => {
            sequenceReady = true;
            drawSequenceFrame(0);
        })
        .catch((error) => {
            console.error('Unable to load the animation sequence', error);
        });

    window.addEventListener('scroll', handleScrollSequence, { passive: true });
    window.addEventListener('resize', resizeSequenceCanvas);
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

    // Activate the scroll-driven animation once everything else is set up
    setupScrollSequence();
});

