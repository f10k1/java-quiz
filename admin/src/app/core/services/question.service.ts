import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Question from '../types/question.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private $questions: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);

    public questions: Observable<Question[]> = this.$questions.asObservable();

    constructor(private _httpClient: HttpClient) { }

    public getAllQuestions(): void {
        this._httpClient.get<Question[]>('question/all').subscribe((res: Question[]) => {
            this.$questions.next(res);
        });
    }

}
