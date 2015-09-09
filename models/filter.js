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
    var Comment = this;
    if (disable) {
        var comment = new Comment({
            relationId: relationId,
            ownerId: ownerId
        });
        comment.save(function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    } else {
        Comment.remove({relationId: relationId}, function (err) {
            if (err) {
                return callback(err);
            }

            callback(null);
        })
    }
};

filterSchema.statics.disable = function (relationId, ownerId, callback) {
    var Comment = this;

    var comment = new Comment({
        relationId: relationId,
        ownerId: ownerId
    });
    comment.save(function (err) {
        if (err) {
            return callback(err);
        }

        callback(null);
    });
};

filterSchema.statics.enable = function (relationId, ownerId, callback) {
    var Comment = this;

    Comment.remove({relationId: relationId}, function (err) {
        if (err) {
            return callback(err);
        }

        callback(null);
    });
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
