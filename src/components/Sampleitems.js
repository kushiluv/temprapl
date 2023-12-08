import React, { useEffect, useRef } from 'react';
import Card from "../components/Card";
import data from "../data";

export default function Sampleitems() {
    const cards = data.map((item) => {
      return <Card key={item.id} {...item} />;
    });
  
    const scrollContainerRef = useRef(null);
  
    useEffect(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.scrollLeft = (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
      }
  
      let isDown = false;
      let startX;
      let scrollLeft;
  
      const onMouseDown = (e) => {
        isDown = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
      };
  
      const onMouseLeave = () => {
        isDown = false;
      };
  
      const onMouseUp = () => {
        isDown = false;
      };
  
      const onMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX);
        scrollContainer.scrollLeft = scrollLeft - walk;
      };
  
      scrollContainer.addEventListener("mousedown", onMouseDown);
      scrollContainer.addEventListener("mouseleave", onMouseLeave);
      scrollContainer.addEventListener("mouseup", onMouseUp);
      scrollContainer.addEventListener("mousemove", onMouseMove);
  
      return () => {
        scrollContainer.removeEventListener("mousedown", onMouseDown);
        scrollContainer.removeEventListener("mouseleave", onMouseLeave);
        scrollContainer.removeEventListener("mouseup", onMouseUp);
        scrollContainer.removeEventListener("mousemove", onMouseMove);
      };
  
    }, []);
  
    return (
      <section className="cards-list">
        <div className="left-section">
          <h2>
            {/* <span>Your Digital Farmer’s Market:</span>
            <span>Fresh, Local, and Convenient.</span> */}
          </h2>
          {/* <button className="market-button">Market</button> */}
        </div>
        <div className="cards-scrolling-container" ref={scrollContainerRef}>
          {cards}
        </div>
      </section>
    );
  }