import { useState, useEffect } from 'react';
import { FaCheckCircle, FaCloudUploadAlt, FaExclamationCircle } from 'react-icons/fa';
import styles from './CommentForm.module.css';
import { supabase } from '../../lib/supabase';
import type { ChapterRow } from '../../types';

const CommentForm = () => {
  const [formData, setFormData] = useState({
    topic: '',
    comment: '',
    zone: '',
    email: '',
    privacy: false
  });
  
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [folio, setFolio] = useState('');

  // Cargar temas
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const { data, error } = await supabase
          .from('consultation_chapters')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setChapters(data || []);
      } catch (error) {
        console.error('Error al cargar temas:', error);
      } finally {
        setIsLoadingChapters(false);
      }
    };

    fetchChapters();
  }, []);

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
      const selectedFile = e.target.files[0];
      
      // Validación tamaño máximo 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado pesado. El límite es 5MB.");
        return;
      }
      
      // Validación tipos permitidos 
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Formato no válido. Solo se aceptan PDF, JPG o PNG.");
        return;
      }

      setFile(selectedFile);
    }
  };

  // Función para subir evidencia al Bucket
  const uploadEvidence = async (fileToUpload: File): Promise<string | null> => {
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `public_uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('evidences')
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data } = supabase.storage
        .from('evidences')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      throw new Error("No se pudo subir el archivo adjunto.");
    }
  };

  // Regex para email
  const isValidEmail = (email: string) => {
    if (!email) return true; // Es opcional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacy) {
      alert("Debes aceptar el Aviso de Privacidad.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      alert("El formato del correo electrónico no es válido.");
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      let evidenceUrl = null;

      if (file) {
        evidenceUrl = await uploadEvidence(file);
      }

      // Insertamos sin enviar el folio y recuperamos el registro con el folio generado de la db
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            topic: formData.topic,
            content: formData.comment,
            zone: formData.zone,
            email: formData.email || null,
            evidence_url: evidenceUrl,
            has_accepted_privacy: formData.privacy,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setFolio(data.folio || '');
      setStatus('success');

    } catch (error: any) {
      console.error('Error al enviar:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error al enviar tu comentario.');
    }
  };

  const handleReset = () => {
    setFormData({ topic: '', comment: '', zone: '', email: '', privacy: false });
    setFile(null);
    setStatus('idle');
    setFolio('');
    setErrorMessage('');
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
            <span className={styles.folioLabel}>Tu folio de seguimiento es:</span>
            <span className={styles.folioValue}>{folio}</span>
          </div>

          <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.9rem' }}>
            {formData.email 
              ? `Hemos enviado un comprobante digital a ${formData.email}.`
              : "Por favor guarda este folio para consultar el estatus de tu aportación en la sección de Transparencia."}
          </p>

          <button 
            className={styles.resetButton}
            onClick={handleReset}
          >
            Enviar otra propuesta
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
          Envía tus observaciones, propuestas o comentarios técnicos para la construcción del PMDU.
        </p>
      </div>

      {status === 'error' && (
        <div className={styles.errorBox}>
          <FaExclamationCircle />
          <span>{errorMessage}</span>
        </div>
      )}

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
                disabled={isLoadingChapters}
              >
                <option value="">Selecciona un tema...</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.name}>{chapter.name}</option>
                ))}
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
            rows={6}
            maxLength={3000}
            placeholder="Describe tu observación de manera clara..."
            className={styles.textarea}
            required
          />
        </div>

        {/* Archivo Adjunto */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Adjuntar Documento o Evidencia (Opcional)</label>
          
          <div className={styles.fileInputContainer}>
            <label className={styles.fileLabelBtn}>
              <FaCloudUploadAlt color="#666" />
              Elegir archivo
              <input 
                type="file" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
                accept=".pdf,.jpeg,.jpg,.png"
              />
            </label>

            {file ? (
              <span className={styles.fileName}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#999' }}>Ningún archivo seleccionado</span>
            )}
          </div>

          <small className={styles.fileHelp}>
            Formatos aceptados: PDF, JPG o PNG. Tamaño máx: 5MB.
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