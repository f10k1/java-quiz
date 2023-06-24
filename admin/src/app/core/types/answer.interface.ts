import Question from "./question.interface";

export default interface Answer{
    id: number,
    title: string,
    correct: boolean,
    questions?: number[] | Question[]
}
