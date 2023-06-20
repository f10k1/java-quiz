import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { QuestionsComponent } from './questions/questions.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QuestionTypeToText } from '../core/pipes/question-type-to-text.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { QuestionComponent } from './questions/question/question.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        DashboardComponent,
        QuestionsComponent,
        QuestionTypeToText,
        QuestionComponent,

    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MatSidenavModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatDialogModule,
        MatToolbarModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule
    ],
    exports: [
        DashboardComponent
    ]
})
export class DashboardModule { }
