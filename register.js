document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const authmessage = document.getElementById('auth-msg');
        if(password !== confirmPassword){
            authmessage.textContent = 'Passwords do not match';
            alert('Passwords do not match');
            return;
        }

        try{
            const respose = await fetch('http://localhost:9000/api/register',{
               method: 'POST',
               headers : {
                'Content-Type': 'application/json'
               }, 
               body: JSON.stringify({email, username, password})
            } );
            const data = await respose.json();
            if(!respose.ok){
                authmessage.textContent = 'User already exists';
            } else {
                authmessage.textContent =  'User Created Successfully';
            }
        }catch(e){
            authmessage.textContent = e.message || 'An error occured';
        }
    });
});