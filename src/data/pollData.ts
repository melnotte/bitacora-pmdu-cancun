export interface PollOption {
  id: string;
  label: string;
  votes: number;
  isOpenResponse?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  openResponses: string[];
}

export const currentPollData: Poll = {
  id: 'poll-001',
  question: '¿Cuál consideras que es el principal desafío de movilidad en Benito Juárez?',
  totalVotes: 1240,
  openResponses: [],
  options: [
    { id: 'opt1', label: 'Tiempos de espera del transporte público', votes: 450 },
    { id: 'opt2', label: 'Falta de rutas conectadas', votes: 320 },
    { id: 'opt3', label: 'Estado de las vialidades (baches/tráfico)', votes: 280 },
    { id: 'opt4', label: 'Seguridad peatonal y ciclovías', votes: 190 },
    { id: 'opt_other', label: 'Otro (Especifique)', votes: 0, isOpenResponse: true }, 
  ],
};

export const saveVote = (pollId: string, newOptionId: string, previousOptionId?: string | null, textResponse?: string): Poll => {
  const stored = localStorage.getItem(`poll_${pollId}`);
  let data = stored ? JSON.parse(stored) : { ...currentPollData };
  
  if (!stored) {
    data.options = currentPollData.options.map(o => ({...o}));
    data.openResponses = [];
  }

  // Si cambiamos voto, restamos del anterior
  if (previousOptionId) {
    const prevIndex = data.options.findIndex((o: PollOption) => o.id === previousOptionId);
    if (prevIndex >= 0 && data.options[prevIndex].votes > 0) {
      data.options[prevIndex].votes -= 1;
      data.totalVotes -= 1;
    }
  }

  // Sumamos al nuevo
  const newIndex = data.options.findIndex((o: PollOption) => o.id === newOptionId);
  if (newIndex >= 0) {
    data.options[newIndex].votes += 1;
    data.totalVotes += 1;
    
    // Guardar texto si es opción abierta
    if (data.options[newIndex].isOpenResponse && textResponse) {
       // REGEX
       const cleanText = textResponse.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').trim();
       if (cleanText) {
         if (!data.openResponses) data.openResponses = [];
         data.openResponses.push(cleanText);
       }
    }
  }
  
  localStorage.setItem(`poll_${pollId}`, JSON.stringify(data));
  return data;
};

export const getPollResults = (pollId: string): Poll => {
  const stored = localStorage.getItem(`poll_${pollId}`);
  return stored ? JSON.parse(stored) : currentPollData;
};