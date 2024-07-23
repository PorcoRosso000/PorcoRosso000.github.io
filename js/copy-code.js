document.addEventListener("DOMContentLoaded", function() {
  var codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(function(codeBlock) {
    var button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.innerText = 'Copy';
    button.addEventListener('click', function() {
      var code = codeBlock.innerText;
      navigator.clipboard.writeText(code).then(function() {
        button.innerText = 'Copied';
        setTimeout(function() {
          button.innerText = 'Copy';
        }, 2000);
      }, function() {
        button.innerText = 'Failed';
      });
    });
    codeBlock.parentNode.insertBefore(button, codeBlock);
  });
});
