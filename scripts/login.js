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
        window.localStorage.setItem('role', 'admin');
        window.location.href = "/index.html";
        return true;
      }
      else{
        window.localStorage.setItem('role', 'user');
        window.location.href = "/index.html";
        return true;
      }
    } else {
      createWindowMessage("Username or password not recognised.", true);
    }
  }

  const form = document.getElementById('loginForm')
	form.addEventListener('submit', validatelogin)

			