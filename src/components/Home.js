import React from 'react';
import '../App.css';

const Home = () => {
  return (
    <div>
      <p>
        This is an example of using React to Query the Marvel API. 
      </p>

      <p className='hometext'>
        The application uses API available at:{' '}
        <a
          rel='noopener noreferrer'
          target='_blank'
          href='https://developer.marvel.com/'
        >
          https://developer.marvel.com/
        </a>{' '}
        for searching the characters, comics and series.
      </p>
      <p>
        Start by clicking the buttons above.
      </p>
    </div>
  );
};

export default Home;
