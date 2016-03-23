MenuItems = new Mongo.Collection('menuItems');

MenuItems.allow({
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