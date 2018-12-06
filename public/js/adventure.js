document.getElementById("background").addEventListener("mousemove", showComponents);

var city = document.getElementById("city");
var desert = document.getElementById("desert");
var temple = document.getElementById("temple");
var right_mountain = document.getElementById("right_mountain");
var left_mountain = document.getElementById("left_mountain");
var grassland = document.getElementById("grassland");
var ruin = document.getElementById("ruin");


var margin_left=300;
var margin_top=80;

city.addEventListener("mousemove", returnToMap);
desert.addEventListener("mousemove", returnToMap);
temple.addEventListener("mousemove", returnToMap);
right_mountain.addEventListener("mousemove", returnToMap);
left_mountain.addEventListener("mousemove", returnToMap);
grassland.addEventListener("mousemove", returnToMap);
ruin.addEventListener("mousemove", returnToMap);

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
    
    console.log(event.clientX, event.clientY);
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
};