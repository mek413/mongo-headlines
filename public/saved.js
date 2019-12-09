window.onload = function(){
    $.get("/savedArticles",function(data){
        for (let i = 0;i<data.length;i++) {
                let card = $("<div>").attr({"class": "card", "data-id": data[i]._id});
                let cardHeaderDiv =  $("<div>").addClass("card-header");
                let cardHeader = $("<h3>");
                let headerConent = $("<a>").attr({"class": "article-link","target": "_blank", "rel": "noopener noreferrer", "href": data[i].link
                }).text(data[i].title);
                let cardHeaderButton = $("<a>").addClass("btn btn-danger delete").text("DELETE FROM SAVED");
                let cardHeaderButtonTwo = $("<a>").addClass("btn btn-dark notes").text("Article Notes");
                cardHeader.append(headerConent,cardHeaderButton,cardHeaderButtonTwo);
                cardHeaderDiv.append(cardHeader);
                let cardBodyDiv = $("<div>").addClass("card-body").text(data[i].summary);
                card.append(cardHeaderDiv,cardBodyDiv)
                $(".article-container").append(card);
        }
    })
}
$(document).on("click", ".clear", clearAll)
function clearAll(){
    $(".article-container").empty();
    $.ajax({
        method: "DELETE",
        url: "/clear"
      }).then(function(data) {
      });
}