import cron from 'node-cron';
import { liberarEstoqueReservado } from './services/reserva-limpeza.service';

export const iniciarTarefasAgendadas = () => {
  // A cada 1 minuto
  cron.schedule('* * * * *', async () => {
    await liberarEstoqueReservado();
  });

  console.log("⏱️ Tarefa agendada: limpeza de reservas expiradas a cada 1 minuto.");
};
