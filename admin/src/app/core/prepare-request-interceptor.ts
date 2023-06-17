import { HttpContext, HttpContextToken, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AUTH_TOKEN } from "./services/auth.service";

@Injectable()
export default class PrepareInterceptor implements HttpInterceptor {

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const headers: any = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        };

        if (httpRequest.context.get(AUTH_TOKEN)) headers["Authorization"] = "Bearer " + httpRequest.context.get(AUTH_TOKEN);

        const preparedRequest = httpRequest.clone({ url: `http://localhost:8090/${httpRequest.url}`, setHeaders: headers });

        return next.handle(preparedRequest);
    }

}
