import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { AUTH_TOKEN, AuthService } from "./services/auth.service";

@Injectable()
export default class PrepareInterceptor implements HttpInterceptor {

    constructor(private _authService: AuthService) { }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const headers: any = {
            "Content-Type": "application/json",
        };

         const $sub: Subscription = this._authService.user.subscribe((value: any) => {
            if (value?.token) headers.Authorization = "Bearer " + value.token;;
        });

        const preparedRequest = httpRequest.clone({ url: `http://localhost:8090/${httpRequest.url}`, setHeaders: headers });
        $sub.unsubscribe();
        return next.handle(preparedRequest);
    }

}
