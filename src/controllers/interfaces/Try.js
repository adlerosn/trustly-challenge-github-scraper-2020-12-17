/**
 * Wraps a computation side-effects' in an object that can be worked on.
 *
 * Inspired by Rust's "Result" and Scala's "Try".
 */
export default class Try {
    /**
     * Constructs a Try wrapper.
     *
     * @param {any} result The result from success
     * @param {Error} failure The error from failure
     */
    constructor(result, failure) {
        this.kind = 'Try';
        this.status = (result !== undefined) ? 'result' : 'failure';
        this.result = result;
        this.failure = failure;
    }

    isFailure() {
        return this.result === undefined;
    }

    isResult() {
        return this.result !== undefined;
    }

    get displayable() {
        return new Try(
            this.result,
            this.failure === undefined ? undefined : {
                constructor: { name: this.failure.constructor.name },
                name: this.failure.name,
                message: this.failure.message,
            },
        );
    }

    static buildResult(result) {
        return new this(result, undefined);
    }

    static buildFailure(failure) {
        return new this(undefined, failure);
    }

    static buildFromAsyncClosure(asyncClosure) {
        return this.buildFromPromise(asyncClosure());
    }

    static async buildFromPromise(promise) {
        try {
            return this.buildResult(await promise);
        } catch (e) {
            return this.buildFailure(e);
        }
    }

    static buildFromClosure(closure) {
        try {
            return this.buildResult(closure());
        } catch (e) {
            return this.buildFailure(e);
        }
    }
}
