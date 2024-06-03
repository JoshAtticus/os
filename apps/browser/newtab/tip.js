      // Array of phrases
      var tips = [
        "You can drag windows around in AtticusOS. Simply click and hold on the title bar, then move your mouse cursor around.",
        "Type ../../ into the URL bar and click go to open another AtticusOS session in this browser",
        "Want to use Scratch? We recommend https://penguinmod.com, it has more features and works in this browser!",
        "If your browser has sync functionalities, your AtticusOS preferences will sync across devices.",
        "The web version of AtticusOS's web browser is heavily limited by CORS. Using the desktop app will bypass this and fix almost every site."
      ];

      // Function to display a random phrase
      function displayRandomTip() {
        var randomIndex = Math.floor(Math.random() * tips.length);
        var randomTip = tips[randomIndex];
        document.getElementById('random-tip').innerHTML = randomTip;
      }
