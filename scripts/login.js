async function validatelogin(event) {
    event.preventDefault()
    const username = document.getElementById('uname').value
    const password = document.getElementById('psw').value

    const result = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then((res) => res.json())

    if (result.status === 'ok') {
      // everythign went fine
      console.log('userid: ', result.uid)
      console.log('admin: ', result.admin)
      localStorage.setItem('objid', result.uid)
      if (result.admin){
        alert("Logged in as admin!");
        window.localStorage.setItem('role', 'admin');
        window.location.href = "/index.html";
        return true;
      }
      else{
        alert("Logged in as user!");
        window.localStorage.setItem('role', 'user');
        window.location.href = "/index.html";
        return true;
      }
    } else {
      alert(result.error)
    }
  }

  const form = document.getElementById('loginForm')
	form.addEventListener('submit', validatelogin)

			