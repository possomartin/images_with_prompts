import path from 'path';
import { parentDir } from './lib/utils.js';
import { inputs, inputs_with_prompts } from '@/consts.js';
import { generateImage, generateImageDescription } from "@/services/openai.js";

/* CODE GOES HERE */

const imageDescriptions = () => {
    const product_descriptions = []
    inputs.forEach(async (input, index) => {
        const inputMapped = {...input, imageFiles: input.imageFiles.map((file) => (path.join(parentDir, `public/input_images/${file}`)))};
        if (index == 4 || index == 8)
        {
            generateImageDescription(inputMapped).then((response) => {
                console.log({name: input.name, description: response});
            }).catch((error) => console.log(error)).finally(() => {
                console.log(`Product ${index} of ${inputs.length}`);
            });
        }
    });
}

const imagesGeneration = async () => {
    for (const input of inputs_with_prompts)
    {
        const inputMapped = {...input, imageFiles: input.imageFiles.map((file) => (path.join(parentDir, `public/input_images/${file}`)))};
        try
        {
            await generateImage(inputMapped);
            console.log(`✅ Image created for ${input.name}`);
        }
        catch(error)
        {
            console.error(`❌ Error generating image for ${input.name}:`, error);
        }

    } 
}

await imagesGeneration();