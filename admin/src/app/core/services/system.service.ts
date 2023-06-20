import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, timeout } from 'rxjs';
import Loadings from '../types/loading.interface';
import Notification, { NOTIFICATION_TYPES } from '../types/notification.interface';
import Message from '../types/message.interface';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SystemService {

    private _notifications: Notification[] = [];
    private _messages: Message = {};
    private _loadings: Loadings = {};
    private _flags: Message = {};
    private _notificationRef: ReturnType<typeof this._snackBar.openFromComponent> | undefined;

    private $notification: BehaviorSubject<Notification> = new BehaviorSubject(this._notifications[0] ?? null);
    private $messages: BehaviorSubject<Message> = new BehaviorSubject(this._messages);
    private $loadings: BehaviorSubject<Loadings> = new BehaviorSubject(this._loadings);
    private $flags: BehaviorSubject<Message> = new BehaviorSubject(this._flags);


    public notification: Observable<Notification | null> = this.$notification.asObservable();
    public loadings: Observable<Loadings> = this.$loadings.asObservable();
    public messages: Observable<Message> = this.$messages.asObservable();
    public flags: Observable<Message> = this.$flags.asObservable();

    constructor(private _snackBar: MatSnackBar, private _zone: NgZone) {
        this.notification.subscribe((value) => {
            if (value) {
                const options: MatSnackBarConfig = {
                    panelClass: [NOTIFICATION_TYPES[value.type].toLowerCase()],
                    verticalPosition: "bottom",
                    horizontalPosition: "center"
                };
                if (value.timespan) options['duration'] = value.timespan;
                this._zone.run(() => {
                    this._notificationRef = this._snackBar.open(value.content, value.action, options);
                    this._notificationRef.afterDismissed().subscribe((info) => {
                        if (value.onDismiss) value.onDismiss();
                        this.removeNotification();
                    });
                });
            }
        });
    }

    public addNotification(notification: Notification): void {
        this._notifications.push(notification);

        if (this._notifications.length === 1) this.$notification.next(notification);
    }
    public removeNotification(): void {
        this._notifications = this._notifications.slice(1);

        this.$notification.next(this._notifications[0] ?? null);
    }

    public addMessage(message: Message): void {
        this._messages = { ...this._messages, ...message };

        this.$messages.next(message);
    }
    public removeMessage(name: string): void {
        if (!this._messages[name]) return;

        delete this._messages[name];

        this.$messages.next(this._messages);
    }

    public addLoading(loading: string) {
        this._loadings[loading] = true;
        this.$loadings.next(this._loadings);
    }

    public removeLoading(loading: string) {
        if (!this._loadings[loading]) return;

        delete this._loadings[loading];

        this.$loadings.next(this._loadings);
    }

    public addFlag(flag: Message) {
        this._flags = { ...this._flags, ...flag };
        this.$flags.next(this._flags);
    }

    public patchFlag(flag: string, newFlag: string) {
        if (!this._flags[flag]) return;

        this._flags[flag] = newFlag;

        this.$flags.next(this._flags);
    }

    public removeFlag(flag: string) {
        if (!this._flags[flag]) return;

        delete this._flags[flag];

        this.$flags.next(this._flags);
    }
}
