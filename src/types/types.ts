/* Generate images based off of prompts */ 
export interface IGenerateImage {
    name: string
    prompt: string;
    imageFiles: Array<string>
}

export interface IPhotographs {
    type: 'input_image';
    image_url: string;
    detail: 'auto';
}