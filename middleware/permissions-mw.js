var jwt = require('jsonwebtoken');
var config = require('../config');
var Filter = require('../models/filter');
var Comment = require('../models/comment');

module.exports = function (options) {
    options = options && options.relationName || {relationName: 'relation'};

    this.extractPayload = function (paramName) {
        return function (req, res, next) {
            jwt.verify(req.params[paramName], config.get('token:relationSecret'), function (err, payload) {
                if (err) {
                    return next(err);
                }

                setRelation(req, payload);
                next();
            });
        };
    };

    this.checkDisable = function (req, res, next) {
        var relation = getRelation(req);
        Filter.isDisabled(relation.id, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result) {
                next(new Error('Forbidden comments.'));
            } else {
                next();
            }
        });
    };

    this.changePermission = function (accessPayloadName) {
        return function (req, res, next) {
            var relation = getRelation(req);
            var payload = req[accessPayloadName];
            if (relation.ownerId == payload.userId) {
                next();
            } else {
                next(new Error('Forbidden to change permissions of comments.'));
            }
        };
    };

    this.checkOwner = function (accessPayloadName, paramName) {
        return function (req, res, next) {
            var payload = req[accessPayloadName];
            var commentId = req.params[paramName];

            Comment.findById(commentId, function (err, comment) {
                if (err) {
                    return next(err);
                }

                if (!comment) {
                    return next(new Error("Not found comment."));
                }

                if (comment.userId != payload.userId) {
                    return next(new Error("Forbidden delete comment."));
                }

                req.comment = comment;
                next();
            });
        };
    };

    function getRelation(req) {
        return req[options.relationName];
    }

    function setRelation(req, relation) {
        req[options.relationName] = relation;
    }

    return this;
};



