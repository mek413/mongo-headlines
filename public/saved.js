window.onload = function(){
    $.get("/savedArticles",function(data){
        for (let i = 0;i<data.length;i++) {
                let card = $("<div>").attr({"class": "card", "data-id": data[i]._id});
                let cardHeaderDiv =  $("<div>").addClass("card-header");
                let cardHeader = $("<h3>");
                let headerConent = $("<a>").attr({"class": "article-link","target": "_blank", "rel": "noopener noreferrer", "href": data[i].link
                }).text(data[i].title);
                let cardHeaderButton = $("<a>").addClass("btn btn-danger delete").text("DELETE FROM SAVED");
                let cardHeaderButtonTwo = $("<a>").addClass("btn btn-dark notes").text("ARTICLE NOTES");
                cardHeaderButtonTwo.attr({"data-toggle":"modal" , "data-target":"#myModal"})
                cardHeader.append(headerConent,cardHeaderButton,cardHeaderButtonTwo);
                cardHeaderDiv.append(cardHeader);
                let cardBodyDiv = $("<div>").addClass("card-body").text(data[i].summary);
                card.append(cardHeaderDiv,cardBodyDiv)
                $(".article-container").append(card);
        }
    })
}
$(document).on("click", ".clear", clearAll);
$(document).on("click", ".btn.notes", grabNotes);
$(document).on("click", ".btn.noteSave", saveNotes);
$(document).on("click", ".btn.note-delete", deleteNote);
$(document).on("click", ".btn.delete", deleteArticle);

function clearAll(){
    $(".article-container").empty();
    $.ajax({
        method: "DELETE",
        url: "/clear"
      }).then(function(data) {
      });
}

function deleteNote(){
    $(this).parents(".note").empty();
    var selectedNote = $(this).data()
    $.ajax({
        method: "DELETE",
        url: "/deleteNote/" + selectedNote.id
      }).then(function(data) {
      });
}

function deleteArticle(){
    $(this).parents(".card").remove();
    var selectedArticle = $(this).parents(".card").data()
    console.log(selectedArticle.id)
    $.ajax({
        method: "DELETE",
        url: "/deleteArticle/" + selectedArticle.id
      }).then(function(data) {
      });
}

function grabNotes(){
    $('.note-container').empty();
    var article = $(this)
    .parents(".card")
    .data()
    $.get("/getNotes/" + article.id ,function(data){
        $(".modal-title").attr("data-id", article.id).text("Notes For Article:" + article.id);
        for(let i = 0; i<data.note.length;i++){
            let note = $("<li>").addClass("list-group-item note").text(data.note[i].body)
            note.append(
            $("<button>").attr({"class":"btn btn-danger note-delete","data-id": data.note[i]._id})
            .text("x")
            )
            $(".note-container").append(note)
        }
    })
}

function saveNotes(){
        function validate(){
            var isValid = true;
            
            if ($(".noteEntry").val().trim() === ""){
                
             isValid = false;
        }
            return isValid;
        }
            
        if (validate()){
            var thisId = $(".modal-title").attr("data-id")
            $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    body: $(".noteEntry").val().trim()
                }
              }).then(function(data) {
              });
      }else {
          (alert("Please fill out all fields!"));
    }
    
    $(".noteEntry").val('');
}