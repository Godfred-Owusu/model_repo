// components/AuthLayout.tsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import bgPattern from "../assets/bg-pattern.svg";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cardRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    );

    gsap.to(bgRef.current, {
      backgroundPosition: "200% center",
      duration: 20,
      repeat: -1,
      ease: "linear",
    });

    return () => {
      tl.kill();
      return undefined;
    };
  }, []);

  return (
    <div
      ref={bgRef}
      className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-indigo-950 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgPattern.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/60 via-indigo-900/50 to-black/70 z-0" />
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
