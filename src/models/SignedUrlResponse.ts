type SignedUrlResponse = {
    key: string;
    bucket: string;
    operation: string;
    url: string;
    expires: number;
}
export {SignedUrlResponse};