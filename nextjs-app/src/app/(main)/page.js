"use client";
// Home page
import Link from "next/link";
import { useRef, useEffect } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const scrollCount = useRef(0);
  const lastDirection = useRef(0);
  const isSnapping = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Helper functions for handling the scrolling
    function smoothScroll(target, ms) {
      const start = el.scrollTop;
      const distance = target - start;
      const duration = ms || 300;
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = progress * (2 - progress); // ease-out
        el.scrollTop = start + distance * ease;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // Make scrolling on home page more seamless
    function handleWheel(e) {
  if (!e || e.deltaY === 0) return;
  e.preventDefault();
  if (isSnapping.current) return;

  const direction = e.deltaY > 0 ? 1 : -1;
  const viewportH = el.clientHeight;
  const scrollPerTick = viewportH * 0.08;

  if (direction !== lastDirection.current) {
    scrollCount.current = 0;
    lastDirection.current = direction;
  }

  scrollCount.current++;

  if (scrollCount.current < 3) {
    // Pass a target — don't mutate scrollTop directly
    smoothScroll(el.scrollTop + direction * scrollPerTick);
  } else {
    isSnapping.current = true;
    scrollCount.current = 0;
    const currentSection = Math.round(el.scrollTop / viewportH);
    const targetSection = Math.max(0, currentSection + direction);
    smoothScroll(targetSection * viewportH, 600);
    setTimeout(() => { isSnapping.current = false; }, 700);
  }
}

    el.addEventListener('wheel', handleWheel, { passive: false });
    document.title = "Home - Trip Planner";
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div ref={containerRef} style={{ height: '100vh', overflowY: 'hidden' }}>
      <div className="h-screen flex flex-col items-end justify-start"
        style={{
          scrollSnapAlign: 'start',
          paddingTop: '6.5vw',
          backgroundImage: "url('/website_background3.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <h1 className="font-bold text-black" style={{ fontSize: '3.53vw', marginBottom: '1.25vw' }}>
          <div style={{ position: 'relative', right: '6.7vw', marginTop: '2.2vw' }}>מסלול</div>
          <div style={{ position: 'relative', right: '24vw', marginTop: '-2.5vw' }}>טיולים</div>
          <div style={{ position: 'relative', right: '35vw', marginTop: '-1vw' }}>אפקה</div>
          <div style={{ position: 'relative', right: '43vw', marginTop: '1.3vw', color: 'white', fontSize: '6vw' }}>2026</div>
        </h1>
      </div>

      {/* Second section — add your content here */}
      <div className="h-screen flex flex-col items-center justify-center"
        style={{
          scrollSnapAlign: 'start',
          backgroundColor: '#000000',
        }}>
        <p className="text-white" style={{ fontSize: '1.5vw' }}>Your second section content here</p>
      </div>
    </div>
  );
}