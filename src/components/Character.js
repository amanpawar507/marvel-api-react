import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useNavigate,useParams} from 'react-router-dom';
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
    border: '1px solid #f70808',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #f70808',
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
    color: '#f70808',
    fontWeight: 'bold',
    fontSize: 12
  }
});

const Show = (props) => {
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
    const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}`;
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
      showData && showData.comics.items.map((d) => <li key={d.name}>{d.name}</li>)
  let listItems1 =
      showData && showData.series.items.map((x) => <li key={x.name}>{x.name}</li>)
  let listItems2 =
      showData && showData.stories.items.map((x) => <li key={x.name}>{x.name}</li>)

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <Card className={classes.card} variant='outlined'>
        <CardHeader className={classes.titleHead} title={showData.name} />
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
                <dt className='title'>Comics Available:</dt>
                {showData && showData.comics.available ? (
                  <dd>{showData.comics.available}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Comics:</dt>
                {showData && showData.comics.items.length!=0 ? (
                  <ul>
                  {listItems}
                  </ul>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Series Available:</dt>
                {showData && showData.series.available ? (
                  <dd>{showData.series.available}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Series:</dt>
                {showData && showData.series.items.length!=0? (
                  <ul>
                  {listItems1}
                  </ul>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Stories Available:</dt>
                {showData && showData.stories.available ? (
                  <dd>{showData.stories.available}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className='title'>Stories:</dt>
                {showData && showData.series.items.length!=0 ? (
                  <ul>
                  {listItems1}
                  </ul>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              
          
            </dl>
            
            <Link to='/characters/page/0'>Back to characters...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Show;
