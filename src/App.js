
import './App.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { useState } from 'react';
const auth = getAuth(app);

function App() {
  const [info, setInfo] = useState({});
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(false)

  //email email sign in
  const handleSubmit = (e) => {
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log(user);

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });

    } else {

      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          // showing success message 
          setInfo(user);
          setError('');

          //clear input fields 
          setEmail('');
          setPassword('');
        })
        .catch(err => {
          // showing error message 
          setError(err.message);
          setInfo(" ");

        })

    }




    e.preventDefault();

  }
  const handleEmailBlur = (e) => {
    setEmail(e.target.value)
  }
  const handlePasswordBlur = (e) => {
    setPassword(e.target.value)
  }


  //check register 
  const handleRegisterCheck = (e) => {
    setRegistered(e.target.checked)
  }




  //google signin
  const provider = new GoogleAuthProvider();
  const googleSignIn = () => {
    signInWithPopup(auth, provider)
      .then(result => {
        setInfo(result.user)
      })
      .catch(err => {
        console.error(err);
      })
  }


  //googel signOUt
  const googleSignOut = () => {
    signOut(auth).then(() => {
      setInfo({})
    }).catch((error) => {

    });

  }
  return (
    <div className="App">
      <h1>Welcome to {registered ? "login" : "Register"} page</h1>
      {
        info.displayName && <> <h1>Welcome {info.displayName}</h1>
          <h1>You Email is :  {info.email}</h1></>
      }

      {
        info.displayName ? <button onClick={googleSignOut}>Google SignOut</button> :
          <button onClick={googleSignIn}>Google SignIn</button>
      }


      <form onSubmit={handleSubmit}>
        <input onBlur={handleEmailBlur} type="text" placeholder='Enter email..' required /> <br />

        <input onBlur={handlePasswordBlur} type="password" placeholder='Enter email..' />
        <br />
        <input type="checkbox" onChange={handleRegisterCheck}></input> <label >{registered ? "Don't have account?" : 'Already Register?'}</label>
        <br />
        <button type='submit'>{registered ? 'Login' : "Register"}</button>
      </form>

      {
        info.email ? <p>User successfully created</p> : <p>{error}</p>
      }


    </div>
  );
}

export default App;
