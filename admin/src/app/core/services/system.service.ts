import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timeout } from 'rxjs';
import Loadings from '../types/loading.interface';
import Notification from '../types/notification.interface';
import Message from '../types/message.interface';

@Injectable({
    providedIn: 'root'
})
export class SystemService {

    private _notifications: Notification[] = [];
    private _messages: Message = {};
    private _loadings: Loadings = {};

    private $notification: BehaviorSubject<Notification> = new BehaviorSubject(this._notifications[0] ?? null);
    private $messages: BehaviorSubject<Message> = new BehaviorSubject(this._messages);
    private $loadings: BehaviorSubject<Loadings> = new BehaviorSubject(this._loadings);

    public notification: Observable<Notification | null> = this.$notification.asObservable();
    public loadings: Observable<Loadings> = this.$loadings.asObservable();
    public messages: Observable<Message> = this.$messages.asObservable();

    public addNotification(notification: Notification): void {
        this._notifications.push(notification);

        if (this._notifications.length === 1) this.$notification.next(notification);
    }
    public removeNotification(): void {
        this._notifications.pop();

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
}
