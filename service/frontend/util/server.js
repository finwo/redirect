const express           = require('express');
const path              = require('path');
const { writeFileSync } = require('fs');

const app     = express();
const docroot = process.env.DOCROOT || path.join(__dirname, 'docroot');
const port    = parseInt(process.env.PORT || '4000');

app.use(express.static(docroot))

app.get('/manifest.json', (req, res) => {

  // Build a basic manifest
  const contents = JSON.stringify([
    {
      type: 'api',
      name: 'redirection-service',
      url : process.env.API_URL || `${req.protocol}://api.${req.hostname}`,
    },
  ]);

  // Save it for future requests, we're not dynamic (yet)
  writeFileSync(path.join(docroot, 'manifest.json'), contents);

  // And send to the client
  res.header('Content-Type', 'application/json');
  res.send(contents);
});

// Start the actual server
app.listen(port, () => {
  console.log(`Listening on :${port}`);
})
