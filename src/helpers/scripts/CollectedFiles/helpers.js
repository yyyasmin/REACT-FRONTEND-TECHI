
// FILE: isEmpty.js

// CHECK IF OBJ OF ANY TYPE IS EMPTY 
function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj === null) {
    return true;
  }

  if (typeof obj === 'string' && obj.trim() === '') {
    return true;
  }

  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  }

  if (typeof obj === 'object' && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}


export default isEmpty


// FILE: ServerRoutes.js
// src/helpers/ServerRoutes.js

///////////// DEVELOPMENT /////////////
const FLASK_PROXY_URL = "http://127.0.0.1:5000";

///////////// PRODUCTION /////////////
export const NODE_RENDER_URL = "https://mgduplicatesinarownode-production.up.railway.app";
export const FLASK_RENDER_URL = "https://mgduplicatrsinarowflask-production.up.railway.app";
export const BROWSER_RENDER_URL = "https://mgduplicatesrowreact.netlify.app/";

////// CHOOSE ENVIRONMENT VARS //////

// Switch between local and render here
const USE_LOCAL = true;
//const USE_LOCAL = false;

// Export chosen URLs for use in frontend
export const CHOSEN_FLASK_URL = USE_LOCAL ? FLASK_PROXY_URL : FLASK_RENDER_URL;
export const CHOSEN_BROWSER_URL = USE_LOCAL ? "http://127.0.0.1:3000" : BROWSER_RENDER_URL;


