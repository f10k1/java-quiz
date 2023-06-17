import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    Validators,
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import FormErrorStateMatcher from './core/input-error.matcher';
import { AuthService } from './core/services/auth.service';
import User from './core/types/user.interface';
import { SystemService } from './core/services/system.service';
import Loadings from './core/types/loading.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    public form: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    public loginLoading: boolean = false;

    public matcher = new FormErrorStateMatcher();

    public user: User | undefined;

    constructor(private fb: FormBuilder, private authService: AuthService, private systemService: SystemService) { }

    public ngOnInit(): void {
        this.systemService.loadings.subscribe((value: Loadings) => {
            this.loginLoading = value['login'] ?? false;
        });
        this.authService.user.subscribe((value: User) => {
            this.user = value;
        });
    }

    public submitLogin(): void {
        if (!this.form.valid) return;

        this.authService.login(this.form.get("username")?.value, this.form.get("password")?.value);

    }

}
