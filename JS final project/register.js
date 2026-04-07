document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.register-form');
  const fullname = document.getElementById('fullname');
  const firstname = document.getElementById('firstname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const accept = document.getElementById('accept');
  const fullnameError = document.getElementById('fullname-error');
  const firstnameError = document.getElementById('firstname-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');
  const acceptError = document.getElementById('accept-error');

  // Lấy danh sách tài khoản từ localStorage hoặc tạo mảng rỗng
  function getAccounts() {
    const accountsStr = localStorage.getItem('accounts');
    return accountsStr ? JSON.parse(accountsStr) : [];
  }

  // Lưu danh sách tài khoản vào localStorage
  function saveAccounts(accounts) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }

  function validateEmail(value) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  }

  function clearErrorStyles() {
    [fullname, firstname, email, password, confirmPassword, accept].forEach((el) => {
      if (el) {
        el.classList.remove('input-error');
      }
    });
    [fullnameError, firstnameError, emailError, passwordError, confirmPasswordError, acceptError].forEach((el) => {
      if (el) {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
  }

  function setError(el, msg) {
    if (!el) return;
    if (el !== accept) {
      el.classList.add('input-error');
    }

    let errorEl;
    if (el === accept) {
      errorEl = acceptError;
    } else if (el.id) {
      errorEl = document.getElementById(`${el.id}-error`);
    }

    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
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
    clearErrorStyles();

    let hasError = false;

    if (!fullname.value.trim()) {
      hasError = true;
      setError(fullname, 'Họ và tên không được để trống.');
    }
    if (!firstname.value.trim()) {
      hasError = true;
      setError(firstname, 'Tên không được để trống.');
    }
    if (!email.value.trim()) {
      hasError = true;
      setError(email, 'Email không được để trống.');
    } else if (!validateEmail(email.value.trim())) {
      hasError = true;
      setError(email, 'Email không hợp lệ.');
    } else {
      // Kiểm tra email đã tồn tại
      const accounts = getAccounts();
      const existingAccount = accounts.find(acc => acc.email.toLowerCase() === email.value.trim().toLowerCase());
      if (existingAccount) {
        hasError = true;
        setError(email, 'Email này đã được đăng ký.');
      }
    }
    if (!password.value) {
      hasError = true;
      setError(password, 'Mật khẩu không được để trống.');
    } else if (password.value.length < 8) {
      hasError = true;
      setError(password, 'Mật khẩu phải tối thiểu 8 ký tự.');
    }
    if (!confirmPassword.value) {
      hasError = true;
      setError(confirmPassword, 'Mật khẩu xác nhận không được để trống.');
    } else if (password.value && confirmPassword.value !== password.value) {
      hasError = true;
      setError(confirmPassword, 'Mật khẩu xác nhận phải trùng khớp.');
    }
    if (!accept.checked) {
      hasError = true;
      setError(acceptError, 'Bạn phải đồng ý với chính sách và điều khoản.');
    }

    if (hasError) {
      return;
    }

    // Lưu thông tin tài khoản mới
    const newAccount = {
      email: email.value.trim().toLowerCase(),
      password: password.value,
      role: 'user',
      name: `${firstname.value.trim()} ${fullname.value.trim()}`,
      fullname: fullname.value.trim(),
      firstname: firstname.value.trim()
    };

    const accounts = getAccounts();
    accounts.push(newAccount);
    saveAccounts(accounts);

    showToast('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1700);
  });
});
