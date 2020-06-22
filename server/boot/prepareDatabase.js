module.exports = function (app) {
    app.dataSources.geo_todo_db.automigrate('ToDo', function (err) { });
}