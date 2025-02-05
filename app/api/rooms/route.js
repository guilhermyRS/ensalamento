import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Função para obter conexão com o banco de dados
async function getDb() {
  return open({
    filename: 'rooms.db',
    driver: sqlite3.Database
  });
}

// Inicializar o banco de dados
async function initializeDb() {
  const db = await getDb();
  
  // Criar tabela de nomes de salas
  await db.run(`
    CREATE TABLE IF NOT EXISTS room_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);
  
  // Criar tabela de salas com o campo status
  await db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_name_id INTEGER NOT NULL,
      days TEXT NOT NULL,
      shift TEXT NOT NULL,
      status TEXT DEFAULT 'closed' NOT NULL,
      FOREIGN KEY (room_name_id) REFERENCES room_names(id)
    )
  `);

  await db.close();
}

// Inicializa o banco de dados
initializeDb().catch(console.error);

// GET /api/rooms
export async function GET(request) {
  const { pathname } = new URL(request.url);
  console.log('GET Request Path:', pathname);
  
  try {
    const db = await getDb();
    
    // Rota para buscar nomes de salas
    if (pathname.includes('room-names')) {
      const roomNames = await db.all('SELECT * FROM room_names ORDER BY name');
      await db.close();
      console.log('Room Names Retrieved:', roomNames);
      return NextResponse.json(roomNames);
    }
    
    // Rota para buscar salas (incluindo status)
    const rooms = await db.all(`
      SELECT 
        r.id,
        rn.name,
        r.days,
        r.shift,
        r.status,
        r.room_name_id
      FROM rooms r
      JOIN room_names rn ON r.room_name_id = rn.id
      ORDER BY rn.name, r.days, r.shift
    `);
    await db.close();
    console.log('Rooms Retrieved:', rooms);
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados: ' + error.message },
      { status: 500 }
    );
  }
}

// POST /api/rooms
export async function POST(request) {
  const { pathname } = new URL(request.url);
  console.log('POST Request Path:', pathname);
  
  try {
    const data = await request.json();
    console.log('POST Received Data:', data);

    const db = await getDb();
    
    // Rota para criar nome de sala
    if (pathname.includes('room-names')) {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        return NextResponse.json(
          { error: 'Nome da sala é obrigatório' },
          { status: 400 }
        );
      }

      try {
        const result = await db.run(
          'INSERT INTO room_names (name) VALUES (?)',
          [data.name.trim()]
        );
        
        const newRoomName = {
          id: result.lastID,
          name: data.name.trim()
        };
        
        await db.close();
        console.log('Created Room Name:', newRoomName);
        return NextResponse.json(newRoomName, { status: 201 });
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          return NextResponse.json(
            { error: 'Nome de sala já existe' },
            { status: 400 }
          );
        }
        throw error;
      }
    }
    
    // Validação dos dados para criar sala
    if (!data.room_name_id || !data.days || !data.shift) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se room_name_id existe
    const roomName = await db.get('SELECT id FROM room_names WHERE id = ?', [data.room_name_id]);
    if (!roomName) {
      return NextResponse.json(
        { error: 'Nome de sala não encontrado' },
        { status: 404 }
      );
    }
    
    // Rota para criar sala (incluindo status inicial)
    const result = await db.run(
      'INSERT INTO rooms (room_name_id, days, shift, status) VALUES (?, ?, ?, ?)',
      [parseInt(data.room_name_id), data.days, data.shift, 'closed']
    );
    
    const newRoom = await db.get(`
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
    `, [result.lastID]);
    
    await db.close();
    console.log('Created Room:', newRoom);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'Erro ao criar dados: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT /api/rooms/[id]
export async function PUT(request) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop();
    const data = await request.json();
    console.log('PUT Request for ID:', id, 'Data:', data);
    
    if (!data.room_name_id || !data.days || !data.shift) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Verificar se a sala existe
    const existingRoom = await db.get('SELECT id FROM rooms WHERE id = ?', [id]);
    if (!existingRoom) {
      await db.close();
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }
    
    // Atualizar sala (mantendo o status atual)
    await db.run(
      'UPDATE rooms SET room_name_id = ?, days = ?, shift = ? WHERE id = ?',
      [parseInt(data.room_name_id), data.days, data.shift, id]
    );
    
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
    `, [id]);
    
    await db.close();
    console.log('Updated Room:', updatedRoom);
    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error in PUT:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar sala: ' + error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/rooms/[id]/status
export async function PATCH(request) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop();
    const data = await request.json();
    
    if (!data.status || !['open', 'closed'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    await db.run(
      'UPDATE rooms SET status = ? WHERE id = ?',
      [data.status, id]
    );

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
    `, [id]);

    await db.close();
    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error in PATCH:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/[id]
export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.split('/').pop();
    console.log('DELETE Request for ID:', id);
    
    const db = await getDb();

    // Verificar se a sala existe
    const existingRoom = await db.get('SELECT id FROM rooms WHERE id = ?', [id]);
    if (!existingRoom) {
      await db.close();
      return NextResponse.json(
        { error: 'Sala não encontrada' },
        { status: 404 }
      );
    }

    await db.run('DELETE FROM rooms WHERE id = ?', [id]);
    await db.close();
    
    console.log('Room Deleted:', id);
    return NextResponse.json({ message: 'Sala excluída com sucesso' });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir sala: ' + error.message },
      { status: 500 }
    );
  }
}