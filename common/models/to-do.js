'use strict';

const gjv = require("geojson-validation");
var wkx = require('wkx');

var mapFoundToDoModel = require("../../helpers/todoHelpers").mapFoundModel;
var hideUnusedRemoteMethods = require("../../helpers/todoHelpers").hideUnusedRemoteMethods;
var overrideDescriptionForExplorer = require("../../helpers/todoHelpers").overrideDescriptionForExplorer;
var overrideCreateForGeoJsonToPostgis = require("../../helpers/todoHelpers").overrideCreateForGeoJsonToPostgis;

module.exports = function (Todo) {
    Todo.beforeRemote('create', overrideCreateForGeoJsonToPostgis);

    Todo.afterRemote('create', function (ctx, modelInstance, next) {
        if (ctx.args.data.position !== null) {
            var geometry = wkx.Geometry.parse(ctx.args.data.position);
            ctx.result = {
                'id': modelInstance.id,
                'name': modelInstance.name,
                'position': geometry.toGeoJSON(),
                'isDone': modelInstance.isDone
            };
        } else {
            ctx.result = {
                'id': modelInstance.id,
                'name': modelInstance.name,
                'isDone': modelInstance.isDone
            }
        }
        next();
    });

    Todo.beforeRemote('patchOrCreate', function (ctx, unused, next) {
        if (ctx.args.data.position !== undefined && ctx.args.data.position !== null) {
            var isGeoJSON = gjv.isGeoJSONObject(ctx.args.data.position);
            if (isGeoJSON) {
                var geometry = wkx.Geometry.parseGeoJSON(ctx.req.body.position.geometry !== undefined ? ctx.req.body.position.geometry : ctx.req.body.position);
                var wkbGeometry = geometry.toWkt();
                ctx.args.data.position = wkbGeometry;
                next();
            } else {
                next(new Error('Bad GeoJSON format.'));
            }
        } else if (ctx.args.data.position === undefined) {
            delete ctx.args.data.position;
            next();
        } else if (ctx.args.data.position === null) {
            ctx.args.data.position = null;
            next();
        }
    });

    Todo.afterRemote('patchOrCreate', function (ctx, modelInstance, next) {
        ctx.result = mapFoundToDoModel(modelInstance);
        next();
    });

    Todo.afterRemote('find', function (ctx, modelInstance, next) {
        var result = [];
        modelInstance.map((model) => {
            var mappedModel = mapFoundToDoModel(model);
            result.push(mappedModel);
        });
        ctx.result = result;
        next();
    });

    Todo.afterRemote('findById', function (ctx, modelInstance, next) {
        ctx.result = mapFoundToDoModel(modelInstance);
        next();
    });

    hideUnusedRemoteMethods(Todo);
    overrideDescriptionForExplorer(Todo);
};
