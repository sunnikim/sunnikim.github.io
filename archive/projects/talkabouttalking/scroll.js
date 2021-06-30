function updateScroll(){
                    var element = document.getElementById("scroll");
                    element.scrollTop = element.scrollHeight;
                }
                setInterval(updateScroll,0);