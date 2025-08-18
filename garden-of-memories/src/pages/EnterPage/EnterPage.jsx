// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";

// /**
//  * GardenEntrance
//  * - Fullscreen intro that plays once on first load.
//  * - Two doors slide open from the center.
//  * - Garden image subtly "moves back" (scale 1.2 -> 1.0) & de-blurs to feel like you step into the garden.
//  * - Optionally shows a title/logo while the doors open.
//  *
//  * Props:
//  *  - imageUrl: string (required) – background garden image URL
//  *  - title?: string – center title text while doors open
//  *  - onComplete?: () => void – called when animation completes
//  *  - duration?: number – total seconds for the door + background sequence (default 2.2)
//  *  - skipButton?: boolean – show a Skip button (default true)
//  */
// export default function GardenEntrance({
//   imageUrl,
//   title = "기억의 정원",
//   onComplete,
//   duration = 2.2,
//   skipButton = true,
// }) {
//   const rootRef = useRef(null);
//   const leftDoorRef = useRef(null);
//   const rightDoorRef = useRef(null);
//   const bgRef = useRef(null);
//   const veilRef = useRef(null);
//   const titleRef = useRef(null);

//   const [done, setDone] = useState(false);

//   useEffect(() => {
//     // Respect reduced motion
//     const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     if (prefersReduced) {
//       // Instantly finish with no animation
//       setDone(true);
//       onComplete?.();
//       return;
//     }

//     const tl = gsap.timeline({
//       defaults: { ease: "power3.inOut" },
//       onComplete: () => {
//         setDone(true);
//         onComplete?.();
//       },
//     });

//     // Initial state
//     gsap.set([leftDoorRef.current, rightDoorRef.current], { x: 0 });
//     gsap.set(bgRef.current, { scale: 1.2, filter: "blur(10px) brightness(0.9)", transformOrigin: "50% 50%" });
//     gsap.set(veilRef.current, { opacity: 0.2 });
//     gsap.set(titleRef.current, { y: 20, opacity: 0 });

//     // Timeline:
//     // 1) Fade in title quickly
//     tl.to(titleRef.current, { y: 0, opacity: 1, duration: 0.6 }, 0.1);

//     // 2) Doors slide open outward
//     const doorPhase = Math.max(0.8, duration * 0.45);
//     tl.to(leftDoorRef.current, { x: "-100%", duration: doorPhase }, 0.2)
//       .to(rightDoorRef.current, { x: "100%", duration: doorPhase }, 0.2);

//     // 3) Background “moves back” (scale down), de-blur; subtle parallax upward
//     const bgPhase = Math.max(0.9, duration * 0.45);
//     tl.to(bgRef.current, { scale: 1.0, y: -12, filter: "blur(0px) brightness(1.02)", duration: bgPhase }, 
//       0.2 + doorPhase - 0.2
//     );

//     // 4) Title gently fade out
//     tl.to(titleRef.current, { y: -10, opacity: 0, duration: 0.45 }, "<");

//     // 5) Veil fade away & allow clicks to pass through
//     tl.to(veilRef.current, { opacity: 0, duration: 0.4 }, "<");

//     return () => tl.kill();
//   }, [duration, onComplete]);

//   const handleSkip = () => {
//     gsap.globalTimeline.clear();
//     setDone(true);
//     onComplete?.();
//   };

//   return (
//     <div ref={rootRef} className="fixed inset-0 z-[9999]">
//       {/* Background garden */}
//       <div
//         ref={bgRef}
//         className="absolute inset-0"
//         style={{
//           backgroundImage: `url(${imageUrl})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           willChange: "transform, filter",
//         }}
//         aria-hidden
//       />

//       {/* Pastel sky fallback gradient behind (subtle) */}
//       <div className="absolute inset-0 bg-gradient-to-b from-[#CFE9FF] via-[#EAF6FF] to-[#F8F6F4] opacity-70 pointer-events-none" />

//       {/* Doors */}
//       <div className="absolute inset-0 grid grid-cols-2">
//         <div ref={leftDoorRef} className="relative overflow-hidden bg-[rgba(255,255,255,0.85)] backdrop-blur-[2px] border-r border-white/50">
//           <DoorPattern side="left" />
//         </div>
//         <div ref={rightDoorRef} className="relative overflow-hidden bg-[rgba(255,255,255,0.85)] backdrop-blur-[2px] border-l border-white/50">
//           <DoorPattern side="right" />
//         </div>
//       </div>

//       {/* Center title / logo */}
//       <div ref={titleRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
//         <div className="px-6 py-3 rounded-2xl shadow-md bg-white/70 backdrop-blur text-gray-900 tracking-wide text-2xl md:text-3xl font-semibold">
//           {title}
//         </div>
//       </div>

//       {/* Veil (prevents clicks until finished) */}
//       <div ref={veilRef} className={`absolute inset-0 bg-white pointer-events-auto ${done ? "pointer-events-none" : ""}`} style={{ opacity: 0 }} />

//       {/* Skip button */}
//       {skipButton && !done && (
//         <button
//           onClick={handleSkip}
//           className="absolute top-5 right-5 rounded-2xl shadow px-4 py-2 bg-white/80 hover:bg-white/95 transition pointer-events-auto text-sm"
//           aria-label="Skip intro"
//         >
//           Skip
//         </button>
//       )}
//     </div>
//   );
// }

// function DoorPattern({ side = "left" }) {
//   // Simple decorative slats & handle
//   return (
//     <div className="absolute inset-0">
//       <div className="absolute inset-0 opacity-60" style={{
//         backgroundImage:
//           "repeating-linear-gradient( to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 12px, rgba(240,240,240,0.6) 12px, rgba(240,240,240,0.6) 28px )",
//       }} />
//       {/* Door handle */}
//       <div className={`absolute top-1/2 ${side === "left" ? "right-6" : "left-6"} -translate-y-1/2 w-2 h-14 rounded-full bg-gray-400/80 shadow-inner`} />
//       {/* Edge shading for more depth */}
//       {side === "left" ? (
//         <div className="absolute right-0 top-0 w-10 h-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
//       ) : (
//         <div className="absolute left-0 top-0 w-10 h-full bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
//       )}
//     </div>
//   );
// }

// /**
//  * Usage example:
//  *
//  * <GardenEntrance
//  *   imageUrl="/assets/garden.jpg"
//  *   title="기억의 정원"
//  *   onComplete={() => setShowIntro(false)}
//  * />
//  *
//  * Place it at the root of your app (e.g., inside App.jsx) so it overlays the initial page.
//  */
