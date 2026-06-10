const fs = require('fs');
const path = require('path');

const defaultApiUrl = 'https://firasti-api.onrender.com/api';
const configuredApiUrl = process.env.API_URL || process.env.NG_APP_API_URL || defaultApiUrl;

const apiUrl = configuredApiUrl.replace(/\/+$/, '');
const target = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const contents = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(apiUrl)}
};
`;

fs.writeFileSync(target, contents);
console.log(`Production API URL set to ${apiUrl}`);
