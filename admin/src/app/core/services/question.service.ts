import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
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
        this._httpClient.get<Question[]>('question/all').pipe(map((value: any) => {
            return value.map((question: any) => {
                if (!question.file) return question
                const newQuestion = {
                    ...question, attachment: {
                        name: question.fileName,
                        url: question.file
                    }
                };
                delete newQuestion.fileName;
                delete newQuestion.file;
                return newQuestion;
            });

        })).subscribe((res: Question[]) => {
            this.$questions.next(res);
        });
    }

    public addQuestion(data: Omit<Question, "id">): void {
        this._httpClient.post<Question>('question/', data).subscribe((res: Question) => {
            this.$questions.next([...this.$questions.getValue(), res]);
        });
    }

}
