import { Logger } from "tslog";
class Log{
    log: Logger<any>;

    constructor() {
        this.log = new Logger();

    }
    trace(message, ...context){
        this.log.trace(message, ...context)
    }

    info(message, ...context){
        this.log.info(message, ...context)
    }
    warn(message, ...context){
        this.log.warn(message, ...context)
    }

    error(message, ...context){
        this.log.error(message, ...context)
    }
}

export { Log };