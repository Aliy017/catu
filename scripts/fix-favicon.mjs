
import sharp from 'sharp';
import path from 'path';

const inputPath = 'c:\\Users\\notience\\Downloads\\catu\\public\\logo.png';
const outputPath = 'c:\\Users\\notience\\Downloads\\catu\\src\\app\\icon.png';

async function optimizeFavicon() {
    try {
        console.log('Processing favicon...');

        // 1. Trim transparency (remove empty space around logo)
        // 2. Resize to standard favicon sizes (e.g. 512x512 for generation)
        // 3. Add a slight background or glow if needed for visibility (optional, checking user request)

        // For now, just TRIM to max size matches the "kattaroq" request
        await sharp(inputPath)
            .trim() // Removes transparent border
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFile(outputPath);

        console.log('Favicon optimized: Trimmed whitespace and resized to 512x512.');

    } catch (err) {
        console.error('Error:', err);
    }
}

optimizeFavicon();
