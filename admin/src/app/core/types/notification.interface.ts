export default interface Notification {
    type: NOTIFICATION_TYPES,
    content: string,
    timespan?: number,
    onDismiss?: Function,
    action: string,
}

export enum NOTIFICATION_TYPES {
    ERROR,
    SUCCESS,
}
