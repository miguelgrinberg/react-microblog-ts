import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useApi } from '../contexts/ApiProvider';
import { useFlash } from '../contexts/FlashProvider';
import { NewUserSchema, UserSchema } from '../Schemas';

type FormErrorsType = {
  username?: string;
  email?: string;
  password?: string;
  password2?: string;
}

export default function RegistrationPage() {
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const usernameField = useRef<HTMLInputElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);
  const password2Field = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    if (usernameField.current) {
      usernameField.current.focus();
    }
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordField.current?.value !== password2Field.current?.value) {
      setFormErrors({password2: "Passwords don't match"});
      console.log('2. set');
    }
    else {
      const data = await api.post<NewUserSchema, UserSchema>('/users', {
        username: usernameField.current ? usernameField.current.value : '',
        email: emailField.current ? emailField.current.value : '',
        password: passwordField.current ? passwordField.current.value : '',
      });
      if (!data.ok && data.errors) {
        console.log('1. set', data.errors);
        setFormErrors(data.errors.json);
      }
      else {
        setFormErrors({});
        flash('You have successfully registered!', 'success');
        navigate('/login');
      }
    }
  };

  return (
    <Body>
      <h1>Register</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username" label="Username"
          error={formErrors.username} fieldRef={usernameField} />
        <InputField
          name="email" label="Email address"
          error={formErrors.email} fieldRef={emailField} />
        <InputField
          name="password" label="Password" type="password"
          error={formErrors.password} fieldRef={passwordField} />
        <InputField
          name="password2" label="Password again" type="password"
          error={formErrors.password2} fieldRef={password2Field} />
        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </Body>
  );
}