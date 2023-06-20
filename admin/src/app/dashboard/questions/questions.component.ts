import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/core/services/question.service';
import Question from 'src/app/core/types/question.interface';
import { QuestionComponent } from './question/question.component';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, AfterViewInit {

    private $questions: Subscription | undefined;

    public questionsData: MatTableDataSource<Question> = new MatTableDataSource([] as Question[]);
    public displayColumns: string[] = ["active", "name", "answers", "attachment", "type"];

    @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

    constructor(private _questionService: QuestionService, private _dialog: MatDialog) { }

    ngOnInit(): void {
        this.$questions = this._questionService.questions.subscribe((value: Question[]) => {
            this.questionsData.data = value;
        });
    }

    ngAfterViewInit() {
        this.questionsData.paginator = this.paginator;
    }

    public addQuestion() {
        this._dialog.open(QuestionComponent);
    }

    public editQuestion(question: Question) {
        this._dialog.open(QuestionComponent, {
            data: question
        });
    }
}
