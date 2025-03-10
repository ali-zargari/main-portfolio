// Real project data
export const projects = [
  {
    id: 'olympus',
    title: 'Olympus',
    description: 'Advanced residential intelligence system integrating IoT architecture with adaptive machine learning. Engineered to create responsive environments that anticipate needs while optimizing resource utilization.',
    tags: ['Artificial Intelligence', 'IoT Architecture', 'Predictive Analytics', 'Smart Environment'],
    image: '/grid.svg',
    status: 'DEPLOYED',
    year: '2023',
    color: '#94A3B8'
  },
  {
    id: 'socialsync',
    title: 'SocialSync',
    description: 'Cognitive-behavioral augmentation platform for neurodivergent individuals. Utilizes computer vision and neural networks to analyze social dynamics and provide real-time adaptive guidance.',
    tags: ['Neural Networks', 'Computer Vision', 'Assistive Technology', 'Behavioral Science'],
    image: '/globe.svg',
    status: 'IMPLEMENTED',
    year: '2022',
    color: '#9B59B6'
  },
  {
    id: 'slam-kalman',
    title: 'Slam Kalman Localization',
    description: 'Advanced simultaneous localization and mapping (SLAM) system using Kalman filtering for precise real-time positioning in dynamic environments without GPS. Optimized for robotics and autonomous navigation.',
    tags: ['Robotics', 'Computer Vision', 'Kalman Filtering', 'Autonomous Systems'],
    image: '/window.svg',
    status: 'OPERATIONAL',
    year: '2022',
    color: '#FFFFFF'
  }
];

// Project-specific details
export const projectDetails = {
  olympus: {
    fullDescription: "Olympus is a comprehensive smart home system that represents the convergence of ambient computing and predictive intelligence, creating environments that learn, adapt, and anticipate. This system orchestrates a network of distributed sensors and actuators through a proprietary protocol layer, enabling seamless integration across heterogeneous device ecosystems while maintaining stringent security standards.",
    challenges: "The primary engineering challenge involved developing a unified protocol architecture that could maintain sub-millisecond responsiveness while ensuring end-to-end encryption across diverse IoT endpoints. Additionally, balancing computational efficiency with privacy-preserving machine learning required innovative approaches to edge computing.",
    technologies: ["TensorFlow", "Python", "MQTT", "React", "Node.js", "MongoDB", "Raspberry Pi", "Arduino"],
    achievements: ["Reduced energy consumption by 30% through predictive optimization", "Enhanced security response architecture with 45% improved incident detection", "Established interoperability with 50+ IoT protocols and device classes"]
  },
  socialsync: {
    fullDescription: "SocialSync is a cognitive augmentation platform that bridges the gap between perception and social understanding for neurodivergent individuals. Utilizing advanced computer vision algorithms and machine learning models, it processes subtle social cues in real-time, translating complex interpersonal dynamics into actionable insights delivered through a minimally invasive wearable interface.",
    challenges: "Developing neural networks capable of distinguishing nuanced emotional expressions with clinical accuracy presented significant technical hurdles. The system required exceptional precision while operating within the constraints of wearable computing hardware, necessitating novel approaches to model optimization and power management.",
    technologies: ["OpenCV", "TensorFlow", "Python", "Flutter", "Firebase", "Wearable Tech", "Edge Computing"],
    achievements: ["Demonstrated 40% improvement in social interaction efficacy through controlled clinical evaluation", "Successfully implemented in 5 specialized therapeutic environments", "Research methodology and outcomes published in the Journal of Assistive Technologies"]
  },
  "slam-kalman": {
    fullDescription: "Slam Kalman Localization is a cutting-edge implementation of simultaneous localization and mapping (SLAM) technology enhanced with Kalman filtering for superior accuracy. This system enables autonomous robots and vehicles to precisely determine their position in unknown environments without relying on GPS, making it ideal for indoor navigation, underground operations, and other GPS-denied scenarios.",
    challenges: "The key challenge was developing algorithms that could maintain accurate positioning despite sensor noise and environmental uncertainties. Optimizing the Kalman filter implementation to run efficiently on embedded systems while handling real-time data from multiple sensors required significant mathematical and computational innovation.",
    technologies: ["C++", "ROS (Robot Operating System)", "Python", "CUDA", "LiDAR", "IMU Sensors", "Computer Vision", "Linear Algebra"],
    achievements: ["Achieved sub-centimeter localization accuracy in dynamic environments", "Reduced computational requirements by 60% compared to traditional SLAM implementations", "Successfully deployed in autonomous warehouse robots, improving navigation efficiency by 35%"]
  }
}; 