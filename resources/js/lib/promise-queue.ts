export class PromiseQueue {
    private tail: Promise<void> = Promise.resolve();

    enqueue(task: () => Promise<void>): Promise<void> {
        const result = this.tail.then(task, task);
        this.tail = result.catch(() => undefined);

        return result;
    }
}
