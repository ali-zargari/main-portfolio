// Real project data
export const projects = [
  {
    id: 'olympus',
    title: 'OLYMPUS',
    description: 'AI-powered smart home system with IoT integration. A comprehensive solution that combines machine learning algorithms with connected devices to create an intelligent living environment.',
    tags: ['AI', 'IoT', 'Machine Learning', 'Smart Home'],
    image: '/olympus.jpg',
    status: 'ACTIVE',
    year: '2023',
    color: '#00FFFF'
  },
  {
    id: 'socialsync',
    title: 'SOCIALSYNC',
    description: 'AI-powered assistive tool for ASD therapy. Leverages computer vision and machine learning to help individuals with Autism Spectrum Disorder improve social interaction skills.',
    tags: ['AI', 'Computer Vision', 'Assistive Technology', 'Healthcare'],
    image: '/socialsync.jpg',
    status: 'COMPLETE',
    year: '2022',
    color: '#9B59B6'
  },
  {
    id: 'memento',
    title: 'MEMENTO',
    description: 'IoT solution for memory impairment assistance. A network of connected devices and sensors that provide contextual reminders and assistance for individuals with memory impairments.',
    tags: ['IoT', 'Assistive Technology', 'Healthcare', 'Embedded Systems'],
    image: '/memento.jpg',
    status: 'ACTIVE',
    year: '2022',
    color: '#FFFFFF'
  },
  {
    id: 'nexus',
    title: 'NEXUS',
    description: 'A distributed system for real-time data processing and analysis, capable of handling millions of events per second with sub-millisecond latency.',
    tags: ['Distributed Systems', 'Real-time Processing', 'Scalability'],
    image: '/nexus.jpg',
    status: 'OPERATIONAL',
    year: '2021',
    color: '#00FFFF'
  }
];

// Project-specific details
export const projectDetails = {
  olympus: {
    fullDescription: "OLYMPUS is an AI-powered smart home system that integrates various IoT devices to create a seamless, intelligent living environment. The system learns from user behavior patterns and environmental data to optimize comfort, energy efficiency, and security.",
    challenges: "Developing a unified protocol for diverse IoT devices while ensuring data privacy and system security presented significant challenges. The system needed to be both powerful and user-friendly.",
    technologies: ["TensorFlow", "Python", "MQTT", "React", "Node.js", "MongoDB", "Raspberry Pi", "Arduino"],
    achievements: ["Reduced energy consumption by 30%", "Improved home security response time by 45%", "Seamless integration with 50+ IoT device types"]
  },
  socialsync: {
    fullDescription: "SocialSync is an assistive technology designed to help individuals with Autism Spectrum Disorder improve social interaction skills. Using computer vision and machine learning, it analyzes facial expressions and social cues in real-time, providing gentle feedback through a discreet wearable device.",
    challenges: "Creating algorithms sensitive enough to detect subtle social cues while being robust against false positives was particularly challenging. The system needed to be non-intrusive and comfortable for daily use.",
    technologies: ["OpenCV", "TensorFlow", "Python", "Flutter", "Firebase", "Wearable Tech", "Edge Computing"],
    achievements: ["Improved social interaction metrics by 40% in clinical trials", "Successfully deployed in 5 therapy centers", "Featured in Journal of Assistive Technologies"]
  },
  memento: {
    fullDescription: "Memento is an IoT ecosystem designed to assist individuals with memory impairments. It combines environmental sensors, wearable devices, and strategically placed displays to provide contextual reminders and assistance based on the user's location and routine.",
    challenges: "Balancing the need for constant monitoring with privacy concerns was a major challenge. The system needed to be reliable enough for healthcare applications while remaining affordable.",
    technologies: ["IoT Sensors", "BLE Beacons", "React Native", "Node.js", "MongoDB", "AWS IoT", "Edge AI"],
    achievements: ["Reduced missed medication instances by 85%", "Improved independent living metrics by 60%", "Deployed in 3 assisted living facilities"]
  },
  nexus: {
    fullDescription: "NEXUS is a distributed system for real-time data processing and analysis, capable of handling millions of events per second with sub-millisecond latency. It provides a scalable infrastructure for applications requiring immediate insights from high-volume data streams.",
    challenges: "Achieving consistent sub-millisecond performance at scale required innovative approaches to distributed computing. Ensuring fault tolerance without compromising speed was particularly challenging.",
    technologies: ["Kafka", "Rust", "gRPC", "Kubernetes", "Prometheus", "ClickHouse", "Redis", "NATS"],
    achievements: ["Processes 5M+ events per second", "99.999% uptime over 12 months", "70% reduction in infrastructure costs compared to previous solution"]
  }
}; 