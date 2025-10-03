
import './App.css';
import Books from './components/Books';
import AddBook from './components/AddBook';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <div className='container mt-5'>

        <Router
        // Je rajoute cette ligne pour accepter le flag des futurs améliorations
          future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
          }}
        >

        <Routes>
          <Route path='/' element={<Books />}> </Route>
          <Route path='/create' element={<AddBook />}> </Route>
        </Routes>
      </Router>

     
    
      </div>
    </div>
  );
}

export default App;
