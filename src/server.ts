import {MediaRoutes} from "./routes/media-routes";
import * as Config from "./utils/config";
import {Factory, FactoryObject} from "./utils/factory";

async function main() {
    let factory: FactoryObject = Factory()
    factory.log.info("Server is starting up...")
    const mediaRoutes = new MediaRoutes(factory);
    process.on('SIGINT', mediaRoutes.stopListening.bind(mediaRoutes));
    await mediaRoutes.listen(Number(Config.getEnvironmentWithDefault("PORT", '8080')))
}
main()