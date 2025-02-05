const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('./rooms.db');

const db = new sqlite3.Database(dbPath);

// Criar tabelas
// In your database initialization file
db.serialize(() => {
  // Tabela de nomes de salas
  db.run(`
    CREATE TABLE IF NOT EXISTS room_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Tabela de salas com os novos campos
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_name_id INTEGER NOT NULL,
      days TEXT NOT NULL,
      shift TEXT NOT NULL,
      status TEXT DEFAULT 'closed' NOT NULL,
      unidade TEXT,
      curso TEXT,
      periodo TEXT,
      disciplina TEXT,
      docente TEXT,
      FOREIGN KEY (room_name_id) REFERENCES room_names(id)
    )
  `);
    
  
});

// Funções auxiliares para o banco de dados
const dbOperations = {
  // Operações de Nomes de Salas
  getAllRoomNames: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM room_names ORDER BY name", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  createRoomName: (name) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO room_names (name) VALUES (?)",
        [name],
        function(err) {
          if (err) {
            // Verificar se o erro é de duplicação
            if (err.code === 'SQLITE_CONSTRAINT') {
              reject(new Error('Nome de sala já existe'));
            } else {
              reject(err);
            }
            return;
          }
          resolve({ id: this.lastID, name });
        }
      );
    });
  },

  // Operações de Salas
  getAllRooms: () => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          r.id,
          rn.name,
          r.days,
          r.shift,
          r.room_name_id
        FROM rooms r
        JOIN room_names rn ON r.room_name_id = rn.id
        ORDER BY rn.name, r.days, r.shift
      `, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  createRoom: (room) => {
    return new Promise((resolve, reject) => {
      const { room_name_id, days, shift } = room;
      db.run(
        "INSERT INTO rooms (room_name_id, days, shift) VALUES (?, ?, ?)",
        [room_name_id, days, shift],
        function(err) {
          if (err) reject(err);
          // Buscar a sala criada com o nome incluído
          db.get(`
            SELECT 
              r.id,
              rn.name,
              r.days,
              r.shift,
              r.room_name_id
            FROM rooms r
            JOIN room_names rn ON r.room_name_id = rn.id
            WHERE r.id = ?
          `, [this.lastID], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
        }
      );
    });
  },

  updateRoom: (id, room) => {
    return new Promise((resolve, reject) => {
      const { room_name_id, days, shift } = room;
      db.run(
        "UPDATE rooms SET room_name_id = ?, days = ?, shift = ? WHERE id = ?",
        [room_name_id, days, shift, id],
        (err) => {
          if (err) reject(err);
          // Buscar a sala atualizada com o nome incluído
          db.get(`
            SELECT 
              r.id,
              rn.name,
              r.days,
              r.shift,
              r.room_name_id
            FROM rooms r
            JOIN room_names rn ON r.room_name_id = rn.id
            WHERE r.id = ?
          `, [id], (err, row) => {
            if (err) reject(err);
            resolve(row);
          });
        }
      );
    });
  },

  deleteRoom: (id) => {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM rooms WHERE id = ?", [id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },

  // Função para verificar se um nome de sala existe
  getRoomNameById: (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM room_names WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  },

  // Função para verificar se uma sala está em uso
  getRoomsByRoomNameId: (roomNameId) => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM rooms WHERE room_name_id = ?", [roomNameId], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = dbOperations;