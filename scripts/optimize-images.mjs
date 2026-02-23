
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'C:\\Users\\notience\\Desktop\\upscayl_png_digital-art-4x_5x';
const outputDir = 'C:\\Users\\notience\\Desktop\\catu_optimized_images';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function processImages() {
    try {
        const files = fs.readdirSync(inputDir);
        const imageFiles = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file));

        console.log(`Found ${imageFiles.length} images to process.`);

        for (const file of imageFiles) {
            const inputPath = path.join(inputDir, file);
            const outputFilename = path.parse(file).name + '.webp';
            const outputPath = path.join(outputDir, outputFilename);

            console.log(`Processing: ${file}...`);

            await sharp(inputPath)
                .resize({ width: 2560, withoutEnlargement: true }) // Max width 2560px for high quality but reasonable size
                .webp({ quality: 80 })
                .toFile(outputPath);

            const inputStats = fs.statSync(inputPath);
            const outputStats = fs.statSync(outputPath);

            console.log(`Done: ${file} -> ${outputFilename}`);
            console.log(`Size: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB -> ${(outputStats.size / 1024).toFixed(2)} KB`);
        }

        console.log('All images processed successfully!');
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

processImages();
