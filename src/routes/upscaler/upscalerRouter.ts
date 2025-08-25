import path from 'path';
import multer from 'multer';
import { parentDir } from '@/lib/utils.js';
import { Request, Response, Router } from 'express';
import { upscaleImages } from '@/services/upscaler.js';


const upscalerRouter = Router();
const publicFolder = path.join(parentDir, 'public', 'uploads', 'upscaler');

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, publicFolder);
    },
    filename: (req, file, cb) => {
        cb(null, 'uploaded' + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

upscalerRouter.post('/upscale-images', upload.array('photos'), async (req: Request, res: Response) => {
    try{
        if (req.files && Array.isArray(req.files))
        {
            const imagePaths = req?.files.map(file => file.path)
            await upscaleImages(imagePaths);
        }
    }
    catch(error: unknown)
    {
        console.log(`Something went wrong <${error}>`);
    }
    finally {
        res.send({ message: 'request finished'});
    }
})

export default upscalerRouter;
