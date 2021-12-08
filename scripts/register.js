async function registeruser(event) {
    event.preventDefault()
    const username = document.getElementById('uname').value
    const password = document.getElementById('psw').value
    const age = document.getElementById('age').value
    const skintype = document.getElementById('skintype').value
    const eyecolor = document.getElementById('eyecolor').value
    const birthday = document.getElementById('birthday').value

    const result = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        age,
        skintype,
        eyecolor,
        birthday
      })
    }).then((res) => res.json())
    if (result.status === 'ok') {
      // everythign went fine
     alert("Succesfully Registered!")  
    } else {
      alert(result.error)
    }  
  }

  const form = document.getElementById('registerForm')
	form.addEventListener('submit', registeruser)

			