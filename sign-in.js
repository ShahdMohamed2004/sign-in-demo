(() => {
  const card = document.getElementById('sign-in-card');
  const form = document.getElementById('sign-in-form');
  const password = document.getElementById('password');
  const passwordToggle = document.getElementById('password-toggle');
  const submitButton = document.getElementById('submit-button');
  const toast = document.getElementById('demo-toast');
  let toastTimer;

  const showDemoMessage = (message) => {
    toast.textContent = `${message} isn’t connected in this visual demo.`;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };

  passwordToggle.addEventListener('click', () => {
    const showing = passwordToggle.getAttribute('aria-pressed') !== 'true';
    password.type = showing ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', String(showing));
    passwordToggle.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
    password.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.classList.add('is-loading');
    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.classList.remove('is-loading');
      showDemoMessage('Sign-in');
    }, 900);
  });

  document.querySelectorAll('[data-demo-action]').forEach((button) => {
    button.addEventListener('click', () => showDemoMessage(button.dataset.demoAction));
  });

  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canTilt && !reduceMotion) {
    const wrap = card.closest('.card-wrap');
    wrap.addEventListener('pointermove', (event) => {
      const bounds = wrap.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      const rotateX = Math.max(-8, Math.min(8, -y / 25));
      const rotateY = Math.max(-8, Math.min(8, x / 25));
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    wrap.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }
})();
