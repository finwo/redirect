import { createServer, IncomingMessage, ServerResponse } from 'http';
import { createConnection } from 'mysql';

type Port = {
  ingress : string;
  egress  : string;
};

const httpPort = parseInt(process.env.PORT || '3000');
const dburl    = new URL(process.env.DB_URL || 'mysql://root:supers3cret@localhost:3306/redirect');
const db       = createConnection({
  host     : dburl.hostname,
  user     : dburl.username,
  password : dburl.password,
  database : dburl.pathname.split('/').pop(),
});

function unprocessable(req: IncomingMessage, res: ServerResponse): void {
  res.statusCode    = 400;
  res.statusMessage = 'Bad Request';
  res.setHeader('Content-Type', 'text/plain');
  res.write('Unprocessable request');
  res.end();
}

const portCache: Record<string, Promise<Port | null>> = {};
async function fetchPort(ingress: string): Promise<Port | null> {

  // Use cache if possible
  if (ingress in portCache) return portCache[ingress];

  // Fetch the ingress from db
  const query = 'SELECT * FROM `port` WHERE `ingress` = ? LIMIT 1;';
  return portCache[ingress] = new Promise<Port | null>((resolve, reject) => {
    db.query(query, [ingress], function(err: Error | null, results) {
      if (err) return reject(err);

      if (!results.length) {
        resolve(null);
      } else {
        resolve({ ...results.shift() });
      }

      setTimeout(() => {
        delete portCache[ingress];
      }, 5e3);
    });
  });
}

// Create server
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const host = req.headers.host;
  if (!host) return unprocessable(req, res);

  const port = await fetchPort(host);
  if (!port) return unprocessable(req, res);

  res.statusCode    = 302;
  res.statusMessage = 'Found';
  res.setHeader('Location', port.egress);
  res.end();
})

// Listen
server.listen(httpPort, () => {
  console.log(`Listening on :${httpPort}`);
})
