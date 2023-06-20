import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/core/services/question.service';
import { SystemService } from 'src/app/core/services/system.service';
import Answer from 'src/app/core/types/answer.interface';
import Question, { QUESTION_TYPES } from 'src/app/core/types/question.interface';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {

    public QUESTION_TYPES = QUESTION_TYPES;

    @ViewChild('fileInput') public fileInput: ElementRef<HTMLInputElement> | null = null;

    public form = this._fb.group({
        name: ['', Validators.required],
        answers: this._fb.group({
            search: '',
            pickedAnswers: null
        }),
        type: QUESTION_TYPES.ONE_CHOICE,
        active: false
    });
    private $loadings: Subscription | null = null;
    public questionSentLoading: Boolean = false;

    private $flags: Subscription | null = null;

    public attachmentFile: any | null = null;
    public pickedAnswers: Answer[] = [];

    constructor(private _fb: FormBuilder, private _systemService: SystemService, private _questionService: QuestionService, @Inject(MAT_DIALOG_DATA) public data: Question, private _dialogRef: MatDialogRef<QuestionComponent>) {
        if (data) {
            this.form.get('name')?.setValue(data.name);
            this.form.get('type')?.setValue(data.type);
            this.form.get('active')?.setValue(data.active);
            this.attachmentFile = this.data.attachment;
        }
    };

    ngOnInit(): void {
        this.$loadings = this._systemService.loadings.subscribe((value: any) => {
            this.questionSentLoading = value['question-sent'] ?? false;
        });
        this.$flags = this._systemService.flags.subscribe((value: any) => {
            if (value['QUESTION_REQUEST'] == 'SUCCESS') {
                this._systemService.removeFlag('QUESTION_REQUEST');
                this._dialogRef.close();
            }
            else if (value['QUESTION_REQUEST'] == 'ERROR') {
                this._systemService.removeFlag('QUESTION_REQUEST');
            }
        });
    }

    ngOnDestroy(): void {
        this.$loadings?.unsubscribe();
        this.$flags?.unsubscribe();
    }

    public fileSelected() {
        if (typeof (FileReader) !== 'undefined' && this.fileInput?.nativeElement.files?.length) {
            const reader = new FileReader();
            const file: File = this.fileInput?.nativeElement.files[0];
            reader.onload = (event: any) => {
                this.attachmentFile = {
                    name: file.name,
                    url: event.target.result,
                };

            };

            reader.readAsDataURL(file);
        }
    }
    public removeFile() {
        if (this.fileInput?.nativeElement.files?.length) {
            this.fileInput.nativeElement.files = null;
            this.attachmentFile = null;
        }
    }

    public saveQuestion() {
        if (!this.form.valid) return;
        if (this.data) {
            const data: Partial<Question> = {};
            console.log(this.data)

            if (this.form.get("name")?.dirty) data.name = <string>this.form.get("name")?.value;
            if (this.form.get("type")?.dirty) data.type = <QUESTION_TYPES>this.form.get("type")?.value;
            if (this.form.get("active")?.dirty) data.active = <boolean>this.form.get("active")?.value;
            if (this.attachmentFile !== this.data.attachment) data.attachment = this.attachmentFile;
            this._questionService.editQuestion(this.data.id, data);
            return;
        }

        const data: Omit<Question, 'id'> = {
            name: <string>this.form.get('name')?.value,
            type: <QUESTION_TYPES>this.form.get('type')?.value,
            active: <boolean>this.form.get('active')?.value
        };

        if (this.pickedAnswers.length) {
            data.answers = this.pickedAnswers;
        }

        if (this.attachmentFile) {
            data.attachment = this.attachmentFile;
        }

        this._questionService.addQuestion(data);
    }
}
