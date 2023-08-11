$(document).ready(function() {
    // ... (other code)

    // Update browser information in the <span> element
    function updateBrowserInfo() {
        var browserInfo = getBrowserInfo();
        $(".browser-info").text(browserInfo);
    }

    // Function to get browser information
    function getBrowserInfo() {
        var ua = navigator.userAgent;
        var tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }

        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
        }

        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

        return M.join(' ');
    }

    // Initial update on page load
    updateBrowserInfo();

    // ... (other code)
});

$(document).ready(function() {
    // ... (other code)

    // Update operating system information in the <span> element
    function updateOsInfo() {
        var osInfo = getOsInfo();
        $(".os-info").text(osInfo);
    }

    // Function to get operating system information
    function getOsInfo() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        var os;

        if (/windows phone/i.test(userAgent)) {
            os = "Windows Phone";
        } else if (/android/i.test(userAgent)) {
            os = "Android";
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            os = "iOS";
        } else if (/Mac/i.test(userAgent)) {
            os = "Mac OS";
        } else if (/Linux|X11/.test(userAgent)) {
            os = "Linux";
        } else if (/Windows/.test(userAgent)) {
            os = "Windows";
        } else {
            os = "Unknown";
        }

        return os;
    }

    // Initial update on page load
    updateOsInfo();

    // ... (other code)
});
