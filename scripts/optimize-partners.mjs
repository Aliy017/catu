
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const partnerDir = 'C:\\Users\\notience\\Downloads\\catu\\public\\partners';

async function optimizePartners() {
    const files = fs.readdirSync(partnerDir);
    const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

    console.log(`Found ${imageFiles.length} partner images to optimize.`);

    for (const file of imageFiles) {
        const inputPath = path.join(partnerDir, file);
        const outputFilename = path.parse(file).name + '.webp';
        const outputPath = path.join(partnerDir, outputFilename);

        // Skip if webp already exists
        if (fs.existsSync(outputPath)) {
            console.log(`Skipping ${file} — WebP already exists`);
            continue;
        }

        const inputStats = fs.statSync(inputPath);

        await sharp(inputPath)
            .resize({ width: 400, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        console.log(`${file} (${(inputStats.size / 1024).toFixed(1)} KB) -> ${outputFilename} (${(outputStats.size / 1024).toFixed(1)} KB)`);
    }

    console.log('\nAll partner images optimized! You can manually delete the old .jpg/.png files.');
}

optimizePartners();
