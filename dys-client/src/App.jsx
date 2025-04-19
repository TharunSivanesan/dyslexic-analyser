// src/App.jsx
import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [textResult, setTextResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrorMessage('Please upload an image!');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);
      setErrorMessage('');
      setTextResult('');

      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTextResult(data.text);
      } else {
        setErrorMessage(data.error || 'Something went wrong!');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1 className="text-center mb-4">Dyslexic Handwriting Analyzer</h1>
          
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleImageSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Handwriting Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
            </Form.Group>

            {preview && (
              <div className="text-center">
                <img src={preview} alt="Preview" className="img-fluid mb-3" style={{ maxHeight: '300px' }} />
              </div>
            )}

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Analyze Handwriting'}
            </Button>
          </Form>

          {textResult && (
            <div className="mt-4">
              <h3>Extracted Text:</h3>
              <p>{textResult}</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
