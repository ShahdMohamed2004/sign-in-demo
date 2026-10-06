(() => {
  const card = document.getElementById('sign-in-card');
  const form = document.getElementById('sign-in-form');
  const password = document.getElementById('password');
  const passwordToggle = document.getElementById('password-toggle');
  const submitButton = document.getElementById('submit-button');
  const toast = document.getElementById('demo-toast');
  let toastTimer;

  const showDemoMessage = (message) => {
    toast.textContent = message;
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
      showDemoMessage('Email/password sign-in is not configured yet.');
    }, 900);
  });

  document.querySelectorAll('[data-demo-action]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.demoAction === 'Google sign-in') {
        showDemoMessage('Google sign-in needs a Firebase project and OAuth setup first.');
        return;
      }
      showDemoMessage(`${button.dataset.demoAction} isn’t connected in this visual demo.`);
    });
  });

  const wrap = card.closest('.card-wrap');
  const scene = document.querySelector('.scene');
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, max) => Math.max(-max, Math.min(max, value));
  const applyTilt = (event, limit) => {
    const bounds = wrap.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    card.style.setProperty('--tilt-x', `${clamp(-y / (bounds.height / limit), limit)}deg`);
    card.style.setProperty('--tilt-y', `${clamp(x / (bounds.width / limit), limit)}deg`);
  };
  const resetTilt = () => {
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  };

  if (!reduceMotion) {
    scene.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'touch') return;
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      scene.style.setProperty('--ambient-x', `${x}%`);
      scene.style.setProperty('--ambient-y', `${y}%`);
    }, { passive: true });

    if (canTilt) {
      wrap.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') applyTilt(event, 7);
      });
      wrap.addEventListener('pointerleave', resetTilt);
    } else {
      wrap.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch') return;
        if (!event.target.closest('input, button, a')) applyTilt(event, 2.5);
      }, { passive: true });
      wrap.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'touch' || !event.buttons) return;
        if (!event.target.closest('input, button, a')) applyTilt(event, 2.5);
      }, { passive: true });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
        wrap.addEventListener(eventName, resetTilt, { passive: true });
      });
    }
  }
})();
