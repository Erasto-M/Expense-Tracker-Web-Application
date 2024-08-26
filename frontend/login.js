document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('form');
    form.addEventListener('submit',async (e)=>{
        e.preventDefault();
      

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const authmessage = document.getElementById('auth-msg');

        try{
            const response = await fetch('http://localhost:9000/api/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                   
                },
                body: JSON.stringify({username,password})
            });
            const data = await  response.json();
            if(!response.ok){
                authmessage.textContent =  data.message ||'Incorrect username or Password';
            } else{
                localStorage.setItem('token', data.token);
                authmessage.textContent = data.message||'Login successful';
                window.location.href = 'dashboard.html';
            }
        }catch(e){
            authmessage.textContent = 'An error occured';
        }
    });
});