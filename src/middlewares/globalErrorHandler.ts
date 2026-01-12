import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client"


function errorHandler (err:any, req:Request, res:Response, next: NextFunction) {

  let statusCode = 500
  let errorMessage = "internal server error"
  let errorDetails = err


  // prisma client validation error 
  if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = 400
    errorMessage = "You provide incorrect field type"
  }else if(err instanceof Prisma.PrismaClientKnownRequestError ){
    if(err.code === "P2025"){
      statusCode = 400
      errorMessage= "An operation failed because it depends on one more records"
    }
  }

  res.status(statusCode)
  res.json({
    message: errorMessage,
    error : errorDetails
  })
}

export default errorHandler
