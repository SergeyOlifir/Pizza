Orders = new Mongo.Collection('orders');

Orders.allow({
    insert: function(userId, doc) {
        return !! userId;
    },
    
    update: function(userId, doc) {
        return !! userId;//return doc && doc.author === userId;
    },
    
    remove: function(userId, doc) {
        return !! userId;//return doc && doc.author === userId;
    },
});

Meteor.methods({
    submitOrder: function(fields) {
        var user = Meteor.user();
        fields = Object.assign(fields, {
            author: user._id,
        });
        
        var id = Orders.insert(fields);
        
        if(Meteor.isServer) {
            var ordersCount = Orders.find({event: fields.event}).count();
            var usersCount = Groups.findOne(Events.findOne(fields.event).group).users.length;
            if(ordersCount == usersCount) {
                Events.update(fields.event, {$set: {status: EventStatuses.ORDERED}}); 
                Meteor.call('sendEmail', fields.event);
            }
        }
        
        return {
          _id: id
        };
    }
});
