var util = require('util');
var Publisher = require('clickberry-nsq-publisher');

function Bus(options) {
    Publisher.call(this, options);
}

util.inherits(Bus, Publisher);

Bus.prototype.publishCreateComment = function (comment, callback) {
    if (!callback) {
        callback = function () {}
    }

    this.publish('create-comments', comment, function (err) {
        if (err) return callback(err);
        callback();
    });
};

module.exports = Bus;