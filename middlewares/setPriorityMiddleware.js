const setPriorityMiddleware = function(next) {
    const now = new Date();
    const dueDate = new Date(this.due_date);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
        this.priority = 0; 
    } else if (daysDiff <= 2) {
        this.priority = 1; 
    } else if (daysDiff <= 4) {
        this.priority = 2; 
    } else {
        this.priority = 3; 
    }

    next();
};

module.exports = setPriorityMiddleware;