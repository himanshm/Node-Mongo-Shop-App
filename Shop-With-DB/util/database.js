import { createPool } from 'mysql2';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'nodecomplete',
});

export default pool.promise();
