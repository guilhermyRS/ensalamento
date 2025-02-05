import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: 'rooms.db',
    driver: sqlite3.Database
  });
}

// Função GET existente (se houver)
export async function GET(request, { params }) {
  let db;
  try {
    db = await getDb();
    const room = await db.get(`
      SELECT 
        r.id,
        rn.name,
        r.days,
        r.shift,
        r.status,
        r.room_name_id
      FROM rooms r
      JOIN room_names rn ON r.room_name_id = rn.id
      WHERE r.id = ?
    `, [params.id]);

    if (!room) {
      return NextResponse.json({ error: 'Sala não encontrada' }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Erro ao buscar sala:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar sala' },
      { status: 500 }
    );
  } finally {
    if (db) await db.close();
  }
}

// Adicionando o método PUT para atualização
export async function PUT(request, { params }) {
  let db;
  try {
    await Promise.resolve(); // Para resolver o aviso de params assíncrono
    const roomId = params.id;
    const updateData = await request.json();

    // Validações básicas
    if (!updateData) {
      return NextResponse.json(
        { error: 'Dados não fornecidos' },
        { status: 400 }
      );
    }

    db = await getDb();

    // Verificar se a sala existe
    const existingRoom = await db.get('SELECT id FROM rooms WHERE id = ?', [roomId]);
    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }

    // Prepara a query de atualização dinamicamente
    const validFields = ['room_name_id', 'days', 'shift', 'status'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (validFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo válido para atualização' },
        { status: 400 }
      );
    }

    // Adiciona o ID ao final dos valores
    values.push(roomId);

    // Executa a atualização
    await db.run(`
      UPDATE rooms 
      SET ${updates.join(', ')}
      WHERE id = ?
    `, values);

    // Busca a sala atualizada
    const updatedRoom = await db.get(`
      SELECT 
        r.id,
        rn.name,
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
    console.error('Erro ao atualizar sala:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar sala' },
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

// Opcional: Adicionar método DELETE se necessário
export async function DELETE(request, { params }) {
  let db;
  try {
    await Promise.resolve();
    const roomId = params.id;

    db = await getDb();

    // Verificar se a sala existe
    const existingRoom = await db.get('SELECT id FROM rooms WHERE id = ?', [roomId]);
    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }

    // Excluir a sala
    await db.run('DELETE FROM rooms WHERE id = ?', [roomId]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao excluir sala:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir sala' },
      { status: 500 }
    );
  } finally {
    if (db) await db.close();
  }
}