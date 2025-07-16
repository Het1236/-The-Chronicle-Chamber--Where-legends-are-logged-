import { useInView } from 'react-intersection-observer';
import { useSpring } from '@react-spring/web';
import { useState, useEffect, useRef } from 'react';

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

/**
 * Hook to create a pulse animation
 * @param {number} duration - Duration of animation in milliseconds
 * @param {number} scale - Maximum scale value during pulse
 * @returns {Object} - Animation properties
 */
export const usePulse = (duration = 1500, scale = 1.05) => {
  return useSpring({
    from: { transform: 'scale(1)' },
    to: [{ transform: `scale(${scale})` }, { transform: 'scale(1)' }],
    config: { duration: duration / 2 },
    loop: true,
  });
};

/**
 * Hook to create a floating animation
 * @param {number} duration - Duration of animation in milliseconds
 * @param {number} y - Distance to float in pixels
 * @returns {Object} - Animation properties
 */
export const useFloat = (duration = 2000, y = 10) => {
  return useSpring({
    from: { transform: 'translateY(0px)' },
    to: [{ transform: `translateY(-${y}px)` }, { transform: 'translateY(0px)' }],
    config: { duration: duration / 2 },
    loop: true,
  });
};

/**
 * Hook to create a typing animation for text
 * @param {string} text - Text to animate
 * @param {number} delay - Delay in milliseconds before animation starts
 * @param {number} speed - Speed of typing (characters per second)
 * @returns {Object} - { typedText, isComplete }
 */
export const useTypingEffect = (text, delay = 0, speed = 50) => {
  const [typedText, setTypedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const index = useRef(0);

  useEffect(() => {
    let timeout;

    // Reset when text changes
    index.current = 0;
    setTypedText('');
    setIsComplete(false);

    const startTyping = () => {
      if (index.current < text.length) {
        const timeout = setTimeout(() => {
          setTypedText(prev => prev + text.charAt(index.current));
          index.current += 1;
          startTyping();
        }, 1000 / speed);
        return timeout;
      } else {
        setIsComplete(true);
        return null;
      }
    };

    timeout = setTimeout(startTyping, delay);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [text, delay, speed]);

  return { typedText, isComplete };
};