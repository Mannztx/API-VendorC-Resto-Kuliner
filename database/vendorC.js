require('dotenv').config();
// Menggunakan pg (PostgreeSQL) agar dapat di deploy ke vercel
const { Client } = require('pg');

const POSTGREE_URL = process.env.POSTGREE_URL;

// Deklarasi client di luar agar dapat di-export
let pgClient; 

const connectionPostgree = async () => {
    // Untuk koneksi client
    pgClient = new Client({
        connectionString: POSTGREE_URL,
    });

    try {
      await pgClient.connect();
      console.log("Koneksi ke NeonDB berhasil");
        
      const sql = `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          base_price INTEGER NOT NULL,
          tax INTEGER NOT NULL,
          stock INTEGER NOT NULL
        );
      `;
      await pgClient.query(sql);
      console.log("Table products berhasil dibuat.");

      // Seeding data (Pastikan hanya insert jika data belum ada)
      const checkQuery = `SELECT COUNT(*) FROM products WHERE id = 501;`;
      const checkResult = await pgClient.query(checkQuery);

      if (parseInt(checkResult.rows[0].count) === 0) {
        console.log("Mengirim data...");
        const insert = 'INSERT INTO products (id, name, category, base_price, tax, stock) VALUES ($1, $2, $3, $4, $5, $6)';
        await pgClient.query(insert, [501, "Nasi Tempong", "Food", 20000, 2000, 50]);
        await pgClient.query(insert, [502, "Nasi Goreng", "Food", 12000, 1200, 50]);
        await pgClient.query(insert, [503, "Nasi Pecel", "Food", 10000, 1000, 50]);
        console.log("Berhasil mengirim data.");
      } else {
        console.log("Data sudah ada di tabel products");
      }
      return pgClient;
    } catch (err) {
        console.error("Koneksi ke NeonDB gagal:", err.message);
        throw err;
    }
};

// Export fungsi inisialisasi dan client
module.exports = { 
    connectionPostgree, 
    getPgClient: () => pgClient // Getter untuk client yang sudah terinisialisasi
};

// require('dotenv').config();
// const sqlite3 = require('sqlite3').verbose();

// const DB_vendorC = process.env.DB_vendorC || "vendorC.db";

// const dbVendorC = new sqlite3.Database(DB_vendorC, (err) => {
//   if (err) {
//     console.error("Koneksi ke vendorC.db gagal:", err.message);
//     throw err;
//   } else {
//     console.log("Koneksi ke vendorC.db berhasil");

//     dbVendorC.run(`CREATE TABLE IF NOT EXISTS products (
//       id INTEGER PRIMARY KEY,
//       name TEXT NOT NULL,
//       category TEXT NOT NULL,
//       base_price INTEGER NOT NULL,
//       tax INTEGER NOT NULL,
//       stock INTEGER NOT NULL
//     )`, (err) => {
//       if (!err) {
//         console.log("Table products created. Seeding initial data...");
//         const insert = 'INSERT INTO products (id, name, category, base_price, tax, stock) VALUES (?, ?, ?, ?, ?, ?)';
//         dbVendorC.run(insert, [501, "Nasi Tempong", "Food", 20000, 2000, 50]);
//         dbVendorC.run(insert, [502, "Nasi Goreng", "Food", 12000, 1200, 50]);
//         dbVendorC.run(insert, [503, "Nasi Pecel", "Food", 10000, 1000, 50]);
//       }
//     });
//   }
// });

// module.exports = { dbVendorC };