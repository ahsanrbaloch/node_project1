const express=require('express');
const app=express();
const path = require('path');
const {logger}=require('./middleware/logEvents');
const errorHandler=require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;
const verifyJWT=require('./middleware/verifyJWT')
const cookieParser=require('cookie-parser');
const cors=require('cors');
const corsOptions=require('./config/corsOptions');
const credentials = require('./middleware/credentials');

//custom middleware logger
app.use(logger);

app.use(credentials);
 
//cross origin resource sharing
app.use(cors(corsOptions));

//built in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/',express.static(path.join(__dirname,'/public')));    

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees',require('./routes/api/employees'));


app.all('*', (req,res)=>{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));