(function(){

    var nameInput = document.getElementById('nameInput');
    var nickNameInput = document.getElementById('nickNameInput');
    var nameButton = document.getElementById('nameButton');
    var allMessages = document.getElementById('allMessages');
    var messageInput = document.getElementById('messageInput');
    var sendMessage = document.getElementById('sendMessage');
    var allUsers = document.getElementById('usersList');
    var messageInput = document.getElementById('messageInput');

    var name = 'Name';
    var nickName = 'NickName'; 
    var socket = io.connect();
    var isTyping = false;
    
    nameButton.onclick = function(){
    if (!((name == nameInput.value)&&(nickName == nickNameInput.value))){
        name = nameInput.value || 'Name',
        nickName = nickNameInput.value || 'NickName'
        var info = {
        name: name,
        nickName: nickName,
        status: ''
         };
         nameInput.value = '';
         nickNameInput.value = '';
         socket.emit('user names', info);
    }

    };
    
    sendMessage.onclick = function(){
        var timestamp =  new Date();
        var data = {
        name: name,
        nickName: nickName,
        text: messageInput.value,
        'timestamp': timestamp
        };
    
        messageInput.value = '';
        socket.emit('chat message', data);
        messageInput.onchange();
    };
    
     
    socket.on('type message', function(typemsg){
        var information = document.getElementById('input-info');
        var inputInfo = document.createElement('p');
        inputInfo.setAttribute('id', typemsg);
        inputInfo.setAttribute('class', 'paragraph');
        inputInfo.innerText = '@' + typemsg + ' is typing... ';
        information.appendChild(inputInfo);
    });
    messageInput.oninput = function(){
        if(!isTyping){
       socket.emit('type message', nickName);
       isTyping = true;
   }
   };

    socket.on('no type message', function(typemsg){
        var inputInfo = document.getElementById(typemsg);
         inputInfo.remove();
    });
 
    messageInput.onchange = function(){
        if(messageInput.value == ''){
            socket.emit('no type message', nickName);
            isTyping = false;
        };
        
    };
   
    
     

      
    
     socket.on('chat history', function(msg){
         
        allMessages.innerHTML = '';
        for(var i in msg){
            if (msg.hasOwnProperty(i)){
                var time = new Date(msg[i].timestamp);
                var element = document.createElement('div');
                element.setAttribute ('class', 'element');
                element.setAttribute ('id', 'message-placeholder');
                var messageText = document.createElement('span');
                messageText.setAttribute('class', 'message-text');
                messageText.innerText = msg[i].text; 
                var messageCreator = document.createElement('span'); 
                messageCreator.setAttribute('class', 'creator');
                messageCreator.innerText = msg[i].name + '(@'+msg[i].nickName + ')' ; 
                var timestamp = document.createElement('span'); 
                timestamp.setAttribute ('class', 'time');
                timestamp.innerText = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
                var wrapper = document.createElement('div');
                wrapper.setAttribute('class', 'wrapper');
                allMessages.appendChild(element);
                element.appendChild(wrapper);
                wrapper.appendChild(messageCreator);
                wrapper.appendChild(timestamp); 
                element.appendChild(messageText);
                 
                if(msg[i].text.includes('@'+ nickName)){
                 element.style.background = '#99ff99';
                 };  
                 
            }
        }
     }); 

     socket.on('chat message', function(msg){
                var time = new Date(msg.timestamp);
                var element = document.createElement('div');
                element.setAttribute ('class', 'element');
                element.setAttribute ('id', 'message-placeholder');
                var messageText = document.createElement('span');
                messageText.setAttribute('class', 'message-text');
                messageText.innerText = msg.text; 
                var messageCreator = document.createElement('span'); 
                messageCreator.setAttribute('class', 'creator');
                messageCreator.innerText = msg.name + '(@'+msg.nickName + ')' ; 
                var timestamp = document.createElement('span'); 
                timestamp.setAttribute ('class', 'time');
                timestamp.innerText = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
                var wrapper = document.createElement('div');
                wrapper.setAttribute('class', 'wrapper');
                allMessages.appendChild(element);
                element.appendChild(wrapper);
                wrapper.appendChild(messageCreator);
                wrapper.appendChild(timestamp); 
                element.appendChild(messageText);
                 
                if(msg.text.includes('@'+ nickName)){
                 element.style.background = '#99ff99';
                 }; 
                 
     });

      socket.on('names history', function(entry){
        allUsers.innerHTML = '';
        for(var i in entry){
            if (entry.hasOwnProperty(i)){
                var userInList = document.createElement('li');
                userInList.setAttribute('id', 'userFromList');
                userInList.innerText = entry[i].name + '(@'+entry[i].nickName +')'+' ';
                var statusLabel = document.createElement('label');
                statusLabel.setAttribute('for', 'userFromList');
                statusLabel.innerText = ' ' + entry[i].status;
                if(entry[i].status == 'offline'){
                    statusLabel.style.background = '#d6d6c2';
                }
                else if (entry[i].status == 'online'){
                        statusLabel.style.background = '#85e085';
                }
                else if (entry[i].status == 'just appeared'){
                    statusLabel.style.background = '#ff704d';
            }
            else if (entry[i].status == 'just left'){
                statusLabel.style.background = '#ffd633';
        }

                userInList.appendChild(statusLabel);
                allUsers.appendChild(userInList); 
            }
        }
      });
       
    /* socket.on('user names', function(entry){
        var userInList = document.createElement('li');
        userInList.innerText = entry.name + '(@'+entry.nickName +')';
        allUsers.appendChild(userInList); 
    }); */
    
    })();