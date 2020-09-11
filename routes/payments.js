  const { isLoggedIn } = require('../middleware');
  const express = require('express'),
        router = express.Router(),	//mergeParams allow req.params to work properly
        stripe = require('stripe')("sk_test_51HK3ZZLJjWMRHKWkYe84C38FjQ1BEMQo9GxJ1NEvnnenC8kTYM3XENRW 61S5k4BTBEFx4AfyS1bGOh4MbR7RQ8il00djH55hRQ");
  
  //checkout
  router.get('/checkout', function(req, res) {
      res.render('checkout', {amount: 1999});
  });
  
  router.post('/paid', async (req, res) =>{
      console.log(req.user);
      req.user.paymentMethodId = req.body.paymentMethodId;
      req.user.hasPaid = true;
      await req.user.save();
      req.flash('success', `Welcome to the Private Section of YelpCamp!`);
      res.send('paid');
  });
  
  const calculateOrderAmount = items => {
      // Replace this constant with a calculation of the order's amount
      // Calculate the order total on the server to prevent
      // people from directly manipulating the amount on the client
      return items.reduce(function(sum, item) {return sum + item}, 0);
  };
  
  router.post("/create-payment-intent", async (req, res) => {
      try {
          const { items } = req.body;
          // Create a PaymentIntent with the order amount and currency
          const paymentIntent = await stripe.paymentIntents.create({
              amount: 1999,
              currency: "usd",
              metadata: {integration_check: 'accept_a_payment'},
          });
          res.send({
              clientSecret: paymentIntent.client_secret,
          });
      } catch (error) {
          req.flash('error', `Error Processing Payment`);
          res.redirect('back');
      }
  });
  
  module.exports = router;
  