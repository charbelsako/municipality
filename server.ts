import app from './app';

const PORT = process.env.PORT || 3000;

const server = app.listen(3000, () => {
  console.log(`Server running on ${PORT}`);
});
