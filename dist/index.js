"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 8005;
const server = app_1.default.listen(port, () => console.log(`WhatsApp_Gateway listening on port ${port}`));
function handleExit(signal) {
    console.info(`Received ${signal}. Close my server properly.`);
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
    });
}
process.on('SIGTERM', handleExit);
process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
//# sourceMappingURL=index.js.map