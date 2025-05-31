// Server Status code
// Informational Response(100-199)
// Success Response (200-299)
// Redirection Message(300-399)
// Client side Error(400-499)
// Server Response Error (500-599)


class Apiresponse {
    constructor(statuscode, data, message = "success") {
        this.statuscode = statuscode;
        this.data = data;
        this.message = message;
        this.success = statuscode < 400;
    }
}