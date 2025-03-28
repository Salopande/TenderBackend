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

const validateProfileEditData = (req)=>{
  const allowEditFields = ["firstName","lastName","emailId","gender","age"];
  const isEditAllowed = Object.keys(req.body).every(field=>allowEditFields.includes(field))
  return isEditAllowed
}

module.exports = {
    validationSignUp,
    validateProfileEditData
}