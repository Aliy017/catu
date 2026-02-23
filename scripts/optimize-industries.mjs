
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const uploads = [
    { src: 'C:/Users/notience/.gemini/antigravity/brain/d035da07-a3c2-4fa9-945e-5e75e283faf4/uploaded_media_0_1771328470950.jpg', name: 'appliance.webp' }, // Electronics?
    { src: 'C:/Users/notience/.gemini/antigravity/brain/d035da07-a3c2-4fa9-945e-5e75e283faf4/uploaded_media_1_1771328470950.jpg', name: 'education.webp' }, // Education?
    { src: 'C:/Users/notience/.gemini/antigravity/brain/d035da07-a3c2-4fa9-945e-5e75e283faf4/uploaded_media_2_1771328470950.jpg', name: 'construction.webp' }, // Construction
    { src: 'C:/Users/notience/.gemini/antigravity/brain/d035da07-a3c2-4fa9-945e-5e75e283faf4/uploaded_media_3_1771328470950.jpg', name: 'medical.webp' } // Medical
];

const outDir = 'public/industries';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function processImages() {
    for (const img of uploads) {
        try {
            console.log(`Processing ${img.name}...`);
            await sharp(img.src)
                .resize(1920, 1080, { fit: 'cover', position: 'center' }) // Full HD cover
                .webp({ quality: 95 }) // High quality as requested
                .toFile(path.join(outDir, img.name));
            console.log(`Saved ${img.name}`);
        } catch (err) {
            console.error(`Error processing ${img.name}:`, err);
        }
    }
}

processImages();
