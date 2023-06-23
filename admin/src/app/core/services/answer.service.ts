import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SystemService } from './system.service';
import { NOTIFICATION_TYPES } from '../types/notification.interface';
import Answer from '../types/answer.interface';

@Injectable({
    providedIn: 'root'
})
export class AnswerService {

    private $answers: BehaviorSubject<Answer[]> = new BehaviorSubject<Answer[]>([]);

    public answers: Observable<Answer[]> = this.$answers.asObservable();

    constructor(private _httpClient: HttpClient, private _systemService: SystemService) { }

    public getAllAnswers(): void {
        this._httpClient.get<Answer[]>('answer/all').subscribe((res: Answer[]) => {
            this.$answers.next(res);
        });
    }

    public saveAnswer(data: Omit<Answer, "id">): void {
        this._systemService.addLoading("answer-sent");
        this._systemService.addFlag({ "ANSWER_REQUEST": "SENT" });
        this._httpClient.put<Answer>('answer/', data).subscribe(
            {
                next: (res: Answer) => {
                    this._systemService.removeLoading("answer-sent");
                    this._systemService.patchFlag("ANSWER_REQUEST", "SUCCESS");
                    if ((data as Answer).id) {
                        let value: Answer[] = this.$answers.getValue().map((answer) => {
                            if (answer.id != (data as Answer).id) return answer;
                            return res;
                        });
                        this.$answers.next([...value]);
                    }
                    else this.$answers.next([...this.$answers.getValue(), res]);
                },
                error: (err: any) => {
                    this._systemService.removeLoading("answer-sent");
                    this._systemService.patchFlag("ANSWER_REQUEST", "ERROR");
                    this._systemService.addNotification({
                        content: "Coś poszło nie tak podczas łączenia z serwerem",
                        action: "ok",
                        type: NOTIFICATION_TYPES.ERROR
                    });
                }
            });
    };

    public deleteAnswer(id: number): void {
        this._systemService.addLoading("answer-sent");
        this._systemService.addFlag({ "answer_REQUEST": "SENT" });
        this._httpClient.delete<Answer>(`answer/${id}`,).subscribe(
            {
                next: (res: Answer) => {
                    let value = this.$answers.getValue().filter((value) => value.id != id);
                    this._systemService.removeLoading("answer-sent");
                    this._systemService.patchFlag("answer_REQUEST", "SUCCESS");
                    this.$answers.next([...value]);
                },
                error: (err: any) => {
                    this._systemService.removeLoading("answer-sent");
                    this._systemService.patchFlag("answer_REQUEST", "ERROR");
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
