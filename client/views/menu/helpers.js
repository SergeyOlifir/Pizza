Template.menuItems.helpers({
    menuItems: function() {
        return MenuItems.find({_id: {$in: this.menuItems}});
    }
});

Template.menuItems.events({
    'click .remove': function(e) {
        var group = Iron.controller().data();
        delete group.menuItems[group.menuItems.indexOf(this._id)];
        Groups.update(group._id, {$set: {
                menuItems: group.menuItems
        }}, (function(error) {
            if (error) {
              alert(error.reason);
            } else {
              //Router.go('viewGroup', {_id: this._id});
            }
        }).bind(this));
    }
});

Template.addMenuItemPopUp.events({
    'submit form': function(e) {
        e.preventDefault();
        var $form = $(e.target);
        var item = {
            title: $form.find('[name="title"]').val() || 'No Title',
            price: parseFloat($form.find('[name="price"]').val().replace(',', '.')) || 0,
            group_id: this._id
        };
        
        var item_id = MenuItems.insert(item);
        this.menuItems.push(item_id);
        Groups.update(this._id, {$set: {menuItems: this.menuItems}});
        $form[0].reset();
    }
});

Template.menuItemEdit.events({
    'submit form': function(e) {
        e.preventDefault();
        var $form = $(e.target);
        var item = {
            title: $form.find('[name="title"]').val() || 'No Title',
            price: parseFloat($form.find('[name="price"]').val().replace(',', '.')) || 0
        };
        
        MenuItems.update(this._id, {$set: item});
        Router.go('viewGroup', {_id: this.group_id});
        
    }
});