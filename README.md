app.use here only registers a middleware for an incoming request, we will then execute this function.

```
app.use((req, res, next) => {
  User.findByPk(1);
});

```

Npm start runs this code for the first time and npm start is what runs sequelize here not incoming requests, incoming requests are only funneled through our middleware. So npm start runs this, this code which sets up our database but never above anonymous function, it just registers it as middleware for incoming requests.

```
async function initialize() {
  try {
    // await sequalize.sync({ force: true });
    await sequalize.sync();
    console.log('Database synchronized successfully.');

    let user = await User.findByPk(1);

    if (!user) {
      user = await User.create({ name: 'Himansh', email: 'him@example.com' });
      console.log('User created:', user);
    }

    console.log('User found:', user);
    app.listen(3000);
    console.log('Server is listening on port 3000.');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

initialize();

```

So the initial code above will only run for incoming requests which on the other hand can only reach it if we did successfully start our server here with app listen
and that in turn is only true if we are done with our initialization code in initilize function.

We can use a concept called eager loading where we basically instruct sequelize
`const orders = await req.user.getOrders({ include: ['products'] });`

'hey if you are fetching all the orders, please also fetch all related products already and give me back one array of orders that also includes the products per order.'

Now this only works of course because we do have a relation between orders and products as set up in app.js `Order.belongsToMany(Product, { through: OrderItem });`
