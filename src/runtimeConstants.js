import process from 'process';

const NODE_PORT = Number(process.env.PORT) || 8000;

// eslint-disable-next-line import/prefer-default-export
export { NODE_PORT };
