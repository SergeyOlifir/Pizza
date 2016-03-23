Groups = new Mongo.Collection('groups');

Groups.allow({
    insert: function(userId, doc) {
        return !! userId;
    },
    
    update: function(userId, doc, fieldNames) {
        return doc && (doc.author === userId || ((doc.users.indexOf(userId) > -1) && (fieldNames.length == 1 && fieldNames.indexOf('menuItems') > -1)));
    },
    
    remove: function(userId, doc) {
        return doc && doc.author === userId;
    },
});


Meteor.methods({
    submitGroupe: function(fields) {
        var user = Meteor.user();
        fields = Object.assign(fields, {
            author: user._id,
            users: new Array(),
            menuItems: new Array()
        });
        
        var id = Groups.insert(fields);
        return {
          _id: id
        };
    }
});



