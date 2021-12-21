const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(localMediaStream => {
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
        video.play();
    }).catch(err => {
        console.error('Something went wrong!');
    });
};

const paintToCanvas = () => {
    const { videoWidth: width, videoHeight: height } = video;
    canvas.width = width;
    canvas.height = height;
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // extract pixels
        // pixels will get us a massive array of numbers each set of 4 corresponds to the 0-255 values of rgba for a single pixel
        let pixels = ctx.getImageData(0, 0, width, height);

        // // place effect on pixels
        // pixels = redEffect(pixels);
        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.1;
        // pixels = greenScreen(pixels);

        // place pixels back into the context
        ctx.putImageData(pixels, 0, 0);

    }, 16);
};

const takePhoto = () => {
    snap.currentTime = 0;
    snap.play();

    // Take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="It's a me!" />`;
    strip.insertBefore(link, strip.firstChild);
};

const redEffect = (pixels) => {
    // += 4 so that we get the next set of values for each pixel
    for (let i = 0; i < pixels.data.length; i += 4) {

        pixels.data[i] += 100; // red
        pixels.data[i + 1] -= 50; // green
        pixels.data[i + 2] *= 0.5; // blue
        // pixels[i+3] // alpha which we don't really need to change
    }
    return pixels;
}

const rgbSplit = (pixels) => {
    // += 4 so that we get the next set of values for each pixel
    for (let i = 0; i < pixels.data.length; i += 4) {

        pixels.data[i - 150] = pixels.data[i] + 100; // red
        pixels.data[i + 100] = pixels.data[i + 1] - 50; // green
        pixels.data[i - 150] = pixels.data[i + 2] * 0.5; // blue
        // pixels[i+3] // alpha which we don't really need to change
    }
    return pixels;
};

const greenScreen = (pixels) => {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
};

getVideo();

video.addEventListener('canplay', paintToCanvas);
