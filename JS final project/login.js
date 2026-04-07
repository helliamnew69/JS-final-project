// Mảng tài khoản mẫu 
const defaultAccounts = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'user@example.com', password: 'user1234', role: 'user', name: 'User Regular' },
];

// Hàm lấy danh sách tài khoản từ localStorage hoặc tạo mặc định
function getAccounts() {
  const accountsStr = localStorage.getItem('accounts');
  if (accountsStr) {
    const accounts = JSON.parse(accountsStr);
    // Kết hợp với tài khoản mặc định nếu chưa có
    const allAccounts = [...defaultAccounts];
    accounts.forEach(acc => {
      if (!allAccounts.find(defaultAcc => defaultAcc.email === acc.email)) {
        allAccounts.push(acc);
      }
    });
    return allAccounts;
  }
  return defaultAccounts;
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.Form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  function clearErrors() {
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    emailError.textContent = '';
    emailError.style.display = 'none';
    passwordError.textContent = '';
    passwordError.style.display = 'none';
  }

  function setError(input, errorEl, message) {
    input.classList.add('input-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type = 'success') {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 2800);
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 3200);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let hasError = false;

    // Validation email
    if (!email) {
      setError(emailInput, emailError, 'Email không được để trống.');
      hasError = true;
    }

    // Validation password
    if (!password) {
      setError(passwordInput, passwordError, 'Mật khẩu không được để trống.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Check credentials
    const accounts = getAccounts();
    const account = accounts.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (!account) {
      // Email hoặc password không đúng
      const message = 'Email hoặc mật khẩu không đúng.';
      setError(emailInput, emailError, message);
      return;
    }

    // Đăng nhập thành công
    // Lưu user thông tin vào localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      email: account.email,
      role: account.role,
      name: account.name,
    }));

    // Hiển thị thông báo thành công dưới dạng toast
    showToast(`Đăng nhập thành công! Bạn được chuyển đến trang ${account.role === 'admin' ? 'quản lý' : 'chính'}.`, 'success');

    // Chuyển hướng sau 1.5 giây
    setTimeout(() => {
      if (account.role === 'admin') {
        window.location.href = 'danh-muc.html';
      } else {
        window.location.href = 'home.html';
      }
    }, 1500);
  });
});
