const express = require('express'),
      router = express.Router(),	//mergeParams allow req.params to work properly
      stripe = require('stripe')("sk_test_51HK3ZZLJjWMRHKWkYe84C38FjQ1BEMQo9GxJ1NEvnnenC8kTYM3XENRW 61S5k4BTBEFx4AfyS1bGOh4MbR7RQ8il00djH55hRQ");
//checkout
router.get('/checkout', async function(req, res) {
    console.log("checkout");
    try {
        let amount = calculateOrderAmount([1000,1400,2000,3900]);
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount / 100, //calculateOrderAmount(items) create a function to calculate price to charge
            currency: "usd",
            metadata: {integration_check: 'accept_a_payment'},
        });
        const {clientSecret} = paymentIntent;
        console.log({clientSecret});
        res.render('checkout', {clientSecret, amount});
    } catch (error) {
        req.flash('error', `${error.message}`);
        res.redirect('back');
    }
});

router.post('/test', (req, res) =>{
    res.send('checkout complete');
});

const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    const sum = items.reduce(function(sum, item) {return sum + item}, 0);
    console.log({sum})
    return sum;
};

router.post("/create-payment-intent", async (req, res) => {
    try {
        const { items } = req.body;
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount([1000,1400,2000,3900]),
        currency: "usd",
        metadata: {integration_check: 'accept_a_payment'},
        });
        console.log("Done with payment");
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        req.flash('error', `Error Processing Payment`);
        res.redirect('back');
    }
});




module.exports = router;
