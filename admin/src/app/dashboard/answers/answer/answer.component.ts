import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AnswerService } from 'src/app/core/services/answer.service';
import { SystemService } from 'src/app/core/services/system.service';
import Answer from 'src/app/core/types/answer.interface';
import Question from 'src/app/core/types/question.interface';

@Component({
    selector: 'app-answer',
    templateUrl: './answer.component.html',
    styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit, OnDestroy {

    @ViewChild('fileInput') public fileInput: ElementRef<HTMLInputElement> | null = null;

    public form = this._fb.group({
        title: ['', Validators.required],
        correct: false,
        questions: this._fb.group({
            search: '',
        }),
    });
    private $loadings: Subscription | null = null;
    public answerSentLoading: Boolean = false;

    private $flags: Subscription | null = null;

    public attachmentFile: any | null = null;
    public pickedQuestions: number[] = [];

    constructor(private _fb: FormBuilder, private _systemService: SystemService, private _answerService: AnswerService, @Inject(MAT_DIALOG_DATA) public data: Answer, private _dialogRef: MatDialogRef<AnswerComponent>) {
        if (data) {
            this.form.get('title')?.setValue(data.title);
            this.form.get('correct')?.setValue(data.correct);
        }
    };

    ngOnInit(): void {
        this.$loadings = this._systemService.loadings.subscribe((value: any) => {
            this.answerSentLoading = value['answer-sent'] ?? false;
        });
        this.$flags = this._systemService.flags.subscribe((value: any) => {
            if (value['ANSWER_REQUEST'] == 'SUCCESS') {
                this._systemService.removeFlag('ANSWER_REQUEST');
                this._dialogRef.close();
            }
            else if (value['ANSWER_REQUEST'] == 'ERROR') {
                this._systemService.removeFlag('ANSWER_REQUEST');
            }
        });
    }

    ngOnDestroy(): void {
        this.$loadings?.unsubscribe();
        this.$flags?.unsubscribe();
    }

    public saveAnswer() {
        if (!this.form.valid) return;

        const data: Omit<Answer, 'id'> = {
            title: <string>this.form.get("title")?.value,
            correct: <boolean>this.form.get("correct")?.value,
            questions: this.pickedQuestions
        };

        if (this.data) {
            (data as Answer).id = this.data.id;
        }

        this._answerService.saveAnswer(data);
    }

    public deleteAnswer() {
        if (this.data) {
            this._answerService.deleteAnswer(this.data.id);
        }
    }
}
