import {SignedUrlCacheItem} from "../models/SignedUrlCacheItem";

const Config = require('../utils/config');

import https from "https";
import {PutObjectCommand, GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

class S3Service {
    private region: string;
    private s3Client: S3Client;

    constructor() {
        this.region = Config.getEnvironmentWithDefault("AWS_REGION", "eu-north-1");
        this.s3Client = new S3Client({region: this.region});
    }

    async createSignedUrl(bucket: string, key: string, operation: string, expires_after: number): Promise<SignedUrlCacheItem> {
        let command: GetObjectCommand | PutObjectCommand;
        switch (operation) {
            case "getObject":
                command = new GetObjectCommand({Bucket: bucket, Key: key});
                break;
            case "putObject":
                command = new PutObjectCommand({Bucket: bucket, Key: key});
                break;
        }
        let result = await getSignedUrl(this.s3Client, command, {expiresIn: expires_after});
        const currentDate = new Date();
        return {url: result, operation: operation, expires: currentDate.getTime() + expires_after} as SignedUrlCacheItem;
    }

    async uploadObject(url: string, data: Buffer): Promise<unknown> {
        return new Promise((resolve, reject) => {
            const req = https.request(
                url,
                {method: "PUT", headers: {"Content-Length": new Blob([data]).size}},
                (res) => {
                    let responseBody = "";
                    res.on("data", (chunk) => {
                        responseBody += chunk;
                    });
                    res.on("end", () => {
                        resolve(responseBody);
                    });
                },
            );
            req.on("error", (err) => {
                reject(err);
            });
            req.write(data);
            req.end();
        });
    }
}

export {S3Service};