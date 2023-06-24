import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import Question from '../types/question.interface';
import { HttpClient } from '@angular/common/http';
import { SystemService } from './system.service';
import { NOTIFICATION_TYPES } from '../types/notification.interface';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private $questions: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);

    public questions: Observable<Question[]> = this.$questions.asObservable();

    constructor(private _httpClient: HttpClient, private _systemService: SystemService) { }

    private alterReturnedQuestion(question: any) {
        if (!question.file) return question;
        const newQuestion = {
            ...question, attachment: {
                name: question.fileName,
                url: question.file
            }
        };
        delete newQuestion.fileName;
        delete newQuestion.file;
        return newQuestion;
    }

    public getAllQuestions(): void {
        this._httpClient.get<Question[]>('api/question/all').pipe(map((data => data.map(this.alterReturnedQuestion)))).subscribe((res: Question[]) => {
            this.$questions.next(res);
        });
    }

    public saveQuestion(data: Omit<Question, "id">): void {
        this._systemService.addLoading("question-sent");
        this._systemService.addFlag({ "QUESTION_REQUEST": "SENT" });
        this._httpClient.put<Question>('api/question/', data).pipe(map(this.alterReturnedQuestion)).subscribe(
            {
                next: (res: Question) => {
                    this._systemService.removeLoading("question-sent");
                    this._systemService.patchFlag("QUESTION_REQUEST", "SUCCESS");
                    if ((data as Question).id) {
                        let value: Question[] = this.$questions.getValue().map((question) => {
                            if (question.id != (data as Question).id) return question;
                            return res;
                        });
                        this.$questions.next([...value]);
                    }
                    else this.$questions.next([...this.$questions.getValue(), res]);
                },
                error: (err: any) => {
                    this._systemService.removeLoading("question-sent");
                    this._systemService.patchFlag("QUESTION_REQUEST", "ERROR");
                    this._systemService.addNotification({
                        content: "Coś poszło nie tak podczas łączenia z serwerem",
                        action: "ok",
                        type: NOTIFICATION_TYPES.ERROR
                    });
                }
            });
    };

    public deleteQuestion(id: number): void {
        this._systemService.addLoading("question-sent");
        this._systemService.addFlag({ "QUESTION_REQUEST": "SENT" });
        this._httpClient.delete<Question>(`api/question/${id}`,).subscribe(
            {
                next: (res: Question) => {
                    let value = this.$questions.getValue().filter((value) => value.id != id);
                    this._systemService.removeLoading("question-sent");
                    this._systemService.patchFlag("QUESTION_REQUEST", "SUCCESS");
                    this.$questions.next([...value]);
                },
                error: (err: any) => {
                    this._systemService.removeLoading("question-sent");
                    this._systemService.patchFlag("QUESTION_REQUEST", "ERROR");
                    this._systemService.addNotification({
                        content: "Coś poszło nie tak podczas łączenia z serwerem",
                        action: "ok",
                        type: NOTIFICATION_TYPES.ERROR
                    });
                }
            }
        );
    }
}
