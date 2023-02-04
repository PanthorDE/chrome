var button = document.createElement("a");
var span = document.createElement("span");
var img = document.createElement("img")
span.appendChild(img);
button.appendChild(span);
button.href = "https://support.panthor.de/steamre" + window.location.pathname
button.className = "btn_profile_action btn_medium";
button.target = "_blank"
span.className = "panthor-button";
img.src = "https://static.panthor.de/img/brand/icon128.png"
img.className = "reward_btn_icon"
img.style.width="20px"
img.style.height="auto"
buttons = document.getElementsByClassName("profile_header_actions")[0];
buttons.appendChild(button)

