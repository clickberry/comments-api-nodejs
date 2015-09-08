var mongoose = require('mongoose');

var filterSchema = mongoose.Schema({
    relationId: String,
    ownerId: String
});

filterSchema.statics.isDisabled = function (relationId, callback) {
    this.findOne({relationId: relationId}, function (err, filter) {
        if (err) {
            return callback(err);
        }

        if (filter) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    });
};

filterSchema.statics.change = function (relationId, ownerId, disable, callback) {
    if (disable) {
        this.relationId = relationId;
        this.ownerId = ownerId;
        this.save(function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    } else {
        this.remove({relationId: relationId}, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        })
    }
};

filterSchema.statics.get = function (relationId, callback) {
    this.findOne({relationId: relationId}, function (err, filter) {
        if (err) {
            return callback(err);
        }

        callback(null, !!filter);
    });
};

module.exports = mongoose.model('Filter', filterSchema);
