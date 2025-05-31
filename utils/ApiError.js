// This code is written because of handling Api Error we dont want to remember first we provide statuscode then message ect . this code standardized for api error handling npm provide error class which has this properties so we can inherit that class 

class ApiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statuscode = statuscode;
        this.errors = errors;
        this.data = null;
        this.success = false;
        this.message = message;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }

}

export { ApiError }