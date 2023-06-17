import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timeout } from 'rxjs';
import Loadings from '../types/loading.interface';
import Notification from '../types/notification.interface';

@Injectable({
    providedIn: 'root'
})
export class SystemService {

    private notifications: Notification[] = [];

    private $notification: BehaviorSubject<Notification> = new BehaviorSubject(this.notifications[0] ?? null);
    private $loadings: BehaviorSubject<Loadings> = new BehaviorSubject({});

    public notification: Observable<Notification> = this.$notification.asObservable();
    public loadings: Observable<Loadings> = this.$loadings.asObservable();

    private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        this.notification.subscribe((value: Notification) => {
            if (this.notificationTimeout) window.clearTimeout(this.notificationTimeout);

            if (value && !value.timespan) {
                this.notificationTimeout = null;
                return;
            };

            this.notificationTimeout = setTimeout(() => {
                this.removeNotification();
            });
        });
    }

    public addNotification(notification: Notification): void {
        this.notifications.push(notification);

        if (this.notifications.length === 1) this.$notification.next(notification);
    }
    public removeNotification(): void {
        this.notifications.pop();

        this.$notification.next(this.notifications[0] ?? null);
    }

    public addLoading(loading: string) {
        this.$loadings.next({ ...this.$loadings.getValue, [loading]: true });
    }
    public removeLoading(loading: string) {
        const tmp: Loadings = this.$loadings.getValue();

        if (!tmp[loading]) return;

        delete tmp[loading];

        this.$loadings.next(tmp);
    }
}
