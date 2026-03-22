(function () {
  const ACCESS_KEY = 'medrex_access_token';
  const REQUIRED_TOKEN = 'bWVkcmV4LWFjY2Vzcy0yMDI2'; // btoa('medrex-access-2026')
  const LOGIN_PATHS = new Set(['', '/', '/login', '/login/']);

  function normalizePath(pathname) {
    if (!pathname) return '/';
    const withoutIndex = pathname.replace(/index\.html$/i, '');
    if (withoutIndex === '' || withoutIndex === '/') return '/';
    return withoutIndex.endsWith('/')
      ? withoutIndex.slice(0, -1) || '/'
      : withoutIndex;
  }

  function isAuthorized() {
    return localStorage.getItem(ACCESS_KEY) === REQUIRED_TOKEN;
  }

  function authorize(code) {
    if (!code) return false;
    const candidate = btoa(code.trim().toLowerCase());
    if (candidate === REQUIRED_TOKEN) {
      localStorage.setItem(ACCESS_KEY, REQUIRED_TOKEN);
      return true;
    }
    return false;
  }

  function revoke() {
    localStorage.removeItem(ACCESS_KEY);
  }

  const currentPath = normalizePath(window.location.pathname);
  const onLoginPage = currentPath === '/login';

  if (!onLoginPage && !isAuthorized()) {
    window.location.replace('/login/');
    return;
  }

  if (onLoginPage && isAuthorized()) {
    window.location.replace('/');
    return;
  }

  window.MedRexAccess = {
    authorize,
    revoke,
    isAuthorized,
    ACCESS_KEY,
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-logout]').forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        revoke();
        window.location.replace('/login/');
      });
    });
  });

  if (onLoginPage) {
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('[data-login-form]');
      if (!form) return;

      const message = form.querySelector('[data-login-message]');
      const input = form.querySelector('input[name="accessCode"]');

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const code = input ? input.value : '';

        if (message) {
          message.textContent = '';
          message.classList.remove('error');
        }

        if (authorize(code)) {
          window.location.replace('/');
        } else if (message) {
          message.textContent = 'That code does not match. Please try again.';
          message.classList.add('error');
        }
      });

      if (input && message) {
        input.addEventListener('input', () => {
          if (message.textContent) {
            message.textContent = '';
            message.classList.remove('error');
          }
        });
      }
    });
  }
})();
