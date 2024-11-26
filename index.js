const express = require('express'); // Nhung express
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // Nhung body-parser
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const app = express(); // Tao app
const port = 3000; // Port
require('dotenv').config(); // Nhung dotenv
const systemConfig = require('./config/system.js'); // Nhung system
const database = require('./config/database.js'); // Nhung database
database.connect(); // Ket noi database
const routeAdmin = require('./routes/admin/index.route.js');
const routeClient = require('./routes/client/index.route.js');


const server = http.createServer(app);
const io = new Server(server)


const methodOverride = require('method-override');
app.set('views', `${__dirname}/views`); // Cau hinh views la thu muc views
app.set('view engine', 'pug'); // Cau hinh view engine la pug
app.use(express.static(`${__dirname}/public`)); // Cau hinh thu muc public
app.locals.prefixAdmin = systemConfig.prefixAdmin; // Cau hinh bien toan cuc prefixAdmin

global._io = io; // Cau hinh bien toan cuc _io

app.use(bodyParser.json()); // Dung body-parser
app.use(bodyParser.urlencoded({ extended: false })); // Dung body-parser
app.use(cookieParser('products-2004'));

app.use(session({ cookie: { maxAge: 60000, secure: true, httpOnly: true  }}));
app.use(flash());
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce'))); // Cau hinh thu muc tinymce
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
routeAdmin.index(app)
routeClient.index(app)

server.listen(port, () => {   // Lang nghe port
    console.log(`Example app listening on port ${port}`);
});