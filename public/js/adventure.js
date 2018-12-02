document.getElementById("background").addEventListener("mousemove", showComponents);

var city = document.getElementById("city");
var desert = document.getElementById("desert");
var temple = document.getElementById("temple");
var right_mountain = document.getElementById("right_mountain");
var left_mountain = document.getElementById("left_mountain");
var grassland = document.getElementById("grassland");
var ruin = document.getElementById("ruin");

var margin_left=0, margin_top=0;

city.addEventListener("mousemove", returnToMap);
desert.addEventListener("mousemove", returnToMap);
temple.addEventListener("mousemove", returnToMap);
right_mountain.addEventListener("mousemove", returnToMap);
left_mountain.addEventListener("mousemove", returnToMap);
grassland.addEventListener("mousemove", returnToMap);
ruin.addEventListener("mousemove", returnToMap);

function showComponents(event) {
    if (check(405, 500, 620, 600, event))
        city.style.visibility = "visible";
    else if (check(400, 380, 660, 480, event))
        desert.style.visibility = "visible";
    else if (check(450, 220, 580, 310, event))
        temple.style.visibility = "visible";
    else if (check(690, 180, 860, 300, event))
        right_mountain.style.visibility = "visible";
    else if (check(120, 120, 310, 275, event))
        left_mountain.style.visibility = "visible";
    else if (check(720, 380, 970, 600, event))
        grassland.style.visibility = "visible";
    else if (check(420, 130, 570, 190, event))
        ruin.style.visibility = "visible";
};

function returnToMap(event) {
    var city = document.getElementById("city");
    if (!(check(405, 500, 620, 600, event)))
        city.style.visibility = "hidden";
    if (!(check(400, 380, 660, 480, event)))
        desert.style.visibility = "hidden";
    if (!(check(450, 220, 580, 310, event)))
        temple.style.visibility = "hidden";
    if (!(check(690, 180, 860, 300, event)))
        right_mountain.style.visibility = "hidden";
    if (!(check(120, 120, 310, 275, event)))
        left_mountain.style.visibility = "hidden";
    if (!(check(720, 380, 970, 600, event)))
        grassland.style.visibility = "hidden";
    if (!(check(420, 130, 570, 190, event)))
        ruin.style.visibility = "hidden";
}

function check(startX, startY, endX, endY, event) {
    var posX = event.clientX + margin_left;
    var posY = event.clientY + margin_top;
    startX = startX + margin_left;
    startY = startY + margin_top;
    endX = endX + margin_left;
    endY = endY + margin_top;

    if ((startX <= posX && posX < endX) && (startY <= posY && posY < endY))
        return true;
    else
        return false;
};