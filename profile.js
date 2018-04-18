var button = document.createElement("a");
var span = document.createElement("span");
var text = document.createTextNode("R")
span.appendChild(text);
button.appendChild(span);
button.href = "https://support.realliferpg.de/steamre" + window.location.pathname;
span.className = "rl-button";
button.className = "btn_profile_action btn_medium";
buttons = document.getElementsByClassName("profile_header_actions")[0];
buttons.appendChild(button)

