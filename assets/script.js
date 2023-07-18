$(document).ready(function() {
    var resizing = false;
    var resizeStartWidth, resizeStartHeight;
    var defaultWidth = 800;
    var defaultHeight = 600;

    $(".app-window").draggable({
        handle: ".window-bar",
        containment: ".desktop",
        start: function() {
            resizing = false;
            resizeStartWidth = $(this).width();
            resizeStartHeight = $(this).height();
        }
    }).resizable({
        containment: ".desktop",
        minHeight: 200,
        minWidth: 200,
        resize: function(event, ui) {
            if (resizing) {
                var widthDelta = ui.size.width - resizeStartWidth;
                var heightDelta = ui.size.height - resizeStartHeight;

                $(this).width(resizeStartWidth + widthDelta);
                $(this).height(resizeStartHeight + heightDelta);
            } else {
                resizing = true;
                resizeStartWidth = $(this).width();
                resizeStartHeight = $(this).height();
            }
        }
    }).on("resize", function() {
        var desktopHeight = $(".desktop").height();
        var windowHeight = $(this).height();
        var windowWidth = $(this).width();
        if (windowHeight > desktopHeight) {
            $(this).height(desktopHeight);
        }
        if (windowWidth > $(".desktop").width()) {
            $(this).width($(".desktop").width());
        }
    });

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
    });

    $(".green-circle").click(function() {
        var $window = $(this).closest(".app-window");
        var $desktop = $window.closest(".desktop");

        if ($window.hasClass("maximized")) {
            $window.removeClass("maximized");
            $window.css({
                width: defaultWidth,
                height: defaultHeight,
                top: ($desktop.height() - defaultHeight) / 2,
                left: ($desktop.width() - defaultWidth) / 2
            });
        } else {
            $window.addClass("maximized");
            $window.css({
                width: $desktop.width(),
                height: $desktop.height(),
                top: 0,
                left: 0
            });
        }
    });
});