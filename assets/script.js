$(document).ready(function() {
    var resizing = false;
    var resizeStartWidth, resizeStartHeight;
    var defaultWidth = 800;
    var defaultHeight = 600;

    function makeWindowDraggableAndResizable($window) {
        $window.draggable({
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
    }

    $(".app-link").click(function() {
        var url = $(this).data("url");
        var appTitle = $(this).data("title");

        // Create a new window
        var $newWindow = $('<div class="app-window"><div class="window-bar"><div class="red-circle"></div><div class="green-circle"></div><div class="title"></div></div><iframe class="app-iframe" src=""></iframe></div>');
        $newWindow.find(".app-iframe").attr("src", url);
        $newWindow.find(".title").text(appTitle);
        $newWindow.appendTo(".desktop");

        // Make the new window draggable and resizable
        makeWindowDraggableAndResizable($newWindow);

        // Show the new window
        $newWindow.addClass("open");
    });

    // Close window on click of red circle
    $(".desktop").on("click", ".red-circle", function() {
        var $window = $(this).closest(".app-window");
        $window.remove();
    });

    // Maximize/restore window on click of green circle
    $(".desktop").on("click", ".green-circle", function() {
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