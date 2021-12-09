window.onload = async function () {
    let loader = createLoader(document.body);
    await getUsers();
    document.body.removeChild(loader)
    loadUsers();
};

let userTable = document.querySelector('#userTable')

let users = [];

async function getUsers() {
  users = [];
  return new Promise((resolve, reject) => {
    const request = new Request(`/api/user`, {
        method: 'get', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            // return a promise that resolves with the JSON body
          return res.json() 
      } else {
            createWindowMessage('Could not get users', true);
            reject();
      }                
    })
    .then((json) => {  // the resolved promise with the JSON body
        json.users.map((u) => {
          if (u._id != localStorage.getItem('objid')) {
            users.push(new User(u._id, u.username));
          }
        })
        resolve();
    }).catch((error) => {
        console.log(error)
        reject()
    })
  })
}


function loadUsers() {
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

function removeFromDatabase(IDToRemove) {
  return new Promise((resolve, reject) => {
    const request = new Request(`/api/user/${IDToRemove}`, {
        method: 'delete', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
      if (res.status === 200) {
        createWindowMessage('User deleted');
        resolve();
      } else {
        createWindowMessage('Could not delete user', true);
        reject();
      }                
    }).catch((error) => {
        console.log(error)
        reject()
    })
  })
}

async function removeUser(uid) {
  let loader = createLoader(document.body);
  await removeFromDatabase(uid);
  createWindowMessage('User Deleted');
  await getUsers();
  document.body.removeChild(loader);
  loadUsers();
}

function search() {
  const input = document.getElementById("searchBar2").value;
  const table = document.getElementById("userTable");
  const tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[0];
    let td2 = tr[i].getElementsByTagName("td")[1];
    if (td && td2) {
      txtValue1 = td.textContent || td.innerText;
      txtValue2 = td2.textContent || td2.innerText;
      if (txtValue1.includes(input) || input == '' || txtValue2.includes(input)) {
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
