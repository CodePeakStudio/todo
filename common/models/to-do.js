'use strict';

var mapFoundToDoModel = require("../../helpers/todoHelpers").mapFoundModel;
var hideUnusedRemoteMethods = require("../../helpers/todoHelpers").hideUnusedRemoteMethods;
var overrideDescriptionForExplorer = require("../../helpers/todoHelpers").overrideDescriptionForExplorer;
var createOverride = require("../../helpers/todoHelpers").createOverride;
var patchOverride = require("../../helpers/todoHelpers").patchOverride;

module.exports = function (Todo) {
    //CREATE
    Todo.beforeRemote('create', createOverride);
    Todo.afterRemote('create', function (ctx, modelInstance, next) {
        ctx.result = mapFoundToDoModel(modelInstance);
        next();
    });

    //PATCH
    Todo.beforeRemote('patchOrCreate', patchOverride);
    Todo.afterRemote('patchOrCreate', function (ctx, modelInstance, next) {
        ctx.result = mapFoundToDoModel(modelInstance);
        next();
    });

    //FIND
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
