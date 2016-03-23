Template.eventForm.rendered = function() {
	$('#event-datepicker').datepicker();
};

Template.eventForm.events({
    'submit form': function(e) {
        e.preventDefault();
        var event = {
            date: new Date($('#event-datepicker').val()).getTime() || Date.now(),
            group: this._id
        };
        
        Meteor.call('submitEvent', event, function(error, result) {
            if (error) {
                return alert(error.reason);
            } else {
                Router.go('viewEvent', {_id: result._id})
            }
        });
    }
});

Template.eventView.helpers({
    formated_date: function() {
        return new Date(this.date);
    },
    
    event_status: function() {
        return EventStatuses.statusFromValue(this.status);
    },
    
    not_has_orders: function() {
        //console.log(Groups.findOne({_id: this.group}).users.indexOf(Meteor.userId()));
        if(Groups.findOne({_id: this.group})) {
            return (Orders.find({event: this._id}).count() < 1 && Groups.findOne({_id: this.group}).users.indexOf(Meteor.userId()) > -1);
        }
        
        return false;
    },
    
    has_orders: function() {
        return (Orders.find({event: this._id}).count());
    }
});

Template.eventsList.helpers({
    events: function() {
        return Events.find({group: this._id})
    }
});

Template.eventItem.helpers({
    formated_date: function() {
        return new Date(this.date);
    },
    
    event_status: function() {
        return EventStatuses.statusFromValue(this.status);
    }
});