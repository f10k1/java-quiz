import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, Subscription } from 'rxjs';
import { AnswerService } from 'src/app/core/services/answer.service';
import { QuestionService } from 'src/app/core/services/question.service';
import { SystemService } from 'src/app/core/services/system.service';
import { SearchInputComponent } from 'src/app/core/shared/search-input/search-input.component';
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

    @ViewChild(SearchInputComponent) searchInputComponent: SearchInputComponent | null = null;

    public form = this._fb.group({
        name: ['', Validators.required],
        type: QUESTION_TYPES.ONE_CHOICE,
        active: false
    });
    private $loadings: Subscription | null = null;
    public questionSentLoading: Boolean = false;

    private $flags: Subscription | null = null;

    public attachmentFile: any | null = null;
    public pickedAnswers: Answer[] = [];

    private $answers: Subscription | null = null;
    public answers: Answer[] | null = null;


    constructor(private _fb: FormBuilder, private _answerService: AnswerService, private _systemService: SystemService, private _questionService: QuestionService, @Inject(MAT_DIALOG_DATA) public data: Question, private _dialogRef: MatDialogRef<QuestionComponent>) {
        if (this.data) {
            this.form.get('name')?.setValue(this.data.name);
            this.form.get('type')?.setValue(this.data.type);
            this.form.get('active')?.setValue(this.data.active);
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
        this.$answers = this._answerService.answers.subscribe((value) => {
            this.answers = value;
        });
        // this.form.get("type")?.valueChanges.subscribe(() => this.searchInputComponent.reset())
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
                this.form.markAsDirty();
            };

            reader.readAsDataURL(file);
        }
    }
    public removeFile() {
        if (this.attachmentFile && this.fileInput) {
            this.fileInput.nativeElement.files = null;
            this.attachmentFile = null;
            this.form.markAsDirty();
        }
    }

    public saveQuestion() {
        if (!this.form.valid) return;

        const data: Omit<Question, 'id'> = {
            name: <string>this.form.get('name')?.value,
            type: <QUESTION_TYPES>this.form.get('type')?.value,
            active: <boolean>this.form.get('active')?.value,
            attachment: this.attachmentFile
        };

        if (this.pickedAnswers.length) {
            data.answers = this.pickedAnswers.map(answer => answer.id);
        }

        if (this.data) {
            (data as Question).id = this.data.id;
        }

        this._questionService.saveQuestion(data);
    }

    public deleteQuestion() {
        if (this.data) {
            this._questionService.deleteQuestion(this.data.id);
        }
    }

    public searchForAnswers = (searchString: string) => {
        return this.answers?.filter(answer => {
            if (this.pickedAnswers.find(picked => picked.id === answer.id)) return false;
            if (answer.correct && this.data?.type == QUESTION_TYPES.ONE_CHOICE && this.pickedAnswers.find(answer => answer.correct)) return false;
            return answer.title.includes(searchString);
        });
    };

    public updatePickedAnswers(answers: Answer[]) {
        this.pickedAnswers = answers;
        this.form.markAsDirty();
    }
}
