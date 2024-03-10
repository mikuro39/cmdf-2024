const swipeData = {};

const cards = document.getElementsByClassName("card");

for (let card of cards) {
    var cardhammer = new Hammer(card);
    cardhammer.on("swipe", function(ev) {
        const xStart = ev.deltaX;
        const yStart = ev.deltaY;
        let xi = 0;
        let yi = 0;
        const opacityFramesOriginal = 200;
        let opacityFrames = 200;

        let framesReq;
        function swipeOut() {
            const str = `translateX(${xStart + xi}px) translateY(${yStart + yi}px)`;
            card.style.transform = str;
            card.style.opacity = Math.min(Math.max(1 / opacityFrames, 0), 1);

            if (xStart < 0) {
                xi--;
            } else {
                xi++;
            }

            if (yStart < 0) {
                yi--;
            } else {
                yi++;
            }

            opacityFrames--;

            framesReq = requestAnimationFrame(swipeOut);
            if (opacityFrames < opacityFramesOriginal - 10) {
                cancelAnimationFrame(framesReq);
                card.parentNode.removeChild(card);
            }
        }
        swipeOut();
        const swipeDirection = ev.offsetDirection === 2 ? "left" : "right"; // 2 indicates left, 4 indicates right
        swipeData[card.id] = swipeDirection; // Assuming each card has a unique ID
        saveSwipeDataToServer(swipeData); // Save swipe data to server
    });

    cardhammer.on("pan", function(ev) {
        const target = ev.target;
        if (!target.classList.contains('question-pic')) { // Check if the swipe gesture is not over an image
            const x = ev.deltaX;
            const y = ev.deltaY;
            const rotation = x / 10; // Adjust rotation amount as needed
            const str = `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`;
            card.style.transform = str;
        }
    });

    cardhammer.on("panend", function(ev) {
        card.style.transform = "";
    });
}
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const topCard = document.querySelector('.card');
        if (topCard) {
            const direction = key === 'ArrowLeft' ? 'left' : 'right';
            simulateSwipeOut(topCard, direction);
        }
    }
});

function simulateSwipeOut(card, direction) {
    const xStart = direction === 'left' ? -1000 : 1000;
    const yStart = 0;
    let xi = 0;
    let yi = 0;
    const opacityFramesOriginal = 200;
    let opacityFrames = 200;

    let framesReq;
    function swipeOut() {
        const str = `translateX(${xStart + xi}px) translateY(${yStart + yi}px)`;
        card.style.transform = str;
        card.style.opacity = Math.min(Math.max(1 / opacityFrames, 0), 1);

        if (xStart < 0) {
            xi--;
        } else {
            xi++;
        }

        if (yStart < 0) {
            yi--;
        } else {
            yi++;
        }

        opacityFrames--;

        framesReq = requestAnimationFrame(swipeOut);
        if (opacityFrames < opacityFramesOriginal - 10) {
            cancelAnimationFrame(framesReq);
            card.parentNode.removeChild(card);
        }
    }
    swipeOut();

    const swipeDirection = direction === 'left' ? 'left' : 'right';
    swipeData[card.id] = swipeDirection; // Assuming each card has a unique ID
    saveSwipeDataToServer(swipeData); // Save swipe data to server
}


function saveSwipeDataToServer(data) {
    // Code to send swipe data to server (e.g., via AJAX request)
    console.log("Swipe data:", data);
}
