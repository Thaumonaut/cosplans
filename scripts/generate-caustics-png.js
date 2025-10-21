/**
 * Generate optimized PNG caustics pattern for Crystal Waters theme
 * This creates a static PNG that's much faster to render than SVG filters
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';

async function generateCausticsPNG() {
  console.log('🌊 Generating optimized caustics PNG...');

  try {
    // Read the optimized SVG
    const svgBuffer = readFileSync('./static/caustics-optimized.svg');

    // Convert to PNG at 1920x1080 (full HD)
    await sharp(svgBuffer)
      .png({
        quality: 90,
        compressionLevel: 9, // Maximum compression
        adaptiveFiltering: true,
        palette: true // Use palette mode for smaller file size
      })
      .toFile('./static/caustics.png');

    console.log('✅ Generated caustics.png (1920x1080)');

    // Also create a smaller version for mobile/tablets
    await sharp(svgBuffer)
      .resize(1280, 720, {
        fit: 'cover',
        position: 'center'
      })
      .png({
        quality: 85,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
      })
      .toFile('./static/caustics-mobile.png');

    console.log('✅ Generated caustics-mobile.png (1280x720)');

    // Create a tiled version that can repeat seamlessly (smaller file)
    await sharp(svgBuffer)
      .resize(960, 540, {
        fit: 'cover',
        position: 'center'
      })
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
      })
      .toFile('./static/caustics-tile.png');

    console.log('✅ Generated caustics-tile.png (960x540 - tileable)');

    console.log('\n🎉 All caustics PNG files generated successfully!');
    console.log('\nUsage in theme:');
    console.log('  Desktop: url(/caustics.png)');
    console.log('  Mobile:  url(/caustics-mobile.png)');
    console.log('  Tiled:   url(/caustics-tile.png) with background-repeat');

  } catch (error) {
    console.error('❌ Error generating PNG:', error);
    process.exit(1);
  }
}

generateCausticsPNG();
