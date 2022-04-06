import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';
import noImage from '../img/download.jpeg';
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';

import '../App.css';
const md5 = require("blueimp-md5");
const publickey = "6869b1b4af9b1ff78189b94f1543f56e";
const privatekey = "8862946a6f968ceeace07f66ef726228423a21fd";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
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
const ComicsList = () => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [showsData, setShowsData] = useState(undefined);
  const [pages, setPages] = useState(0);
  const [curr, setCurr] = useState(1);
  let {pageNumber} = useParams(); 
  const nav = useNavigate();
  let card = null;

  function pageChange(e, v){
    console.log("pageChange called")
    nav("/comics/page/" + (v-1));
  }

  async function getSearchLink() {
    console.log(pageNumber);
    setLoading(true);
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl =
      "https://gateway.marvel.com:443/v1/public/comics?";
    const url = baseUrl + "&ts=" + ts + "&apikey=" + publickey + "&hash=" + hash + "&limit=20" + "&offset=" + (parseInt(pageNumber)*20);
    try {
      const dataResult = await axios.get(url);
      const characterList = dataResult.data.data.results;
      if(characterList.length==0){
        nav("/error")
        return
      }
      console.log(dataResult);
      setShowsData(characterList);
      setPages(parseInt(dataResult.data.data.total/20))
      setCurr(parseInt(pageNumber)+1)
    } catch (e) {
        nav("/error")
        throw "Could not get Marvel data";
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log('on load useeffect');
    getSearchLink();
  }, []);

  useEffect(() => {
    console.log('on page change');
    getSearchLink();
  }, [pageNumber]);

  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant='outlined'>
          <CardActionArea>
            <Link to={`/comics/${show.id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={
                  show.thumbnail && show.thumbnail.path
                    ? show.thumbnail.path + '.' +show.thumbnail.extension
                    : noImage
                }
                title='show image'
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant='h6'
                  component='h2'
                >
                  {show.title}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {show.description
                    ? show.description.replace(regex, '').substring(0, 139) + '...'
                    : 'No Summary'}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  

    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
        <Box my={2} display="flex" justifyContent="center">
          <Pagination count={pages} onChange = {pageChange} page={curr}/>
        </Box >
      </div>
    );
  }
};

export default ComicsList;
