// import * as mongoose from 'mongoose'
import App from './app'

const port = process.env.PORT || 8005

const server = App.listen(port, ()=> console.log(`WhatsApp_Gateway listening on port ${port}`))

function handleExit(signal: string){
    console.info(`Received ${signal}. Close my server properly.`);
    console.log('Closing http server.');

    server.close(() => {
        console.log('Http server closed.');
    })
}

process.on('SIGTERM', handleExit)
process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
