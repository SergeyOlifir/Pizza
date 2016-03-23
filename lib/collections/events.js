Events = new Mongo.Collection('events');

Events.allow({
    insert: function(userId, doc) {
        return !! userId;
    },
    
    update: function(userId, doc, fieldNames) {
        return !! userId;
    },
    
    remove: function(userId, doc) {
        return !! userId;
    },
});


Meteor.methods({
    submitEvent: function(fields) {
        var user = Meteor.user();
        fields = Object.assign(fields, {
            creator: user._id,
            orders: new Array(),
            status: EventStatuses.ORDERING
        });
        
        var id = Events.insert(fields);
        return {
          _id: id
        };
    }
});