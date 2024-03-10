'use client'
import React, { useEffect } from 'react';
import Hammer from 'hammerjs';

const SwipeableCards = () => {

  useEffect(() => {
    const swipeData = {};

    const cards = document.getElementsByClassName("card");

    for (let card of cards) {
      const cardhammer = new Hammer(card);
      cardhammer.on("swipe", function(ev) {
        let xStart = ev.deltaX;
        let yStart = ev.deltaY;
        let xi = 0;
        let yi = 0;
        let opacityFramesOriginal = 200;
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
        const x = ev.deltaX;
        const y = ev.deltaY;
        const rotation = x / 10; // Adjust rotation amount as needed
        const str = `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`;
        card.style.transform = str;
      });

      cardhammer.on("panend", function(ev) {
        card.style.transform = "";
      });
    }
  }, []);

  function saveSwipeDataToServer(data) {
    // Code to send swipe data to server (e.g., via AJAX request)
    console.log("Swipe data:", data);
  }

  return (
    <div className="container">
      <h4>Loading results</h4>
      <div className="card">
        <div className="title">Question 1</div>
        <img className="question-pic" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png" alt=""/>
        <div className="body">Are you familiar with this topic?</div>
        <div className="img-container">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1024px-Eo_circle_green_checkmark.svg.png" alt=""/>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png" alt=""/>
        </div>
      </div>
      {/* More card elements go here */}
    </div>
  );
};

export default SwipeableCards;
