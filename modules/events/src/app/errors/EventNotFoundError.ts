export class EventNotFoundError extends Error {
    constructor() {
        super("Event Not Found");
    }
}