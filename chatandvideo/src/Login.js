import React from 'react';
import './Login.css';
import { Button } from '@material-ui/core';
import { signIn } from './authService';

function Login() {
  const sp = require('./StateProvider');
  const serv = require('./service');
  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = sp.useStateValue();
  const [login, setLogin] = React.useState('');
  const [pass, setPass] = React.useState('');

  const signInInput = (e) => {
    e.preventDefault();
    serv.checkLoginAndPass(login, pass, dispatch);
    setPass('');
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://img.icons8.com/clouds/100/000000/google-logo.png"
          alt="google"
        />
        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          type="text"
          placeholder="Login"
        />
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="text"
          placeholder="Password"
        />
        <button type="submit" onClick={signInInput}>
          Sign in
        </button>
        <div className="login_text">
          <h1>Sign in to Google</h1>
        </div>
        <Button type="submit" onClick={signIn(dispatch)}>
          Sign in With Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
