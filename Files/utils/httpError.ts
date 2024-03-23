class HttpError extends Error {
  httpErrorCode: number;

  constructor(message: string, httpErrorCode: number) {
    super(message); // Call the constructor of the base Error class.
    this.httpErrorCode = httpErrorCode;
    this.name = this.constructor.name; // Set the error name to the class name.
  }
}

export default HttpError;
