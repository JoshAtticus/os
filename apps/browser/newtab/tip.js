      // Array of phrases
      var tips = [
        "You can drag windows around in AtticusOS. Simply click and hold on the title bar, then move your mouse cursor around.",
        "Type ../../ into the URL bar and click go to open another AtticusOS session in this browser",
        "Want to learn more about CORS in this browser and how to disable it? Type <b>corsinfo</b> into the URL bar and click go.",
        "Google doesn't work in this browser due to CORS. Instead, you can use Bing, or if you also want Google search results, use https://search.tosdr.org",
        "Want to use Scratch? We recommend https://penguinmod.site, it has more features and works in this browser!",
        "If your browser has sync functionalities, your AtticusOS preferences will sync across devices."
      ];

      // Function to display a random phrase
      function displayRandomTip() {
        var randomIndex = Math.floor(Math.random() * tips.length);
        var randomTip = tips[randomIndex];
        document.getElementById('random-tip').innerHTML = randomTip;
      }
