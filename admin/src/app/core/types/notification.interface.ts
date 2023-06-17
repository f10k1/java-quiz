export default interface Notification {
    type: NOTIFICATION_TYPES,
    content: string,
    actions?: boolean,
    closable?: boolean,
    timespan?: number,
    onAccept?: Function,
    onReject?: Function
}

enum NOTIFICATION_TYPES {
    ERROR,
    SUCCESS,
    INFO,
    WARNING
}
