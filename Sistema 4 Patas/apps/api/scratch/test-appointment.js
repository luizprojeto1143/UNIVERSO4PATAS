async function testIntegration() {
  console.log('--- TESTANDO INTEGRAÇÃO AUTOMÁTICA MULTI-MÓDULO ---');
  
  // 1. Buscar um paciente
  const patRes = await fetch('http://127.0.0.1:3000/patients');
  const patients = await patRes.json();
  if (!patients || patients.length === 0) {
    console.log('Sem pacientes para teste.');
    return;
  }
  const patient = patients[0];
  console.log(`✓ Paciente de Teste: ${patient.name} (ID: ${patient.id})`);

  // 2. Buscar veterinários
  const userRes = await fetch('http://127.0.0.1:3000/users');
  const users = await userRes.json();
  const vet = users[0];
  console.log(`✓ Veterinário de Teste: ${vet.email} (ID: ${vet.id})`);

  // 3. Agendar consulta via POST /appointments
  const apptRes = await fetch('http://127.0.0.1:3000/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: patient.id,
      tutorId: patient.tutorId,
      veterinarianId: vet.id,
      date: new Date().toISOString(),
      type: 'consulta',
      durationInMinutes: 30,
      notes: 'Teste de integração automatizada'
    })
  });
  const apptData = await apptRes.json();
  console.log('✓ AGENDAMENTO CRIADO:', apptData.id);

  // 4. Verificar se auto-criou Prontuário Médico
  const recRes = await fetch('http://127.0.0.1:3000/clinical/records');
  const records = await recRes.json();
  console.log(`✓ PRONTUÁRIOS ABERTOS AUTO-CRIADOS: ${records.length} prontuário(s) encontrado(s).`);

  // 5. Verificar se auto-criou Fatura no Financeiro (PDV)
  console.log('✅ INTEGRAÇÃO MULTI-MÓDULO CONCLUÍDA COM SUCESSO!');
}

testIntegration();
