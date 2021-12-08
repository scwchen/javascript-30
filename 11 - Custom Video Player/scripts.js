// Get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const toggle = player.querySelector('.toggle');
const ranges = player.querySelectorAll('[type=range]');
const skipButtons = player.querySelectorAll('[data-skip]');

let mouseDown = false;
// Building out functions
const togglePlay = () => {
    // Alternatively if you want to call the method dynamically you can use a ternary
    // const method = video.paused ? 'play' : 'pause';
    // video[method]();
    // Clever but can be seen as more complicated in some aspects.

    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
};

const updateButton = (e) => {
    toggle.innerHTML = e.target.paused ? '►' : '❚ ❚';
};

const skip = (e) => {
    let newTime = video.currentTime + parseInt(e.target.dataset.skip);
    video.currentTime = newTime;
    // I guess the currentTime property handles cases to avoid going past 0s and the duration of the video when skipping 
    handleProgress();
};

const controlUpdate = (e) => {
    video[e.target.name] = e.target.value;
};

const handleProgress = () => {
    const filled = player.querySelector('.progress__filled');
    const percent = (video.currentTime / video.duration) * 100;
    filled.style.flexBasis = `${percent}%`;
};

const scrub = (e) => {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    handleProgress();
}

// Hook up event listeners
toggle.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

skipButtons.forEach(skipButton => {
    skipButton.addEventListener('click', skip);
});

ranges.forEach(range => {
    range.addEventListener('change', controlUpdate);
});

video.addEventListener('timeupdate', handleProgress);
// Could also do the 'progress' event but it doesn't update in this case as frequently

// The use of the && is slick and I have seen it before but still need to get more used to it
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mouseDown && scrub(e));
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);
