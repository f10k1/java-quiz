import Answer from "./answer.interface";

export default interface Question {
    id: number,
    name: string,
    answers?: number[] | Answer[],
    active: boolean,
    type: QUESTION_TYPES,
    attachment?: {
        name: string,
        url: string;
    };
}

export enum QUESTION_TYPES {
    MULTI_CHOICE = "MULTI_CHOICE",
    TRUE_FALSE = "TRUE_FALSE",
    ONE_CHOICE = "ONE_CHOICE"
}
