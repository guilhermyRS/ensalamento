import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: 'rooms.db',
    driver: sqlite3.Database
  });
}

export async function GET() {
  try {
    const db = await getDb();
    const roomNames = await db.all('SELECT * FROM room_names ORDER BY name');
    await db.close();
    return NextResponse.json(roomNames);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar nomes das salas' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    const db = await getDb();
    
    try {
      const result = await db.run(
        'INSERT INTO room_names (name) VALUES (?)',
        [name]
      );
      
      const newRoomName = {
        id: result.lastID,
        name
      };
      
      await db.close();
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
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar nome da sala' },
      { status: 500 }
    );
  }
}