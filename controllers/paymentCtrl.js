const razorpay = require('razorpay');

const instance = new razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

const checkout = async (req, res) => {
    try {
        const {amount} = req.body; 
        const options = {
            amount:amount.toFixed(2) * 100, // amount in the smallest currency unit
            currency: "INR",
            // receipt: "order_rcptid_11",
        };
        const order = await instance.orders.create(options);
            // if (error) {
            //     console.log(error);
            //     return res.status(500).send({ message: "Something went wrong" });
            // }
             
            res.json({order});
    
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
};

const paymentVerification = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId } = req.body;
        res.json({ razorpayOrderId, razorpayPaymentId });
        // const sign = razorpay_order_id + "|" + razorpay_payment_id;
        // const expectedSign = crypto
        //     .createHmac("sha256", "v9qz5Ff9qz5Ff9qz5Ff9qz5F")   
        //     .update(sign.toString())
        //     .digest("hex");
        // if (razorpay_signature === expectedSign) {
        //     return res.status(200).send({ message: "Payment verified successfully" });
        // } else {
        //     return res.status(400).send({ message: "Invalid signature sent!" });
        // }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
};


module.exports = { checkout, paymentVerification }