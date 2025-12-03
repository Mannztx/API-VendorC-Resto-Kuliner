require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectionPostgree, getPgClient } = require('./database/vendorC.js'); 
const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

const getAll = async (sql) => {
    const client = getPgClient();
    if (!client) {
        throw new Error("Database client tidak terhubung.");
    }
    // Menggunakan client.query untuk menjalankan SELECT pada PostgreSQL
    const result = await client.query(sql);
    return result.rows; // pgClient mengembalikan data dalam properti 'rows'
};

app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date()
    });
});

app.get('/vendorc/products', async (req, res) => {
    try {
        const standarData = await getAll("SELECT * FROM products");
        const nestedData = standarData.map(item => ({
            "id": item.id,
            "details": {
                "name": item.name,
                "category": item.category
            },
            "pricing": {
                "base_price": item.base_price,
                "tax": item.tax
            },
            "stock": item.stock
        }));
        res.json(nestedData);
    } catch (error) {
        console.error("API Vendor C Error", error);
        res.status(500).json({
            message: "Failed to fetch Vendor C data."
        });
    }
});

app.use((req, res) => {
    res.status(404).json({error: "Route not found"});
});

// Fungsi Asinkron untuk memulai Server
async function startServer() {
    try {
        await connectionPostgree(); // Menunggu koneksi dan inisialisasi database selesai

        app.listen(port, () => {
            console.log(`API Vendor C running on localhost: ${port}`);
            console.log(`Endpoint/URL: http://localhost:${port}/vendorc/products`);
        });

    } catch (error) {
        console.error("Gagal memulai server karena error database:", error);
        process.exit(1);
    }
}

startServer();

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { dbVendorC } = require('./database/vendorC.js');
// const app = express();
// const port = process.env.PORT || 3003;

// app.use(cors());
// app.use(express.json());

// app.get('/status', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'Server is running',
//     timestamp: new Date()
//   });
// });

// const getAll = (db, sql) => {
//     return new Promise((resolve, reject) => {
//         db.all(sql, (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         });
//     });
// };

// app.get('/vendorc/products', async (req, res) => {
//     // const sql = "SELECT * FROM products ORDER BY id ASC";
//     // dbVendorC.all(sql, [], (err, rows) => {
//     //     if (err) return res.status(400).json({error: err.message});
//     //     res.json(rows);
//     // });
//     try {
//         standarData = await getAll(dbVendorC, "SELECT * FROM products");

//         const nestedData = standarData.map(item => ({
//             "id": item.id,
//             "details": {
//                 "name": item.name,
//                 "category": item.category
//             },
//             "pricing": {
//                 "base_price": item.base_price,
//                 "tax": item.tax
//             },
//             "stock": item.stock
//         }));
//         res.json(nestedData);
//     } catch (error) {
//         console.error("API Vendor C Error", error);
//         res.status(500).json({
//             message: "Failed to fetch Vendor C data."
//         });
//     }
// });

// app.use((req, res) => {
//     res.status(404).json({error: "Route not found"});
// });

// app.listen(port, () => {
//     console.log(`API Vendor C running on localhost: ${port}`);
//     console.log(`Endpoint: http://localhost:${port}/vendorc/products`);
// });