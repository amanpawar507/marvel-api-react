import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link,useNavigate, useParams} from 'react-router-dom';
import noImage from '../img/download.jpeg';

import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@material-ui/core';
import '../App.css';
const md5 = require("blueimp-md5");
const publickey = "6869b1b4af9b1ff78189b94f1543f56e";
const privatekey = "8862946a6f968ceeace07f66ef726228423a21fd";
const useStyles = makeStyles({
  card: {
    maxWidth: 550,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});

const Series = (props) => {
  const [showData, setShowData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  let {id} = useParams();
  const nav = useNavigate();

  async function getCharLink(id) {
    console.log(id)
    setLoading(true)
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = `https://gateway.marvel.com:443/v1/public/series/${id}`;
    const url = baseUrl + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
    try {
      const dataResults = await axios.get(url);
      let myCharacter =  dataResults.data.data.results[0];
      console.log(dataResults);
      setShowData(myCharacter);
    } catch (e) {
        nav("/error")
        throw "Could not get Marvel data";
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log('useEffect fired for specific character');
    getCharLink(id);
  }, [id]);

  let description = null;
  const regex = /(<([^>]+)>)/gi;
  if (showData && showData.description) {
    description = showData && showData.description.replace(regex, '');
  } else {
    description = 'No Description';
  }
    let listItems =
        showData && showData.creators.items.map((d) => <li key={d.name}>{d.name}</li>)
    let listItems1 =
        showData && showData.characters.items.map((d) => <li key={d.name}>{d.name}</li>)
  //if (showData && showData.thumbnail) {}
    let listItems2 =
        showData && showData.stories.items.map((d) => <li key={d.name}>{d.name}</li>)
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <Card className={classes.card} variant='outlined'>
        <CardHeader className={classes.titleHead} title={showData.title} />
        <CardMedia
          className={classes.media}
          component='img'
          image={
            showData.thumbnail && showData.thumbnail.path
              ? showData.thumbnail.path + '.' +showData.thumbnail.extension
              : noImage
          }
          title='show image'
        />

        <CardContent>
          <Typography variant='body2' color='textSecondary' component='span'>
            <dl>
            <p>
                <dt className='title'>Summary:</dt>
                <dd>{description}</dd>
            </p>
            <p>
                <dt className='title'>Start Year:</dt>
                {showData && showData.startYear ? (
                  <dd>{showData.startYear}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
            </p>
            <p>
                <dt className='title'>Creators:</dt>
                {showData && showData.creators.items ? (
                  <ul>
                  {listItems}
                  </ul>
                ) : (
                  <dd>N/A</dd>
                )}
            </p>
            <p>
                <dt className='title'>Characters:</dt>
                {showData && showData.characters.items ? (
                  <ul>
                  {listItems1}
                  </ul>
                ) : (
                  <dd>N/A</dd>
                )}
            </p>
            <p>
                <dt className='title'>Stories:</dt>
                {showData && showData.stories.items ? (
                  <ul>
                  {listItems2}
                  </ul>
                ) : (
                  <dd>N/A</dd>
                )}
            </p>
            
            
              
              
            </dl>
            <Link to='/series/page/0'>Back to all series...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Series;
