$(document).ready(function() {
    $(".app-link").click(function() {
        var url = $(this).data("url");
        var appTitle = $(this).data("title");

        $(".app-iframe").attr("src", url);
        $(".app-window").addClass("open");
        $(".title").text(appTitle);
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
        minHeight: 200
    });
});
