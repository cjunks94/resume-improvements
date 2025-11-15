# Carousel Images

This folder contains images for the hero section carousel.

## Required Images

1. **profile.jpg** - Professional headshot or photo of you
   - Recommended: 800x600px or 1200x900px (4:3 aspect ratio)

2. **sqs-ui.png** - Screenshot of AWS SQS Monitoring UI
   - Show the main dashboard or key features

3. **bb-bounce.png** - Screenshot of BB-Bounce Brick Breaker game
   - Gameplay screenshot showing the game in action

4. **tech-radar.png** - Screenshot of your Tech Radar visualization
   - Full radar view showing all technologies

## Image Guidelines

- **Aspect Ratio**: 4:3 (e.g., 1200x900, 800x600)
- **Format**: JPG for photos, PNG for screenshots
- **File Size**: Optimize for web (under 200KB per image recommended)
- **Quality**: High enough to look good on retina displays

## Adding More Images

To add more carousel slides:

1. Add your image file to this folder
2. Edit `index.html` and add a new slide in the `.carousel-slides` div:
   ```html
   <div class="carousel-slide">
       <img src="images/carousel/your-image.png" alt="Description" loading="lazy">
       <p class="carousel-caption">Your Caption</p>
   </div>
   ```
3. Add a corresponding indicator button:
   ```html
   <button class="carousel-indicator" aria-label="Go to slide X" data-slide="X"></button>
   ```
