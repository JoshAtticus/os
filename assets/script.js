$(document).ready(function() {
    $(".app-link").click(function() {
        var url = $(this).data("url");
        var appTitle = $(this).data("title");

        $(".app-iframe").attr("src", url);
        $(".app-window").addClass("open");
        $(".title").text(appTitle);
        $(".app-window").removeClass("maximized"); // Add this line to remove the maximized class
    });

    $(".red-circle").click(function() {
        $(".app-window").removeClass("open");
        $(".app-iframe").attr("src", "");
        $(".title").text("");
    });

    $(".green-circle").click(function() {
        $(".app-window").toggleClass("maximized");
    });

    $(".app-window").draggable({
        handle: ".window-bar",
        containment: "body",
        scroll: false
    });

    $(".app-window").resizable({
        handles: "n, e, s, w, ne, se, sw, nw",
        containment: "body",
        minWidth: 200,
        minHeight: 200,
        start: function(event, ui) {
            $(this).removeClass("maximized"); // Add this line to remove the maximized class when resizing starts
        }
    });
});
