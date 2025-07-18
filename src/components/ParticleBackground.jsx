import React, { useEffect, useRef } from 'react';

export default function ParticleBackground({ config = {} }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Default configuration with fallbacks
  const {
    particleCount,
    color,
    shape = 'circle',
    minSize = 1,
    maxSize = 3,
    speed = 0.5,
    opacity = 0.7,
    connectParticles = true,
    connectDistance = 100,
    connectWidth = 0.5,
    mouseInteraction = true
  } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particlesRef.current = [];
      const numberOfParticles = particleCount || Math.floor(window.innerWidth * 0.1);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = minSize + Math.random() * (maxSize - minSize);
        const particleOpacity = opacity * (0.5 + Math.random() * 0.5);
        
        let particleColor;
        if (color) {
          // If color is provided, use it with the configured opacity
          if (color.startsWith('#')) {
            // Convert hex to rgba
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            particleColor = `rgba(${r}, ${g}, ${b}, ${particleOpacity})`;
          } else {
            // Assume it's already a valid color format
            particleColor = color;
          }
        } else {
          // Default color scheme
          particleColor = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.2})`;
        }
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          color: particleColor,
          shape: shape
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction (if enabled)
        if (mouseInteraction) {
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            particle.x -= Math.cos(angle) * 0.5;
            particle.y -= Math.sin(angle) * 0.5;
          }
        }

        // Boundary check
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle based on shape
        ctx.beginPath();
        if (particle.shape === 'circle' || !particle.shape) {
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        } else if (particle.shape === 'square') {
          ctx.rect(particle.x - particle.size, particle.y - particle.size, particle.size * 2, particle.size * 2);
        } else if (particle.shape === 'triangle') {
          ctx.moveTo(particle.x, particle.y - particle.size);
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
          ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
          ctx.closePath();
        }
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Connect nearby particles
        for (let j = index + 1; j < particlesRef.current.length; j++) {
          const particle2 = particlesRef.current[j];
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectDistance && connectParticles) {
            ctx.beginPath();
            // Extract color from particle for connection lines
            let connectionColor;
            if (color && color.startsWith('#')) {
              // Convert hex to rgba for connections
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              connectionColor = `rgba(${r}, ${g}, ${b}, ${0.2 * (1 - distance / connectDistance)})`;
            } else {
              connectionColor = `rgba(255, 255, 255, ${0.2 * (1 - distance / connectDistance)})`;
            }
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = connectWidth;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    // Initialize
    resizeCanvas();
    createParticles();
    drawParticles();

    // Event listeners
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, color, shape, minSize, maxSize, speed, opacity, particleCount, connectParticles, connectDistance, connectWidth, mouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}