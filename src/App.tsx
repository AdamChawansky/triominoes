import './App.css'
import { RootDisplay } from './components/RootDisplay'
import { getMessage, setMessage } from './online/firebaseApi';

(window as any).fbapi = {
  setMessage,
  getMessage,
};

/* App runs a function and returns something that looks like HTML */
function App() {
  return (
    <>
      <RootDisplay />
    </>
  )
}

export default App
