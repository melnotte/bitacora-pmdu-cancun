import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPollH } from 'react-icons/fa'; 
import { supabase } from '../../lib/supabase';
import type { WeeklyPollWithDetails } from '../../types';
import styles from './WeeklyPoll.module.css';

export const WeeklyPoll = () => {
  // Datos
  const [poll, setPoll] = useState<WeeklyPollWithDetails | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  
  // Control de Interfaz
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Mensajes
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('weekly_polls')
          .select('*, poll_options (*)')
          .eq('is_active', true)
          .single();

        if (error) throw error;

        if (data) {
           data.poll_options.sort((a, b) => {
              if (a.is_open_response === true) return 1;
              if (b.is_open_response === true) return -1;
              return a.label.localeCompare(b.label);
           });
           
           setPoll(data as WeeklyPollWithDetails);
        }
      } catch (err) {
        console.error('Error cargando encuesta:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, []);

  // Verificar localStorage cuando la encuesta carga
  useEffect(() => {
    if (!poll) return;

    const votedId = localStorage.getItem(`voted_${poll.id}`);
    const savedText = localStorage.getItem(`text_${poll.id}`);

    if (votedId) {
        setSelectedOption(votedId);
        if (savedText) setOtherText(savedText);
        
        setHasVoted(true);
    }
  }, [poll]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasVoted) return; 

    const val = e.target.value;
    
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,]*$/.test(val)) {
      setOtherText(val);
      setErrorMsg('');
    }
  };

  const handleSelect = (optionId: string) => {
    // Si ya votó, no dejamos cambiar la opción
    if (hasVoted) return;
    
    setSelectedOption(optionId);
    setErrorMsg('');
  };

  const handleSubmit = async () => {
    if (!poll || !selectedOption) return;

    if (hasVoted || localStorage.getItem(`voted_${poll.id}`)) {
        setHasVoted(true);
        setSuccessMsg('Ya has registrado tu voto anteriormente.');
        return;
    }

    // Buscamos la opción en el array de Supabase (poll.poll_options)
    const optionDef = poll.poll_options.find(o => o.id === selectedOption);

    if (optionDef?.is_open_response && !otherText.trim()) {
      setErrorMsg('Por favor escribe tu respuesta para continuar.');
      return;
    }

    try {
        setSubmitting(true);
        // Llamada a la función para votos simultáneos
        const { error } = await supabase.rpc('vote_for_option', {
             p_option_id: selectedOption,
             p_text_response: optionDef?.is_open_response ? otherText : undefined
        });

        if (error) throw error;

        localStorage.setItem(`voted_${poll.id}`, selectedOption);
        
        if (optionDef?.is_open_response) {
            localStorage.setItem(`text_${poll.id}`, otherText);
        } 

        setHasVoted(true);
        setErrorMsg('');

    } catch (err) {
        console.error(err);
        setErrorMsg('Error al conectar con el servidor.');
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return null;
  if (!poll) return null;

  return (
    <div className={styles.pollWrapper}>
      <div className={styles.header}>
        <span className={styles.tag}>Pregunta Semanal</span>
        <h3 className={styles.question}>{poll.question}</h3>
        <p className={styles.instructions}>
            {hasVoted ? 'Gracias por tu participación' : 'Selecciona una opción para participar'}
        </p>
      </div>

      <div className={styles.optionsGrid}>
        {poll.poll_options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showInput = option.is_open_response && isSelected;

          return (
            <div 
                key={option.id} 
                className={`${styles.optionWrapper} ${option.is_open_response ? styles.fullWidth : ''}`}
            >
                <button
                  onClick={() => handleSelect(option.id)}
                  disabled={hasVoted || submitting}
                  className={`
                    ${styles.optionButton} 
                    ${isSelected ? styles.optionButtonSelected : ''}
                    ${hasVoted && !isSelected ? styles.dimmed : ''} 
                  `}
                >
                  <div className={styles.optionButtonContent}>
                      <div className={`${styles.radioCircle} ${isSelected ? styles.radioCircleSelected : ''}`}>
                          {isSelected && <div className={styles.radioDot} />}
                      </div>
                      <span className={`${styles.optionText} ${isSelected ? styles.optionTextSelected : ''}`}>
                        {option.label}
                      </span>
                  </div>
                </button>
                
                {showInput && (
                    <div className={styles.inputWrapper}>
                        <input 
                            type="text" 
                            value={otherText}
                            onChange={handleTextChange}
                            placeholder={hasVoted ? "Tu respuesta registrada" : "Escribe tu respuesta aquí..."}
                            className={styles.textInput}
                            disabled={hasVoted || submitting}
                        />
                    </div>
                )}
            </div>
          );
        })}
      </div>

      <div className={styles.footerActions}>
        {errorMsg && <div className={styles.messageError}>{errorMsg}</div>}
        {successMsg && <div className={styles.messageSuccess}>{successMsg}</div>}
        
        {/* Mensaje de confirmación si ya votó */}
        {hasVoted && !successMsg && (
             <div className={styles.messageSuccess}>✓ Tu voto ha sido registrado exitosamente </div>
        )}

        {/* El botón desaparece si ya votó */}
        {!hasVoted && (
            <button 
                onClick={handleSubmit} 
                className={styles.submitButton}
                disabled={submitting}
            >
            {submitting ? 'Enviando...' : 'Enviar Voto'}
            </button>
        )}
      </div>
      
      <div className={styles.resultsLinkContainer}>
        <Link to="/transparencia" className={styles.resultsLink}>
          Ver resultados globales <FaPollH size="1.1em" />
        </Link>
      </div>

    </div>
  );
};