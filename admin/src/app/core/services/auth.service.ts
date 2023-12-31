import { Injectable } from '@angular/core';
import { HttpClient, HttpContextToken } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import User from '../types/user.interface';
import { SystemService } from './system.service';
import { NOTIFICATION_TYPES } from '../types/notification.interface';

export const AUTH_TOKEN = new HttpContextToken<string | null>(() => null);

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private _httpClient: HttpClient, private _systemService: SystemService) { }

    private $user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    public user: Observable<User | null> = this.$user.asObservable();

    public login(username: string, password: string) {
        this._systemService.addLoading("login");
        this._systemService.removeMessage("login");
        this._httpClient.post<User>('auth/login', JSON.stringify({ username, password })).pipe(
            map(((value: any) => {
                return {
                    ...value,
                    token: value.jwtToken
                };
            }))).subscribe({
                next: (res: User) => {
                    this.$user.next(res);
                    this._systemService.removeLoading("login");
                    localStorage.setItem("user.token", res.token);
                    localStorage.setItem("user.username", res.username);
                },
                error: () => {
                    this._systemService.removeLoading("login");
                    this._systemService.addMessage({ "login": "Niepoprawna <strong>nazwa użytkownika</strong> lub <strong>hasło</strong>" });
                }
            });
    };

    public recoverUser() {
        if (!localStorage.getItem("user.token") || !localStorage.getItem("user.username")) return;

        this._systemService.addLoading("jwt");

        setTimeout(() => {
            this._httpClient.post<User>('auth/checkJwt', { jwtToken: localStorage.getItem("user.token") })
                .subscribe({
                    next: () => {
                        this.$user.next({
                            token: localStorage.getItem("user.token") as string,
                            username: localStorage.getItem("user.username") as string
                        });
                        this._systemService.addNotification({ type: NOTIFICATION_TYPES.SUCCESS, content: "Zalogowano pomyślnie", action: "Ok", timespan: 6000 });
                        this._systemService.removeLoading("jwt");
                    },
                    error: (err: any) => {
                        this._systemService.removeLoading("jwt");
                        this._systemService.addNotification({ type: NOTIFICATION_TYPES.ERROR, content: "Sesja wygasła", action: "Ok", timespan: 6000 });
                        localStorage.removeItem("user.token");
                        localStorage.removeItem("user.username");
                    }
                });
        }, 1000);
    }

    public logout() {
        localStorage.removeItem("user.token");
        localStorage.removeItem("user.username");
        this.$user.next(null);
    }
}

