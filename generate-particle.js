const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a canvas
const size = 128;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, size, size);

// Create a radial gradient
const gradient = ctx.createRadialGradient(
  size / 2, size / 2, 0,
  size / 2, size / 2, size / 2
);

// Add color stops
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');    // White center
gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)'); // Slightly transparent
gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)'); // More transparent
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');    // Fully transparent edge

// Fill with gradient
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, size, size);

// Convert to PNG buffer
const buffer = canvas.toBuffer('image/png');

// Save to file
fs.writeFileSync('public/particle.png', buffer);

console.log('Particle texture generated: public/particle.png'); 