$(document).ready(function() {
    $(".app-link").click(function() {
        var url = $(this).data("url");
        var appTitle = $(this).data("title");
        var appWindow = $("<div>").addClass("app-window resizable draggable").appendTo(".desktop");
        var windowBar = $("<div>").addClass("window-bar").appendTo(appWindow);
        var closeButton = $("<div>").addClass("red-circle").appendTo(windowBar);
        var maximizeButton = $("<div>").addClass("green-circle").appendTo(windowBar);
        var title = $("<div>").addClass("title").text(appTitle).appendTo(windowBar);
        var iframe = $("<iframe>").addClass("app-iframe").attr("src", url).appendTo(appWindow);

        closeButton.click(function() {
            appWindow.remove();
        });

        maximizeButton.click(function() {
            appWindow.toggleClass("maximized");
        });

        appWindow.draggable({
            handle: windowBar,
            containment: ".desktop",
            scroll: false
        });

        appWindow.resizable({
            handles: "n, e, s, w, ne, se, sw, nw",
            containment: ".desktop",
            minWidth: 200,
            minHeight: 200
        });
    });

    function updateTime() {
        var currentDate = new Date();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12 || 12;

        // Add leading zeros to minutes if less than 10
        minutes = minutes < 10 ? '0' + minutes : minutes;

        // Update the clock display
        $('.clock').text(hours + ':' + minutes + ' ' + ampm);
    }

    // Call updateTime initially
    updateTime();

    // Update time every second
    setInterval(updateTime, 1000);
});
