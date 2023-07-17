 // Function to update the time every second
 function updateTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var meridiem = hours >= 12 ? 'PM' : 'AM';

    // Convert the hours to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zeros if necessary
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Update the content of the <h1> element
    var timeString = hours + ':' + minutes + ':' + seconds + ' ' + meridiem;
    document.getElementById('current-time').innerHTML = timeString;
  }

  // Call updateTime function every second
  setInterval(updateTime, 1000);