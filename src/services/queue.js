function Queue(func, max) {
    this.jobs = [];
    this.func = func;
    this.totalConRequests = 0;
    this.max = max ? max : 5;
    // this.progress = true;
}

Queue.prototype.isStop = function () {
    return this.progress;
}

Queue.prototype.ProgressStop = function () {
    this.progress = false
}

Queue.prototype.push = function (data) {
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

Queue.prototype.run = async function () {
    // console.log("--------------------");
    var self = this;
    var tasks = self.jobs.slice();
    const promises = new Array(self.max).fill(Promise.resolve());

    // Parallel Requests---Recursively chain the next Promise to the currently executed Promise
    function chainNext(p) {
        if (tasks.length) {
            const arg = tasks.shift();            
            return p.then(() => {
                self.totalConRequests++
                const operationPromise = self.func(arg.data);
                return chainNext(operationPromise);
            })
        }
        return p;
    }
    await Promise.all(promises.map(chainNext)).then(this.next.bind(this));
};

Queue.prototype.ConRequests = function () {
    return this.totalConRequests
}

Queue.prototype.next = function () {
    if (this.jobs.length) {
        this.run();
    } else {
        this.progress = false;
        console.log("false");
    }
};

Queue.prototype.isEmpty = function () {
    return this.jobs.length === 0
}

Queue.prototype.dequeue = function (string) {
    if (this.isEmpty()) return null
    return this.jobs.shift()
}

export default Queue;