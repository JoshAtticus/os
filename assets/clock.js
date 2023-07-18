// Update clock display
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var timeString = hours + ':' + minutes + ' ' + ampm;
    $(".clock").text(timeString);
}

// Update clock display every second
setInterval(updateClock, 1000);
