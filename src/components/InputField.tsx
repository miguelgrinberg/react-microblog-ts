import Form from 'react-bootstrap/Form';

type InputFieldProps = {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    error?: string;
    fieldRef?: React.RefObject<HTMLInputElement>;
}

export default function InputField(
  { name, label, type, placeholder, error, fieldRef }: InputFieldProps
) {
  return (
    <Form.Group controlId={name} className="InputField">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type || 'text'}
        placeholder={placeholder}
        ref={fieldRef}
      />
      <Form.Text className="text-danger">{error}</Form.Text>
    </Form.Group>
  );
}