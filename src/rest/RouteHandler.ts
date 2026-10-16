import InsightFacade from "../controller/InsightFacade";

import restify = require("restify");
import Log from "../Util";
import * as fs from "fs";

export class RouteHandler {
    public static addDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        // Log.trace("RouteHandler::addDataset(..) - params: " + JSON.stringify(req.params));

        try {
            const id = req.params.id;
            const kind = req.params.kind;
            const content = new Buffer(req.params.body).toString("base64");

            Log.trace("RouteHandler::addDataset(..) - extracted params: " + "id: " + id + ", kind: " + kind);

            RouteHandler.facade.addDataset(id, content, kind)
                .then((result) => {
                    Log.trace("RouteHandler::addDataset(..)addDataset - SUCCESS: " + JSON.stringify(result));
                    res.json(result.code, result.body);
                })
                .catch((err) => {
                    Log.trace("RouteHandler::addDataset(..) - ERROR ON FACADE SIDE: " + JSON.stringify(err));
                    res.json(err.code, err.body);
                });
        } catch (err) {
            Log.trace("RouteHandler::addDataset(..) - ERROR: " + JSON.stringify(err));
            res.json(400, {error: err.message});
        }

        return next();
    }

    public static removeDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace("RouteHandler::removeDataset(..) - params: " + JSON.stringify(req.params));

        try {
            const id = req.params.id;

            RouteHandler.facade.removeDataset(id)
                .then((result) => {
                    Log.trace("RouteHandler::removeDataset(..) - SUCCESS: " + JSON.stringify(result));
                    res.json(result.code, result.body);
                })
                .catch((err) => {
                    Log.trace("RouteHandler::removeDataset(..) - ERROR ON FACADE SIDE: " + JSON.stringify(err));
                    res.json(err.code, err.body);
                });
        } catch (err) {
            Log.trace("RouteHandler::removeDataset(..) - ERROR: " + JSON.stringify(err));
            res.json(404, {error: err.message});
        }

        return next();
    }

    public static listDatasets(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace("RouteHandler::listDatasets(..) entry");

        RouteHandler.facade.listDatasets()
            .then((result) => {
                Log.trace("RouteHandler::listDatasets(..) - returns: " + JSON.stringify(result));
                res.json(result.code, result.body);
            })
            .catch((err) => {
                Log.trace("RouteHandler::listDatasets(..) - ERROR: " + JSON.stringify(err));
                res.json(404, {error: err.message});
            });

        return next();
    }

    public static performQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace("RouteHandler::performQuery(..) - req body: " + JSON.stringify(req.body));

        try {
            const query: string = req.body;
            Log.trace("RouteHandler::performQuery(..) - extracted query: " + query);

            RouteHandler.facade.performQuery(query)
                .then((result) => {
                    // Log.trace("RouteHandler::performQuery(..) - SUCCESS: " + JSON.stringify(result));
                    res.json(result.code, result.body);
                })
                .catch((err) => {
                    Log.trace("RouteHandler::performQuery(..) - ERROR ON FACADE SIDE: " + JSON.stringify(err));
                    res.json(err.code, err.body);
                });
        } catch (err) {
            Log.trace("RouteHandler::performQuery(..) - ERROR: " + JSON.stringify(err));
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static getStatic(req: restify.Request, res: restify.Response, next: restify.Next) {
        const publicDir = "frontend/public/";
        Log.trace("RouteHandler::getStatic::" + req.url);
        let path = publicDir + "index.html";
        if (req.url !== "/") {
            path = publicDir + req.url.split("/").pop();
        }
        fs.readFile(path, function (err: Error, file: Buffer) {
            if (err) {
                res.send(500);
                Log.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }

    private static facade = new InsightFacade();
}
