import { Pipe, PipeTransform } from '@angular/core';
import { QUESTION_TYPES } from '../types/question.interface';

@Pipe({ name: 'questionTypeToText' })
export class QuestionTypeToText implements PipeTransform {
    transform(value: QUESTION_TYPES): string {
        switch (value) {
            case QUESTION_TYPES.MULTI_CHOICE:
                return 'Wielokrotnego wyboru';
            case QUESTION_TYPES.ONE_CHOICE:
                return 'Jedna poprawna odpowiedź';
            case QUESTION_TYPES.TRUE_FALSE:
                return "Prawda/Fałsz"
            default:
                return "Nie rozpoznano typu"
        }

    }
}
