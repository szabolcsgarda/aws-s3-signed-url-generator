import {AuthenticationService} from "../services/authentication-service";
import {MediaService} from "../services/media-service";
import {Request, Response} from 'express';
import {ErrorResponse} from "../models/ErrorResponse";
import {FactoryObject} from "../utils/factory";
import {SignedUrlResponseSingle} from "../models/SignedUrlResponseSingle";
import {SignedUrlRequestBodySingle} from "../models/SignedUrlRequestBodySingle";
import {SignedUrlResponse} from "../models/SignedUrlResponse";
import {Log} from "../utils/logger";

class MediaController {
    authenticator: AuthenticationService;
    mediaService: MediaService;
    logger: Log;

    constructor(factoryObject: FactoryObject) {
        this.authenticator = factoryObject.authenticator;
        this.mediaService = factoryObject.mediaService;
        this.logger = factoryObject.log;
    }

    getHealthHandler(req: Request, res: Response): void {
        res.send('media-service is healthy');
        //TODO: Check connection with AWS server and return accordingly
    }

    async getSignedUrlHandler(req: Request, res: Response): Promise<void> {
        const body = req.body || null;
        if (!body) {
            let responseBody: ErrorResponse = {
                error: 'BODY_MISSING',
                message: 'Body is required',
            }
            res.status(400).json(responseBody);
            return;
        }

        let items: SignedUrlRequestBodySingle[] = []
        if (Array.isArray(req.body)) {
            items = req.body as SignedUrlRequestBodySingle[]
        } else {
            items = [req.body as SignedUrlRequestBodySingle]
        }

        let responseBodies: SignedUrlResponseSingle[] = []
        for (let item of items) {
            try {
                // @ts-ignore
                const signedUrlCacheItem = await this.mediaService.getSignedUrl(item.bucket, item.key, item.operation, item.expires)
                const singleResponse: SignedUrlResponse = {
                    url: signedUrlCacheItem.url,
                    key: item.key,
                    operation: item.operation,
                    bucket: item.bucket,
                    expires: signedUrlCacheItem.expires
                }
                responseBodies.push({signedUrlResponse: singleResponse})
            } catch (e) {
                const errorResponse: ErrorResponse = {
                    error: 'SIGNED_URL_ERROR',
                    message: "Error creating signed url",
                }
                responseBodies.push({error: errorResponse})
            }
        }
        this.logger.trace("Get Signed URL response", {"response": responseBodies})
        if (responseBodies.length <= 1) {
            res.status(200).json(responseBodies[0])
        }
        else{
            res.status(200).json(responseBodies)
        }
    }

}

export {MediaController};