import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  role: Yup.string().oneOf(['admin', 'doctor', 'lab_technician'], 'Invalid role').required('Role is required'),
  termsAccepted:Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

export const patientSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number().positive('Age must be positive').integer('Age must be an integer').required('Age is required'),
  gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').required('Gender is required'),
});