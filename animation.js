// GSAP and scrollTrigger 

window.onload = function () {

    //HERO

    gsap.to(".hero-image", {
        scrollTrigger: {
            trigger: ".hero",
            start: "bottom bottom",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
            scrub: true,
            pin: true,
        },
        opacity: 1,
        duration: 1,
        delay: 0,
    });

    gsap.from(".hero-text", {
        scrollTrigger: {
            trigger: ".hero",
            start: "99.9% bottom",
            end: "120% top",
            toggleActions: "play reverse play reverse",
            scrub: true,
        },
        opacity: 0,
        duration: 1,
        delay: 0,
    });

    // HERO VIDEO

    const heroVideo = document.querySelector(".hero-video video");

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom+=200% bottom",
            scrub: true,
            pin:true,
        },
    });

    heroVideo.onloadedmetadata = function () {
        tl.to(heroVideo, { currentTime: heroVideo.duration });
    };


    // NAV

    gsap.from(".nav-about", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top 95%",
            endTrigger: '.project-list',
            end: 'top top',
            toggleActions: "play reverse play reverse",
        },
        opacity: 0.5,
        duration: 0.2,
        delay: 0,
    });

    gsap.from(".nav-work", {
        scrollTrigger: {
            trigger: ".project-list",
            start: "top center",
            end: "bottom center",
            toggleActions: "play reverse play reverse",
        },
        opacity: 0.5,
        duration: 0.2,
        delay: 0,
    });

    gsap.from(".nav-contact", {
        scrollTrigger: {
            trigger: ".contact",
            start: "top center",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
        },
        opacity: 0.5,
        duration: 0.2,
        delay: 0,
    });

    //SKEW

    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".skewElem", "skewY", "deg"), // fast
        clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees.

    ScrollTrigger.create({
        onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -600);
            // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, {
                    skew: 0,
                    duration: 0.8,
                    ease: "power3",
                    overwrite: true,
                    onUpdate: () => skewSetter(proxy.skew),
                });
            }
        },
    });

    // make the right edge "stick" to the scroll bar. force3D: true improves performance
    gsap.set(".skewElem", { transformOrigin: "right center", force3D: true });
};
