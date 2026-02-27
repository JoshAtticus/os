$(document).ready(function() {
    var defaultWidth = 800;
    var defaultHeight = 600;
    var highestZIndex = 1; // Initialize the highest z-index

    function makeWindowDraggableAndResizable($window, allowResize, allowMaximize, allowDrag) {
        $window.draggable({
            handle: ".window-bar",
            containment: ".desktop",
            start: function () {
                // Prevent iframes from stealing mouse events during drag
                $(".app-iframe").css("pointer-events", "none");
                // Disable transitions during drag
                $window.addClass("no-transition");
            },
            stop: function () {
                // Restore pointer events
                $(".app-iframe").css("pointer-events", "auto");
                // Restore transitions
                $window.removeClass("no-transition");
            }
        });

        if (allowResize) {
            $window.resizable({
                containment: ".desktop",
                minHeight: 100,
                minWidth: 100,
                start: function() {
                     // Prevent iframes from stealing mouse events during resize
                    $(".app-iframe").css("pointer-events", "none");
                    // Disable transitions during resize
                    $window.addClass("no-transition");
                },
                stop: function() {
                    // Restore pointer events
                    $(".app-iframe").css("pointer-events", "auto");
                    // Restore transitions
                    $window.removeClass("no-transition");
                }
            }).on("resize", function () {
                var desktopHeight = $(".desktop").height();
                var windowHeight = $window.height();
                var windowWidth = $window.width();
                if (windowHeight > desktopHeight) {
                    $window.height(desktopHeight);
                }
                if (windowWidth > $(".desktop").width()) {
                    $window.width($(".desktop").width());
                }
            });
        }

        if (!allowDrag) {
            $window.draggable("disable");
            $window.removeClass("draggable");
        }

        // Bring window to front on click
        $window.on("mousedown", function() {
            highestZIndex++;
            $window.css("z-index", highestZIndex);
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
        makeWindowDraggableAndResizable($newWindow, true, true, true);

        // Set initial z-index and bring to front
        highestZIndex++;
        $newWindow.css("z-index", highestZIndex);

        // Move the new window based on available space
        var menuBarHeight = $(".menu-bar").outerHeight() || 40;
        var dockHeight = $(".dock").outerHeight() || 80;
        
        // Use absolute positioning for precise placement
        $newWindow.css("position", "absolute");
        
        // Calculate max dimensions
        var maxW = $(window).width() - 40; // 20px padding on sides
        var maxH = $(window).height() - menuBarHeight - dockHeight - 40; // Padding top/bottom

        // Determine initial size
        var setWidth = Math.min(defaultWidth, maxW);
        var setHeight = Math.min(defaultHeight, maxH);
        
        $newWindow.css({
            "width": setWidth + "px",
            "height": setHeight + "px"
        });
        
        // Calculate centered position
        var leftPos = ($(window).width() - setWidth) / 2;
        var availableH = $(window).height() - menuBarHeight - dockHeight;
        var topPos = menuBarHeight + (availableH - setHeight) / 2;
        
        $newWindow.css({
            "left": leftPos + "px",
            "top": topPos + "px"
        });

        // Show the new window
        $newWindow.addClass("open");
    });

    // Close window on click of red circle
    $(".desktop").on("click", ".red-circle", function() {
        var $window = $(this).closest(".app-window");
        $window.addClass("closing");
        
        // Fallback in case animationend doesn't fire
        var cleanupTimer = setTimeout(function() {
             $window.remove();
        }, 300); // slightly longer than animation duration specific in CSS (0.2s)

        $window.on("animationend", function() {
            clearTimeout(cleanupTimer);
            $window.remove();
        });
    });

    // Maximize/restore window on click of green circle
    $(".desktop").on("click", ".green-circle", function() {
        var $window = $(this).closest(".app-window");
        var menuBarHeight = $(".menu-bar").outerHeight() || 40;
        var dockHeight = $(".dock").outerHeight() || 80;

        if ($window.hasClass("maximized")) {
            $window.removeClass("maximized");
            
            // Calculate centered position for restore
            var maxW = $(window).width();
            var maxH = $(window).height() - menuBarHeight - dockHeight;
            var setWidth = Math.min(defaultWidth, maxW);
            var setHeight = Math.min(defaultHeight, maxH);
            
            var leftPos = ($(window).width() - setWidth) / 2;
            var topPos = menuBarHeight + (maxH - setHeight) / 2;

            $window.css({
                width: setWidth,
                height: setHeight,
                top: topPos,
                left: leftPos,
                'border-radius': '25px'
            });
        } else {
            $window.addClass("maximized");
            $window.css({
                width: $(window).width(),
                height: $(window).height() - menuBarHeight - dockHeight,
                top: menuBarHeight,
                left: 0,
                'border-radius': '0px'
            });
        }

        // Bring maximized window to front
        highestZIndex++;
        $window.css("z-index", highestZIndex);
    });

    $(".menu-bar").on("click", ".wallpaper-option", function() {
        var image = $(this).data("image");
        $("body").css("background-image", "url('" + image + "')");
        localStorage.setItem("wallpaper", image);
    });

    $(".menu-bar").on("click", ".close-windows-option", function() {
        $(".app-window").remove();
    });

    $(document).ready(function() {
        // Load the bold text and zoom settings from localStorage on page load
        var boldTextSetting = localStorage.getItem("boldTextSetting");
        if (boldTextSetting === "true") {
            $("body").addClass("bold-text");
        }

        var zoomSetting = localStorage.getItem("zoomSetting");
        if (zoomSetting) {
            $("body").css("zoom", zoomSetting + "%");
        }

        // Check if the user is using Safari
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // Toggle bold text setting and save to localStorage on click
        $(".menu-bar").on("click", ".toggle-bold-option", function() {
            $("body").toggleClass("bold-text");
            boldTextSetting = $("body").hasClass("bold-text") ? "true" : "false";
            localStorage.setItem("boldTextSetting", boldTextSetting);
        });

        // Apply "greyed out" style to "Toggle Zoom" option on Safari
        if (isSafari) {
            $(".zoom-menu").addClass("disabled");
            var safariZoomState = localStorage.getItem("safariZoomState");
            if (safariZoomState === "disabled") {
                $(".zoom-menu").addClass("disabled");
            }
        }

        // Handle zoom selection and apply chosen zoom level
        $(".zoom-option").on("click", function() {
            if (!isSafari) { // Only apply zoom if not using Safari
                var selectedZoom = $(this).data("zoom");
                $("body").css("zoom", selectedZoom + "%");
                localStorage.setItem("zoomSetting", selectedZoom);
            } else {
                $(".zoom-menu").addClass("disabled");
                localStorage.setItem("safariZoomState", "disabled");
            }
        });
    });

    $(document).ready(function() {
        $("body").css("background-image", "url('assets/wallpapers/default/wallpaper1.avif')");
    });

    $(document).ready(function() {
        var savedWallpaper = localStorage.getItem("wallpaper");
        if (savedWallpaper) {
            $("body").css("background-image", "url('" + savedWallpaper + "')");
        }
    });

    $(".menu-bar").on("click", ".file-upload-option", function() {
        $("#file-input").click();
    });

    $(".menu-bar").on("click", ".image-url-option", function() {
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
