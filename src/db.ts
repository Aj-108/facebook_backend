import { Pool, Client } from 'pg'
 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port : 3000,
})

const createTable = async () =>  {
    const client = await pool.connect(); 
    try {
      // await client.query(`DROP TABLE users`)

      // user table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          user_id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          fname VARCHAR(50) NOT NULL,
          lname VARCHAR(50) NOT NULL
        )
      `);
      
     

      const createPostTableText = `
      CREATE TABLE IF NOT EXISTS posts (
        post_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users,
        content VARCHAR(100) ,
        content_image VARCHAR(100)
      )
    `;

    const createCommentTableText = `
      CREATE TABLE IF NOT EXISTS comments (
        comment_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        post_id INT REFERENCES posts(post_id),
        content varchar(50)
      )
    `;


    
    client.query(createPostTableText, (err, res) => {
      if (err) {
        console.error('Error creating post table', err.stack);
        return;
      }
      console.log('Posts Table created');
    });

    client.query(createCommentTableText, (err, res) => {
      if (err) {
        console.error('Error creating comment table', err.stack);
        return;
      }
      console.log('Comments Table created');
    });


      
      ;
    } finally {
      client.release();
    }
  }


// const createTable = async () =>{
//   const client = await pool.connect();

//   try {
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         user_id SERIAL PRIMARY KEY,
//         username VARCHAR(50) NOT NULL
//         -- Add other user columns as needed
//       )
//     `);

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS posts (
//         post_id SERIAL PRIMARY KEY,
//         user_id INT REFERENCES users(user_id),
//         content TEXT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         -- Add other post columns as needed
//       )
//     `);

//     await client.query(`
//       CREATE TABLE IF NOT EXISTS comments (
//         comment_id SERIAL PRIMARY KEY,
//         user_id INT REFERENCES users(user_id),
//         post_id INT REFERENCES posts(post_id),
//         content TEXT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         -- Add other comment columns as needed
//       )
//     `);

//     console.log('Tables created successfully');
//   } catch (error) {
//     console.error('Error creating tables:', error);
//   } finally {
//     client.release();
//   }
// }


  export { pool, createTable };