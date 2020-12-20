export default class Job {
    constructor(workload, fetchUrl, isCached) {
        this.workload = workload;
        this.fetchUrl = fetchUrl;
        this.isCached = isCached;
    }

    static build(workload, fetchUrl, isCached) {
        return new this(workload, fetchUrl, isCached);
    }
}
