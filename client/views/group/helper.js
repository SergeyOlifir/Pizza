Template.groups.helpers({
    groups: function() {
        return Groups.find({author: Meteor.userId()});
    }
});

Template.relatedGroups.helpers({
    rGroups: function() {
        return Groups.find({users: Meteor.userId()});
    }
});

Template.groupItem.events({
    'click .delete': function(e) {
        e.preventDefault();
        if (confirm("Delete this post?")) {
            Groups.remove(this._id);
        }
    }
    
});

Template.groupItem.helpers({
    ownGroup: function() {
        return this.author == Meteor.userId();
    },
});

Template.groupView.helpers({
    ownGroup: function() {
        return this.author == Meteor.userId();
    },
});

Template.groupForm.events({
    'submit form': function(e) {
        var $form = $(e.target);
        e.preventDefault();
        var group = {
          title: $form.find('[name="title"]').val() || 'No title',
        };
        
        
        var submitGroup = (function(fileObj) {
            if(fileObj) {
                group.img = '/cfs/files/images/' + fileObj._id;
            }
            if(!this._id) {
                Meteor.call('submitGroupe', group, function(error, result) {
                    if (error) {
                        return alert(error.reason);
                    }
                })
            } else {
                Groups.update(this._id, {$set: group}, function(error) {
                    if (error) {
                      alert(error.reason);
                    }
                });
            }

            Router.go('root');
        }).bind(this);
        
        
        var files = $form.find('[name="image"]')[0].files;
        if(files.length > 0) {
            Images.insert(files[0], (function (err, fileObj) {
                submitGroup(fileObj);
            }).bind(this));
        } else {
            submitGroup();
        }
        
        
    },
    
    'change [type="file"]': function(e) {
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
          $('form .thumbnail img').attr('src', reader.result);
        }, false);

        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    
    
});