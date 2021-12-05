// const vw = Math.max(
//     document.documentElement.clientWidth || 0,
//     window.innerWidth || 0
// );
// const vh = Math.max(
//     document.documentElement.clientHeight || 0,
//     window.innerHeight || 0
// );
let tl = gsap.timeline({

});

classList = document.querySelectorAll('.image-container')

classList.forEach(element => {
    let parentDiv = element
    // let imageChild = element.querySelectorAll('img')
    let imageChild = gsap.utils.toArray(".child"); 
    for (let i = 0; i < imageChild.length; i++) {
       tl.to(imageChild[i], {
           x: function () {
               if (i % 4 == 0) {
                   //x
                   return "+=100vw";
               } else if (i % 4 == 1) {
                   //y
                   return "-100vw";
               } else if (i % 4 == 2) {
                   //negative x
                   return "-=100vw";
               } else if (i % 4 == 3) {
                   //negative y
                   return "+=100vw";
               }
           },

           y: function () {
               if (i % 4 == 0) {
                   return "0vw";
               } else if (i % 4 == 1) {
                   return "-=100vh";
               } else if (i % 4 == 2) {
                   return "0vw";
               } else if (i % 4 == 3) {
                   return "+=100vh";
               }
           },
           scrollTrigger: {
               markers: true,
               start: "start start",
               trigger: imageChild[i],
               scrub: 0.3,
               anticipatePin: 1,
               pin: true,
               pinSpacing: false,
               //    onLeave: hideImageChild(element)
           },
       });

    }
    

});

// function hideImageChild(selector){
//     tl.set(selector, { opacity: 0 });
// }

// classList.forEach((element) => {
//     let imageChild = element.querySelectorAll("img");

//     tl.to(imageChild, {
//         x: "+=150vw",
//         scrollTrigger: {
//             markers: true,
//             end: "+=1500",
//             trigger: element,
//             scrub: true,
//             pin: true,
//             pinSpacing: false,
//         },
//     });
// });




