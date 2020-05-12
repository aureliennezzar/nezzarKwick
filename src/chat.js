/* A AMELIORER : 
    
    EN FONCTION DU STATUS CHANGER LES OUTPUTS, ( login say etc )
    

*/

$(document).ready(function () {
    $("#username").html(localStorage.getItem("username"));
    window.lastTimeStamp = 0;
    refreshMessages();
    checkUsers();
    setInterval(checkUsers, 5000);
    setInterval(refreshMessages, 500);
});



function logOut() {
    $.ajax({
        url: `http://greenvelvet.alwaysdata.net/kwick/api/logout/${localStorage.getItem("token")}/${localStorage.getItem("id")}`,
        dataType: 'jsonp',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            localStorage.removeItem("username")
            localStorage.removeItem("id")
            localStorage.removeItem("token")
            window.location = 'index.html';
        },
        error: function (xhr, status, error) {
            alert('Error');
        }
    });
}

function checkUsers() {
    $.ajax({
        url: 'http://greenvelvet.alwaysdata.net/kwick/api/user/logged/' + localStorage.getItem('token'),
        dataType: 'jsonp',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            $(".userLogged").remove();
            for (let i = 0; i < result.result.user.length; i++) {
                let username = '';
                if (result.result.user[i] == localStorage.getItem("username")) {
                    username += `${result.result.user[i]} (Vous)`;
                } else { username += result.result.user[i] }
                $(".menu-vertical").append(`<a class="userLogged"> <img src="assets/profilepic.png" alt="profilepicture"> ${username}</a>`);
            }
        },
        error: function (xhr, status, error) {
            alert('Error');
        }
    });

}

function refreshMessages() {
    $.ajax({
        url: `http://greenvelvet.alwaysdata.net/kwick/api/talk/list/${localStorage.getItem('token')}/${window.lastTimeStamp}`,
        dataType: 'jsonp',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            const messages = result.result.talk;

            // Boucle affichage des messages
            for (let i = 0; i < messages.length; i++) {
                let messageContent = messages[i].content;
                let messageDate = timestampToHour(messages[i].timestamp);
                let username = ''
                if (messages[i].user_name == localStorage.getItem('username')) {
                    messageClass = "userMessage";
                    username += messages[i].user_name + ' (Vous)';
                } else {
                    messageClass = "clear"
                    username += messages[i].user_name;
                }
                $("#chatbox").append(`<div class="msg-ctnr o${messageClass}"><div class="msg-all ${messageClass}"><div class="msg-content"><img src="assets/profilepic.png" alt="Avatar"><span class="msgDate">${messageDate}</span><h5>${username}</h5><p>${messageContent}</p></div></div></div>`)
            }

            // Initialisation scroll en bas
            if (window.lastTimeStamp == 0) {
                let chatbox = $('#chatbox');
                let height = chatbox[0].scrollHeight;
                chatbox.scrollTop(height);
            }
            // check si nouveaux messages, sinon ne pas reinitialiser lastTimeStamp
            if (messages.length > 0) {
                window.lastTimeStamp = result.result.last_timestamp;
                let chatbox = $('#chatbox');
                let height = chatbox[0].scrollHeight;
                chatbox.scrollTop(height);
            }
        },
        error: function (xhr, status, error) {
            alert('Error');
        }
    });

}

function postMessage(message) {
    if (message.trim() == '') return
    $.ajax({
        url: `http://greenvelvet.alwaysdata.net/kwick/api/say/${localStorage.getItem('token')}/${localStorage.getItem('id')}/${encodeURIComponent(message.trim())}`,
        dataType: 'jsonp',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (result, status, xhr) {
            $('#userMsg').val('');
        },
        error: function (xhr, status, error) {
            alert('Error');
        }
    });

}
// Transform timestamp en date
function timestampToHour(timestamp) {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    let today = new Date();
    let jour = today.getDate();

    let date = new Date(timestamp * 1000);

    let month = months[date.getMonth()];
    let jourMsg = date.getDate();
    let hour = date.getHours();
    let min = "0" + date.getMinutes();
    let year = date.getFullYear();
    let messageDate = "";
    
    if (min.length == 3) min = min.substr(1);
    if (jour == jourMsg) {
        messageDate += `Aujourd'hui à ${hour}:${min}`;
    } else if (jourMsg == jour - 1) {
        messageDate += `Hier à ${hour}:${min}`;
    } else {
        messageDate += `le ${jourMsg} ${month} ${year}`;
    }

    return messageDate
}

$("#userMsg").keypress(function (e) {
    if (!e) e = window.event;
    let keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        postMessage($('#userMsg').val());
    }
});
// Appel logout
$("#logout").click(function () {
    logOut();
});
// Appel submit message
$("#submitMsg").click(function () {
    postMessage($('#userMsg').val());
});