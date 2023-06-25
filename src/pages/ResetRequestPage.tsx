import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Body from '../components/Body';
import InputField from '../components/InputField';
import { useApi } from '../contexts/ApiProvider';
import { useFlash } from '../contexts/FlashProvider';
import { PasswordResetRequestSchema } from '../Schemas';

type FormErrorsType = {
    email?: string;
}

export default function ResetRequestPage() {
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const emailField = useRef<HTMLInputElement>(null);
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    if (emailField.current) {
      emailField.current.focus();
    }
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await api.post<PasswordResetRequestSchema, null>('/tokens/reset', {
      email: emailField.current?.value || '',
    });
    if (!response.ok && response.errors) {
      setFormErrors(response.errors.json);
    }
    else {
      if (emailField.current) {
        emailField.current.value = '';
      }
      setFormErrors({});
      flash(
        'You will receive an email with instructions ' +
        'to reset your password.', 'info'
      );
    }
  };

  return (
    <Body>
      <h1>Reset Your Password</h1>
      <Form onSubmit={onSubmit}>
        <InputField
          name="email" label="Email Address"
          error={formErrors.email} fieldRef={emailField} />
        <Button variant="primary" type="submit">Reset Password</Button>
      </Form>
    </Body>
  );
}