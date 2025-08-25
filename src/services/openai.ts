import fs from "fs";
import path from 'path';
import OpenAi, { toFile } from 'openai';
import { parentDir } from "@/lib/utils.js";
import { IGenerateImage, IPhotographs } from "@/types/types.js";
import { imageDescriptionPrompt, imageGenerationPrompt } from "@/common/consts.js";

const openai = new OpenAi(
    { apiKey: process.env.OPENAI_KEY }
);

export const processImages = async (imagePaths: string[]): Promise<void> => {
    for (const [index, path] of imagePaths.entries())
    {
        console.log('Processing Image: ', index);
        const description = await generateImageDescription({ prompt: imageDescriptionPrompt, imageFiles: [path]});
        if (description)
        {
            const imagePrompt = `${imageGenerationPrompt}: ${description}`;
            await generateImage({ name: `image-generated-${index}`, prompt: imagePrompt, imageFiles: [path] });
            console.log(`Generated image ${index + 1} of ${imagePaths.length}`)
        }
    }
}

/* Describe image with prompt and reference image */

export const generateImageDescription = async ({ prompt, imageFiles }: Omit<IGenerateImage, "name">): Promise<void | string> => {
    const base64Images: Array<IPhotographs> = imageFiles.map((image) => ({
        type: 'input_image', 
        image_url: `data:image/jpeg;base64,${fs.readFileSync(image, "base64")}`,
        detail: 'auto'
    }));

    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
                    { type: "input_text", text: prompt },
                    ...base64Images,
                ]
            }
        ]
    });

    return response.output_text;
}


/* Generate images with prompt and reference images */ 

export const generateImage = async ({ name, prompt, imageFiles }: IGenerateImage): Promise<void> => {
    try{
        const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
        const images = await Promise.all(imageFiles.map(async (file) => await toFile(fs.createReadStream(file),  null, { type: "image/png" })), );
    
        const result = await openai.images.edit({ model: model, image: images, prompt, size: '1024x1024', quality: 'high' });
    
        if (!result.data) return;
    
        const image_base64 = result.data[0].b64_json || '';
        const image_bytes = Buffer.from(image_base64, "base64");

        fs.writeFileSync(path.join(parentDir, `public/results/openai/${name}.png`), image_bytes);
    } catch(error: any)
    {
        console.error(`Something went wrong <${error}>`);
    }
}
