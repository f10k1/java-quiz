import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import PrepareInterceptor from './core/prepare-request-interceptor';
import { CustomErrorHandler } from './core/custom-error-handler';
import { LoginComponent } from './login/login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationComponent } from './share/notification/notification.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotificationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatSlideToggleModule,
        BrowserAnimationsModule,
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatProgressBarModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: PrepareInterceptor, multi: true },
        { provide: ErrorHandler, useClass: CustomErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
