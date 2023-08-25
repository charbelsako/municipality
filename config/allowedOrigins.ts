const allowedOrigins = [
  // 'http://localhost:5000',
  'http://localhost:3001',
  // 'http://mysite.com',
];

if (process.env.NODE_ENV) allowedOrigins.push('http://localhost:3000');

export default allowedOrigins;
