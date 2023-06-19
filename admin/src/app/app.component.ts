import { Component, OnInit } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { SystemService } from "./core/services/system.service";
import { NOTIFICATION_TYPES } from "./core/types/notification.interface";
import { AuthService } from "./core/services/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public auth: boolean = false;
    constructor(private _authService: AuthService) { }

    ngOnInit() {
        this._authService.user.subscribe((value) => {
            if (!this.auth && value) this.auth = true;
            else if (this.auth && !value) this.auth = false;
        });
    }
}
