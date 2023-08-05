$(document).ready(function() {
    var resizing = false;
    var resizeStartWidth, resizeStartHeight;
    var defaultWidth = 600;
    var defaultHeight = 400;

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
            minHeight: 100,
            minWidth: 100,
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
        var $newWindow = $('<div class="app-window"><div class="window-bar"><div class="red-circle"></div><div class="green-circle"></div><div class="title"></div></div><embed class="app-iframe" src=""></embed></div>');
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
        var dockHeight = $(".dock").outerHeight();

        if ($window.hasClass("maximized")) {
            $window.removeClass("maximized");
            $window.css({
                width: defaultWidth,
                height: defaultHeight,
                top: ($desktop.height() - defaultHeight - dockHeight) / 2,
                left: ($desktop.width() - defaultWidth) / 2
            });
        } else {
            $window.addClass("maximized");
            $window.css({
                width: $desktop.width(),
                height: $desktop.height() - dockHeight,
                top: 0,
                left: 0
            });
        }
    });

    $(".menu-items").on("click", ".wallpaper-option", function() {
        var image = $(this).data("image");
        $("body").css("background-image", "url('" + image + "')");
        localStorage.setItem("wallpaper", image);
    });    
        
    $(document).ready(function() {
        $("body").css("background-image", "url('assets/wallpaper1.png')");
    });

    $(document).ready(function() {
        var savedWallpaper = localStorage.getItem("wallpaper");
        if (savedWallpaper) {
            $("body").css("background-image", "url('" + savedWallpaper + "')");
        }
    });
    
    $(".menu-items").on("click", ".file-upload-option", function() {
        $("#file-input").click();
    });
    
    
    $(".menu-items").on("click", ".image-url-option", function() {
        var imageUrl = prompt("Please enter an image URL:", "");
        if (imageUrl) {
            $("body").css("background-image", "url('" + imageUrl + "')");
            localStorage.setItem("wallpaper", imageUrl);
        }
    });    

    $("#file-input").change(function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var imageUrl = e.target.result;
                $("body").css("background-image", "url('" + imageUrl + "')");
                localStorage.setItem("wallpaper", imageUrl);
            };
            reader.readAsDataURL(file);
        }
    });
    
});
