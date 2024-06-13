const { v4: uuidv4 } = require('uuid');

export const generateUniqueID = ()=> {
  const uniqueID = uuidv4();
  
  return uniqueID;
}