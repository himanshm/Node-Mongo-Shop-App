import { Request, Response, NextFunction, RequestHandler } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { promisify } from 'util';
import { validationResult } from 'express-validator';

import User from '../models/user';

const randomBytesAsync = promisify(crypto.randomBytes);

// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.sendinblue.com',
//   port: 587,
//   auth: {
//     user: 'sai.himanshum011@gmail.com',
//     pass: process.env.AUTH_KEY,
//   },
// });

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
      oldInput: {
        email: '',
        password: '',
      },
      validationErrors: [],
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
      oldInput: { email: '', password: '', confirmPassword: '' },
      validationErrors: [],
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password!',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
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
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password!',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  const mailOptions = {
    from: 'shop@node-complete.com',
    to: email,
    subject: `Signup Succeeded`,
    html: `<h1>You successfully signed up!</h1>`,
  };
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    // const userDoc = await User.findOne({ email: email });
    // if (userDoc) {
    //   req.flash('error', 'Email exists already, Please pick a different one!');
    //   return res.redirect('/signup');
    // }

    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await user.save();
    // await transporter.sendMail(mailOptions);
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

export const postReset: RequestHandler = async (req, res, next) => {
  try {
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      req.flash('error', 'No account with that email found!');
      return res.redirect('/reset');
    }

    user.resetToken = token;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // now + 1 hour
    await user.save();

    res.redirect('/');
    // await transporter.sendMail({
    //   from: 'shop@node-complete.com',
    //   to: req.body.email,
    //   subject: `Password Reset`,
    //   html: `<p>You requested a password reset</p>
    //          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`,
    // });
  } catch (err) {
    console.log(err);
    next(err);
  }
  // crypto.randomBytes(32, async (err, buffer) => {
  //   if (err) {
  //     console.log(err);
  //     return res.redirect('/reset');
  //   }

  //   const token = buffer.toString('hex');
};

export const getNewPassword: RequestHandler = async (req, res, next) => {
  let message: string[] = req.flash('error');
  if (message.length > 0) {
    message = [message[0]];
  }

  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      req.flash('error', 'No user found! The token is probably expired!');
      return res.redirect('/reset');
    }

    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message.length > 0 ? message[0] : null,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const postNewPassword: RequestHandler = async (req, res, next) => {
  try {
    const { userId, newPassword, passwordToken } = req.body;
    console.log(userId, newPassword, passwordToken);

    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    if (!user) {
      req.flash('error', 'No user found!');
      return res.redirect('/reset');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    next(err);
  }
};
