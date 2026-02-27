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

    // Initialize System API
    window.System = {
        openApp: function(url, title, width, height) {
            // Create a new window
            var $newWindow = $('<div class="app-window"><div class="window-bar"><div class="red-circle"></div><div class="green-circle"></div><div class="title"></div></div><embed class="app-iframe" src=""></embed></div>');
            $newWindow.find(".app-iframe").attr("src", url);
            $newWindow.find(".title").text(title);
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
            var w = width ? parseInt(width) : defaultWidth;
            var h = height ? parseInt(height) : defaultHeight;
            
            var setWidth = Math.min(w, maxW);
            var setHeight = Math.min(h, maxH);
            
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
            
            return $newWindow;
        },
        restart: function() {
            location.reload();
        },
        changeWallpaper: function(url) {
            $("body").css("background-image", "url('" + url + "')");
            localStorage.setItem("wallpaper", url);
        },
        addMenuBarWidget: function(html) {
             // ensure menu-group right exists
             if ($(".menu-group.right").length === 0) {
                 $(".menu-bar").append('<div class="menu-group right" style="display:flex; margin-left: auto; align-items:center; padding-right:15px;"></div>');
             }
             // Ensure widgets container exists
             if ($(".menu-group.right .widgets").length === 0) {
                 $(".menu-group.right").prepend('<div class="widgets" style="display:flex; gap:10px; margin-right:10px;"></div>');
             }
             $(".menu-group.right .widgets").append(html);
        }
    };

    $(".app-link").click(function() {
        var url = $(this).data("url");
        var appTitle = $(this).data("title");
        var width = $(this).data("width");
        var height = $(this).data("height");
        
        System.openApp(url, appTitle, width, height);
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

    // --- Context Menu Logic ---
    $(document).on("contextmenu", function(e) {
        // Allow default context menu inside apps (iframes)
        if ($(e.target).closest(".app-window").length > 0) return true;
        
        e.preventDefault();
        
        // Remove existing custom menu
        $("#custom-context-menu").remove();
        
        // Create Menu Structure
        var menu = $('<div id="custom-context-menu" class="context-menu"></div>');
        
        var changeWallpaperItem = $('<div class="context-item"><span class="icon">🖼️</span> Change Wallpaper...</div>');
        changeWallpaperItem.on("click", function() {
            System.openApp('apps/settings/index.html', 'Settings', 800, 600);
            $("#custom-context-menu").remove();
        });
        
        var settingsItem = $('<div class="context-item"><span class="icon">⚙️</span> Settings...</div>');
        settingsItem.on("click", function() {
            System.openApp('apps/settings/index.html', 'Settings', 800, 600);
            $("#custom-context-menu").remove();
        });
        
        var moreOptionsItem = $('<div class="context-item separator-top"><span class="icon">⋮</span> More Options...</div>');
        moreOptionsItem.on("click", function(event) {
             // To show the browser context menu, we can't trigger it programmatically.
             // We can only stop preventing default on the NEXT click.
             $("#custom-context-menu").remove();
             alert("Right click again now to see the browser menu.");
             
             // Temporarily enhance the next context menu event
             var originalHandler = $(document).data("events") ? $(document).data("events").contextmenu : null;
             // But jQuery event handlers are complex. 
             // Better approach: set a flag.
             window.skipCustomContextMenu = true;
             setTimeout(function() { window.skipCustomContextMenu = false; }, 2000);
        });

        menu.append(changeWallpaperItem);
        menu.append(settingsItem);
        menu.append(moreOptionsItem);
        
        $("body").append(menu);
        
        // Position Menu (check bounds)
        var menuWidth = menu.outerWidth();
        var menuHeight = menu.outerHeight();
        var x = e.pageX;
        var y = e.pageY;
        
        if (x + menuWidth > $(window).width()) x -= menuWidth;
        if (y + menuHeight > $(window).height()) y -= menuHeight;
        
        menu.css({top: y, left: x});
        menu.addClass("visible");
    });
    
    // Close context menu on click anywhere else
    $(document).on("click", function(e) {
        if (!$(e.target).closest("#custom-context-menu").length) {
            $("#custom-context-menu").remove();
        }
    });

    // Check flag for context menu
    var originalContextMenu = document.oncontextmenu;
    document.addEventListener('contextmenu', function(e) {
        if (window.skipCustomContextMenu) {
            e.stopPropagation(); // Stop our jQuery handler from running again?
            return true; // Use default
        }
    }, true); // Capture phase


    // --- Dock Logic ---
    // Function to update dock indicators
    function updateDockIndicators() {
        $(".dock-icon").removeClass("open");
        
        $(".app-window").each(function() {
            // Find corresponding dock icon based on title/alt text mapping 
            // Ideally we need data-app attributes. 
            // For now, let's rely on mapping common names.
            var title = $(this).find(".title").text().toLowerCase();
            
            $(".dock-icon img").each(function() {
                var alt = $(this).attr("alt").toLowerCase();
                 // Heuristic matching
                if (title.includes(alt) || alt.includes(title) || (title.includes("settings") && alt.includes("settings"))) {
                    $(this).parent().addClass("open");
                }
            });
        });
    }

    // Call updates whenever windows change
    // We hook into our System.openApp and makeWindowDraggableAndResizable (which handles close click)
    // But since we removed the original window creation code blocks, we need to ensure our new System functions call this.
    
    // Override/Extend the window removal logic we edited earlier to update dock
    var originalRemove = $.fn.remove;
    // ... risky to override jQuery.remove.
    // Instead let's use a MutationObserver on .desktop
    var observer = new MutationObserver(function(mutations) {
        updateDockIndicators();
    });
    var desktop = document.querySelector(".desktop");
    if(desktop) observer.observe(desktop, { childList: true });

});
