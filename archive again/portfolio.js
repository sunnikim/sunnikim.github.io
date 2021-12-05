let videoContainer = document.querySelector('video-container');
let videoElement = document.querySelector('#video-element');
let videoSource = document.querySelector('#video-source');
let projects = document.querySelectorAll('.project a')


projects.forEach(project => {
    project.addEventListener('mouseover', () => {
        videoSource.setAttribute('src', newmp4);
        videoElement.load();
        videoElement.play();
    })
    project.addEventListener('mouseleave', () => {
        videoSource.setAttribute('src', null);
    })
})