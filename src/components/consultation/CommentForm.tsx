import { useState } from 'react';
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';
import styles from './CommentForm.module.css';

// Catálogo de temas
const THEMES = [
  "Diagnóstico Integrado",
  "Estrategia de Movilidad",
  "Zonificación Secundaria",
  "Espacio Público y Equipamiento",
  "Medio Ambiente y Sostenibilidad",
  "Infraestructura y Servicios",
  "Otro"
];

const CommentForm = () => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    topic: '',
    comment: '',
    zone: '',
    email: '',
    privacy: false
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [folio, setFolio] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulación de envío al backend
    setTimeout(() => {
      // Generar folio: PMDU-AÑO-RANDOM
      const newFolio = `CONSULTA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setFolio(newFolio);
      setStatus('success');
      
      console.log("Enviando datos:", { ...formData, file, date: new Date().toISOString() });
    }, 1500);
  };

  const handleReset = () => {
    setFormData({ topic: '', comment: '', zone: '', email: '', privacy: false });
    setFile(null);
    setStatus('idle');
    setFolio('');
  };

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.successState}>
          <FaCheckCircle className={styles.successIcon} />
          <h2 className={styles.title}>¡Comentario Enviado!</h2>
          <p className={styles.subtitle}>
            Tu aportación ha sido registrada correctamente en el sistema de consulta pública.
          </p>

          <div className={styles.folioBox}>
            <span className={styles.folioLabel}>Tu folio de seguimiento</span>
            <span className={styles.folioValue}>{folio}</span>
          </div>

          <p style={{ color: '#666', marginBottom: '20px' }}>
            {formData.email 
              ? `Hemos enviado un comprobante a ${formData.email}.`
              : "Guarda este folio para futuras referencias."}
          </p>

          <button onClick={handleReset} className={styles.resetButton}>
            Enviar otro comentario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Buzón de Consulta Pública</h2>
        <p className={styles.subtitle}>
          Envía tus observaciones, propuestas o comentarios técnicos sobre el borrador del PMDU.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Fila 1: Tema y Zona */}
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tema o Capítulo *</label>
              <select 
                name="topic" 
                value={formData.topic} 
                onChange={handleChange} 
                className={styles.select} 
                required
              >
                <option value="">Selecciona un tema...</option>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Colonia o Zona (Opcional)</label>
              <input 
                type="text" 
                name="zone" 
                value={formData.zone} 
                onChange={handleChange} 
                placeholder="Ej. Centro, Región 100..."
                className={styles.input} 
              />
            </div>
          </div>
        </div>

        {/* Comentario */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Tu Comentario / Propuesta *</label>
          <textarea 
            name="comment" 
            value={formData.comment} 
            onChange={handleChange} 
            placeholder="Describe tu observación de manera clara..."
            className={styles.textarea} 
            required
          />
        </div>

        {/* Archivo Adjunto */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Adjuntar Documento o Evidencia (Opcional)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className={styles.fileInput} 
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            {file && <span style={{ fontSize: '0.8rem', color: '#2e7d32' }}><FaCloudUploadAlt /> Listo para subir</span>}
          </div>
          <small style={{ color: '#9ca3af' }}>Formatos: PDF, Word, Imagen. Máx 5MB.</small>
        </div>

        {/* Correo Electrónico */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Correo Electrónico (Opcional)</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Para recibir acuse de recibo y seguimiento"
            className={styles.input} 
          />
        </div>

        {/* Aviso de Privacidad */}
        <div className={styles.checkboxGroup}>
          <input 
            type="checkbox" 
            name="privacy" 
            id="privacy"
            checked={formData.privacy} 
            onChange={handleChange} 
            className={styles.checkbox}
            required 
          />
          <label htmlFor="privacy" className={styles.checkboxLabel}>
            He leído y acepto el <strong>Aviso de Privacidad</strong>. Mis datos personales (si los proporciono) 
            serán utilizados únicamente para el registro y análisis estadístico de la consulta pública.
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar Comentario'}
        </button>

      </form>
    </div>
  );
};

export default CommentForm; 