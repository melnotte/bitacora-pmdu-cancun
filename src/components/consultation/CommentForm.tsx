import { useState } from 'react';
import { FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';
import styles from './CommentForm.module.css';
import type { Comment } from '../../data/commentsData';

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

    // 1. Simulación de retardo de red
    setTimeout(() => {
      // 2. Generar datos del sistema (Folio, ID, Fecha)
      const year = new Date().getFullYear();
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const newFolio = `PMDU-${year}-${randomId}`;
      const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

      // 3. Crear el objeto con la estructura
      const newComment: Comment = {
        id: crypto.randomUUID(),
        folio: newFolio,
        date: today,
        topic: formData.topic,
        zone: formData.zone || 'No especificada',
        content: formData.comment,
        status: 'Recibido',
        internalNote: ''
      };

      // 4. Guardar en localStorage para simular persistencia en la demo
      try {
        const existingData = localStorage.getItem('pmdu_demo_comments');
        const comments = existingData ? JSON.parse(existingData) : [];
        localStorage.setItem('pmdu_demo_comments', JSON.stringify([newComment, ...comments]));
      } catch (error) {
        console.error("Error guardando en localstorage", error);
      }

      console.log("✅ Comentario registrado en sistema:", newComment);
      if (file) console.log("📎 Archivo adjunto:", file.name);

      setFolio(newFolio);
      setStatus('success');
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
          <FaCheckCircle color="#2e7d32" size={60} style={{ marginBottom: '20px' }} />
          <h2 className={styles.title}>¡Comentario Enviado!</h2>
          <p className={styles.subtitle}>
            Tu aportación ha sido registrada correctamente en el sistema de consulta pública.
          </p>

          <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px dashed #ccc' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Tu folio de seguimiento</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#005eb8', letterSpacing: '1px' }}>{folio}</span>
          </div>

          <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.9rem' }}>
            {formData.email 
              ? `Hemos enviado un comprobante digital a ${formData.email}.`
              : "Por favor guarda este folio para consultar el estatus de tu aportación en la sección de Transparencia."}
          </p>

          <button onClick={handleReset} className={styles.submitButton} style={{ marginTop: 0 }}>
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
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
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
            style={{ minHeight: '120px', width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
            required
          />
        </div>

        {/* Archivo Adjunto */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Adjuntar Documento o Evidencia (Opcional)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <label style={{ 
              cursor: 'pointer', 
              padding: '8px 16px', 
              border: '1px solid #ddd', 
              borderRadius: '6px', 
              background: '#f9f9f9', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.9rem'
            }}>
              <FaCloudUploadAlt color="#666" />
              Elegir archivo
              <input 
                type="file" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </label>
            {file ? (
              <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 600 }}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#999' }}>Ningún archivo seleccionado</span>
            )}
          </div>
          <small style={{ color: '#9ca3af', display: 'block', marginTop: '5px', fontSize: '0.8rem' }}>
            Formatos aceptados: PDF, Word, Imagen. Tamaño máx: 5MB.
          </small>
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
        <div className={styles.checkboxGroup} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '10px' }}>
          <input 
            type="checkbox" 
            name="privacy" 
            id="privacy"
            checked={formData.privacy} 
            onChange={handleChange} 
            className={styles.checkbox}
            style={{ marginTop: '4px' }}
            required 
          />
          <label htmlFor="privacy" className={styles.checkboxLabel} style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.4' }}>
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