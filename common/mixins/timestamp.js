module.exports = function (Model, options) {
    Model.defineProperty('created', { type: Date, default: '$now' });
    Model.defineProperty('modified', { type: Date, default: '$now' });

    // Model.observe('before save', function event(ctx, next) { //Observe any insert/update event on Model
    //     debugger;
    // });
}