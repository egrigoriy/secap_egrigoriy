/**
 * Receives a query object as parameter and sends it as Ajax request to the POST /query REST endpoint.
 *
 * @param query The query object
 * @returns {Promise} Promise that must be fulfilled if the Ajax request is successful and be rejected otherwise.
 */

CampusExplorer.sendQuery = (query) => {
    return new Promise((resolve, reject) => {
        console.log("send query");
        const request = new XMLHttpRequest();
        request.open("POST", "/query", true);
        request.setRequestHeader("Content-type", "application/json");
        request.responseType = "json";

        request.onload = function () {
            const resObject = request.response;
            if (this.status === 200) {
                resolve(resObject);
            } else {
                reject(resObject);
            }
        };
        request.onerror = function () {
            reject(request.response);
        }
        console.log("query to send to Server in JSON format: " + JSON.stringify(query));
        request.send(query);
    });
};
