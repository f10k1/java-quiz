import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { QuestionService } from '../core/services/question.service';
import { Observable } from 'rxjs';
import Question from '../core/types/question.interface';
import { AnswerService } from '../core/services/answer.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public $questions: Observable<Question[]> = this._questionService.questions;

    constructor(private _authService: AuthService, private _questionService: QuestionService, private _answerService: AnswerService) { };

    public ngOnInit(): void {
        this._questionService.getAllQuestions();
        this._answerService.getAllAnswers();
    }

    public logout() {
        this._authService.logout();
    }
}
