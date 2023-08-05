function updateAnalogClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var hourHand = document.getElementById('hour-hand');
    var minuteHand = document.getElementById('minute-hand');
    var secondHand = document.getElementById('second-hand');
    hourHand.style.transform = 'rotate(' + (hours * 30 + minutes * 0.5) + 'deg)';
    minuteHand.style.transform = 'rotate(' + (minutes * 6 + seconds * 0.1) + 'deg)';
    secondHand.style.transform = 'rotate(' + (seconds * 6) + 'deg)';
 }
 setInterval(updateAnalogClock,1000);
 
 function updateDigitalClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >=12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert to 12-hour format
    minutes = minutes < 10 ? '0' + minutes : minutes; // add leading zero
    var time = hours + ':' + minutes + ' ' + ampm;
    document.getElementById('digital-clock').innerHTML = time;
 }
 setInterval(updateDigitalClock,1000);
 
 function updateCalendar() {
    var now = new Date();
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var month = now.getMonth();
    document.getElementById('month').innerHTML = monthNames[month];
    document.getElementById('day').innerHTML = now.getDate();
    document.getElementById('year').innerHTML = now.getFullYear();
 }
 updateCalendar();
 
 function createTicks() {
     var ticksContainer = document.getElementById('ticks');
     for (var i=0;i<60;i++) {
         var tickElement;
         if (i % 5 === 0) {
             tickElement = document.createElement('div');
             tickElement.className = 'hour-tick';
             tickElement.style.transform = `rotate(${i*6}deg)`;
             tickElement.innerHTML = `<div style="transform:rotate(-${i*6}deg)">${i/5 || 12}</div>`;
         } else {
             tickElement = document.createElement('div');
             tickElement.className = 'tick';
             tickElement.style.transform = `rotate(${i*6}deg)`;
         }
         ticksContainer.appendChild(tickElement);
     }
 }
 createTicks();
 