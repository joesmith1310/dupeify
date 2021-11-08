window.onload = function () {
    loadUsers();
};

function loadUsers() {
    const userTable = document.querySelector('#userTable')
    clearTable(userTable);
    for (let i=0; i<users.length; i++) {
        const row = document.createElement('tr');
        const userIDCell = document.createElement('td');
        const usernameCell = document.createElement('td');
        const removeButtonBox = document.createElement('td');
        const removeButton = document.createElement('div');
        userIDCell.innerText = users[i].userID;
        usernameCell.innerText = users[i].username;
        removeButton.innerText = 'Remove';
        removeButton.classList.add('button');
        removeButton.addEventListener('click', function(){
            removeUser(users[i].userID)});
        removeButtonBox.appendChild(removeButton);
        row.appendChild(userIDCell);
        row.appendChild(usernameCell);
        row.appendChild(removeButton);
        userTable.appendChild(row);
    }
}

function removeUser(IDToRemove) {
    console.log("REMOVE");
    let index = -1;
    for (let i=0; i<users.length; i++) {
        if (users[i].userID == IDToRemove) {
            index = i;
        }
    }
    if (index > -1) {
        users.splice(index, 1);
    }
    loadUsers();
}

function search() {
  const input = document.getElementById("searchBar").value;
  const table = document.getElementById("userTable");
  const tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[0];
    console.log(td);
    if (td) {
      txtValue = td.textContent || td.innerText;
      console.log(txtValue);
      console.log(input);
      if (txtValue == input || input == '') {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function clearTable(parent) {
    while (parent.childElementCount > 1) {
        parent.removeChild(parent.lastChild);
    }
}
