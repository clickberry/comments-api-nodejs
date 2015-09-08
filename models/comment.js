var mongoose=require('mongoose');

var commentSchema=mongoose.Schema({
    userId: String,
    relationId: String,
    text: String,
    created: Date
});

module.exports=mongoose.model('Comment',commentSchema);
