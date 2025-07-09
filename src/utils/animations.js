import { useInView } from 'react-intersection-observer';
import { useSpring } from '@react-spring/web';

// Fade in animation for elements
export const useFadeIn = (delay = 0) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: inView ? { opacity: 1, transform: 'translateY(0)' } : { opacity: 0, transform: 'translateY(50px)' },
    delay,
    config: { tension: 280, friction: 20 },
  });

  return [ref, props];
};

// Scale animation for cards and images
export const useScaleIn = (delay = 0) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const props = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: inView ? { opacity: 1, transform: 'scale(1)' } : { opacity: 0, transform: 'scale(0.8)' },
    delay,
    config: { tension: 280, friction: 20 },
  });

  return [ref, props];
};

// Slide in animation for side elements
export const useSlideIn = (direction = 'left', delay = 0) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const props = useSpring({
    from: {
      opacity: 0,
      transform: direction === 'left' ? 'translateX(-100px)' : 'translateX(100px)',
    },
    to: inView
      ? { opacity: 1, transform: 'translateX(0)' }
      : {
          opacity: 0,
          transform: direction === 'left' ? 'translateX(-100px)' : 'translateX(100px)',
        },
    delay,
    config: { tension: 280, friction: 20 },
  });

  return [ref, props];
};

// Bounce animation for interactive elements
export const useBounce = (delay = 0) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const props = useSpring({
    from: { transform: 'scale(0)' },
    to: inView ? { transform: 'scale(1)' } : { transform: 'scale(0)' },
    delay,
    config: { tension: 200, friction: 12, mass: 1 },
  });

  return [ref, props];
};