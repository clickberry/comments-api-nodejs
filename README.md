# Dockerized Comments API
Comments micro-service on Node.js. This micro-service for add, edit, get and manage comments for relation entity such as *video-api-clickberry*. For working it should receive [{relationToken}](#relationToken) from external micro-service.

* [Architecture](#architecture)
* [Technologies](#technologies)
* [Environment Variables](#environment-variables)
* [Events](#events)
* [API](#api)
* [License](#license)

# Architecture
The application is a REST API service with database and messaging service (Bus) dependencies.
## {relationToken}
{relationToken} it is json web token with info about relation entity - {id: *relation_id*, ownerId: *owner_id*}. For example, if you want to add comment for video micro-service then *relation_id* - video id, *owner_id* - video owner user id. In this way we connect comments-api to external entities.

# Technologies
* Node.js
* MongoDB/Mongoose
* Express.js
* Passport.js
* Official nsqjs driver for NSQ messaging service

# Environment Variables
The service should be properly configured with following environment variables.

Key | Value | Description
:-- | :-- | :-- 
MONGODB_CONNECTION | mongodb://mongo_host:mongo_port/auth | MongoDB connection string.
TOKEN_ACCESSSECRET | MDdDRDhBOD*** | Access token secret.
TOKEN_RELATIONSECRET | NUQzNTYwND*** | Refresh token secret.
NSQD_ADDRESS | bus.yourdomain.com | A hostname or an IP address of the NSQD running instance.
NSQD_PORT | 4150 | A TCP port number of the NSQD running instance to publish events.

# Events
The service generates events to the Bus (messaging service) in response to API requests.

## Send events

Topic | Message | Description
:-- | :-- | :--
create-comments | { id: *comment_id*, userId: *user_id*, relationId: *id_relation_entity*, text: *comment_message*, created: *created_date*} | Created new comment.

# API
## POST /{relationToken}
Adds comment to relation entity.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |
#### Body
| Param    | Description |
|----------|-------------|
| text    | Comment message       |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |

## GET /{relationToken}
Get comments for relation entity.

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode  | 200                                                               |
| Body        | {id: *comment_id*, userId: *user_id*, relationId: *id_relation_entity*, text: *comment_message*, created: *created_date*} |

## POST /{relationToken}/disable
Disable comments to relation entity. Only relation entity owner.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 201                                                                |

## DELETE /{relationToken}/disable
Enable comments to relation entity. Only relation entity owner.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200   |

## PUT /{commentId}
Edit comment. Only comment owner.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |
#### Body
| Param    | Description |
|----------|-------------|
| text    | Edited comment message       |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200   |

## DELETE /{commentId}
Delete comment. Only comment owner.

### Request
#### Header
| Param   | Value |
|----------|-------------|
| Authorization     | "JWT [accessToken]" |

### Response
| HTTP       |      Value                                                         |
|------------|--------------------------------------------------------------------|
| StatusCode | 200   |

# License
Source code is under GNU GPL v3 [license](LICENSE).
