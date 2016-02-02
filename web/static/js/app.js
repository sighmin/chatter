// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "deps/phoenix_html/web/static/js/phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import { Socket } from "deps/phoenix/web/static/js/phoenix";

class App {
  static init() {
    let socket = new Socket('/socket');

    /* Chat connection & handlers */
    var username = $("#username");
    var msgBody = $("#message");

    socket.connect();
    socket.onClose(e => console.log("Closed chat connection"));

    var chatChannel = socket.channel("rooms:lobby", {});
    chatChannel.join()
      .receive('error', () => console.log("Connection error"))
      .receive('ok',    () => console.log("Connected"));

    msgBody.off("keypress").on("keypress", e => {
      if (e.keyCode == 13) {
        if (msgBody.val() === "") { return; }
        console.log(`[${username.val()}] ${msgBody.val()}`);
        chatChannel.push("new:message", {
          user: username.val(),
          body: msgBody.val()
        });
        msgBody.val("");
      }
    });

    chatChannel.on("new:message", msg => {
      this.renderMessage(msg);
      console.log(msg.body);
    });

    /* Notifications connection & handlers */
    socket.connect();
    socket.onClose(e => console.log("Closed notices connection"));

    var notificationsChannel = socket.channel("notifications:general", {});
    notificationsChannel.join()
      .receive('error', () => console.log("Connection error"))
      .receive('ok',    () => console.log("Connected"));

    notificationsChannel.on("flash:message", notification => {
      console.log(`${notification.type}: ${notification.body}`);
      this.renderNotification(notification);
    });
  }

  static sanitize(html) {
    return $("<div/>").text(html).html()
  }

  static renderNotification(notification) {
    let type = this.sanitize(notification.type);
    let body = this.sanitize(notification.body);
    var notifications = $("#notifications");
    notifications.html(`<div class="alert alert-${type}" role="alert">${body}</div>`);
    setTimeout(function(){
      notifications.html("");
    }, 5000);
  }

  static renderMessage(msg) {
    let user = this.sanitize(msg.user);
    let body = this.sanitize(msg.body);
    var messages = $("#messages");
    messages.append(`<p><b>[${user}]</b>: ${body}</p>`);
  }
}

$( () => App.init() );

export default App;
