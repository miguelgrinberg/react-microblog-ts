import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useApi } from '../contexts/ApiProvider';
import { useFlash } from '../contexts/FlashProvider';
import { PasswordResetSchema } from '../Schemas';

type FormErrorsType = {
    password?: string;
    password2?: string;
}

export default function ResetPage() {
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const passwordField = useRef<HTMLInputElement>(null);
  const password2Field = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { search } = useLocation();
  const api = useApi();
  const flash = useFlash();
  const token = new URLSearchParams(search).get('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
    else {
      if (passwordField.current) {
        passwordField.current.focus();
      }
    }
  }, [token, navigate]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordField.current?.value !== password2Field.current?.value) {
        setFormErrors({password2: "New passwords don't match"});
    }
    else {
      const response = await api.put<PasswordResetSchema, null>('/tokens/reset', {
        token: token || '',
        new_password: passwordField.current?.value || '',
      });
      if (response.ok) {
        setFormErrors({});
        flash('Your password has been reset.', 'success');
        navigate('/login');
      }
      else {
        if (response.errors?.json?.new_password) {
          setFormErrors(response.errors.json);
        }
        else {
          flash('Password could not be reset. Please try again.', 'danger');
          navigate('/reset-request');
        }
      }
    }
  };

  return (
    <Body>
      <h1>Reset Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="password" label="New Password" type="password"
          error={formErrors.password} fieldRef={passwordField} />
        <InputField
          name="password2" label="New Password Again" type="password"
          error={formErrors.password2} fieldRef={password2Field} />
        <Button variant="primary" type="submit">Reset Password</Button>
      </Form>
    </Body>
  );
}
