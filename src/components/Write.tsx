import { useState, useEffect, useRef } from 'react';
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Form from 'react-bootstrap/Form';
import InputField from './InputField';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import { NewPostSchema, PostSchema } from '../Schemas';

type WriteProps = {
    showPost: (post: any) => void;
}

type FormErrorsType = {
    text?: string;
}

export default function Write({ showPost }: WriteProps) {
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const textField = useRef<HTMLInputElement>(null);
  const api = useApi();
  const { user } = useUser();

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, []);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const response = await api.post<NewPostSchema, PostSchema>("/posts", {
      text: textField.current?.value || '',
    });
    if (response.ok) {
      showPost(response.body);
      if (textField.current) {
        textField.current.value = '';
      }
    }
    else {
      if (response.errors) {
        setFormErrors(response.errors.json);
      }
    }
  };

  return (
    <Stack direction="horizontal" gap={3} className="Write">
      {user &&
        <Image
          src={user.avatar_url + '&s=64' }
          roundedCircle
        />
      }
      <Form onSubmit={onSubmit}>
        <InputField
          name="text" placeholder="What's on your mind?"
          error={formErrors.text} fieldRef={textField} />
      </Form>
    </Stack>
  );
}