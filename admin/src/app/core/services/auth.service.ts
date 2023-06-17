import { Injectable } from '@angular/core';
import { HttpClient, HttpContextToken } from '@angular/common/http';
import { BehaviorSubject, Observable, map, timeout } from 'rxjs';
import User from '../types/user.interface';
import { SystemService } from './system.service';

export const AUTH_TOKEN = new HttpContextToken<string | null>(() => null);

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private systemService: SystemService) { }

    private $user: BehaviorSubject<User> = new BehaviorSubject({} as User);

    public user: Observable<User> = this.$user.asObservable();

    public login(username: string, password: string) {
        this.systemService.addLoading("login");
        this.http.post<User>('auth/login', JSON.stringify({ username, password })).pipe(map(((value: any) => {
            return {
                ...value,
                token: value.jwtToken
            };
        }))).subscribe({
            next: (res) => {
                this.$user.next(res);
                this.systemService.removeLoading("login");
            },
            error: () => {
                this.systemService.removeLoading("login");
            }
        });
    };
}

