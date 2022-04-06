import React from 'react';
import logo from './img/marvel-logo-1.webp';
import './App.css';
import CharacterList from './components/CharacterList';
import Character from './components/Character';
import Home from './components/Home';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import Comic from './components/Comic';
import ComicsList from './components/ComicsList';
import SeriesList from './components/SeriesList';
import Series from './components/Series';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
          All the Marvel data you'll ever need in one place! The Marvel Comics API is a tool to help developers everywhere create amazing, uncanny and incredible web sites and applications using data from the 70-plus years of the Marvel age of comics.
          </h1>
          <Link className='showlink' to='/'>
            Home
          </Link>
          <Link className='showlink' to='/characters/page/0'>
            Characters
          </Link>
          <Link className='showlink' to='/comics/page/0'>
            Comics
          </Link>
          <Link className='showlink' to='/series/page/0'>
            Series
          </Link>
          
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/characters/page/:pageNumber' element={<CharacterList />} />
            <Route path='/characters/:id' element={<Character />} />
            <Route path='/comics/page/:pageNumber' element={<ComicsList />} />
            <Route path='/comics/:id' element={<Comic />} />
            <Route path='/series/page/:pageNumber' element={<SeriesList />} />
            <Route path='/series/:id' element={<Series />} />
            <Route path='/error' element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
