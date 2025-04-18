import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.scss';
import { Form } from 'react-bootstrap';

function App() {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf',
    multiple: false,
  });

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Por favor, seleccione un archivo antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/GetExcel`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "factura_generada.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error al descargar el archivo:", response.statusText);
      }
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
    }
  };

  return (
    <>
      <h1>Suba su archivo .pdf</h1>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelte el archivo aquí...</p>
        ) : (
          <p>Arrastre y suelte un archivo aquí, o haga clic para seleccionar uno</p>
        )}
      </div>
      {file && (
        <div>
          <p>
            Archivo seleccionado: {file.name}{' '}
            <span
              style={{
                color: '#888',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginLeft: '10px',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: file ? 'scale(1)' : 'scale(0)',
                opacity: file ? 1 : 0,
              }}
              onClick={handleRemoveFile}
            >
              ×
            </span>
          </p>
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <button type="submit">Enviar</button>
      </Form>
    </>
  );
}

export default App;