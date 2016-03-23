BaseModel = function(arg) {
    this.mongoModel = Groups;
    this._id = null;
    this._fields = new Object();
    
    this.IsNew = function() {
        return !!this._id;
    };
    
    this._construct = function(arg) {
        if(arg instanceof Object) {
            this._fields = arg;
        } else {
            this._id = arg;
            
        }
    };
    
    this.FieldsFromBd = function() {
        if(!this.IsNew() && this.mongoModel) {
            var props = this.mongoModel.findOne(this._id);
            Object.keys(props).map(function(key){
                if(key !== '_id') {
                    this._fields[key] = props[key]
                }
            })
        } else {
            throw new Error("No _id or BD model");
        }
    };
    
    this.Save = function() {
        //if()
    }
    
    this._construct(arg);
    
};


