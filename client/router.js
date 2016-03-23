ApplicationController = RouteController.extend({
    layoutTemplate: 'ApplicationLayout',

    onBeforeAction: function () {
        if(!Meteor.user() && !Meteor.loggingIn()) {
            Router.go('root');
        }
        
        this.next();
    }
});

AuthController = RouteController.extend({
    layoutTemplate: 'AuthLayout',
});

Router.configure({
    controller: 'ApplicationController'
});


Router.route('/', function () {
    if (!Meteor.userId()) {
        this.render('AuthLayout');
    } else {
        Meteor.subscribe('groups', Meteor.userId());
        this.render('main');
    }
        
}, {
    name: 'root',
});

Router.route('/group/create', function () {
    this.render('groupForm');
}, {
    name: 'createGroup'
});

Router.route('/group/edit/:_id', function () {
    this.render('groupForm');
}, {
    name: 'editGroup',
    waitOn: function() {return Meteor.subscribe('group', this.params._id);},
    data: function() { return  Groups.findOne(this.params._id); }
});

Router.route('/group/view/:_id', function () {
    Meteor.subscribe('users');
    Meteor.subscribe('menuItems', this.params._id);
    Meteor.subscribe('events');
    this.render('groupView');
}, {
    name: 'viewGroup',
    waitOn: function() {return Meteor.subscribe('group', this.params._id);},
    data: function() { return  Groups.findOne(this.params._id); }
});

Router.route('/event/create/:_id', function() {
    this.render('eventForm');
}, {
    name: 'createEvent',
    waitOn: function() {return Meteor.subscribe('group', this.params._id);},
    data: function() { return  Groups.findOne(this.params._id); }
});

Router.route('/events/view/:_id', function() {
    this.render('eventView');
}, {
    name: 'viewEvent',
    waitOn: function() {return Meteor.subscribe('events');},
    data: function() {
        var event = Events.findOne(this.params._id);
        if(event) {
            Meteor.subscribe('group', event.group);
            Meteor.subscribe('menuItems');
            if (Meteor.userId()) {
                Meteor.subscribe('orders', Meteor.userId());
            }
        }
        return event;
    } 
});

Router.route('/menuitem/edit/:_id', function () {
    this.render('menuItemEdit');
}, {
    name: 'editMenuItem',
    waitOn: function() {return Meteor.subscribe('menuItems');},
    data: function() { return  MenuItems.findOne(this.params._id); }
});