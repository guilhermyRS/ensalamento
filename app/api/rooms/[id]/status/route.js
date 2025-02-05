import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: 'rooms.db',
    driver: sqlite3.Database
  });
}

// Usando o método recomendado do Next.js 14
export async function PATCH(
  request,
  context
) {
  let db;
  try {
    // Primeiro, aguardar a resolução dos parâmetros
    await Promise.resolve();
    const roomId = context.params?.id;
    const requestData = await request.json();
    const { status } = requestData;

    // Validações
    if (!roomId) {
      return NextResponse.json({ error: 'ID da sala não fornecido' }, { status: 400 });
    }

    if (!['open', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    // Conectar ao banco de dados
    db = await getDb();

    // Verificar se a sala existe
    const roomExists = await db.get('SELECT id FROM rooms WHERE id = ?', [roomId]);
    if (!roomExists) {
      return NextResponse.json({ error: 'Sala não encontrada' }, { status: 404 });
    }

    // Atualizar o status
    await db.run(
      'UPDATE rooms SET status = ? WHERE id = ?', 
      [status, roomId]
    );

    // Buscar a sala atualizada
    const updatedRoom = await db.get(`
      SELECT 
        r.id,
        rn.name as name,
        r.days,
        r.shift,
        r.status,
        r.room_name_id
      FROM rooms r
      JOIN room_names rn ON r.room_name_id = rn.id
      WHERE r.id = ?
    `, [roomId]);

    return NextResponse.json(updatedRoom);

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json(
      { error: 'Erro interno ao atualizar status' },
      { status: 500 }
    );

  } finally {
    if (db) {
      try {
        await db.close();
      } catch (error) {
        console.error('Erro ao fechar conexão:', error);
      }
    }
  }
}