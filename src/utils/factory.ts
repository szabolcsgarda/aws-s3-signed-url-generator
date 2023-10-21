import {Log} from "./logger";
import {AuthenticationService} from "../services/authentication-service";
import {S3Service} from "../services/s3-service";
import {MediaService} from "../services/media-service";
import {MediaController} from "../controllers/media-controller";

type FactoryObject = {
    log: Log,
    authenticator: AuthenticationService,
    s3Service: S3Service,
    mediaService: MediaService,
    mediaController: MediaController,
}

function Factory(): any {
    let res: FactoryObject = {} as FactoryObject
    res.log = new Log()
    res.authenticator = new AuthenticationService(res.log, true, false, false)
    res.s3Service = new S3Service()
    res.mediaService = new MediaService(res,1000)
    res.mediaController = new MediaController(res)
    return res
}

export {FactoryObject, Factory}