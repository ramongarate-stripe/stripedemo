const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.secret_key);

app.use(express.static("."));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  const customerId =
    req.body.customerId || (await stripe.customers.create()).id;
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: "eur",
    customer: customerId,
    setup_future_usage: "on_session",
  });
  res.send({
    paymentIntent: paymentIntent.client_secret,
    customerId: customerId,
    ephemeralKey: ephemeralKey.secret,
  });
});

app.post("/addPaymentMethod", async (req, res) => {
  const customerId = req.body.customerId;
  console.log(customerId);
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: "2020-08-27" }
  );
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    usage: "on_session",
  });
  res.send({
    setupIntent: setupIntent.client_secret,
    customerId: customerId,
    ephemeralKey: ephemeralKey.secret,
  });
});

app.post("/login", async (req, res) => {
  // Create new customer
  const customer = await stripe.customers.create({
    name: "Jane Doe",
  });
  // Add 3 mock payment methods (visa, mastercard, amex)
  const visa = stripe.setupIntents.create({
    payment_method: "pm_card_visa", // stripe testing token
    customer: customer.id,
    confirm: true,
    usage: "on_session",
  });
  const mastercard = stripe.setupIntents.create({
    payment_method: "pm_card_mastercard", // stripe testing token
    customer: customer.id,
    confirm: true,
    usage: "on_session",
  });
  const amex = stripe.setupIntents.create({
    payment_method: "pm_card_amex", // stripe testing token
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
  const { customerId } = req.params;
  const customer = stripe.customers.retrieve(customerId);
  const paymentMethods = stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  Promise.all([customer, paymentMethods]).then(
    async ([customer, paymentMethods]) => {
      // Sort payment methods so default one appears first
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
  const { customerId, paymentMethodId } = req.body;
  const customer = await stripe.customers.update(customerId, {
    metadata: { default_payment_method: paymentMethodId },
  });
  res.send(customer);
});

app.post("/delete", async (req, res) => {
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
