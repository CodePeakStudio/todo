var buffer = require('buffer');
var wkx = require('wkx');
const gjv = require("geojson-validation");

function mapFoundModel(src) {
    var result = {};
    if (src.position !== null) {
        var parsedPosition = "";
        try {
            parsedPosition = wkx.Geometry.parse(src.position).toGeoJSON();
        }
        catch {
            var hexAry = src.position.match(/.{2}/g);
            var intAry = [];
            for (var i in hexAry) {
                intAry.push(parseInt(hexAry[i], 16));
            }

            var buf = new buffer.Buffer.from(intAry);

            var geometry = wkx.Geometry.parse(buf);

            var parsedPosition = geometry.toGeoJSON();
        }



        result = {
            'id': src.id,
            'name': src.name,
            'position': parsedPosition,
            'isDone': src.isDone
        }
    } else {
        result = {
            'id': src.id,
            'name': src.name,
            'isDone': src.isDone
        };
    }

    return result;
}

function overrideCreateForGeoJsonToPostgis(ctx, unused, next) {
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
    } else {
        ctx.args.data.position = null;
        next();
    }

}

function hideUnusedRemoteMethods(Model) {
    Model.disableRemoteMethodByName('replaceOrCreate');
    Model.disableRemoteMethodByName('createChangeStream');

    Model.disableRemoteMethodByName('updateAll');
    Model.disableRemoteMethodByName('prototype.updateAttributes');

    Model.disableRemoteMethod('upsertWithWhere', true);
    Model.disableRemoteMethod('updateAttributes')
    Model.disableRemoteMethodByName('findOne');

    Model.disableRemoteMethodByName('replaceById');

    Model.disableRemoteMethodByName('confirm');
    Model.disableRemoteMethodByName('count');
    Model.disableRemoteMethodByName('exists');
    Model.disableRemoteMethodByName('resetPassword');
}

function overrideDescriptionForExplorer(Model) {
    Model.sharedClass.findMethodByName('upsert').description = "Update TODO properties";
    Model.sharedClass.findMethodByName('find').description = "Get All TODOs";
    Model.sharedClass.findMethodByName('create').description = "Add new TODO to TODO list";
    Model.sharedClass.findMethodByName('findById').description = "Get TODO by Id";
    Model.sharedClass.findMethodByName('deleteById').description = "Delete TODO by Id";
}

module.exports = overrideDescriptionForExplorer

module.exports = {
    mapFoundModel,
    overrideCreateForGeoJsonToPostgis,
    hideUnusedRemoteMethods,
    overrideDescriptionForExplorer
}