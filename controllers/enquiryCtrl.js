const asyncHandler = require('express-async-handler')
const Enquiry = require('../models/enquiryModel')
const validateMongodbId = require('../utils/validatemongodbID')


const createEnquiry = asyncHandler(async(req,res)=>{
    try{
        const newEnquiry = await Enquiry.create(req.body)
        res.json(newEnquiry)

    }catch(error){
        throw new Error(error);
    }
})

const updateEnquiry = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        console.log(req.body);

        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id,req.body,{
            new:true,
        })
        res.json(updatedEnquiry)

    }catch(error){
        throw new Error(error);
    }
})

const getEnquiry = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const enquiry = await Enquiry.findById(id)
        res.json(enquiry)

    }catch(error){
        throw new Error(error);
    }
})

const getEnquiries = asyncHandler(async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.json(enquiries);
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const deleteEnquiry = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongodbId(id)
    try{
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id)
        res.json(deletedEnquiry)

    }catch(error){
        throw new Error(error);
    }
})


module.exports = {createEnquiry,updateEnquiry,deleteEnquiry,
    getEnquiry,getEnquiries}