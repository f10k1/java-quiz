import { ErrorHandler, Injectable } from "@angular/core";
import { SystemService } from "./services/system.service";
import { NOTIFICATION_TYPES } from "./types/notification.interface";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
    constructor(private _systemService: SystemService) { }

    handleError(error: any): void {
        console.log(error.message);
        this._systemService.addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            content: "Wystąpił błąd spróbuj ponownie później.",
            action: "ok",
            timespan: 5000
        });
    }
}
