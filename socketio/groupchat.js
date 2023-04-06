module.exports = function(io){
    //for the connection io.on will listen to the connection
    io.on('connection',(socket)=>{
        //will be displayed on the console
        console.log('user connected');
    });
}