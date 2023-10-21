import {Request, Response} from 'express';
import {SignedUrlRequestBodySingle} from "../models/SignedUrlRequestBodySingle";

class Validator {
    static ValidateApiKeyAuthenticationRequest(req: Request, res: Response): boolean {
        if (!req.headers.hasOwnProperty('authorization')) {
            res.status(400).send({error: "BAD_REQUEST", message: "API Code is missing"})
            return false
        }
        return true
    }

    static ValidateGetSignedUrlRequest(req: Request, res: Response): boolean {
        let items: SignedUrlRequestBodySingle[] = []
        if (Array.isArray(req.body)) {
            try {
                items = req.body as SignedUrlRequestBodySingle[]
            } catch (e) {
                res.status(400).send({error: "BAD_REQUEST", message: "Invalid or incomplete body"})
                return false
            }
        } else {
            items = [req.body as SignedUrlRequestBodySingle]
        }
        for (let item of items) {
            if (!item.hasOwnProperty('key')
                || !item.hasOwnProperty('bucket')
                || !item.hasOwnProperty('operation')) {
                res.status(400).send({error: "BAD_REQUEST", message: "Invalid or incomplete body"})
                return false
            }
        }
        return true
    }
}

export {Validator};