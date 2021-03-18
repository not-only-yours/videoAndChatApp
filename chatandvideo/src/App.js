import "./App.css";
import Leftpart from "./Leftpart";
import Chat from "./Chat";

function App() {
  return (
    <div className="app">
      <div className="app_body">
        <Leftpart />
        <Chat />
        {/*Тут буде вікно самого чату */}
      </div>
    </div>
  );
}

export default App;
