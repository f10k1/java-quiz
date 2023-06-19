import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import FormErrorStateMatcher from '../core/input-error-matcher';
import { AuthService } from '../core/services/auth.service';
import { SystemService } from '../core/services/system.service';
import Loadings from '../core/types/loading.interface';
import Message from '../core/types/message.interface';
import { Observable, Subscription } from 'rxjs';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    public form: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    public matcher = new FormErrorStateMatcher();
    public loginLoading: boolean = false;
    public jwtLoading: boolean = false;

    private $loadings: Subscription | undefined;
    public $messages: Observable<Message> = this._systemService.messages;

    constructor(private fb: FormBuilder, private _authService: AuthService, private _systemService: SystemService) { }

    public ngOnInit(): void {
        this._authService.recoverUser();

        this.$loadings = this._systemService.loadings.subscribe((value: Loadings) => {
            this.loginLoading = value['login'] ?? false;
            this.jwtLoading = value['jwt'] ?? false;
        });

    }

    public submitLogin(): void {
        if (!this.form.valid) return;

        this._authService.login(this.form.get("username")?.value, this.form.get("password")?.value);
    }

    public ngOnDestroy(): void {
        this.$loadings?.unsubscribe();
    }
}
