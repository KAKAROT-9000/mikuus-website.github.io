document.addEventListener("DOMContentLoaded", function () {
    // Flickity Carousel Initialization
    let carousel = document.querySelector(".carousel");
    let flkty = new Flickity(carousel, {
        draggable: false,
        prevNextButtons: false,
        wrapAround: true,
        pageDots: false
    });

    document.querySelector(".prev").addEventListener("click", function () {
        flkty.previous();
    });

    document.querySelector(".next").addEventListener("click", function () {
        flkty.next();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") {
            flkty.previous();
        } else if (event.key === "ArrowRight") {
            flkty.next();
        }
    });

    // Overlay and Expanded View for Carousel Videos
    const carouselCells = document.querySelectorAll(".carousel-cell");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    carouselCells.forEach((cell) => {
        const video = cell.querySelector("video");

        cell.addEventListener("click", function () {
            cell.classList.add("expanded");
            overlay.classList.add("active");
            video.play(); // Automatically play the video when expanded
        });

        overlay.addEventListener("click", function () {
            cell.classList.remove("expanded");
            overlay.classList.remove("active");
            video.pause(); // Pause the video when collapsing
            video.currentTime = 0; // Reset the video to the start
        });
    });

    // Existing Code for Hearts Game
    const innerBox = document.querySelector('.inner-box');
    const scoreElement = document.getElementById('score');
    let score = 0;

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = `${Math.random() * 100}%`;
        heart.addEventListener('click', () => {
            heart.style.animation = 'none';
            heart.style.opacity = 0;
            score++;
            scoreElement.textContent = score;
        });
        innerBox.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    setInterval(createHeart, 200); // Increased rate of generating hearts

    // Modal functionality for memes
    const modal = document.getElementById("memeModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close");

    // Open modal when a meme is clicked
    document.querySelectorAll(".polaroid img").forEach((img) => {
        img.addEventListener("click", () => {
            modal.style.display = "block";
            modalImage.src = img.src;
            modalImage.alt = img.alt;
        });
    });

    // Close modal when the close button is clicked
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the image
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// YouTube Player Integration
let player;
let playlist = ["rHvQakk1zMA", "199pKN7-bSg", "JVtKEX90SZ0", "v8oqbWrP1QY", "JqIHlDVqUTw"];
let currentIndex = 0;

// Load YouTube API
function loadYouTubeAPI() {
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Initialize YouTube Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "180", 
        width: "310",
        videoId: playlist[currentIndex],
        playerVars: { autoplay: 0, controls: 0 },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    updateTrackHighlight();
}

// Handle state changes
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        nextTrack();
    }
}

// Play or pause video
function togglePlayPause() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

// Play next track
function nextTrack() {
    currentIndex = (currentIndex + 1) % playlist.length;
    player.loadVideoById(playlist[currentIndex]);
    updateTrackHighlight();
}

// Play previous track
function prevTrack() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    player.loadVideoById(playlist[currentIndex]);
    updateTrackHighlight();
}

// Highlight active track
function updateTrackHighlight() {
    let tracks = document.querySelectorAll(".track");
    tracks.forEach((track, index) => {
        track.classList.toggle("active", index === currentIndex);
    });
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".btn:nth-child(1)").addEventListener("click", prevTrack);
    document.querySelector(".btn:nth-child(2)").addEventListener("click", togglePlayPause);
    document.querySelector(".btn:nth-child(3)").addEventListener("click", nextTrack);

    // Play selected track from the tracklist
    function playSelectedTrack(index) {
        currentIndex = index; // Update the current index
        player.loadVideoById(playlist[currentIndex]);
        player.playVideo();
        updateTrackHighlight();
    }

    // Attach event listeners to tracklist items
    const trackElements = document.querySelectorAll(".track");
    trackElements.forEach((track, index) => {
        track.addEventListener("click", () => playSelectedTrack(index));
    });

    // Attach event listener to the "Play Music" button
    document.getElementById("playMusicButton").addEventListener("click", function () {
        currentIndex = 0; // Set to the first track
        player.loadVideoById(playlist[currentIndex]);
        player.playVideo();
        updateTrackHighlight();
    });

    loadYouTubeAPI();
});