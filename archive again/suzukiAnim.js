var suntween = gsap.to("#sun", {
    duration: 4,
    x: 750,
    rotation: 360,
    ease: "none",
    paused: true,
});

sun.onclick = () => suntween.resume();
