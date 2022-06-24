import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import * as yup from "yup";
import { Formik } from "formik";

type FormValues = {
  subject: string;
  content: string;
};

const schema = yup.object().shape({
  subject: yup.string().required(),
  content: yup.string().required(),
});

const App = () => {
  const onSubmit = (
    values: FormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (flag: boolean) => void; resetForm: () => void }
  ) => {
    setSubmitting(true);

    setTimeout(() => {
      console.log(values);
      resetForm();
      setSubmitting(false);
    }, 1500);
  };
  const header =
    "<header contenteditable='false'><div style='height: 150px; font-size: 28px'>Header Section</div></header>";
  const footer =
    "<footer contenteditable='false'><div style='height: 150px; font-size: 28px'>Footer Section</div></footer>";
  const initialValue = `${header}<p></p><p></p>${footer}`;
  return (
    <Container>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          subject: "",
          content: "",
        }}
      >
        {({
          setFieldValue,
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    isValid={touched.subject && !errors.subject}
                    isInvalid={touched.subject && !!errors.subject}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Content</Form.Label>
                  <Editor
                    tinymceScriptSrc={
                      process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                    }
                    initialValue={initialValue}
                    onEditorChange={(value) => {
                      setFieldValue("content", value);
                    }}
                    init={{
                      height: 600,
                      menubar: false,
                      inline_styles: true,
                      statusbar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat remove ",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default App;
