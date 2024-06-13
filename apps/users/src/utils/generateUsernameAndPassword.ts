export const generateUsernameAndPassword =(firstname: string, lastname:string)=>{
  const username = `${firstname}_${lastname}`;
  const number = Math.floor(Math.random() * 1000) + 1;
  const password = `mypassword_${number}`
  return {username,password}
}