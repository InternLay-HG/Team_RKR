import { S3Client,GetObjectCommand,PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";

import dotenv from "dotenv";
dotenv.config();
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { } from "@aws-sdk/client-s3";
const s3Client = new S3Client({ region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
 });

export async function getObjectURL(key) {
const command=new GetObjectCommand({
    Bucket:"testbucketbyadi",
    Key:key
})

const url=await getSignedUrl(s3Client,command)
return url
} 

export async function putObject(filename,contentType) {
    const command=new PutObjectCommand({
        Bucket:"testbucketbyadi",
        Key: `uploads/user-uploads/${filename}`,
        ContentType:contentType,
        
    })
    const url=await getSignedUrl(s3Client,command)
    return url
}
export async function deleteObject(key) {
    const command=new DeleteObjectCommand({
        Bucket:"testbucketbyadi",
        Key:key
    });
        const response=await s3Client.send(command);
        return response;
}
