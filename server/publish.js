Meteor.publish('groups', function(author) {
    return Groups.find({$or:[{author: author}, {users: author}]});
});

Meteor.publish('group', function(id) {
    return Groups.find({_id: id});
});

Meteor.publish('group_by_event_id', function(id) {
    return Groups.find({_id: id});
});

Meteor.publish('images', function(){ 
    return Images.find(); 
});

Meteor.publish('menuItems', function(grId){ 
    return MenuItems.find(); 
});

Meteor.publish("users", function () {
    return Meteor.users.find({},
                             {fields: {username: 1, 'profile.name': 1}});
});

Meteor.publish('events', function(){ 
    return Events.find(); 
});

Meteor.publish('orders', function(userId){ 
    return Orders.find({author: userId}); 
});


Images.deny({
    insert: function(){
        return false;
    },
    update: function(){
        return false;
    },
    remove: function(){
        return false;
    },
    download: function(){
        return false;
    }
});

Images.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    },
    download: function(){
        return true;
    }
});