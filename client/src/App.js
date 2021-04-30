import axios from 'axios'
import { useState, useEffect } from 'react'

axios.defaults.baseURL = 'http://localhost:2727/'
axios.defaults.withCredentials = true

function App() {

  const [m, setM] = useState("logged out")


  const login = async () => {
    const res = await axios.get('/login')
    //automatically set on the non http cookie
    setM("logged in now" + res.data.name)
  }

  function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  const afterLogin = async () => {
    try {
      //using the csrf token,now refresh the _csrf
      const res = await axios.post('/post')
      console.log(res.data);
      setM("post-token-" + "-" + res.data.name)
    } catch (e) {
      setM(e.message)
    }
  }

  const logout = async () => {
    try {
      await axios.get('/logout')
      setM("logged out")
    } catch (e) {
      setM(e.message)
    }
  }

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={afterLogin}>afterLogin</button>
      <button onClick={logout}>logout</button>

      <h1>{m}</h1>

    </div>
  );
}

export default App;
