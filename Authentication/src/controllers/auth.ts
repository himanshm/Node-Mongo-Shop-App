import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import User from '../models/user';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: 'sai.himanshum011@gmail.com',
    pass: 'xsmtpsib-57665c015e95c2fae23b42669d55a437d2bcc22d442fcaa67ec5b345013871f5-5jGED6wvJAxmRBIW',
  },
});

export const getLogin: RequestHandler = (req, res, next) => {
  try {
    let message: string[] = req.flash('error');
    if (message.length > 0) {
      message = [message[0]];
    }

    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message.length > 0 ? message[0] : null,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getSignup: RequestHandler = (req, res, next) => {
  try {
    let message: string[] = req.flash('error');
    if (message.length > 0) {
      message = [message[0]];
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message.length > 0 ? message[0] : null,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export async function postLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash('error', 'Invalid email or password!');
      return res.redirect('/login');
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    } else {
      req.flash('error', 'Invalid email or password!');
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
    res.redirect('/login');
  }
}

export async function postSignup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password, confirmPassword } = req.body;
  const mailOptions = {
    from: 'shop@node-complete.com',
    to: email,
    subject: `Signup Succeeded`,
    html: `<h1>You successfully signed up!</h1>`,
  };
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash('error', 'Email exists already, Please pick a different one!');
      return res.redirect('/signup');
    }

    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await user.save();
    await transporter.sendMail(mailOptions);
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export function postLogout(req: Request, res: Response, next: NextFunction) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      next(err);
    } else {
      res.redirect('/');
    }
  });
}

export const getReset: RequestHandler = (req, res, next) => {
  let message: string[] = req.flash('error');
  if (message.length > 0) {
    message = [message[0]];
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message.length > 0 ? message[0] : null,
  });
};
