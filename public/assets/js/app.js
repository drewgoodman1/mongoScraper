//click handler for scrape articles button
$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    })
    .then(function(data) {
         console.log(data);
         window.location = "/";
    })
});

//click handler for save article button
$(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    //use ajax post to request modification of article
    $.ajax({
        method: "POST",
        url: "articles/save/" + thisId
    })
    .then(function(data) {
        window.location = "/";
    })
});