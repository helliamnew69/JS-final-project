const tableBody = document.querySelector('.table-wrapper tbody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const sortSelect = document.getElementById('sortSelect');
const pagination = document.querySelector('.pagination');
const sortButtons = document.querySelectorAll('.sort-btn');
const searchButton = document.querySelector('.search-btn');
const btnAddCategory = document.getElementById('btnAddCategory');
const addCategoryModal = document.getElementById('addCategoryModal');
const closeAddModalBtn = document.getElementById('closeAddModal');
const cancelAdd = document.getElementById('cancelAdd');
const submitAdd = document.getElementById('submitAdd');
const newCategoryCode = document.getElementById('newCategoryCode');
const newCategoryName = document.getElementById('newCategoryName');
const editCategoryModal = document.getElementById('editCategoryModal');
const closeEditModalBtn = document.getElementById('closeEditModal');
const cancelEdit = document.getElementById('cancelEdit');
const submitEdit = document.getElementById('submitEdit');
const editCategoryCode = document.getElementById('editCategoryCode');
const editCategoryName = document.getElementById('editCategoryName');

const categoryStorageKey = 'ecommerceCategories';
const productStorageKey = 'ecommerceProducts';

let currentPage = 1;
const pageSize = 5;
let currentSortKey = sortSelect ? sortSelect.value : 'createdAt';
let currentSortOrder = 'desc';
let currentSearch = '';
let currentStatus = statusFilter ? statusFilter.value : 'all';
let categories = [];

function getStoredCategories() {
  try {
    return JSON.parse(localStorage.getItem(categoryStorageKey)) || null;
  } catch (error) {
    return null;
  }
}

function saveCategories() {
  localStorage.setItem(categoryStorageKey, JSON.stringify(categories));
}

function getStoredProducts() {
  try {
    return JSON.parse(localStorage.getItem(productStorageKey)) || [];
  } catch (error) {
    return [];
  }
}

function getProductCountForCategory(categoryCode) {
  const products = getStoredProducts();
  return products.filter((item) => item.categoryCode === categoryCode).length;
}

function openAddModal() {
  if (addCategoryModal) {
    addCategoryModal.style.display = 'flex';
    if (newCategoryCode) newCategoryCode.focus();
  }
}

function closeAddModal() {
  if (addCategoryModal) {
    addCategoryModal.style.display = 'none';
    if (newCategoryCode) newCategoryCode.value = '';
    if (newCategoryName) newCategoryName.value = '';
    const activeRadio = document.querySelector('input[name="newStatus"][value="active"]');
    if (activeRadio) activeRadio.checked = true;
  }
}

function openEditModal(category) {
  if (editCategoryModal && editCategoryCode && editCategoryName) {
    editCategoryCode.value = category.code;
    editCategoryName.value = category.name;
    const activeRadio = document.querySelector(`input[name="editStatus"][value="${category.status}"]`);
    if (activeRadio) activeRadio.checked = true;
    editCategoryModal.style.display = 'flex';
    editCategoryName.focus();
  }
}

function closeEditModal() {
  if (editCategoryModal) {
    editCategoryModal.style.display = 'none';
  }
}

function handleAddCategory() {
  const code = newCategoryCode ? newCategoryCode.value.trim() : '';
  const name = newCategoryName ? newCategoryName.value.trim() : '';
  const status = document.querySelector('input[name="newStatus"]:checked')?.value || 'active';

  if (!code) {
    alert('Vui lòng nhập mã danh mục.');
    return;
  }
  if (!name) {
    alert('Vui lòng nhập tên danh mục.');
    return;
  }

  // Kiểm tra mã danh mục đã tồn tại
  if (categories.some((cat) => cat.code.toLowerCase() === code.toLowerCase())) {
    alert('Mã danh mục đã tồn tại.');
    return;
  }

  // Kiểm tra tên danh mục đã tồn tại (không phân biệt hoa thường)
  if (categories.some((cat) => cat.name.toLowerCase() === name.toLowerCase())) {
    alert('Tên danh mục đã tồn tại.');
    return;
  }

  const newCategory = {
    id: code,
    code,
    name,
    status,
    createdAt: Date.now(),
  };

  categories.unshift(newCategory); // Thêm vào đầu danh sách
  saveCategories();
  closeAddModal();
  alert('Thêm danh mục thành công!');
  renderTable();
}

function handleEditCategory() {
  const code = editCategoryCode ? editCategoryCode.value.trim() : '';
  const name = editCategoryName ? editCategoryName.value.trim() : '';
  const status = document.querySelector('input[name="editStatus"]:checked')?.value || 'active';

  if (!code) {
    alert('Vui lòng nhập mã danh mục.');
    return;
  }
  if (!name) {
    alert('Vui lòng nhập tên danh mục.');
    return;
  }

  const category = categories.find((cat) => cat.code === code);
  if (!category) {
    alert('Danh mục không tồn tại.');
    return;
  }

  // Kiểm tra trùng tên danh mục - không cho trùng với danh mục khác (không phân biệt hoa thường)
  const isDuplicateName = categories.some((cat) => 
    cat.code !== code && cat.name.toLowerCase() === name.toLowerCase()
  );
  if (isDuplicateName) {
    alert('Tên danh mục này đã tồn tại. Vui lòng chọn tên khác.');
    return;
  }

  category.name = name;
  category.status = status;
  category.updatedAt = Date.now();
  saveCategories();
  closeEditModal();
  alert('Cập nhật danh mục thành công!');
  renderTable();
}

function parseInitialCategories() {
  const storedCategories = getStoredCategories();
  if (storedCategories && Array.isArray(storedCategories) && storedCategories.length > 0) {
    categories = storedCategories;
    return;
  }

  // Default categories if no stored data
  categories = [
    { id: 'DM001', code: 'DM001', name: 'Quần áo', status: 'active', createdAt: Date.now() - 6 * 86400000 },
    { id: 'DM002', code: 'DM002', name: 'Kính mắt', status: 'inactive', createdAt: Date.now() - 5 * 86400000 },
    { id: 'DM003', code: 'DM003', name: 'Giày dép', status: 'active', createdAt: Date.now() - 4 * 86400000 },
    { id: 'DM004', code: 'DM004', name: 'Thời trang nam', status: 'inactive', createdAt: Date.now() - 3 * 86400000 },
    { id: 'DM005', code: 'DM005', name: 'Thời trang nữ', status: 'inactive', createdAt: Date.now() - 2 * 86400000 },
    { id: 'DM006', code: 'DM006', name: 'Hoa quả', status: 'inactive', createdAt: Date.now() - 1 * 86400000 },
    { id: 'DM007', code: 'DM007', name: 'Rau', status: 'active', createdAt: Date.now() },
  ];
  saveCategories();
}

function getFilteredCategories() {
  return categories.filter((category) => {
    const matchesSearch = currentSearch
      ? category.name.toLowerCase().includes(currentSearch.toLowerCase())
      : true;
    const matchesStatus = currentStatus === 'all' ? true : category.status === currentStatus;
    return matchesSearch && matchesStatus;
  });
}

function sortCategories(list) {
  return list.slice().sort((a, b) => {
    let left = a[currentSortKey];
    let right = b[currentSortKey];

    if (currentSortKey === 'createdAt') {
      left = Number(left);
      right = Number(right);
    } else {
      left = String(left).toLowerCase();
      right = String(right).toLowerCase();
    }

    if (left < right) return currentSortOrder === 'asc' ? -1 : 1;
    if (left > right) return currentSortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

function renderTable() {
  if (!tableBody) return;
  const filtered = sortCategories(getFilteredCategories());
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  tableBody.innerHTML = '';

  if (pageItems.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="4" style="text-align:center; padding: 24px 0;">Không có danh mục phù hợp.</td>';
    tableBody.appendChild(emptyRow);
  } else {
    pageItems.forEach((category) => {
      const row = document.createElement('tr');
      const badgeClass = category.status === 'active' ? 'badge badge-active' : 'badge badge-inactive';
      const badgeText = category.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động';
      row.innerHTML = `
        <td>${category.code}</td>
        <td>${category.name}</td>
        <td>
          <span class="${badgeClass}">
            <span class="badge-dot"></span>
            ${badgeText}
          </span>
        </td>
        <td class="action-cell">
          <button class="btn-icon delete-btn" aria-label="Xóa">
            <img src="https://www.figma.com/api/mcp/asset/aa9471dc-404a-4367-abde-ba0282773476" alt="trash" />
          </button>
          <button class="btn-icon edit-btn" aria-label="Sửa">
            <img src="https://www.figma.com/api/mcp/asset/b173f6bb-c859-437d-9139-32de314f7ad3" alt="edit" />
          </button>
        </td>
      `;
      row.dataset.categoryId = category.id;
      tableBody.appendChild(row);
    });
  }

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (!pagination) return;
  pagination.innerHTML = '';

  const createPageButton = (label, page, isActive = false, disabled = false) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-btn';
    button.textContent = label;
    if (isActive) button.classList.add('active');
    button.disabled = disabled;
    button.addEventListener('click', () => {
      if (disabled) return;
      currentPage = page;
      renderTable();
    });
    return button;
  };

  pagination.appendChild(createPageButton('←', Math.max(1, currentPage - 1), false, currentPage === 1));

  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pagination.appendChild(createPageButton(i, i, i === currentPage));
  }

  pagination.appendChild(createPageButton('→', Math.min(totalPages, currentPage + 1), false, currentPage === totalPages));
}

function updateFilters() {
  currentSearch = searchInput ? searchInput.value.trim() : '';
  currentStatus = statusFilter ? statusFilter.value : 'all';
  if (sortSelect) {
    currentSortKey = sortSelect.value;
  }
  currentPage = 1;
  renderTable();
}

function setupSortSelect() {
  if (!sortSelect) return;
  sortSelect.addEventListener('change', () => {
    currentSortKey = sortSelect.value;
    currentSortOrder = 'asc';
    renderTable();
  });
}

function setupSortButtons() {
  sortButtons.forEach((button) => {
    button.addEventListener('click', () => {
      let key = button.dataset.sort;
      if (!key) return;
      if (currentSortKey === key) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortKey = key;
        currentSortOrder = 'asc';
      }

      if (sortSelect) {
        sortSelect.value = currentSortKey;
      }

      sortButtons.forEach((btn) => {
        const icon = btn.querySelector('.sort-icon');
        if (icon) icon.src = 'arrow-down.svg';
      });

      const icon = button.querySelector('.sort-icon');
      if (icon) icon.src = currentSortOrder === 'asc' ? 'arrow-up.svg' : 'arrow-down.svg';

      renderTable();
    });
  });
}

function setupEvents() {
  if (searchInput) {
    searchInput.addEventListener('input', updateFilters);
  }
  if (searchButton) {
    searchButton.addEventListener('click', updateFilters);
  }
  if (statusFilter) {
    statusFilter.addEventListener('change', updateFilters);
  }
  if (btnAddCategory) {
    btnAddCategory.addEventListener('click', openAddModal);
  }
  if (closeAddModalBtn) {
    closeAddModalBtn.addEventListener('click', closeAddModal);
  }
  if (cancelAdd) {
    cancelAdd.addEventListener('click', closeAddModal);
  }
  if (submitAdd) {
    submitAdd.addEventListener('click', handleAddCategory);
  }
  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', closeEditModal);
  }
  if (cancelEdit) {
    cancelEdit.addEventListener('click', closeEditModal);
  }
  if (submitEdit) {
    submitEdit.addEventListener('click', handleEditCategory);
  }
  if (addCategoryModal) {
    addCategoryModal.addEventListener('click', (event) => {
      if (event.target === addCategoryModal) {
        closeAddModal();
      }
    });
  }
  if (editCategoryModal) {
    editCategoryModal.addEventListener('click', (event) => {
      if (event.target === editCategoryModal) {
        closeEditModal();
      }
    });
  }
  if (tableBody) {
    tableBody.addEventListener('click', (event) => {
      const deleteButton = event.target.closest('.delete-btn');
      const editButton = event.target.closest('.edit-btn');
      const row = event.target.closest('tr');
      if (!row) return;
      const categoryId = row.dataset.categoryId;
      if (deleteButton) {
        const category = categories.find((item) => item.id === categoryId);
        if (!category) return;

        const productCount = getProductCountForCategory(category.code);
        if (productCount > 0) {
          alert(`Danh mục "${category.name}" đang có ${productCount} sản phẩm và không thể xóa.`);
          return;
        }

        const confirmed = confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}" (${category.code}) không?`);
        if (!confirmed) return;

        categories = categories.filter((item) => item.id !== categoryId);
        saveCategories();
        renderTable();
      }
      if (editButton) {
        const category = categories.find((item) => item.id === categoryId);
        if (!category) return;
        openEditModal(category);
      }
    });
  }
}

function initCategoryPage() {
  parseInitialCategories();
  setupSortButtons();
  setupSortSelect();
  setupEvents();
  renderTable();
}

initCategoryPage();
