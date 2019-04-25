"use strict";
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/messages")
    .build();

connection.on("ReceiveMessage", function (message) {
    //debugger
    var msg = message
        .replace(/!/g, "!amp;")
        .replace(/</g, "!lt;")
        .replace(/>/g, "!gt;");
    var div = document.createElement("div");
    div.innerHTML = msg + "<hr/>";

    document.getElementById("messages").appendChild(div);
});

connection.on("UserConnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    var option = document.createElement("option");
    option.text = connectionId;
    option.value = connectionId;
    groupElement.add(option);
});

connection.on("UserDisconnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    for (var i = 0; i < groupElement.length; i++) {
        if (groupElement.options[i] === connectionId) {
            groupElement.remove(i);
        }
    }
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    //debugger
    var message = document.getElementById("message").value;
    var groupElement = document.getElementById("group");
    var groupElementValue = groupElement.options[groupElement.selectedIndex].value;
    
    if (groupElementValue === "All" || groupElementValue === "MaySelf") {
       var method = groupElementValue === "All"
            ? "SendMessageToAll"
            : "SendMessageToCaller";

        connection.invoke(method, message).catch(function (err) {
            return console.error(err.toString());
        });
    } else {
        connection.invoke("SendMessageToUser",groupElementValue,message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    
    event.preventDefault();
});