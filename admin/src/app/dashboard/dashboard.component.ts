import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { QuestionService } from '../core/services/question.service';
import { Observable } from 'rxjs';
import Question from '../core/types/question.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    private $questions: Observable<Question[]> = this._questionService.questions;

    constructor(private _authService: AuthService, private _questionService: QuestionService) { };

    public ngOnInit(): void {
        this._questionService.getAllQuestions();
    }

    public logout() {
        this._authService.logout();
    }
}
