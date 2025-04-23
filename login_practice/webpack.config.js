const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "url": false,
      "util": false,
      "assert": false,
      "zlib": false
    }
  },
  // Optionally, you can configure other Webpack settings here if needed
};
