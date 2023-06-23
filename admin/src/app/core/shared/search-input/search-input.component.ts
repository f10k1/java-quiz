import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, debounceTime } from 'rxjs';

@Component({
    selector: 'app-search-input',
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

    @Input() label: string | undefined;
    @Input() searchFunc: Function = () => { return []; };
    @Input() display: any;
    @Input() pickedByDefault: any[] = [];

    @Output() pickedItemsChanged: EventEmitter<any[]> = new EventEmitter();

    public form = this._fb.group({
        searchString: '',
        picked: this._fb.array([]),
        suggesters: this._fb.array([])
    });

    private $pickedItems: Subscription | undefined;
    private $suggesterChangesSubscriptions: Subscription = new Subscription();
    private $value: Subscription | undefined;

    public pickedItems: any[] = [];
    public searchResult: any[] = [];

    constructor(private _fb: FormBuilder) { }

    ngOnInit(): void {
        this.$pickedItems = this.form.controls.picked.valueChanges.subscribe((values) => {
            const index = values.findIndex(value => value === false);
            if (index === -1) return;
            this.form.controls.picked.removeAt(index);
            this.pickedItems.splice(index, 1);
            this.pickedItemsChanged.emit(this.pickedItems);
            this.search(this.form.get("searchString")?.value);
        });
        this.$value = this.form.get("searchString")?.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
            this.search(value);
        });
        this.pickedByDefault.forEach((value) => this.addToPicked(value))
    }

    private search = (value: any) => {
        this.$suggesterChangesSubscriptions.unsubscribe();
        this.$suggesterChangesSubscriptions.closed = false;
        this.form.controls.suggesters.clear();
        this.searchResult = [];
        if (value && value.length <= 3) return;
        setTimeout(() => {
            this.searchResult = this.searchFunc(value);
            this.searchResult.forEach((result: any) => {
                const control = this._fb.control(false);
                this.form.controls.suggesters.push(control);
                const sub = control.valueChanges.subscribe(checkboxValue => {
                    if (checkboxValue == true) {
                        this.addToPicked(result);
                    }
                });
                this.$suggesterChangesSubscriptions.add(sub);
            });
        }, 0);
    };

    private addToPicked(result: any) {
        this.pickedItems.push(result);
        const control = this._fb.control(true);
        this.form.controls.picked.push(control);

        this.pickedItemsChanged.emit(this.pickedItems);
        this.search(this.form.get("searchString")?.value);
    }

    public trackByResult(index: number, item: any) {
        return item.id;
    }
}
