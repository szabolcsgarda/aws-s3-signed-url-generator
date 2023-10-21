import {Log} from "../utils/logger";

const Config = require('../utils/config');
import {Response} from 'express';
import {ErrorResponse} from "../models/ErrorResponse";

class AuthenticationService {
    private loggerService: Log;
    private apiCodeAuthenticationEnabled: boolean;
    private basicAuthenticationEnabled: boolean;
    private bearerAuthenticationEnabled: boolean;
    private apiCodes: string[] = [];

    constructor(loggerService: Log, apiCodeAuthenticationEnabled: boolean, BasicAuthenticationEnabled: boolean, BearerAuthenticationEnabled: boolean) {
        this.loggerService = loggerService;
        this.apiCodeAuthenticationEnabled = apiCodeAuthenticationEnabled;
        this.basicAuthenticationEnabled = BasicAuthenticationEnabled;
        this.bearerAuthenticationEnabled = BearerAuthenticationEnabled;

        //Configure API code Authentication
        if (this.apiCodeAuthenticationEnabled) {
            this.loggerService.trace("API Code Authentication is enabled");
            let apiCodes = Config.getEnvironmentWithDefault("API_CODES", "[]")
            try {
                this.apiCodes = JSON.parse(apiCodes);
            } catch (e) {
                throw new Error("API_CODES is not a valid JSON array");
            }
        }
        //Configure Basic Authentication
        if (this.basicAuthenticationEnabled) {
            throw new Error("Basic Authentication is not implemented");
        }
        //Configure Bearer Authentication
        if (this.bearerAuthenticationEnabled) {
            throw new Error("Bearer Authentication is not implemented");
        }
    }

    authenticateApiCode(apiCode: string, res: Response): boolean {
        if (!this.apiCodes.includes(apiCode)) {
            let error: ErrorResponse = {error: "Unauthorized", message: ""}
            res.status(401).send(error);
            return false
        }
        return true
    }
}

export {AuthenticationService};