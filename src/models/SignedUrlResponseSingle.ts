import {SignedUrlResponse} from "./SignedUrlResponse.js";
import {ErrorResponse} from "./ErrorResponse";

type SignedUrlResponseSingle = {
    signedUrlResponse?: SignedUrlResponse;
    error?: ErrorResponse;
}

export {SignedUrlResponseSingle};