async function test() {
  const res = await fetch('http://127.0.0.1:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'veterinario@4patas.com.br', password: '123456' }),
  });
  const data = await res.json();
  console.log('STATUS:', res.status);
  console.log('RESULT:', data);
}
test();
