var typeList = document.querySelectorAll('.type-category .type');
var submit = document.querySelector(".search-box button")

for (var i = 0; i < typeList.length; i++) {
    typeList[i].addEventListener("click", sendFilterQuery);
}

function sendFilterQuery() {
    var classList = this.className.split(" ");
    var type = this.innerHTML;
    
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/api/search");
    
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "search_data");
    hiddenField.setAttribute("value", type);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
}