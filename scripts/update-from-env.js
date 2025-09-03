const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis do .env.local
dotenv.config({ path: '.env.local' });

async function updateFromEnv() {
  console.log('🔄 Atualizando dados do .env.local...\n');

  const db = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database,
  });

  try {
    // Pegar valores do .env.local
    const newBalance = parseFloat(process.env.INITIAL_BALANCE || '0');
    const newCreditLimit = parseFloat(process.env.CREDIT_LIMIT || '5000');
    const newDueDay = parseInt(process.env.CREDIT_DUE_DAY || '15');

    // Mostrar valores atuais
    const currentAccount = await db.get(
      'SELECT * FROM accounts WHERE user_id = 1'
    );

    if (!currentAccount) {
      console.log('❌ Conta não encontrada. Execute npm run dev primeiro.');
      return;
    }

    console.log('📊 Valores ATUAIS:');
    console.log(`   Saldo: €${currentAccount.balance}`);
    console.log(`   Limite: €${currentAccount.credit_limit}`);
    console.log(`   Dia vencimento: ${currentAccount.credit_due_day}`);
    console.log('');

    console.log('📝 Valores NOVOS do .env.local:');
    console.log(`   Saldo: €${newBalance}`);
    console.log(`   Limite: €${newCreditLimit}`);
    console.log(`   Dia vencimento: ${newDueDay}`);
    console.log('');

    // Perguntar se quer continuar
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question('Deseja atualizar? (s/n): ', async answer => {
      if (answer.toLowerCase() === 's') {
        // Atualizar apenas saldo e configurações do cartão
        await db.run(
          `UPDATE accounts 
           SET balance = ?,
               credit_limit = ?,
               credit_due_day = ?
           WHERE user_id = 1`,
          [newBalance, newCreditLimit, newDueDay]
        );

        console.log('\n✅ Dados atualizados com sucesso!');
        console.log('🚀 Reinicie o servidor: npm run dev');
      } else {
        console.log('\n❌ Atualização cancelada.');
      }

      readline.close();
      await db.close();
    });
  } catch (error) {
    console.error('❌ Erro:', error);
    await db.close();
  }
}

// Executar
updateFromEnv().catch(console.error);
