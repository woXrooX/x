"use strict";

///////////////////////////// FETCH - Bridge
// export default async function bridge(url='', data={}, contentType = null){
export default async function bridge(url='', data=null, contentType = null){
  // Url Is Falsy, Set Url "To window.location.href"
  if(!!url === false) url = window.location.href;

  // Default Content Type Is "application/json"
  if(!!contentType === false) contentType = "application/json";

  let tmp_url = new URL(url, window.location.origin);
  window.Log.info(`bridge request to: ${tmp_url.href}`);

  try{
    const response = await fetch(tmp_url, {
      method: 'POST',
      mode: 'same-origin',
      cache: 'force-cache',
      credentials: 'include',

      // Check If contentType == "application/json"
      ...(contentType == "application/json") && {headers: {"Content-Type": "application/json"}},

      redirect: 'follow',
      referrerPolicy: 'no-referrer',

      // Check If contentType == "application/json" Then Pass JSON.stringify(data) Else Just Data
      body: (contentType == "application/json") ? JSON.stringify(data) : data

    });

    if(response.ok){
      const data = await response.json();
      return data;

    }else{
      console.warn("[Bridge] Response Error - code: "+response.status);
      return response.status;

    }

  }catch(error){
    console.warn("[Bridge] "+error);
    return error;

  }

}

// Make bridge() Usable W/O Importing It
window.bridge = bridge;
