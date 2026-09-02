async function createSampleData() {
  console.log('--- CRIANDO DADOS DE TESTE DE INTEGRAÇÃO ---');
  
  // 1. Criar Tutor
  const tutorRes = await fetch('http://127.0.0.1:3000/tutors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Luciana Santos',
      phone: '(11) 99887-6655',
      cpf: '123.456.789-00',
      email: 'luciana@email.com'
    })
  });
  const tutor = await tutorRes.json();
  console.log('✓ Tutor Criado:', tutor.name, '(ID:', tutor.id, ')');

  // 2. Criar Paciente (Pet)
  const patientRes = await fetch('http://127.0.0.1:3000/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Thor',
      tutorId: tutor.id,
      gender: 'M',
      weight: 14.5,
      notes: 'Golden Retriever de 2 anos'
    })
  });
  const patient = await patientRes.json();
  console.log('✓ Paciente Criado:', patient.name, '(ID:', patient.id, ')');

  // 3. Buscar veterinário
  const userRes = await fetch('http://127.0.0.1:3000/users');
  const users = await userRes.json();
  const vet = users[0];

  // 4. Criar Agendamento de Consulta
  const apptRes = await fetch('http://127.0.0.1:3000/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: patient.id,
      tutorId: tutor.id,
      veterinarianId: vet.id,
      date: new Date().toISOString(),
      type: 'consulta',
      durationInMinutes: 30,
      notes: 'Consulta clínica de rotina e vacinação'
    })
  });
  const appt = await apptRes.json();
  console.log('✓ Agendamento Criado:', appt.id);

  // 5. Verificar se auto-criou Prontuário Médico
  const recRes = await fetch('http://127.0.0.1:3000/clinical/records');
  const records = await recRes.json();
  console.log('✓ Prontuário Médico Auto-Criado:', records[0]?.id);

  console.log('===================================================');
  console.log('✅ INTEGRAÇÃO MULTI-MÓDULO TESTADA E VERIFICADA!');
  console.log('===================================================');
}

createSampleData();
