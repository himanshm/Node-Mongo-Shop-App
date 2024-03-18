import express, {
  Express,
  Request as ExpressRequest,
  Response,
  NextFunction,
} from 'express';
import 'dotenv/config';
import { Schema, InferSchemaType } from 'mongoose';
import path from 'path';
import bodyParser from 'body-parser';
// import adminRoutes from './routes/admin';
// import shopRoutes from './routes/shop';
// import User from './models/user';

import { get404 } from './controllers/error';
import mongooseConnect from './util/database';

// export interface Request extends ExpressRequest {
//   user?: User;
// }

const app: Express = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await User.findById('65f7ed241a1dfff21eec4412');
//     if (user) {
//       req.user = new User(user.username, user.email, user.cart, user._id);
//     }
//     console.log(user);
//     next();
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(get404);

async function initialize() {
  try {
    await mongooseConnect();
    app.listen(3000);
    console.log('Server is listening on port 3000.');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

initialize();
