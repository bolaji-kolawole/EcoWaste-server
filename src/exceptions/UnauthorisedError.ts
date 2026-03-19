export class UnauthorisedError extends Error {

    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, UnauthorisedError.prototype);
    }
    
}