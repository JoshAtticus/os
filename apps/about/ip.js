$(document).ready(function() {
    // ... (other code)

    // Update IP address, country, and ISP in the <span> elements
    function updateIpInfo() {
        getIpAddress(function(ipAddress, country, isp) {
            $(".ip-info").text(ipAddress);
            $(".country-info").text(country);
            $(".isp-info").text(isp);
        }, function(error) {
            $(".ip-info").text("Failed to get info :(");
            $(".country-info").text("Failed to get info :(");
            $(".isp-info").text("Failed to get info :(");
        });
    }

    // Function to get IP address, country, and ISP
    function getIpAddress(successCallback, errorCallback) {
        // Make a request to an IP lookup service with a timeout
        $.ajax({
            url: "https://ipapi.co/json/",
            timeout: 5000, // Timeout in milliseconds (adjust as needed)
            success: function(data) {
                var ipAddress = data.ip;
                var country = data.country_name;
                var isp = data.org;
                successCallback(ipAddress, country, isp);
            },
            error: function() {
                errorCallback();
            }
        });
    }

    // Initial update on page load
    updateIpInfo();

    // ... (other code)
});
