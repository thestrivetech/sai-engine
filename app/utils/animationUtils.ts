// app/utils/animationUtils.ts

export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      duration: 0.5, 
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { 
      duration: 0.4,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
  
  glow: (color: string = '229, 95, 42') => ({
    animate: {
      boxShadow: [
        `0 0 0 0 rgba(${color}, 0.7)`,
        `0 0 0 10px rgba(${color}, 0)`,
        `0 0 0 0 rgba(${color}, 0.7)`
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  }),
  
  pulse: (scale: number[] = [1, 1.2, 1], opacity: number[] = [0.5, 1, 0.5]) => ({
    animate: { scale, opacity },
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
  }),
  
  rotate: (duration: number = 2) => ({
    animate: { rotate: [0, 360] },
    transition: { duration, repeat: Infinity, ease: "linear" }
  }),
  
  wiggle: {
    animate: { rotate: [0, -10, 10, -10, 10, 0] },
    transition: { duration: 0.5 }
  },
  
  bounce: {
    animate: { y: [0, -20, 0] },
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
      ease: ["easeOut", "easeIn"]
    }
  }
};

// Generate floating particles
export const generateFloatingParticles = (count: number = 6, advanced: boolean = false) => {
  if (advanced) {
    return [...Array(count)].map((_, i) => ({
      key: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
      },
      animate: {
        y: [0, Math.random() * -50 - 20, 0],
        x: [0, Math.random() * 40 - 20, 0],
        scale: [0, 1, 1, 0],
        opacity: [0, 0.3, 0.3, 0]
      },
      transition: {
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: "easeInOut"
      }
    }));
  }
  
  return [...Array(count)].map((_, i) => ({
    key: i,
    style: {
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 60}%`,
    },
    animate: {
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      scale: [0.8, 1.2, 0.8],
      opacity: [0.1, 0.3, 0.1]
    },
    transition: {
      duration: 4 + Math.random() * 4,
      repeat: Infinity,
      delay: Math.random() * 4,
      ease: "easeInOut"
    }
  }));
};

// Stagger animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Button animations
export const buttonAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 }
};

export const magneticButton = {
  whileHover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  whileTap: { scale: 0.95 }
};

// Spring transitions
export const smoothSpring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 20,
  mass: 0.8
};

export const elasticTransition = {
  type: "spring" as const,
  stiffness: 600,
  damping: 15,
  mass: 1
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, x: -200 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 200 },
  transition: smoothSpring
};

// Reveal on scroll
export const revealOnScroll = {
  initial: { opacity: 0, y: 100 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeOut" }
};

// Success animation
export const successAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1],
      ease: ["easeOut", "easeIn"]
    }
  }
};

// Error shake
export const errorShake = {
  animate: { x: [0, -10, 10, -10, 10, 0] },
  transition: { duration: 0.5 }
};

// Notification slide
export const notificationSlide = {
  initial: { x: 400, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
  transition: smoothSpring
};