"use strict";

///////////////////////////// FETCH - Bridge
export default async function bridge(url='', bodyData={}){
  try{
    const response = await fetch(URL+url, {
      method: 'POST',                               // *GET, POST, PUT, DELETE, etc.
      mode: 'same-origin',                          // no-cors, *cors, same-origin
      cache: 'force-cache',                         // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include',                       // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',          // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      redirect: 'follow',                           // manual, *follow, error
      referrerPolicy: 'no-referrer',                // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(bodyData)                // body data type must match "Content-Type" header
    });
    if(response.ok){
      const data = await response.json();
      return data;
    }else{
      console.warn("[Bridge] Response Error - code: "+response.status);
    }
  }catch(error){
    console.warn("[Bridge] "+error);
  }
}
