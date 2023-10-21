import {Log} from "../utils/logger";
import {AuthenticationService} from "../services/authentication-service";
import {MediaController} from "../controllers/media-controller";
import {ErrorResponse} from "../models/ErrorResponse";
// @ts-ignore
import express, {Express, Request, Response} from 'express';
import {FactoryObject} from "../utils/factory";
import {Validator} from "../utils/validator";
import * as http from "http";

class MediaRoutes {
    app: Express = express();
    logger: Log;
    authenticator: AuthenticationService;
    mediaController: MediaController;
    server: http.Server;

    constructor(factoryObject: FactoryObject) {
        this.logger = factoryObject.log;
        this.authenticator = factoryObject.authenticator;
        this.mediaController = factoryObject.mediaController;

        this.app.use(express.json());
        this.app.use((error, request, response, next) => {
            if (error instanceof SyntaxError) {
                let errorBody: ErrorResponse = {
                    error: 'BODY_PARSE_ERROR',
                    message: 'Body is not valid JSON',
                }
                response.status(400).send(errorBody)
            }
        });

        this.app.get('/health', (req, res) => {
            this.logger.trace("Health check called", {"header": req.headers, "body": req.body})
            if (Validator.ValidateApiKeyAuthenticationRequest(req, res)) {
                if (this.authenticator.authenticateApiCode(req.headers['authorization'] as string, res)) {
                    factoryObject.mediaController.getHealthHandler(req, res)
                }
            }
        })

        this.app.get('/signed-url', (req, res) => {
            this.logger.trace("Get signed url called", {"header": req.headers, "body": req.body})
            if (Validator.ValidateApiKeyAuthenticationRequest(req, res)) {
                if (this.authenticator.authenticateApiCode(req.headers['authorization'] as string, res)) {
                    if (Validator.ValidateGetSignedUrlRequest(req, res)) {
                        factoryObject.mediaController.getSignedUrlHandler(req, res)
                    }
                }
            }
        })
    }

    listen(port: number) {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, () => {
                this.logger.info(`[server]: Server is running at http://localhost:${port}`)
            });
        })
    }

    stopListening() {
        this.server.close();
        this.logger.info(`[server]: Server stopped listening`)
        process.exit()
    }
}

export {MediaRoutes};