const mongoose= require("mongoose");


module.exports= async()=>{
   const mongourl="mongodb://hemant:vx5RUPnsqVOjvdbU@ac-wcvet4v-shard-00-00.wdmpcmg.mongodb.net:27017,ac-wcvet4v-shard-00-01.wdmpcmg.mongodb.net:27017,ac-wcvet4v-shard-00-02.wdmpcmg.mongodb.net:27017/?ssl=true&replicaSet=atlas-14a8mc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
 try{
    const connect = await mongoose.connect(mongourl,{
         useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Mongoose connected")
 }
 catch(e){
    console.log(e.message);
    process.exit(1);
 }

}
