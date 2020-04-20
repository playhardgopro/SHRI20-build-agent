function errorHandler(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(
      '============================================================'
    );
    console.warn(error.response.status);
    console.log(error.response.data);
    console.error(
      '============================================================'
    );
    // console.log(error.response.headers)
  } else if (error.request) {
    const { protocol, path, method, hostname, port } = error.request._options;
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(
      '============================================================'
    );
    console.error(
      'ERROR:',
      method,
      protocol + '//' + hostname + ':' + port + path,
      'did not answer'
    );
    console.error(
      '============================================================'
    );
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(
      '============================================================'
    );
    console.log('Error', error.message);
    console.error(
      '============================================================'
    );
  }
}

module.exports = { errorHandler };
