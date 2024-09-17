const mongoose= require('mongoose');
const connectedtoDB= ()=>{mongoose.connect('mongodb://127.0.0.1:27017/signin&signup').then((result) => {
    console.log(` tthe database is connected....!`);
    
    
}).catch((err) => {
    console.log(" the error message is :-",err);
    
});
}
module.exports=connectedtoDB;