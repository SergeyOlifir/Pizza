if(Meteor.isServer) {
    CEmail = function(fields) {
        var props = {};

        var construct = function(fields) {
            if(fields.hasOwnProperty('to')) {
                props.to = fields.to;
            }

            if(fields.hasOwnProperty('from')) {
                props.from = fields.from;
            }

            if(fields.hasOwnProperty('subject')) {
                props.subject = fields.subject;
            }

            if(fields.hasOwnProperty('text')) {
                props.text = fields.text;
            }
        };

        this.To = function(adress) {
            props.to = adress;
            return this;
        };

        this.From = function(from) {
            props.from = from;
            return this;
        };

        this.Subject = function(subject) {
            props.subject = subject;
            return this;
        };

        this.Body = function(text) {
            props.text = text;
            return this;
        };

        this.Send = function() {
            Email.send(props);
        };

        if(fields) {
            construct(fields);
        }
    };

    CEmail.Forge = function(fields) {
        return new CEmail(fields);
    };
    
    
    
    Meteor.methods({
        sendEmail: function(eventId) {
            var event = Events.findOne(eventId);
            var groupe = Groups.findOne(event.group);
            var users = Meteor.users.find({_id: {$in: groupe.users}}, { fields: {emails: true, 'services.google.email': true} }).fetch(); 
            var email = CEmail.Forge();
            email.From('boroda@mail.ru');
            email.Subject('Subject');
            
            for(var i = 0; i < users.length; i++) {
                var user = users[i];
                var emailAddresses = [];
                if(user.emails) {
                    for (var j = 0; j < user.emails.length; j++) {
                        emailAddresses.push(user.emails[j].address);
                    }
                } else if(user.services && user.services.google && user.services.google.email) {
                    emailAddresses.push(user.services.google.email);
                }
                
                
                email.To(emailAddresses);
                var orders = Orders.findOne({event: eventId, author: user._id});
                var totalPrice = 0;
                if(orders) {
                    var orderItems = orders.items;
                    var templateItems = orderItems.map(function(value, index) {
                        var menuItem = MenuItems.findOne(value.menuItem);
                        totalPrice += (menuItem.price * value.count)
                        return {
                            name: function() {
                                return menuItem.title;
                            },

                            price: function() {
                                return menuItem.price;
                            },

                            total: function() {
                                return (menuItem.price * value.count);
                            },
                            
                            count: value.count
                        };
                    });
                    if(event.creator == user._id) {
                        var allOrders = Orders.find({event: eventId}).fetch();
                        var allMenuItems = {};
                        allOrders.map(function(item) {
                            for(var ind in item.items) {
                                if(allMenuItems[item.items[ind].menuItem]) {
                                    allMenuItems[item.items[ind].menuItem] += item.items[ind].count;
                                } else {
                                    allMenuItems[item.items[ind].menuItem] = item.items[ind].count;
                                }
                            }
                        });
                        
                        var allTemplateItems = [];
                        var allTotalPrice = 0;
                        for(var mItemId in allMenuItems) {
                            var menuItem = MenuItems.findOne(mItemId);
                            allTotalPrice += (menuItem.price * allMenuItems[mItemId])
                            allTemplateItems.push({
                                name: function() {
                                    return menuItem.title;
                                },

                                price: function() {
                                    return menuItem.price;
                                },

                                total: function() {
                                    return (menuItem.price * allMenuItems[mItemId]);
                                },

                                count: allMenuItems[mItemId]
                            });
                        }
                        
                        email.Body(Handlebars.templates['email']({
                            orderItems: templateItems, 
                            totalPrice: totalPrice,
                            creator: true,
                            allOrderItems: allTemplateItems,
                            allPrice: allTotalPrice
                        }));
                    } else {
                        email.Body(Handlebars.templates['email']({
                            orderItems: templateItems, 
                            totalPrice: totalPrice,
                            creator: false
                        }));
                    }
                    
                    this.unblock();
                    email.Send();
                }
                
            }
            
            
        }
    });
}