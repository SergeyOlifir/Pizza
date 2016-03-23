EventStatuses = {
    ORDERING: 0,
    ORDERED: 1,
    DELIVERING: 2,
    DELIVERED: 3,
    
    statusFromValue: function(val) {
        switch (val) {
            case this.ORDERING:
                return 'Ordering';
            
            case this.ORDERED:
                return 'Ordered';
                
            case this.DELIVERING:
                return 'Delivering';
                
            case this.DELIVERED:
                return 'Delivered';
                
            default :
                return 'Ordering';
        }
    },
};

