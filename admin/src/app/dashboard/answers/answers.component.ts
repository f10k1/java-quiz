import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AnswerService } from 'src/app/core/services/answer.service';
import answer from 'src/app/core/types/answer.interface';
import { AnswerComponent } from './answer/answer.component';
// import { answerComponent } from './answers/answer.component';

@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit, AfterViewInit {

    private $answers: Subscription | undefined;

    public answersData: MatTableDataSource<answer> = new MatTableDataSource([] as answer[]);
    public displayColumns: string[] = ["active", "name", "questions", "correct"];

    @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

    constructor(private _answerService: AnswerService, private _dialog: MatDialog) { }

    ngOnInit(): void {
        this.$answers = this._answerService.answers.subscribe((value: answer[]) => {
            this.answersData.data = value;
        });
    }

    ngAfterViewInit() {
        this.answersData.paginator = this.paginator;
    }

    public addAnswer() {
        this._dialog.open(AnswerComponent);
    }

    public editAnswer(answer: answer) {
        this._dialog.open(AnswerComponent, {
        data: answer
        });
    }
}
