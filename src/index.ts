import * as express from 'express';
import * as swc from '@swc/core';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const app = express();

const readFilePromise = promisify(fs.readFile);

app.listen(1337, () => {
  console.log('Listening on 1337');
});

app.get('/', async (req, res) => {
  const file = await readFilePromise(
    path.join(__dirname, './components/test.tsx'),
    { encoding: 'utf-8' }
  );
  swc
    .transform(file, {
      filename: 'test.tsx',
      sourceMaps: true,
      isModule: true,
      jsc: {
        transform: {
          react: {
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment',
            throwIfNamespace: true,
            development: false,
            useBuiltins: false,
          },
          optimizer: {
            globals: {
              vars: {
                __DEBUG__: 'true',
              },
            },
          },
        },
      },
    })
    .then((output) => {
      const transformedReactFile = output.code;
      res.send({ file: transformedReactFile });
    });
});
