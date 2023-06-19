import Answer from "./answer.interface";

export default interface Question {
    id: number,
    name: string,
    answers: Answer[];
}
