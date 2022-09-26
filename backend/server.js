const express = require("express");
const app = express();
const { resolve } = require("path");
const stripe = require("stripe")(
  process.env.secret_key /* https://stripe.com/docs/keys#obtain-api-keys */
  //{ apiVersion: '2020-08-27;automatic_payment_methods_beta=v1;' }
);

app.use(express.static("."));
app.use(express.json());

// An endpoint for your checkout
app.post("/checkout", async (req, res) => {
  // Create or retrieve the Stripe Customer object associated with your user.
  const customerId =
    req.body.customerId || (await stripe.customers.create()).id; // This example just creates a new Customer every time
  // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
  console.log(customerId);
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: "2020-08-27" }
  );

  // Create a PaymentIntent with the payment amount, currency, and customer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: "eur",
    customer: customerId,
    setup_future_usage: "on_session",
  });

  // Send the object keys to the client
  res.send({
    publishableKey: process.env.publishable_key, // https://stripe.com/docs/keys#obtain-api-keys
    paymentIntent: paymentIntent.client_secret,
    customerId: customerId,
    ephemeralKey: ephemeralKey.secret,
  });
});

app.post("/addPaymentMethod", async (req, res) => {
  // Create or retrieve the Stripe Customer object associated with your user.
  const customerId = req.body.customerId;
  // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
  console.log(customerId);
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: "2020-08-27" }
  );

  // Create a PaymentIntent with the payment amount, currency, and customer
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    usage: "on_session",
  });

  // Send the object keys to the client
  res.send({
    publishableKey: process.env.publishable_key, // https://stripe.com/docs/keys#obtain-api-keys
    setupIntent: setupIntent.client_secret,
    customerId: customerId,
    ephemeralKey: ephemeralKey.secret,
  });
});

app.post("/login", async (req, res) => {
  // Create or retrieve the Stripe Customer object associated with your user.
  const customer = await stripe.customers.create({
    name: "Jane Doe",
  });
  const visa = stripe.setupIntents.create({
    payment_method: "pm_card_visa",
    customer: customer.id,
    confirm: true,
    usage: "on_session",
  });
  const mastercard = stripe.setupIntents.create({
    payment_method: "pm_card_mastercard",
    customer: customer.id,
    confirm: true,
    usage: "on_session",
  });
  const amex = stripe.setupIntents.create({
    payment_method: "pm_card_amex",
    customer: customer.id,
    confirm: true,
    usage: "on_session",
  });
  Promise.all([visa, mastercard, amex]).then(
    async ([visa, mastercard, amex]) => {
      const updatedCustomer = await stripe.customers.update(customer.id, {
        metadata: { default_payment_method: visa.payment_method },
      });
      res.send(updatedCustomer);
    }
  );
});

app.get("/payment_methods/:customerId", async (req, res) => {
  // Create or retrieve the Stripe Customer object associated with your user.
  const { customerId } = req.params;
  const customer = stripe.customers.retrieve(customerId);
  const paymentMethods = stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  Promise.all([customer, paymentMethods]).then(
    async ([customer, paymentMethods]) => {
      res.send(
        paymentMethods.data
          .sort((a, b) => b.id === customer.metadata.default_payment_method)
          .map((pm) => ({
            ...pm.card,
            paymentMethodId: pm.id,
          }))
      );
    }
  );
});

app.post("/default", async (req, res) => {
  // Create or retrieve the Stripe Customer object associated with your user.
  const { customerId, paymentMethodId } = req.body;
  const customer = await stripe.customers.update(customerId, {
    metadata: { default_payment_method: paymentMethodId },
  });
  res.send(customer);
});

app.post("/delete", async (req, res) => {
  // Create or retrieve the Stripe Customer object associated with your user.
  const { customerId, paymentMethodId } = req.body;
  const customer = await stripe.paymentMethods.detach(paymentMethodId);
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  res.send(
    paymentMethods.data
      .sort((a, b) => b.id === customer.metadata.default_payment_method)
      .map((pm) => ({
        ...pm.card,
        paymentMethodId: pm.id,
      }))
  );
});

app.listen(process.env.PORT, () =>
  console.log(`Node server listening on port ${process.env.PORT}!`)
);
