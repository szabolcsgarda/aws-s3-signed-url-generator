import {S3Service} from "./s3-service";
import {FactoryObject} from "../utils/factory";
import {Log} from "../utils/logger";
import {SignedUrlCacheItem} from "../models/SignedUrlCacheItem";

class MediaService {
    logger: Log
    s3Service: S3Service

    constructor(factory: FactoryObject, cacheSize: Number) {
        this.logger = factory.log
        this.s3Service = factory.s3Service
    }

    public async getSignedUrl(bucket: string, key: string, operation: string, expires: number | undefined): Promise<SignedUrlCacheItem> {
        let res = this.LookupSignedUrlCache(bucket, key, operation);
        if (res != null) {
            return res;
        }
        if (typeof  expires == undefined) {
            expires = 3600
        }
        let signedUrlItem = await this.s3Service.createSignedUrl(bucket, key, operation, expires);
        this.AddSignedUrlToCache(bucket, key, signedUrlItem);
        return signedUrlItem;
    }

    private LookupSignedUrlCache(bucket: string, key: string, operation: string): SignedUrlCacheItem | null {
        return null
    }

    private AddSignedUrlToCache(bucket: string, key: string, url: SignedUrlCacheItem): void {
        return
    }
}

export {MediaService};