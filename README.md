# Ali Zargari Portfolio

<<<<<<< HEAD
A bold, provocative, and deeply personal portfolio for Ali Zargari—a self-made systems engineer whose work blurs the line between survival and innovation.

## Overview

This portfolio is designed to challenge, intrigue, and provoke thought. It's not just a showcase of work; it's an immersive experience that reflects the mindset of a systems engineer who has fought for mastery and refuses mediocrity.

## Key Features

- **Subliminal Messaging**: Quick, flickering words that fade in the background during scrolling—representing the driving forces behind the work.
- **Warning Modal**: First-time visitors are greeted with a security clearance screen that sets the tone for the experience.
- **Glitch Effects**: Deliberate micro-glitches on text and images, as if the site is self-aware and recalibrating.
- **Offbeat Section Titles**: Unconventional naming for traditional sections (e.g., "Quantum Initiatives" instead of "Projects").
- **Easter Eggs**: Hidden hotkeys that reveal secret messages and personal notes.
- **"The Cost" Section**: A subtle section listing what this life of mastery takes.
- **Stark Aesthetic**: High contrast design with deep shadows and piercing lights, resembling the digital core of a machine built to keep chaos at bay.
- **GitHub Contribution Graph**: Real-time display of coding activity directly from GitHub's API.

## Technical Implementation

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Animations**: Custom CSS animations and React-based interactive elements
- **API Integration**: GitHub GraphQL API for contribution data

## Pages

- **Home**: The entry point with a terminal-like introduction and main navigation.
- **Origin Story**: Personal background and journey.
- **Quantum Initiatives**: Portfolio projects presented as advanced technological systems.
- **Signal Noise**: Blog/thoughts section with filterable content.
- **The Cost**: Detailed exploration of the sacrifices made for mastery.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your GitHub Personal Access Token (create one at https://github.com/settings/tokens with `read:user` scope)
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## GitHub Contribution Graph

The portfolio includes a GitHub contribution graph similar to the one on your GitHub profile. To set this up:

1. Create a GitHub Personal Access Token with the `read:user` scope
2. Add the token to your `.env.local` file as `GITHUB_TOKEN=your_token_here`
3. By default, it will show contributions for the GitHub user 'alizargari'
4. To change the username, modify the `username` state in the `GitHubContributions` component

If no token is provided, the application will display simulated contribution data.

## Build for Production

```
npm run build
npm run start
```

## Design Philosophy

This portfolio is designed to unsettle in the best way—to make visitors question if they're on a portfolio or inside a prototype, and to leave an aftertaste of ambition, exhaustion, and awe.

"This is not a site you forget. This is Olympus."
=======
>>>>>>> e754ae4767c6fb6a16618720a889c84e6ee8c1eb
