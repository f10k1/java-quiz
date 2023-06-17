import { Injectable } from '@angular/core';
import { HttpClient, HttpContextToken } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import User from '../types/user.interface';
import { SystemService } from './system.service';
import { NOTIFICATION_TYPES } from '../types/notification.interface';

export const AUTH_TOKEN = new HttpContextToken<string | null>(() => null);

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private systemService: SystemService) { }

    private $user: Subject<User> = new Subject();

    public user: Observable<User> = this.$user.asObservable();

    public login(username: string, password: string) {
        this.systemService.addLoading("login");
        this.systemService.removeMessage("login");
        this.http.post<User>('auth/login', JSON.stringify({ username, password })).pipe(
            map(((value: any) => {
                return {
                    ...value,
                    token: value.jwtToken
                };
            }))).subscribe({
                next: (res) => {
                    this.$user.next(res);
                    this.systemService.removeLoading("login");
                    localStorage.setItem("user.token", res.token);
                    localStorage.setItem("user.username", res.username);
                },
                error: () => {
                    this.systemService.removeLoading("login");
                    this.systemService.addMessage({ "login": "Niepoprawna <strong>nazwa użytkownika</strong> lub <strong>hasło</strong>" });
                }
            });
    };

    public recoverUser() {
        if (!localStorage.getItem("user.token") || !localStorage.getItem("user.username")) return;

        this.systemService.addLoading("login");

        this.http.post<User>('auth/checkJwt', { jwtToken: localStorage.getItem("user.token") })
            .subscribe({
                next: () => {
                    this.$user.next({
                        token: localStorage.getItem("user.token") as string,
                        username: localStorage.getItem("user.username") as string
                    });
                    this.systemService.addNotification({ type: NOTIFICATION_TYPES.SUCCESS, content: "Zalogowano pomyślnie", action: "Ok", timespan: 6000 });
                    this.systemService.removeLoading("login");
                },
                error: (err) => {
                    this.systemService.removeLoading("jwt");
                    this.systemService.addNotification({ type: NOTIFICATION_TYPES.ERROR, content: "Sesja wygasła", action: "Ok", timespan: 6000 });
                    localStorage.removeItem("user.token");
                    localStorage.removeItem("user.username");
                }
            });
    }
}

