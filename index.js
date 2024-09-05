const express = require('express'); // Nhung express
const app = express(); // Tao app
const port = 3000; // Port

app.get('/', (req, res) => {
    res.send("Home Page");
});

app.get('/products', (req, res) => {
    res.send("Products");
});

app.listen(port, () => {   // Lang nghe port
    console.log(`Example app listening on port ${port}`);
});