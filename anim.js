const animContainer = document.querySelector('.animContainer');
const video = animContainer.querySelector('video');
const title = animContainer.querySelector('img');
const game = animContainer.querySelector('.gameContainer');

//SCROLL MAGIC 
const controller = new ScrollMagic.Controller();

let scene = new ScrollMagic.Scene({
    duration: 5500,
    triggerElement: animContainer,
    triggerHook: 0,
})
    .setPin(animContainer)
    .addTo(controller);

//TITLE ANIMATION
const titleAnim = TweenMax.fromTo(title, 3, {opacity:1},{opacity:0});

let titleScene = new ScrollMagic.Scene({
    duration: 800,
    triggerElement: animContainer,
    triggerHook: 0,
})
    .setTween(titleAnim)
    .addTo(controller);

const textAnimFirstIn = TweenMax.from('.text', 3, { y: '50vh', opacity: 0, ease: 'power3.out'});

let textSceneFirstIn = new ScrollMagic.Scene({
    duration: 800,
    offset: 800,
    triggerElement: animContainer,
    triggerHook: 0,
})
    .setTween(textAnimFirstIn)
    .addTo(controller);

const textAnimFirstOut = TweenMax.to('.text', 3, { opacity: 0 });

let textSceneFirstOut = new ScrollMagic.Scene({
    duration: 800,
    offset: 3000,
    triggerElement: animContainer,
    triggerHook: 0,
})
    .setTween(textAnimFirstOut)
    .addTo(controller);

const gameAnimIn = TweenMax.to(game, 3, { opacity: 1, display: 'block' });

let gameSceneIn = new ScrollMagic.Scene({
    duration: 0,
    offset: 5500,
    triggerElement: animContainer,
    triggerHook: 0,
})
    .setTween(gameAnimIn)
    .addTo(controller);


let accelAmount = 0.1;
let scrollpos = 0;
let delay = 0;

scene.on('update', e => {
    scrollpos = e.scrollPos / 1000;
})

setInterval(() => {
    delay += (scrollpos - delay) * accelAmount;
    console.log(scrollpos, delay);

    video.currentTime = delay;
}, 33.3);