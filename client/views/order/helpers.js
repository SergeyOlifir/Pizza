Template.addOrderForm.helpers({
    menuItems: function() {
        var group = Groups.findOne(this.group);
        if(group) {
            return MenuItems.find({_id: {$in: group.menuItems}});
        }
    }
});

Template.ordersList.helpers({
    orderItems: function() {
        return Orders.findOne({event: this._id, author: Meteor.userId()}).items;
    }
});

Template.orderItem.helpers({
    name: function() {
        return MenuItems.findOne(this.menuItem).title;
    },
    
    price: function() {
        return MenuItems.findOne(this.menuItem).price;
    },
    
    total: function() {
        return (MenuItems.findOne(this.menuItem).price * this.count);
    },
});

Template.addOrderForm.events({
    'submit form': function(e) {
        e.preventDefault();
        var $form = $(e.target);
        var order_tems = new Array();
        var items = $form.find('[type="checkbox"]:checked').map((function(key, value) {
            order_tems.push({
                menuItem: $(value).val(),
                count: $form.find('[name="' + $(value).val() + '-count"]').val() || 1,
            });
        }).bind(this));
        
        if(order_tems.length > 0) {
            Meteor.call('submitOrder', {items: order_tems, event: this._id}, function(error, result) {
                if (error) {
                    return alert(error.reason);
                }
            })
        }
        
        $('#orderModal').modal('toggle');
        $('.modal-backdrop').remove();
    }
});