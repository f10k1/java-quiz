import { Component, OnInit } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { Observable, Subscription } from "rxjs";
import { SystemService } from "./core/services/system.service";
import { NotificationComponent } from "./share/notification/notification.component";
import { NOTIFICATION_TYPES } from "./core/types/notification.interface";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public auth: boolean = false;
    public notificationRef: ReturnType<typeof this._snackBar.openFromComponent> | undefined;

    constructor(private _snackBar: MatSnackBar, private _systemService: SystemService) { }

    ngOnInit() {
        this._systemService.notification.subscribe((value) => {
            if (value) {
                const options: MatSnackBarConfig = {
                    data: {
                        content: value.content,
                        action: value.action,
                    },
                    panelClass: [NOTIFICATION_TYPES[value.type].toLowerCase()]
                };
                if (value.timespan) options['duration'] = value.timespan;
                this.notificationRef = this._snackBar.openFromComponent(NotificationComponent, options);
                this.notificationRef.afterDismissed().subscribe((info) => {
                    if (value.onDismiss) value.onDismiss();
                    this._systemService.removeNotification();
                    this.notificationRef = undefined;
                });
            }
        });
    }
}
