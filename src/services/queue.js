function Queue(func, max) {
    this.jobs = [];
    this.func = func;
    this.max = max ? max : 10;
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

Queue.prototype.run = function() {
    console.log("--------------------");
    var self = this;
    var tasks = self.jobs.splice(0, self.max);
    console.log("tasks:", tasks.map(obj => obj.data));

    Promise.all(
        tasks.map(function(task){
            return self.func(task.data).then(task.resolve, task.reject);
        }
    )).then(this.next.bind(this));
};

Queue.prototype.next = function () {
    if (this.jobs.length) {
        this.run();
    } else {
        this.progress = false;
    }
};

export default Queue;