Template.usersList.helpers({
    groupUsers: function(){
        return Meteor.users.find({ _id: { $in: this.users }})
    }
});

Template.usersList.events({
    'click .remove': function(e) {
        var group = Iron.controller().data();
        group.users.splice(group.users.indexOf(this._id), 1);
        Groups.update(group._id, {$set: {
                users: group.users
        }}, (function(error) {
            if (error) {
              alert(error.reason);
            } else {
              //Router.go('viewGroup', {_id: this._id});
            }
        }).bind(this));
    }
});

Template.userItemForPopUp.helpers({
    name: function() {
        return this.username || this.profile.name;
    }
});

Template.userItem.helpers({
    name: function() {
        return this.username || this.profile.name;
    }
});
 

Template.addUsersPopUp.helpers({
    users: function(){
        return Meteor.users.find({ _id: { $nin: this.users }});
    }
});

Template.addUsersPopUp.events({
    'submit form': function(e) {
        e.preventDefault();
        var $form = $(e.target);
        $form.find('[type="checkbox"]:checked').map((function(index){
            this.users.push($($form.find('[type="checkbox"]:checked')[index]).val());
        }).bind(this));
        
        Groups.update(this._id, {$set: {
                users: this.users
        }}, (function(error) {
            if (error) {
              alert(error.reason);
            } 
            $form[0].reset();
        }).bind(this));
    }
});