import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPollH } from 'react-icons/fa'; 
import { currentPollData, saveVote, type Poll } from '../../data/pollData';
import styles from './WeeklyPoll.module.css';

export const WeeklyPoll = () => {
  const [poll, setPoll] = useState<Poll>(currentPollData);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const votedId = localStorage.getItem(`voted_${poll.id}`);
    const savedText = localStorage.getItem(`text_${poll.id}`); 
    
    if (votedId) setSelectedOption(votedId);
    if (savedText) setOtherText(savedText);
  }, [poll.id]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
      setOtherText(val);
      setErrorMsg('');
      setIsSaved(false); 
    }
  };

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setErrorMsg('');
    setIsSaved(false);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      setErrorMsg('Por favor selecciona una opción.');
      return;
    }

    const optionDef = currentPollData.options.find(o => o.id === selectedOption);
    
    if (optionDef?.isOpenResponse && !otherText.trim()) {
      setErrorMsg('Por favor escribe tu respuesta para continuar.');
      return;
    }

    const previousVoteId = localStorage.getItem(`voted_${poll.id}`);

    // Guardar voto
    const updatedPoll = saveVote(poll.id, selectedOption, previousVoteId, otherText);
    setPoll(updatedPoll);
    
    localStorage.setItem(`voted_${poll.id}`, selectedOption);
    
    if (optionDef?.isOpenResponse) {
        localStorage.setItem(`text_${poll.id}`, otherText);
    } else {
        localStorage.removeItem(`text_${poll.id}`);
        setOtherText(''); 
    }
    
    setIsSaved(true);
    setErrorMsg('');
  };

  return (
    <div className={styles.pollWrapper}>
      <div className={styles.header}>
        <span className={styles.tag}>Pregunta Semanal</span>
        <h3 className={styles.question}>{currentPollData.question}</h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Selecciona la opción que mejor represente tu opinión.
        </p>
      </div>

      <div className={styles.optionsGrid}>
        {currentPollData.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const showInput = option.isOpenResponse && isSelected;

          return (
            <div 
                key={option.id} 
                className={`${styles.optionWrapper} ${option.isOpenResponse ? styles.fullWidth : ''}`}
            >
                <button
                  onClick={() => handleSelect(option.id)}
                  className={`${styles.optionButton} ${isSelected ? styles.optionButtonSelected : ''}`}
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
                            placeholder="Escribe tu respuesta aquí..."
                            className={styles.textInput}
                            autoFocus={!isSaved} 
                        />
                    </div>
                )}
            </div>
          );
        })}
      </div>

      <div className={styles.footerActions}>
        {errorMsg && <div className={styles.messageError}>{errorMsg}</div>}
        {isSaved && <div className={styles.messageSuccess}>✓ Tu voto ha sido actualizado correctamente</div>}

        <button onClick={handleSubmit} className={styles.submitButton}>
          {isSaved ? 'Actualizar Voto' : 'Enviar Voto'}
        </button>
      </div>
      
      <div className={styles.resultsLinkContainer}>
        <Link to="/transparencia" className={styles.resultsLink}>
          Ver resultados globales <FaPollH size="1.1em" />
        </Link>
      </div>

    </div>
  );
};