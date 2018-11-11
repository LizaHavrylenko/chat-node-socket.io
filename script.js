(function(){

    const nameInput = document.getElementById('nameInput');
    const nickNameInput = document.getElementById('nickNameInput');
    const nameButton = document.getElementById('nameButton');
    const allMessages = document.getElementById('allMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessage = document.getElementById('sendMessage');
    const allUsers = document.getElementById('usersList');

    let name = 'Name';
    let nickName = 'NickName'; 
    let socket = io.connect();
    let isTyping = false;
    
    nameButton.onclick = function(){
        if (!((name == nameInput.value)&&(nickName == nickNameInput.value))){
            name = nameInput.value || 'Name';
            nickName = nickNameInput.value || 'NickName';
            const info = {
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
        const timestamp =  new Date();
        const data = {
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
        const information = document.getElementById('input-info');
        const inputInfo = document.createElement('p');
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
        const inputInfo = document.getElementById(typemsg);
        inputInfo.remove();
    });
 
    messageInput.onchange = function(){
        if(messageInput.value == ''){
            socket.emit('no type message', nickName);
            isTyping = false;
        }   
    };
   
    socket.on('chat history', function(msg){
         
        allMessages.innerHTML = '';
        for(const i in msg){
            if (msg.hasOwnProperty(i)){
                const time = new Date(msg[i].timestamp);
                const element = document.createElement('div');
                element.setAttribute ('class', 'element');
                element.setAttribute ('id', 'message-placeholder');
                const messageText = document.createElement('span');
                messageText.setAttribute('class', 'message-text');
                messageText.innerText = msg[i].text; 
                const messageCreator = document.createElement('span'); 
                messageCreator.setAttribute('class', 'creator');
                messageCreator.innerText = msg[i].name + '(@'+msg[i].nickName + ')' ; 
                const timestamp = document.createElement('span'); 
                timestamp.setAttribute ('class', 'time');
                timestamp.innerText = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
                const wrapper = document.createElement('div');
                wrapper.setAttribute('class', 'wrapper');
                allMessages.appendChild(element);
                element.appendChild(wrapper);
                wrapper.appendChild(messageCreator);
                wrapper.appendChild(timestamp); 
                element.appendChild(messageText);
                 
                if(msg[i].text.includes('@'+ nickName)){
                    element.style.background = '#99ff99';
                }     
            }
        }
    }); 

    socket.on('chat message', function(msg){
        const time = new Date(msg.timestamp);
        const element = document.createElement('div');
        element.setAttribute ('class', 'element');
        element.setAttribute ('id', 'message-placeholder');
        const messageText = document.createElement('span');
        messageText.setAttribute('class', 'message-text');
        messageText.innerText = msg.text; 
        const messageCreator = document.createElement('span'); 
        messageCreator.setAttribute('class', 'creator');
        messageCreator.innerText = msg.name + '(@'+msg.nickName + ')' ; 
        const timestamp = document.createElement('span'); 
        timestamp.setAttribute ('class', 'time');
        timestamp.innerText = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        allMessages.appendChild(element);
        element.appendChild(wrapper);
        wrapper.appendChild(messageCreator);
        wrapper.appendChild(timestamp); 
        element.appendChild(messageText);
                 
        if(msg.text.includes('@'+ nickName)){
            element.style.background = '#99ff99';
        }           
    });

    socket.on('names history', function(entry){
        allUsers.innerHTML = '';
        for(const i in entry){
            if (entry.hasOwnProperty(i)){
                const userInList = document.createElement('li');
                userInList.setAttribute('id', 'userFromList');
                userInList.innerText = entry[i].name + '(@'+entry[i].nickName +')'+' ';
                const statusLabel = document.createElement('label');
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
})();