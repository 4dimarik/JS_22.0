'use strict';


const getData = ({ url }) => {
  return fetch(url)
    .then((response) =>{
      if (response.ok){
        return response.json();
      } else {
        throw response;
      }
    })
    .catch((response) => {
      const errorMessage = `status: ${response.status}` + 
      `${response.statusText ? ', statusText:' + response.statusText : '' }`;
      console.error(errorMessage);
      return response.ok;
    })
  ;
};

const sendData = ({ url , user = {}}) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(user)
  })
    .then((response) =>{
      if (response.ok){
        return response.json();
      } else {
        throw response;
      }
    })
    .catch((response) => {
      const errorMessage = `status: ${response.status}` + 
      `${response.statusText ? ', statusText:' + response.statusText : '' }`;
      console.error(errorMessage);
      return response.ok;
    })
  ;
};

getData({ url: 'http://127.0.0.1:5500/api/db.json' })
  .then(data=>{
    return data
    ? sendData({url:'https://jsonplaceholder.typicode.com/posts', user:data})
    : data;
   
  })
  .then(data=>console.log(data));
