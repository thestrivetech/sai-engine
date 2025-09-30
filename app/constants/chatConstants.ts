// app/constants/chatConstants.ts

export const URLS = {
  CALENDLY: 'https://calendly.com/strivetech',
  STRIVE_WEBSITE: 'https://strivetech.ai',
  GROQ_CONSOLE: 'https://console.groq.com'
};

// Service cards for full mode
export const SERVICE_CARDS = [
  {
    icon: 'TrendingUp',
    title: 'Predictive Analytics',
    description: 'Transform your data into actionable insights that drive better business decisions.',
    color: 'primary',
    gradientFrom: 'from-primary-500',
    gradientTo: 'to-primary-600'
  },
  {
    icon: 'Eye',
    title: 'Computer Vision',
    description: 'Automate visual tasks with AI that sees and understands like humans do.',
    color: 'blue',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600'
  },
  {
    icon: 'MessageCircle',
    title: 'Natural Language AI',
    description: 'Understand and process human language to automate communication tasks.',
    color: 'green',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600'
  }
];

// Animation and UI constants
export const ANIMATIONS = {
  GLOW_DURATION: 4,
  ROTATE_DURATION: 2,
  PULSE_DURATION: 2,
  BOUNCE_DELAY: 0.2,
  FADE_DURATION: 0.5,
  HOVER_SCALE: 1.05,
  TAP_SCALE: 0.95
};

export const SIZES = {
  AVATAR_LARGE: 80,
  AVATAR_MEDIUM: 60,
  AVATAR_SMALL: 36,
  GLOW_OFFSET: 30,
  ICON_SMALL: 12,
  ICON_MEDIUM: 16,
  ICON_LARGE: 20
};

export const COLORS = {
  PRIMARY_RGB: '245, 104, 52',
  BLUE_RGB: '59, 130, 246',
  GREEN_RGB: '16, 185, 129',
  RED_RGB: '239, 68, 68',
  PURPLE_RGB: '168, 85, 247'
};