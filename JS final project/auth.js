// Utility functions for authentication and user management

function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function logout() {
  const confirmLogout = confirm('Bạn có chắc chắn muốn đăng xuất?');
  if (!confirmLogout) {
    return;
  }
  localStorage.removeItem('currentUser');
  if (window.showToast) {
    window.showToast('Đăng xuất thành công.', 'success', 2000);
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } else {
    alert('Đã đăng xuất thành công!');
    window.location.href = 'login.html';
  }
}

function checkLoginStatus() {
  // Nếu trang cần đăng nhập mà user chưa login, chuyển về login
  const currentPath = window.location.pathname;
  const protectedPages = ['danh-muc.html', 'dashboard.html'];

  if (protectedPages.some(page => currentPath.includes(page)) && !isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Hàm để hiển thị info user ở navbar
function displayUserInfo() {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  // Nếu trang đã có user menu tùy chỉnh thì không chèn thêm thông tin user tự động
  if (document.querySelector('.user-menu')) {
    return;
  }

  let userInfoEl = document.getElementById('user-info');
  if (!userInfoEl) {
    userInfoEl = document.createElement('div');
    userInfoEl.id = 'user-info';
    userInfoEl.style.cssText = 'display: flex; align-items: center; gap: 8px; cursor: pointer;';
    userInfoEl.innerHTML = `
      <span style="font-size: 14px; color: #333;">👤 ${user.name}</span>
      <button id="logout-btn" style="padding: 6px 12px; background: #fff; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;">Đăng xuất</button>
    `;
    const navbar = document.querySelector('nav');
    if (navbar && navbar.parentElement) {
      navbar.parentElement.insertBefore(userInfoEl, navbar.nextSibling);
    }
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function () {
  // Setup logout button dalam dashboard/admin
  const userAvatarBtn = document.getElementById('user-avatar-btn');
  if (userAvatarBtn) {
    userAvatarBtn.addEventListener('click', logout);
  }

  if (isLoggedIn()) {
    displayUserInfo();
  }
});
