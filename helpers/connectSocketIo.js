const socketIo = require("socket.io");
const connectSocketIo = (server)=>{
    const io = socketIo(server,{
        cors:{
          origin:"*"
        }
      });
    return io; 
}

module.exports = connectSocketIo;