document.addEventListener('DOMContentLoaded', (event) => {
  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach((codeBlock) => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';

    codeBlock.parentNode.insertBefore(button, codeBlock);

    button.addEventListener('click', () => {
      const textarea = document.createElement('textarea');
      textarea.value = codeBlock.innerText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
  });
});
