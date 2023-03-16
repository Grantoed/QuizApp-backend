import { S3 } from 'aws-sdk';
import fs from 'fs';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

export function uploadFile(file: Express.Multer.File) {
    console.log(file);

    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName || 'default-bucket-name',
        Body: fileStream,
        Key: file.filename,
    };

    return s3.upload(uploadParams).promise();
}
