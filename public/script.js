const apiURL = '/api/users';
const userList = document.getElementById('user-list');
const userForm = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const userIdInput = document.getElementById('user-id');
const submitButton = document.getElementById('submit-button');
const loadingSpinner = document.getElementById('loading');

async function fetchUsers() {
  showLoadingSpinner();
  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error('Failed to fetch users');
    const users = await response.json();
    await displayUsers(users);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    hideLoadingSpinner();
  }
}

async function displayUsers(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'user-item';
    userDiv.innerHTML = `
      <span>${user.name}</span>
      <button class="edit-btn" onclick="editUser('${user._id}', '${user.name}')">Edit</button>
      <button class="delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
    `;
    userList.appendChild(userDiv);
  });
}

async function addUser(userData) {
  showLoadingSpinner();
  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to add user');
    await fetchUsers();
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    hideLoadingSpinner();
  }
}

async function deleteUser(id) {
  showLoadingSpinner();
  try {
    const response = await fetch(`${apiURL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete user');
    await fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    hideLoadingSpinner();
  }
}

function editUser(id, name) {
  userIdInput.value = id;
  usernameInput.value = name;
  submitButton.textContent = 'Update User';
}

async function updateUser(id, userData) {
  showLoadingSpinner();
  try {
    const response = await fetch(`${apiURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to update user');
    await fetchUsers();
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    hideLoadingSpinner();
  }
}


userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = usernameInput.value.trim();
  if (!name) {
    alert('User name is required');
    return;
  }

  const userId = userIdInput.value;
  
  try {
    if (userId) {
      await updateUser(userId, { name });
      submitButton.textContent = 'Add User';
    } else {
      await addUser({ name });
    }
    
    userForm.reset();
    userIdInput.value = '';
  } catch (error) {
    console.error('Form submission error:', error);
  }
});

// Initial load
document.addEventListener('DOMContentLoaded', fetchUsers);

function showLoadingSpinner() {
  loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
  loadingSpinner.style.display = 'none';
}