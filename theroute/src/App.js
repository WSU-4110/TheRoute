import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import {Map} from "./pages/Map";
import {Setup} from "./pages/Setup";


function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element= {<Map/>}/>
        <Route path="/setup" element = {<Setup/>}/>
      </Routes>
    </Router>
  )
}

export default App;