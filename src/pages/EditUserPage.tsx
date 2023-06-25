import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import { useFlash } from '../contexts/FlashProvider';
import { UpdateUserSchema, UserSchema } from '../Schemas';

type FormErrorsType = {
    username?: string;
    email?: string;
    about_me?: string;
}

export default function EditUserPage() {
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const usernameField = useRef<HTMLInputElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  const aboutMeField = useRef<HTMLInputElement>(null);
  const api = useApi();
  const { user, setUser } = useUser();
  const flash = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    if (usernameField.current) {
      usernameField.current.value = user?.username || '';
      usernameField.current.focus();
    }
    if (emailField.current) {
      emailField.current.value = user?.email || '';
    }
    if (aboutMeField.current) {
      aboutMeField.current.value = user?.about_me || '';
    }
  }, [user]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await api.put<UpdateUserSchema, UserSchema>('/me', {
      username: usernameField.current?.value || '',
      email: emailField.current?.value || '',
      about_me: aboutMeField.current?.value || '',
    });
    if (response.ok) {
      setFormErrors({});
      setUser(response.body); 
      flash('Your profile has been updated.', 'success');
      navigate('/user/' + response.body?.username);
    }
    else if (response.errors) {
      setFormErrors(response.errors.json);
    }
  };

  return (
    <Body sidebar>
      <Form onSubmit={onSubmit}>
        <InputField
          name="username" label="Username"
          error={formErrors.username} fieldRef={usernameField} />
        <InputField
          name="email" label="Email"
          error={formErrors.email} fieldRef={emailField} />
        <InputField
          name="aboutMe" label="About Me"
          error={formErrors.about_me} fieldRef={aboutMeField} />
        <Button variant="primary" type="submit">Save</Button>
      </Form>
    </Body>
  );
}