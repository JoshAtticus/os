// Retrieve the editor element
const editor = document.getElementById('editor');

// Retrieve the font size and font family select elements
const fontSizeSelect = document.getElementById('fontsize');
const fontFamilySelect = document.getElementById('fontfamily');

// Retrieve the bold, italic, and underline buttons
const boldButton = document.getElementById('bold-btn');
const italicButton = document.getElementById('italic-btn');
const underlineButton = document.getElementById('underline-btn');

// Event listener for font size changes
fontSizeSelect.addEventListener('change', function() {
  const fontSize = this.value + 'px';
  applyFontStyle(fontSize);
});

// Event listener for font family changes
fontFamilySelect.addEventListener('change', function() {
  const fontFamily = this.value;
  applyFontStyle(null, fontFamily);
});

// Event listener for bold button click
boldButton.addEventListener('click', function() {
  applyStyleToSelection('bold');
});

// Event listener for italic button click
italicButton.addEventListener('click', function() {
  applyStyleToSelection('italic');
});

// Event listener for underline button click
underlineButton.addEventListener('click', function() {
  applyStyleToSelection('underline');
});

// Function to apply font style to selected text
function applyFontStyle(fontSize, fontFamily) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    if (fontSize) {
      span.style.fontSize = fontSize;
    }
    if (fontFamily) {
      span.style.fontFamily = fontFamily;
    }
    range.surroundContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Function to apply style to selected text
function applyStyleToSelection(style) {
  document.execCommand(style);
}
