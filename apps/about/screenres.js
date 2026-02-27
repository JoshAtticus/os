$(document).ready(function() {

    // Update screen resolution in the <span> element
    function updateScreenResolution() {
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        var screenResolution = screenWidth + " x " + screenHeight;
        $(".screen-resolution").text(screenResolution);
    }

    // Initial update on page load
    updateScreenResolution();

});
