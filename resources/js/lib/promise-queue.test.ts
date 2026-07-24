import { describe, expect, it } from 'vitest';

import { PromiseQueue } from './promise-queue';

describe('PromiseQueue', () => {
    it('runs waiting tasks one at a time in submission order', async () => {
        const queue = new PromiseQueue();
        const events: string[] = [];
        let releaseFirst: () => void = () => undefined;
        const firstGate = new Promise<void>((resolve) => {
            releaseFirst = resolve;
        });

        const first = queue.enqueue(async () => {
            events.push('first:start');
            await firstGate;
            events.push('first:end');
        });
        const second = queue.enqueue(async () => {
            events.push('second:start');
            events.push('second:end');
        });

        await Promise.resolve();
        expect(events).toEqual(['first:start']);

        releaseFirst();
        await Promise.all([first, second]);

        expect(events).toEqual(['first:start', 'first:end', 'second:start', 'second:end']);
    });

    it('continues after a failed task', async () => {
        const queue = new PromiseQueue();
        const events: string[] = [];

        const failed = queue.enqueue(() => Promise.reject(new Error('save failed')));
        const next = queue.enqueue(async () => {
            events.push('next');
        });

        await expect(failed).rejects.toThrow('save failed');
        await next;

        expect(events).toEqual(['next']);
    });
});
