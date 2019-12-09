window.onload = function(){
    $.get("/articles",function(data){
        for (let i = 0;i<data.length;i++) {
            if (i < 10 ){
                if (data[i].isItSaved == false){
                let card = $("<div>").attr({"class": "card", "data-id": data[i]._id});
                let cardHeaderDiv =  $("<div>").addClass("card-header");
                let cardHeader = $("<h3>");
                let headerConent = $("<a>").attr({"class": "article-link","target": "_blank", "rel": "noopener noreferrer", "href": data[i].link
                }).text(data[i].title);
                let cardHeaderButton = $("<a>").addClass("btn btn-success save").text("SAVE ARTICLE");
                cardHeader.append(headerConent,cardHeaderButton);
                cardHeaderDiv.append(cardHeader);
                let cardBodyDiv = $("<div>").addClass("card-body").text(data[i].summary);
                card.append(cardHeaderDiv,cardBodyDiv)
                $(".article-container").append(card);}
            }else{
                break;
            }
        }
    })
}
var isDataValid = true;
$(document).on("click", ".btn.save", articleSaver)
$(document).on("click", ".scrape", renderArticles)
$(document).on("click",".clear", clearAll)

function articleSaver(){
    var savedArticle = $(this)
      .parents(".card")
      .data();

    $(this)
    .parents(".card")
    .remove();

  savedArticle.saved = true;

  $.ajax({
    method: "PUT",
    url: "/api/headlines/" + savedArticle.id,
    data: savedArticle
  }).then(function(data) {
      console.log("saved")
  });

    
}
function renderArticles(){
    $.get("/scrape", function(data){
        var validData = []
        for (let i = 0; i<data.length;i++){
            if (data[i].title === ""){
                isDataValid = false
            }else {isDataValid = true}

            if (data[i].link === ""){
                isDataValid = false
            }else{isDataValid = true}
            if (data[i].summary === "") {
                isDataValid = false
            }else{isDataValid = true}
            
            if (isDataValid == true){
                validData.push({
                    id: data[i]._id,
                    title: data[i].title,
                    link: data[i].link,
                    summary: data[i].summary
                })
            }
        }
        for (let i = 0;i<validData.length;i++) {
            if (i < 5){
                let card = $("<div>").attr({"class": "card", "data-id": validData[i].id});
                let cardHeaderDiv =  $("<div>").addClass("card-header");
                let cardHeader = $("<h3>");
                let headerConent = $("<a>").attr({"class": "article-link","target": "_blank", "rel": "noopener noreferrer", "href": validData[i].link
                }).text(validData[i].title);
                let cardHeaderButton = $("<a>").addClass("btn btn-success save").text("SAVE ARTICLE");
                cardHeader.append(headerConent,cardHeaderButton);
                cardHeaderDiv.append(cardHeader);
                let cardBodyDiv = $("<div>").addClass("card-body").text(validData[i].summary);
                card.append(cardHeaderDiv,cardBodyDiv)
                $(".article-container").append(card);
            }else{
                break;
            }
        }
    })
}
function clearAll(){
    $(".article-container").empty();
    $.ajax({
        method: "DELETE",
        url: "/clear"
      }).then(function(data) {
      });
}