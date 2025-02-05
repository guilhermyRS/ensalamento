import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: 'rooms.db',
    driver: sqlite3.Database
  });
}

// app/api/rooms/[id]/route.js
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
        r.room_name_id,
        r.unidade,
        r.curso,
        r.periodo,
        r.disciplina,
        r.docente
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

export async function PUT(request, { params }) {
  let db;
  try {
    const roomId = params.id;
    const updateData = await request.json();

    db = await getDb();

    // Verificar se a sala existe
    const existingRoom = await db.get('SELECT id FROM rooms WHERE id = ?', [roomId]);
    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar sala com todos os campos
    await db.run(`
      UPDATE rooms SET 
        room_name_id = ?, 
        days = ?, 
        shift = ?,
        unidade = ?,
        curso = ?,
        periodo = ?,
        disciplina = ?,
        docente = ?
      WHERE id = ?
    `, [
      parseInt(updateData.room_name_id),
      updateData.days,
      updateData.shift,
      updateData.unidade,
      updateData.curso,
      updateData.periodo,
      updateData.disciplina,
      updateData.docente,
      roomId
    ]);

    // Buscar a sala atualizada com todos os campos
    const updatedRoom = await db.get(`
      SELECT 
        r.id,
        rn.name,
        r.days,
        r.shift,
        r.status,
        r.room_name_id,
        r.unidade,
        r.curso,
        r.periodo,
        r.disciplina,
        r.docente
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
    if (db) await db.close();
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