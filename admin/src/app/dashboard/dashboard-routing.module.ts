import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';
import { AnswersComponent } from './answers/answers.component';

const routes: Routes = [
    { path: "", component: QuestionsComponent },
    { path: "questions", component: QuestionsComponent },
    { path: "answers", component: AnswersComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
