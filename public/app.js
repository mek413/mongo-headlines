$('.scrape').on("click", function(){
    $.get("/scrape", function(data){
        console.log(data)
    })
})