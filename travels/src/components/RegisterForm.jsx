import React,{useState} from 'react'
import axios from 'axios'

const RegisterForm = () => {
    const [form, setform] = useState({
        username:'', email:'', password:''
    })
    const [message, setmessage] =useState('')
    const handlechange=(e)=>{
      setform({...form, [e.target.name]:e.target.value})
    }
 
    const handleSubmit =async(e)=>{   // Form reloads page
        e.preventDefault()  //Stops page refresh
                              //Keeps React app running
        try{
          await axios.post("http://localhost:8000/api/register/",form);
          setmessage('Registration successful')
        } 
        catch (error) {
  setmessage("Registration failed", +(error.response?.data?.username || error.message ) )}

    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
    <div>
      <label >Username</label>
      <input type="text" name='username' value={form.username} onChange={handlechange} /> <br />
      <label >Email</label>
      <input type="text" name='email' value={form.email} onChange={handlechange} /> <br />
      <label >Password</label>
      <input type="password" name='password' value={form.password} onChange={handlechange}  /> <br />
      <button type='submit'>Register</button>
      {message && <p>{message}</p>}
    </div>
      </form>
      
    </div>
  )
}

export default RegisterForm
