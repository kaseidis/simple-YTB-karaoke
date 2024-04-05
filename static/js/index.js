// Song to play with empty list
var empty_item = 'FOIjvHjK0Rw'

// Setup YTB Player
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Share Varibles
var next_btn = document.getElementById('next_btn');
var wait = true
var player;

// Add Event Listeners
next_btn.addEventListener("click", onNextClick)
window.addEventListener("resize",onResize)
document.addEventListener('keydown', onKeydown);

// Load YTB player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: window.innerHeight * 0.99,
        width: window.innerWidth * 0.99,
        playerVars: { 'autoplay': 1 },
        videoId: empty_item,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

// Load next video from API
function getNextVid(target) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("./api/item", requestOptions)
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        if ("vid" in result) {
            target.loadVideoById(result.vid);
            wait = false;
        } else
            throw new Error(JSON.stringify(result))
    })
    .catch((error) => {
        // console.error(error);
        wait = true
        if (target.getVideoData().video_id != empty_item) {
            target.loadVideoById(empty_item);
            target.seekTo(0);
            target.playVideo();
        }
        setTimeout(() => getNextVid(target), 1000);
    });
}

// Event Listeners

//Keep video full screen
function onResize() {
    player.setSize(window.innerWidth * 0.99, window.innerHeight * 0.99)
}

// Play next video when press enter
function onKeydown(event) {
    if(event.keyCode == 13) {
        onNextClick();
    }
}

// Play next video when click next
function onNextClick() {
    if (!wait)
        getNextVid(player);
}

// Trying load next video when player ready
function onPlayerReady(event) {
    getNextVid(event.target);
}

// Trying pause video when player got error
function onPlayerError(event) {
    event.target.pauseVideo();
}

// Trying play next video when current end
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        getNextVid(event.target);
    }
}