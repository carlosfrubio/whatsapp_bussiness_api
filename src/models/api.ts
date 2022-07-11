import * as fs from 'fs'
import * as path from 'path'

export enum DataErrorCode {
    INCOMPLETE_DATA = 400,
    INVALID = 422,
    NOT_FOUND = 404,
    CONFLICT = 409
}

export enum AuthErrorCode {
    ACCESS_TOKEN = 401,
    PERMISSIONS_FAIL = 403
}

export enum StandarCode {
    OK = 200,
    OK_NO_CONTENT = 204
}

export const getTempPath = () => {
    const dir = path.join(__dirname, '../tmp/')

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    return dir;

}



