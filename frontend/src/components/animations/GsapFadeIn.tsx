import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface Props {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
}

const GsapFadeIn: React.FC<Props> = ({
  children,
  delay = 0,
  yOffset = 20,
  duration = 0.6,
}) => {
  const elRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      elRef.current,
      { opacity: 0, y: yOffset },
      { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
    );
  }, [delay, yOffset, duration]);

  return <div ref={elRef}>{children}</div>;
};

export default GsapFadeIn;
