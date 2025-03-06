// Real project data
export const projects = [
  {
    id: 'olympus',
    title: 'ATHENA',
    description: 'Advanced residential intelligence system integrating IoT architecture with adaptive machine learning. Engineered to create responsive environments that anticipate needs while optimizing resource utilization.',
    tags: ['Artificial Intelligence', 'IoT Architecture', 'Predictive Analytics', 'Smart Environment'],
    image: '/olympus.jpg',
    status: 'DEPLOYED',
    year: '2023',
    color: '#94A3B8'
  },
  {
    id: 'socialsync',
    title: 'EMPATHICA',
    description: 'Cognitive-behavioral augmentation platform for neurodivergent individuals. Utilizes computer vision and neural networks to analyze social dynamics and provide real-time adaptive guidance.',
    tags: ['Neural Networks', 'Computer Vision', 'Assistive Technology', 'Behavioral Science'],
    image: '/socialsync.jpg',
    status: 'IMPLEMENTED',
    year: '2022',
    color: '#9B59B6'
  },
  {
    id: 'memento',
    title: 'COGNISENSE',
    description: 'Ambient intelligence ecosystem for cognitive assistance. Orchestrates distributed sensors and contextual computing to create a responsive support network for individuals with memory-related conditions.',
    tags: ['Ambient Computing', 'Distributed Systems', 'Healthcare Technology', 'Contextual Intelligence'],
    image: '/memento.jpg',
    status: 'OPERATIONAL',
    year: '2022',
    color: '#FFFFFF'
  },
  {
    id: 'nexus',
    title: 'QUANTUM FLUX',
    description: 'High-throughput distributed processing architecture delivering microsecond latency at enterprise scale. Engineered for mission-critical applications requiring real-time analytics across massive data streams.',
    tags: ['High-Performance Computing', 'Real-time Analytics', 'Enterprise Architecture'],
    image: '/nexus.jpg',
    status: 'PRODUCTION',
    year: '2021',
    color: '#94A3B8'
  }
];

// Project-specific details
export const projectDetails = {
  olympus: {
    fullDescription: "ATHENA represents the convergence of ambient computing and predictive intelligence, creating environments that learn, adapt, and anticipate. This system orchestrates a network of distributed sensors and actuators through a proprietary protocol layer, enabling seamless integration across heterogeneous device ecosystems while maintaining stringent security standards.",
    challenges: "The primary engineering challenge involved developing a unified protocol architecture that could maintain sub-millisecond responsiveness while ensuring end-to-end encryption across diverse IoT endpoints. Additionally, balancing computational efficiency with privacy-preserving machine learning required innovative approaches to edge computing.",
    technologies: ["TensorFlow", "Python", "MQTT", "React", "Node.js", "MongoDB", "Raspberry Pi", "Arduino"],
    achievements: ["Reduced energy consumption by 30% through predictive optimization", "Enhanced security response architecture with 45% improved incident detection", "Established interoperability with 50+ IoT protocols and device classes"]
  },
  socialsync: {
    fullDescription: "EMPATHICA is a cognitive augmentation platform that bridges the gap between perception and social understanding for neurodivergent individuals. Utilizing advanced computer vision algorithms and machine learning models, it processes subtle social cues in real-time, translating complex interpersonal dynamics into actionable insights delivered through a minimally invasive wearable interface.",
    challenges: "Developing neural networks capable of distinguishing nuanced emotional expressions with clinical accuracy presented significant technical hurdles. The system required exceptional precision while operating within the constraints of wearable computing hardware, necessitating novel approaches to model optimization and power management.",
    technologies: ["OpenCV", "TensorFlow", "Python", "Flutter", "Firebase", "Wearable Tech", "Edge Computing"],
    achievements: ["Demonstrated 40% improvement in social interaction efficacy through controlled clinical evaluation", "Successfully implemented in 5 specialized therapeutic environments", "Research methodology and outcomes published in the Journal of Assistive Technologies"]
  },
  memento: {
    fullDescription: "COGNISENSE creates an intelligent support infrastructure for individuals with memory-related conditions through a sophisticated network of environmental sensors, personal devices, and adaptive interfaces. The system constructs a contextual understanding of user patterns and needs, providing precisely timed cognitive assistance that adapts to changing circumstances and environments.",
    challenges: "Developing a system that maintains continuous awareness while respecting privacy boundaries required sophisticated approaches to on-device processing and data minimization. Additionally, ensuring reliability in healthcare contexts demanded fault-tolerant architecture with redundant systems and graceful degradation pathways.",
    technologies: ["IoT Sensors", "BLE Beacons", "React Native", "Node.js", "MongoDB", "AWS IoT", "Edge AI"],
    achievements: ["Reduced critical medication non-adherence by 85% in clinical deployment", "Improved independent living assessment metrics by 60% among participants", "Successfully implemented in 3 assisted living facilities with ongoing expansion"]
  },
  nexus: {
    fullDescription: "QUANTUM FLUX is an enterprise-grade distributed computing platform engineered for applications requiring deterministic performance at massive scale. The architecture implements a novel approach to stream processing that guarantees consistent sub-millisecond response times while maintaining linear scalability across distributed infrastructure.",
    challenges: "Achieving deterministic performance across distributed nodes required rethinking fundamental assumptions about data routing and processing. The system implements custom network protocols and memory management techniques to eliminate jitter and ensure predictable latency even under extreme load conditions.",
    technologies: ["Kafka", "Rust", "gRPC", "Kubernetes", "Prometheus", "ClickHouse", "Redis", "NATS"],
    achievements: ["Processes over 5 million events per second with consistent sub-millisecond latency", "Maintains 99.999% availability across production deployments", "Delivers 70% infrastructure cost optimization compared to previous solutions"]
  }
}; 