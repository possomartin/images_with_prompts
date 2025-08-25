import fs from 'fs';
import { encryptionText, uploadURL } from '@/common/consts.js';
import { convertToBlob, generateEncryption, getVisitorId } from '@/lib/utils.js';

export const upscaleImages = async (filePaths: string[]) => {

    const image_urls = [];
 
    for(const path of filePaths)
    {
        const formData = new FormData();
        const dataUri = `data:image/jpeg;base64,${fs.readFileSync(path, "base64")}`

        formData.append('input.type', '8X');
        formData.append('input.enhance_quality', 'false');
        formData.append('retention', '1d');
        formData.append('input.image', convertToBlob(dataUri));

        const clientID = await getVisitorId('sr');
        const isoString = new Date().toISOString();
        const signature = `${encryptionText}${isoString}${clientID}`;
        const secret = process.env.SECRET_KEY || '';

        const options = {
            method: 'POST',
            headers: {
                "x-ebg-signature": generateEncryption(signature, secret),
                "x-ebg-param": Buffer.from(isoString, 'utf-8').toString('base64'),
                "pixb-cl-id": clientID,
            },
            body: formData
        }

        const response = await fetch(uploadURL, options);
        const data = await response?.json();

        image_urls.push(data?.urls?.get);
    }

    console.log(image_urls);
}
