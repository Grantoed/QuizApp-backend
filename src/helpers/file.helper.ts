import Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const AVATARS_DIR = path.resolve('./tmp');

const resizeAndRenameImage = async (
    fileName: string,
): Promise<{ newFileName: string; newFilePath: string }> => {
    // Read the image from tmp folder
    const image = await Jimp.read(`${AVATARS_DIR}/${fileName}`);

    // Resize the image to 250x250
    image.resize(250, 250);

    // Generate a unique name for the image
    const newFileName = `${uuidv4()}.${image.getExtension()}`;

    // Save the image to tmp folder
    image.write(`${AVATARS_DIR}/${newFileName}`);

    // Delete the original image from tmp folder
    await fs.unlink(`${AVATARS_DIR}/${fileName}`);

    const newFilePath = path.join(AVATARS_DIR, newFileName);
    return { newFileName, newFilePath };
};

export default resizeAndRenameImage;
