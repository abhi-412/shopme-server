const express = require('express')
const dotenv = require('dotenv').config()
const dbConnect = require('./config/dbConnect.js')
const userRoutes = require('./Routes/userRoutes.js')
const bodyParser = require('body-parser')
const userController = require('./controllers/userController.js')
const { notFound, errorHandler } = require('./middlewares/errorHandler.js')
const cookieParser = require('cookie-parser')
const blogRoutes = require('./Routes/blogRoutes.js')
const blogCatRoutes = require('./Routes/blogCatRoutes.js')
const productRoutes = require('./Routes/productRoutes.js')
const categoryRoutes = require('./Routes/categoryRoutes.js')
const brandRoutes = require('./Routes/brandRoutes.js')
const couponRoutes = require('./Routes/couponRoutes.js')
const colorRoutes = require('./Routes/colorRoutes.js')
const enqRoutes = require('./Routes/enquiryRoutes.js')
const uploadRoutes = require('./Routes/uploadRoutes.js')


const cors = require('cors')

const morgan = require('morgan')
const app = express();
const PORT = process.env.PORT || 4000;
 

dbConnect();

const corsOptions = {
    origin:["https://shopme-admin-delta.vercel.app/","http://localhost:5173"],
    credentials:true,
    optionSuccessStatus:200,
  } 
  
  app.use(cors(corsOptions));

app.use(morgan("dev"))
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(cookieParser());

app.get("/", (req, res) => { res.send("Welcome to the Server"); })

app.use('/api/user', userRoutes)

app.use('/api/product', productRoutes)

app.use('/api/blog', blogRoutes)

app.use('/api/category', categoryRoutes)

app.use('/api/blogCat',blogCatRoutes)

app.use('/api/brands',brandRoutes)

app.use('/api/coupon',couponRoutes) 

app.use('/api/color',colorRoutes)

app.use('/api/enquiry',enqRoutes)

app.use('/api/upload',uploadRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
}) 

