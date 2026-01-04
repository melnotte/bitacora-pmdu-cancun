import CommentForm from '../components/consultation/CommentForm';
import styles from './Consultation.module.css';

const Consultation = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Consulta Pública Ciudadana</h1>
          <p className={styles.description}>
            Tu participación es vinculante para el análisis técnico del PMDU. 
            Por favor, selecciona el tema de tu interés y comparte tus observaciones, 
            propuestas o evidencia técnica.
          </p>
        </div>

        <CommentForm />
        
      </div>
    </div>
  );
};

export default Consultation;