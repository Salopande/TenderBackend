const validator = require('validator')

const validationSignUp = (req)=>{
  const {firstName, lastName, emailId, password} = req.body;
  if(!firstName || !lastName){
    throw new Error('FirstName is not valid!')
  }else if(!validator.isEmail(emailId)){
    throw new Error('email is not valid')
  }else if(!validator.isStrongPassword(password)){
    throw new Error('password is not strong')
  }
}

module.exports = {
    validationSignUp,
}