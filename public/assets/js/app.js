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

//click handler for delete article button
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        window.location = "/saved"
    })
});

//click handler to create a note
$(".saveNote").on("click", function() {
    var thisId = $(this).attr("data-id");
    if (!$("#noteText" + thisId).val()) {
        alert("Please enter a note.")
    }else {
        $.ajax({
            method: "POST",
            url: "/notes/save/" + thisId,
            data: {
                text: $("#noteText" + thisId).val()
            }
        }).done(function(data) {
            console.log(data);
            $("#noteText" + thisId).val("");
            $(".modalNote").modal("hide");
            window.location = "/saved"
        });
    }
});





