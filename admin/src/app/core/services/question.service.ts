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

    public getAllQuestions(): void {
        this._httpClient.get<Question[]>('question/all').pipe(map((value: any) => {
            return value.map((question: any) => {
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
            });

        })).subscribe((res: Question[]) => {
            this.$questions.next(res);
        });
    }

    public addQuestion(data: Omit<Question, "id">): void {
        this._systemService.addLoading("question-sent");
        this._systemService.addFlag({ "QUESTION_REQUEST": "SENT" });
        setTimeout(() => {
            this._httpClient.post<Question>('question/', data).subscribe(
                {
                    next: (res: Question) => {
                        this._systemService.removeLoading("question-sent");
                        this._systemService.patchFlag("QUESTION_REQUEST", "SUCCESS");
                        this.$questions.next([...this.$questions.getValue(), res]);
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
        }, 1000)

    };


    public editQuestion(id: number, data: Partial<Question>): void {
        this._systemService.addLoading("question-sent");
        this._systemService.addFlag({ "QUESTION_REQUEST": "SENT" });
        console.log(data)
        this._httpClient.patch<Question>(`question/${id}`, data).subscribe(
            {
                next: (res: Question) => {
                    let oldValue = this.$questions.getValue().find((value) => {
                        value.id == id;
                    });
                    oldValue = res;
                    this._systemService.removeLoading("question-sent");
                    this._systemService.patchFlag("QUESTION_REQUEST", "SUCCESS");
                    this.$questions.next([...this.$questions.getValue(), oldValue]);
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
