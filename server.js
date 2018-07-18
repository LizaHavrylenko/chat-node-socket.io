var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http); 
var allMessages = [];
var allUsers = [];
 

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/script.js', function(req, res){
    res.sendFile(__dirname + '/script.js');
});
app.get('/styles.css', function(req, res){
    res.sendFile(__dirname + '/styles.css');
});
 

io.on('connection', function(socket){
    console.log('Client connected');
    var name = 'Name';
    var nickName = 'NickName'; 
    socket.on('chat message', function(msg){
        allMessages.push(msg);
        io.emit('chat message', msg);
    });
    socket.on('type message', function(typemsg){
        socket.broadcast.emit('type message', typemsg);
    });
    socket.on('no type message', function(typemsg){
        socket.broadcast.emit('no type message', typemsg);
    });
    socket.on('disconnecting', function(){
      leftChat();
    });
    
leftChat = function (){
        var timestamp =  new Date();
        var data = {
        name: name,
        nickName: nickName,
        text: "@"+nickName+" left chat.",
        'timestamp': timestamp
        };
        socket.broadcast.emit('chat message', data);
        allUsers.forEach((user)=> {
                        if ( (user.nickName==nickName)&&(user.name==name)){
                            user.status = 'just left';
                            setTimeout(()=>{
                                if (user.status == 'just left'){
                                user.status = 'offline';
                                io.emit('names history', allUsers);
                                }
                            }, 60000);
                        }
                    } 
                );
        io.emit('names history', allUsers);
    }
        
  
    socket.emit('chat history', allMessages);
   
    socket.on('user names', function(entry){
       if ( !allUsers.some((user)=>{return (user.nickName==entry.nickName)&&(user.name==entry.name);}) )
       {allUsers.push(entry)};
       if (!((name=='Name')&&(nickName=='NickName')))
        {leftChat();}
      /*   io.emit('user names', entry); */
        name = entry.name;
        nickName = entry.nickName;
        allUsers.forEach((user)=> {
                        if ( (user.nickName==nickName)&&(user.name==name))
                                {
                                    user.status = 'just appeared';
                                    io.emit('names history', allUsers);
                                    
                                    setTimeout(()=>{
                                        if (user.status == 'just appeared'){
                                        user.status = 'online';
                                        io.emit('names history', allUsers);
                                        }
                                    }, 60000);
                                }
        });

    socket.emit('names history', allUsers);
    })
});




http.listen(3000, function(){
    console.log('listening on 3000');
})