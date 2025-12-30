import { useState } from 'react';
import styles from './EventRegistration.module.css';

interface RegistrationProps {
  eventId: string;
  eventTitle: string;
}

const EventRegistration = ({ eventId, eventTitle }: RegistrationProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [folio, setFolio] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    organizacion: '',
    privacidad: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de envío al backend************************************
    setTimeout(() => {
      const nuevoFolio = `PMDU-${eventId.split('-')[1]}-${Math.floor(Math.random() * 1000)}`;
      setFolio(nuevoFolio);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className={styles.successMessage}>
        <h3>¡Registro Confirmado!</h3>
        <p>Te has registrado exitosamente para: <strong>{eventTitle}</strong></p>
        <p>Tu folio de acceso es:</p>
        <span className={styles.folio}>{folio}</span>
        <p><small>Hemos enviado un correo de confirmación a {formData.email}</small></p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registro al Evento</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre Completo *</label>
          <input type="text" name="nombre" required className={styles.input} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Correo Electrónico *</label>
          <input type="email" name="email" required className={styles.input} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Teléfono (Opcional)</label>
          <input type="tel" name="telefono" className={styles.input} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Organización o Colonia (Opcional)</label>
          <input type="text" name="organizacion" className={styles.input} onChange={handleChange} />
        </div>

        <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" name="privacidad" required onChange={handleChange} />
          <label className={styles.label} style={{ fontWeight: 'normal' }}>
            Acepto el aviso de privacidad y el uso de mis datos para fines del PMDU.
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>Confirmar Asistencia</button>
      </form>
    </div>
  );
};

export default EventRegistration;