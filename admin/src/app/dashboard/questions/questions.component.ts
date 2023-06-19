import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { QuestionService } from 'src/app/core/services/question.service';
import Question from 'src/app/core/types/question.interface';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, AfterViewInit {

    private $questions: Subscription | undefined;

    public questionsData: MatTableDataSource<Question> = new MatTableDataSource([] as Question[]);
    public displayColumns: string[] = ["name", "answers", "attachments"];

    @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

    constructor(private _questionService: QuestionService) { }

    ngOnInit(): void {
        this.$questions = this._questionService.questions.subscribe((value: Question[]) => {
            value = [...value, ...value, ...value];
            this.questionsData.data = value;
        });

        this._questionService.getAllQuestions();
    }

    ngAfterViewInit() {
        console.log(this.questionsData);
        this.questionsData.paginator = this.paginator;
    }
}
