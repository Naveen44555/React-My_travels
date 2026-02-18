import React,{useState} from 'react'
import axios from 'axios'

        // onlogin -- Used to store token after login
const LoginForm = ({onlogin}) => {
    const [form, setform] = useState({
        username:'', password:''
    })
    const [message, setmessage] =useState('')
    const handlechange=(e)=>{
      setform({...form, [e.target.name]:e.target.value})
    }
    const handleSubmit =async(e)=>{
        e.preventDefault()   //Stops browser from refreshing page
        try {
            const response =await axios.post("http://localhost:8000/api/login/",form)
            setmessage('Login success')

            if(onlogin){   // Save token in localStorage, Use token for future API calls
                onlogin(response.data.token, response.data.user_id)
            }
        } catch (error) {
            setmessage("login failed")
        }
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
    <div>
      <label >Username</label>
      <input type="text" name='username' value={form.username} onChange={handlechange} /> <br />
   
      <label >Password</label>
      <input type="password" name='password' value={form.password} onChange={handlechange}  /> <br />
      <button type='submit'>Login</button>
      {message && <p>{message}</p>}
    </div>
      </form>
    </div>
  )
}

export default LoginForm
