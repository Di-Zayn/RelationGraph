import fetch from 'dva/fetch';
import config from './config';
import { message } from 'antd';

// const myHeader = new headers({
//   "Accept": 'application/json',
//   'Content-Type': 'application/json; charset=UTF-8',
//   "Access-Control-Allow-Origin" :  "*",
//   'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
// })

const checkBackEndReturn = (result, callback, failCallback) => {
  if (typeof failCallback == 'undefined')
    failCallback = (result) => {
      message.error(result.msg);
    };
  if (typeof callback == 'undefined') callback = () => {};
  if (result.status == 'success') {
    callback(result);
    return true;
  } else if (result.status == 'fail') {
    // if (result.msg === 'back_to_login'){
    //     history.push({pathname:'/login'});
    //     history.go();
    // }
    // else{
    failCallback(result);
    return false;
    // }
  } else message.error('something wrong happend');
};

function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      methods: 'GET',
      headers: {
        Accept: 'application/json,text/plain,*/*',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status + ' : ' + response.statusText);
        }
      })
      .then((result) => resolve(result))
      .catch((error) => {
        reject(error);
      });
  });
}

// function post(url, data){
//     return new Promise((resolve,reject)=>{
//         fetch(url,{
//             method: 'POST',
//             headers:{
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data)
//         })
//             .then(response=>{
//                 return response.json();})
//             .then(result=>resolve(result))
//             .catch(error=>{
//                 reject(error);
//             })
//     })
// };

function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      "Access-Control-Allow-Origin" :  "http://localhost:8000/login",
      Accept: 'application/json,text/plain,*/*',
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
    },
    mode: "cors",
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  }).catch(err=>{
    console.log(err)
  }
  );
}

export function postAction(url, postData, successCallback, failCallback) {
  console.log(url)
  url = config.proxy ? url : config.apiUrl + config.apiPrefix + url;
  console.log(url)
  return post(url, postData)
    .then((re) => {
      console.log(url, re, postData);
      if (checkBackEndReturn(re, successCallback, failCallback)) {
        return re;
      } else return null;
    })
    .catch((error) => {
      message.error(error.message);
    });
}

export function getAction(url, successCallback, failCallback) {
  url = config.proxy ? url : config.apiUrl + config.apiPrefix + url;
  get(url)
    .then((re) => {
      console.log(url, re);
      if (checkBackEndReturn(re, successCallback, failCallback)) {
        return re
      }
      else return null;
    })
    .catch((error) => {
      message.error(error.message);
    });
}
