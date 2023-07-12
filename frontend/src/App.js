
import './App.css';
import Header from './components/layout/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import webFont from "webfontloader";
import React from 'react';
import Footer from './components/layout/Footer/Footer';
import Home from './components/Home/Home';

function App() {


  React.useEffect(() => {
    webFont.load({
      google: {
        families:["Roboto","Droid Sans","chilanka"]
      }
  })
  },[])


  return (
    <>
    <Router>
        <Header/>
          <Routes>

            <Route exact path="/" element={<Home/>}/>

          </Routes>
        <Footer/>
    </Router>
    </>
  );
}

export default App;
