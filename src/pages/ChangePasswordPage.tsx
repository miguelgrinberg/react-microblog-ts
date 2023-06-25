import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useApi } from '../contexts/ApiProvider';
import { useFlash } from '../contexts/FlashProvider';
import { PasswordChangeSchema } from '../Schemas';

type FormErrorsType = {
    old_password?: string;
    password?: string;
    password2?: string;
}

export default function EditUserPage() {
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const oldPasswordField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);
  const password2Field = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    if (oldPasswordField.current) {
      oldPasswordField.current.focus();
    }
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordField.current?.value !== password2Field.current?.value) {
        setFormErrors({password2: "New passwords don't match"});
    }
    else {
      const response = await api.put<PasswordChangeSchema, null>('/me', {
        old_password: oldPasswordField.current?.value || '',
        password: passwordField.current?.value || '',
      });
      if (response.ok) {
        setFormErrors({});
        flash('Your password has been updated.', 'success');
        navigate('/me');
      }
      else if (response.errors) {
        setFormErrors(response.errors.json);
      }
    }
  };

  return (
    <Body sidebar={true}>
      <h1>Change Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="oldPassword" label="Old Password" type="password"
          error={formErrors.old_password} fieldRef={oldPasswordField} />
        <InputField
          name="password" label="New Password" type="password"
          error={formErrors.password} fieldRef={passwordField} />
        <InputField
          name="password2" label="New Password Again" type="password"
          error={formErrors.password2} fieldRef={password2Field} />
        <Button variant="primary" type="submit">Change Password</Button>
      </Form>
    </Body>
  );
}