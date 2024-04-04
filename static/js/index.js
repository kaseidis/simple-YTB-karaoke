// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

var empty_item = 'FOIjvHjK0Rw'

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var next_btn = document.getElementById('next_btn');
var wait = true

next_btn.addEventListener("click", () => {
    if (!wait)
        getNextVid(player);
})

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
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

window.onresize = function (event) {
    player.setSize(window.innerWidth * 0.99, window.innerHeight * 0.99)
};

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    getNextVid(event.target);
}


// 4. The API will call this function when the video player is ready.
function onPlayerError(event) {
    event.target.pauseVideo();
}

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

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        getNextVid(event.target);
    }
}