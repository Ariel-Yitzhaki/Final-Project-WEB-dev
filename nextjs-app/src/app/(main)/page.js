"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlanningForm from "./planning/components/PlanningForm";

export default function Home() {
  // Scroll snapping state:
  // scrollCount tracks consecutive wheel ticks in the same direction
  // lastDirection stores previous scroll direction (1 = down, -1 = up)
  // isSnapping prevents input during snap animation
  // activeSection controls which section's arrow indicator is visible
  const containerRef = useRef(null);
  const scrollCount = useRef(0);
  const lastDirection = useRef(0);
  const isSnapping = useRef(false);
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const router = useRouter();

  // Form state for the quick planning form
  const [location, setLocation] = useState("");
  const [tripType, setTripType] = useState("trek");
  const [days, setDays] = useState(1);

  // Redirect to planning page with form values as URL params
  function handleHomeSubmit(e) {
    e.preventDefault();
    router.push(`/planning?location=${encodeURIComponent(location)}&tripType=${tripType}&days=${days}`);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Animate scroll to a target position with ease-out easing
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

    // Custom scroll handler: small scrolls nudge the page, 3+ consecutive
    // ticks in the same direction trigger a full snap to the next section
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
        smoothScroll(el.scrollTop + direction * scrollPerTick);
      } else {
        isSnapping.current = true;
        scrollCount.current = 0;
        const currentSection = Math.round(el.scrollTop / viewportH);
        const targetSection = Math.min(1, Math.max(0, currentSection + direction));
        setActiveSection(targetSection);
        activeSectionRef.current = targetSection;
        smoothScroll(targetSection * viewportH, 600);
        setTimeout(() => { isSnapping.current = false; }, 700);
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    document.title = "Home - Trip Planner";
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Makes sure window resizing doesn't leak top section image when on bottom section
  useEffect(() => {
    function handleResize() {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTop = activeSectionRef.current * el.clientHeight;
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} style={{ height: '100vh', overflowY: 'hidden' }}>
      {/* Hero section - background image with Hebrew title */}
      <div className="h-screen flex flex-col items-end justify-start"
        style={{
          position: 'relative',
          scrollSnapAlign: 'start',
          paddingTop: '6.5%',
          backgroundImage: "url('/website_background (2).png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        {/* Scroll-down arrow indicator - fades out when leaving section 0 */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          opacity: activeSection === 0 ? 1 : 0,
          transitionProperty: 'opacity',
          transitionDuration: '2s',
          transitionDelay: activeSection === 0 ? '0.5s' : '0s',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <p className="text-white font-semibold" style={{ fontSize: '1.1rem', marginBottom: '0.9rem' }}>Start Planning!</p>
          <div style={{ animation: 'float 2s ease-in-out infinite' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 1 }}>
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Form section - quick planning form that redirects to /planning */}
      <div className="h-screen flex flex-col items-center justify-center"
        style={{
          position: 'relative',
          scrollSnapAlign: 'start',
          backgroundImage: "url('/homePageBackground.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>

        {/* Scroll-up arrow indicator - fades in when on section 1 */}
        <div style={{
          opacity: activeSection === 1 ? 1 : 0,
          transitionProperty: 'opacity',
          transitionDuration: '2s',
          transitionDelay: activeSection === 1 ? '0.5s' : '0s',
          display: 'flex',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}>
          <div style={{ animation: 'float 2s ease-in-out infinite' }}>
            <svg width="3vw" height="3vw" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ opacity: 1, transform: 'rotate(180deg)', minWidth: '24px', minHeight: '24px', maxWidth: '48px', maxHeight: '48px' }}>
              <path d="M12 5v14" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </div>
          <p className="text-white font-semibold" style={{ letterSpacing: '0.075rem', fontSize: '1.1rem', marginTop: '0.9rem' }}>Return</p>
        </div>

        <p className="text-white font-bold" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 2.25rem', marginBottom: '1rem' }}>Fill Out The Form To Start</p>
        <div style={{ width: 'clamp(16rem, 50vw, 28rem)', borderRadius: '1rem', overflow: 'hidden' }}>
          <PlanningForm
            location={location}
            setLocation={setLocation}
            tripType={tripType}
            setTripType={setTripType}
            days={days}
            setDays={setDays}
            loading={false}
            onSubmit={handleHomeSubmit}
          />
        </div>
      </div>
    </div>
  );
}
