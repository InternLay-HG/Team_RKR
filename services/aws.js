import { S3Client,GetObjectCommand,PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";

import dotenv from "dotenv";
dotenv.config();
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { } from "@aws-sdk/client-s3";
const s3Client = new S3Client({ region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
 });

export async function getObjectURL(key) {
const command=new GetObjectCommand({
    Bucket:"adityatestbucket1st",
    Key:key
})
const url=await getSignedUrl(S3Client,command)
return url
} 

export async function putObject(filename,contentType) {
    const command=new PutObjectCommand({
        Bucket:process.env.BUCKET_NAME,
        Key: `uploads/user-uploads/${filename}`,
        ContentType:contentType,
        
    })
    const url=await getSignedUrl(s3Client,command)
    return url
}
export async function deleteObject(key) {
    const command=new DeleteObjectCommand({
        Bucket:process.env.BUCKET_NAME,
        Key:key
    });
        const response=await s3Client.send(command);
        return response;
}
async function init() {
    console.log(await putObject(`image-${Date.now()}.jpeg`,"image/jpeg"));
}
init();
