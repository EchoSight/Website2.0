document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const feedback = form.querySelector('.form-feedback');

  const setFeedback = (message, isError = false) => {
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.toggle('form-feedback--error', isError);
      feedback.classList.toggle('form-feedback--success', !isError);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setFeedback('');

    const formData = new FormData(form);
    const honeypot = formData.get('company');
    if (honeypot) {
      setFeedback('Something went wrong. Please try again or email us directly.', true);
      return;
    }

    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    const consent = formData.get('consent');

    if (!name || !email || !message || !consent) {
      setFeedback('Please complete the required fields before submitting.', true);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setFeedback('Please enter a valid email address.', true);
      return;
    }

    setFeedback('Thank you! We’ve received your message and will respond within one working day.');
    form.reset();
  });
});
