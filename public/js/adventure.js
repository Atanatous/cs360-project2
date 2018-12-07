document.getElementById("background").addEventListener("mousemove", showComponents);

var city = document.getElementById("city");
var desert = document.getElementById("desert");
var temple = document.getElementById("temple");
var right_mountain = document.getElementById("right_mountain");
var left_mountain = document.getElementById("left_mountain");
var grassland = document.getElementById("grassland");
var ruin = document.getElementById("ruin");

// Get the modal
var modal = document.getElementById('myModal');

// Get the elements that submit / closes the modal
var okBtn = document.getElementById("confirm");
var clsBtn = document.getElementById("close");

var margin_left=300;
var margin_top=80;

city.addEventListener("mousemove", returnToMap);
desert.addEventListener("mousemove", returnToMap);
temple.addEventListener("mousemove", returnToMap);
right_mountain.addEventListener("mousemove", returnToMap);
left_mountain.addEventListener("mousemove", returnToMap);
grassland.addEventListener("mousemove", returnToMap);
ruin.addEventListener("mousemove", returnToMap);

city.addEventListener("click", showModal);
desert.addEventListener("click", showModal);
temple.addEventListener("click", showModal);
right_mountain.addEventListener("click", showModal);
left_mountain.addEventListener("click", showModal);
grassland.addEventListener("click", showModal);
ruin.addEventListener("click", showModal);

function showModal(event) {
    var time = document.getElementById("time");
    var gold = document.getElementById("gold");
    var componentId = this.id;

    if (componentId == "city"){
        time.innerHTML="소요 시간 : 5s";
        gold.innerHTML="예상 획득 금화 : 100 gold";
    }
    if (componentId == "ruin"){
        time.innerHTML="소요 시간 : 60s";
        gold.innerHTML="예상 획득 금화 : 600 gold";
    }
    if (componentId == "desert"){
        time.innerHTML="소요 시간 : 10s";
        gold.innerHTML="예상 획득 금화 : 150 gold";
    }
    if (componentId == "right_mountain"){
        time.innerHTML="소요 시간 : 20s";
        gold.innerHTML="예상 획득 금화 : 200 gold";
    }
    if (componentId == "left_mountain"){
        time.innerHTML="소요 시간 : 20s";
        gold.innerHTML="예상 획득 금화 : 200 gold";
    }
    if (componentId == "grassland"){
        time.innerHTML="소요 시간 : 30s";
        gold.innerHTML="예상 획득 금화 : 300 gold";
    }
    if (componentId == "temple"){
        time.innerHTML="소요 시간 : 25s";
        gold.innerHTML="예상 획득 금화 : 250 gold";
    }

    modal.style.display = "block";

    okBtn.onclick = function() {    
        var form = document.createElement("form");
        
        form.setAttribute("method", "post");
        form.setAttribute("action", "/adventure/" + componentId);
        
        document.body.appendChild(form);
        form.submit();
    };

    // When the user clicks on close, close the modal
    clsBtn.onclick = function() {
        modal.style.display = "none";
    };
}

function showComponents(event) {
    if (check(540, 660, 820, 815, event))
        city.style.visibility = "visible";
    else if (check(520, 500, 890, 645, event))
        desert.style.visibility = "visible";
    else if (check(550, 170, 750, 240, event))
        ruin.style.visibility = "visible";
    else if (check(900, 250, 1180, 420, event))
        right_mountain.style.visibility = "visible";
    else if (check(120, 160, 440, 400, event))
        left_mountain.style.visibility = "visible";
    else if (check(950, 520, 1280, 820, event))
        grassland.style.visibility = "visible";
    else if (check(520, 270, 830, 460, event))
        temple.style.visibility = "visible";
}

function returnToMap(event) {
    if (!(check(540, 660, 820, 815, event)))
        city.style.visibility = "hidden";
    if (!(check(520, 500, 890, 645, event)))
        desert.style.visibility = "hidden";
    if (!(check(550, 170, 750, 240, event)))
        ruin.style.visibility = "hidden";
    if (!(check(900, 250, 1180, 420, event)))
        right_mountain.style.visibility = "hidden";
    if (!(check(120, 160, 440, 400, event)))
        left_mountain.style.visibility = "hidden";
    if (!(check(950, 520, 1280, 820, event)))
        grassland.style.visibility = "hidden";
    if (!(check(520, 270, 830, 460, event)))
        temple.style.visibility ="hidden";
}

function check(startX, startY, endX, endY, event) {
    var posX = event.clientX;
    var posY = event.clientY;
    startX = startX + margin_left;
    startY = startY + margin_top;
    endX = endX + margin_left;
    endY = endY + margin_top;

    if ((startX <= posX && posX < endX) && (startY <= posY && posY < endY))
        return true;
    else
        return false;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}