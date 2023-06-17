import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import FormErrorStateMatcher from '../core/input-error-matcher';
import { AuthService } from '../core/services/auth.service';
import User from '../core/types/user.interface';
import { SystemService } from '../core/services/system.service';
import Loadings from '../core/types/loading.interface';
import Message from '../core/types/message.interface';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    @Output() loggedIn: EventEmitter<void> = new EventEmitter<void>();

    public form: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    public matcher = new FormErrorStateMatcher();
    public loginLoading: boolean = false;
    public jwtLoading: boolean = false;

    public user: User | undefined;
    public messages: Message = {};

    private $loadings: Subscription | undefined;
    private $user: Subscription | undefined;
    private $messages: Subscription | undefined;


    constructor(private fb: FormBuilder, private authService: AuthService, private systemService: SystemService) { }

    public ngOnInit(): void {

        setTimeout(() => {
            this.authService.recoverUser();

            this.$loadings = this.systemService.loadings.subscribe((value: Loadings) => {
                this.loginLoading = value['login'] ?? false;
                this.jwtLoading = value['jwt'] ?? false;
            });
            this.$user = this.authService.user.subscribe((value: User) => {
                this.loggedIn.emit();
                this.user = value;
            });
            this.$messages = this.systemService.messages.subscribe((value: Message) => {
                this.messages = value;
            });
        }, 10000)

    }

    public submitLogin(): void {
        if (!this.form.valid) return;

        this.authService.login(this.form.get("username")?.value, this.form.get("password")?.value);
    }

    public ngOnDestroy(): void {
        this.$loadings?.unsubscribe();
        this.$user?.unsubscribe();
        this.$messages?.unsubscribe();
    }
}
