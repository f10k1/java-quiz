import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/core/services/question.service';
import Answer from 'src/app/core/types/answer.interface';
import Question, { QUESTION_TYPES } from 'src/app/core/types/question.interface';

@Component({
    selector: 'app-add-question',
    templateUrl: './add-question.component.html',
    styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {

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

    public attachmentFile: any | null = null;
    public pickedAnswers: Answer[] = [];

    constructor(private _fb: FormBuilder, private _questionService: QuestionService) { };

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

        this._questionService.addQuestion(data)
    }
}
