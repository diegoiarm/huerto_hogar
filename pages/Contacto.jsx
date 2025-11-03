import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { 
  initialFormState, 
  handleFormSubmit, 
  handleInputChange 
} from '../js/contacto';

const Contacto = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const onSubmit = (e) => {
    handleFormSubmit(e, formData, setFormData, setErrors, setValidated);
  };

  const onChange = (e) => {
    handleInputChange(e, formData, setFormData, validated, setErrors);
  };

  return (
    <section className="py-5">
      <Container>
        <h2 className="form-title text-center">Contáctanos</h2>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm px-4 py-5">
              <Form noValidate onSubmit={onSubmit}>
                
                <Form.Group className="mb-3" controlId="contact-nombre">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={onChange}
                    isValid={validated && !errors.nombre}
                    isInvalid={!!errors.nombre}
                    placeholder="Tu nombre"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="contact-email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    isValid={validated && formData.email && !errors.email}
                    isInvalid={!!errors.email}
                    placeholder="email@ejemplo.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="contact-mensaje">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={onChange}
                    isValid={validated && !errors.mensaje}
                    isInvalid={!!errors.mensaje}
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mensaje}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="btn-esmeralda"
                    style={{ border: 'none' }}
                  >
                    Enviar mensaje
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contacto;