class appError extends Error{
  constructor(message,statusCode){
    super(message)
    this.statusCode=statusCode,
    this.status=this.statusCode===404? 'fail':'Error'
  }
}

module.exports=appError