class Queue {
    constructor(func, max) {
        this.jobs = []
        this.func = func
        this.totalConRequests = 0
        this.max = max ? max : 5
        this.progress = false;
        this.totalLinks = 0;
    }

    isStop() {
        return this.progress;
    }

    StopCrawler() {
        this.progress = true;
    }

    push(data) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.jobs.push({
                data: data,
                resolve: resolve,
                reject: reject
            });
            if (!self.progress) {
                self.progress = true;
                self.run();
            }
        });
    };

    async run() {
        var self = this;
        var tasks = self.jobs.splice(0, this.max);
        const promises = new Array(self.max).fill(Promise.resolve());
        // Parallel Requests---Recursively chain the next Promise to the currently executed Promise
        function chainNext(p) {
            if (tasks.length) {
                const arg = tasks.shift();
                return p.then(() => {
                    const operationPromise = self.func(arg.data);
                    self.dequeue()
                    return chainNext(operationPromise);
                })
            }
            return p;
        }
        
        await Promise.all(promises.map(chainNext)).then(()=>{
            if (this.jobs.length ) {
                this.run();
            } else {
                console.log('DONE');
                console.log("Total crawled Links", this.totalLinks);
                this.progress = false;
                return null
            }
        })
    };

    ConRequests() {
        return this.totalConRequests
    }

    isEmpty() {
        return this.jobs.length === 0
    }

    dequeue() {
        if (this.isEmpty()) return null
        return this.jobs.shift()
    }
}

export default Queue;