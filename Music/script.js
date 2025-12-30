const audio = document.getElementById('bg-audio');
const playBtn = document.getElementById('play-pause');
const progressLine = document.getElementById('progress-line');

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerText = 'Pause';
        } else {
            audio.pause();
            playBtn.innerText = 'Play';
        }
    });

    // Update the progress bar
    audio.addEventListener('timeupdate', () => {
        const duration = audio.duration;
        const currentTime = audio.currentTime;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressLine.style.width = `${progressPercent}%`;
        }
    });

    