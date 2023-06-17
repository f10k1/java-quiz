import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor() { }

    handleError(error: any): void {

    }
}
