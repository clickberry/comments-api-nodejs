var express = require('express');
var moment = require('moment');
var permissions = require('../middleware/permissions-mw')('relation');
var Comment = require('../models/comment');
var Filter = require('../models/filter');

var Bus = require('../lib/bus-service');
var bus = new Bus({});

var router = express.Router();

module.exports = function (passport) {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.post('/:relationToken',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        permissions.extractPayload('relationToken'),
        permissions.checkDisable,
        function (req, res, next) {
            var comment = new Comment();
            comment.userId = req.payload.userId;
            comment.relationId = req.relation.id;
            comment.text = req.body.text;
            comment.created = moment.utc();

            comment.save(function (err) {
                if (err) {
                    return next(err);
                }

                bus.publishCreateComment(commentMapper(comment), function(err){
                    if(err){
                        return next(err);
                    }

                    res.sendStatus(201);
                });
            });
        }
    );

    router.get('/:relationToken',
        permissions.extractPayload('relationToken'),
        permissions.checkDisable,
        function (req, res, next) {
            Comment.find({relationId: req.relation.id}, function (err, comments) {
                if (err) {
                    return next(err);
                }

                var commentDtos = comments.map(commentMapper);
                res.send(commentDtos);
            });
        });

    router.put('/:commentId',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        permissions.checkOwner('payload', 'commentId'),
        function (req, res, next) {
            Comment.findById(req.params.commentId, function (err, comment) {
                if (err) {
                    return next(err);
                }

                if (!comment) {
                    return next(new Error('Not found comment.'))
                }

                comment.text = req.body.text;

                comment.save(function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.sendStatus(200);
                });
            });
        });

    router.delete('/:commentId',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        permissions.checkOwner('payload', 'commentId'),
        function (req, res, next) {
            req.comment.remove(function(err){
                if(err){
                    return next(err);
                }

                res.sendStatus(200);
            });
        });

    router.post('/:relationToken/disable',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        permissions.extractPayload('relationToken'),
        permissions.changePermission('payload'),
        function (req, res, next) {
            Filter.disable(req.relation.id, req.relation.ownerId, function (err) {
                if (err) {
                    return next(err);
                }

                res.sendStatus(200);
            });
        });

    router.delete('/:relationToken/disable',
        passport.authenticate('access-token', {session: false, assignProperty: 'payload'}),
        permissions.extractPayload('relationToken'),
        permissions.changePermission('payload'),
        function (req, res, next) {
            Filter.enable(req.relation.id, req.relation.ownerId, function (err) {
                if (err) {
                    return next(err);
                }

                res.sendStatus(200);
            });
        });

    router.get('/:relationToken/disable',
        permissions.extractPayload('relationToken'),
        function (req, res, next) {
            Filter.get(req.relation.id, function (err, disabled) {
                if (err) {
                    return next(err);
                }

                res.send({disabled: disabled});
            });
        });


    function commentMapper(comment) {
        return {
            id: comment._id,
            userId: comment.userId,
            relationId: comment.relationId,
            text: comment.text,
            created: comment.created
        };
    }

    return router;
};
