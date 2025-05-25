import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Server } from 'socket.io';

// Laden der Umgebungsvariablen aus der .env-Datei
dotenv.config();


const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  const [ivHex, content] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}



const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:8100",
  credentials: true
}));


// MySQL-Verbindung (ändere die Konfiguration, falls notwendig)
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "zuseapp"
});

con.connect(function(err) {
  if (err) {
    console.error("Fehler beim Verbinden zur Datenbank:", err);
    return;
  }
  console.log("Erfolgreich mit der Datenbank verbunden");
});






//Abfrage für chats

app.get('/messages/:groupId', authenticateToken, (req, res) => {
  const groupId = req.params.groupId;
  const before = req.query.before;
  const limit = 20;

  let query = `
    SELECT c.sender_id, u.firstname, u.lastname, c.message, c.timestamp
    FROM chats c
    JOIN users u ON c.sender_id = u.ID
    WHERE c.group_id = ?
  `;
  const params = [groupId];

  if (before) {
    query += ' AND c.timestamp < ?';
    params.push(before);
  }

  query += ' ORDER BY c.timestamp DESC LIMIT ?';
  params.push(limit);

  con.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen der Nachrichten:', err);
      return res.status(500).send('Datenbankfehler');
    }

    // Die Namen müssen hier noch einzeln mitgegeben werden:
    const messages = results.reverse().map(row => ({
      senderId: row.sender_id,
      firstname: row.firstname,
      lastname: row.lastname,
      message: decrypt(row.message),
      timestamp: row.timestamp
    }));

    res.json({ messages });
  });
});




//ende abfrage für chats


app.post('/create-user', async (req, res) => {
  const { username, password, firstname, lastname, r_id } = req.body;

  if (!username || !password || !firstname || !lastname || !r_id) {
    return res.status(400).json({ success: false, message: "Fehlende Felder" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (username, password, firstname, lastname, r_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    con.query(insertQuery, [username, hashedPassword, firstname, lastname, r_id], function (err) {
      if (err) {
        console.error("Fehler beim Erstellen des Benutzers:", err);
        return res.status(500).json({ success: false, message: "Datenbankfehler" });
      }

      return res.json({ success: true, message: "Benutzer erfolgreich erstellt." });
    });
  } catch (err) {
    console.error("Fehler beim Hashen des Passworts:", err);
    return res.status(500).json({ success: false, message: "Serverfehler" });
  }
});




// Route für das Login und das Erstellen eines JWT
  // Benutzer in der Datenbank suchen
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Benutzer anhand des Benutzernamens finden
  const query = "SELECT ID, USERNAME, R_ID, password FROM users WHERE USERNAME = ?";

  con.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Fehler bei der Datenbankabfrage:", err);
      return res.status(500).send("Datenbankfehler");
    }

    if (results.length === 0) {
      return res.status(401).send("Falsche Anmeldedaten");
    }

    const user = results[0];

    // Passwort vergleichen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Falsche Anmeldedaten");
    }

    // JWT erstellen
    const token = jwt.sign(
      { id: user.ID, username: user.USERNAME, r_id: user.R_ID },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, r_id: user.R_ID });
  });
});






function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("📦 Eingehender Token:", token); // Debug-Ausgabe

  if (!token) {
    return res.status(403).send("Kein Token, Zugriff verweigert");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ JWT Fehler:", err.message);
      return res.status(403).send("Ungültiges Token");
    }
    req.user = user;
    next();
  });
}





// Beispiel für eine geschützte Route
app.get("/protected", authenticateToken, (req, res) => {
  res.send(`Hallo ${req.user.username}, du hast Zugriff auf diese Route!`);
});



// Route für das Abrufen der group_id des Benutzers
app.get('/get-group-id', authenticateToken, (req, res) => {
  const userId = req.user.id; // kommt aus dem JWT

  const query = "SELECT group_id FROM users WHERE ID = ?";
  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Fehler bei der Datenbankabfrage:", err);
      return res.status(500).send("Datenbankfehler");
    }

    if (results.length === 0) {
      return res.status(404).send("Benutzer nicht gefunden");
    }

    const groupId = results[0].group_id;

    if (!groupId) {
      return res.status(400).json({ message: "Keine group_id gefunden." });
    }

    res.json({ group_id: groupId });
  });
});



app.get('/get-chat-history', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Hole group_id für diesen Benutzer
  const groupQuery = 'SELECT group_id FROM users WHERE id = ?';
  con.query(groupQuery, [userId], (err, groupResult) => {
    if (err || groupResult.length === 0) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der Gruppe' });
    }

    const groupId = groupResult[0].group_id;

    // Hole Chatverlauf für diese Gruppe
    const chatQuery = `
      SELECT chats.message, chats.timestamp, users.firstname, users.lastname
      FROM chats
      JOIN users ON chats.sender_id = users.id
      WHERE chats.group_id = ?
      ORDER BY chats.timestamp ASC
    `;

    con.query(chatQuery, [groupId], (err, chatResult) => {
      if (err) {
        return res.status(500).json({ error: 'Fehler beim Abrufen der Chats' });
      }

      // Rückgabe der Nachrichten mit Namen
      const messages = chatResult.map(msg => ({
        sender: `${msg.firstname} ${msg.lastname}`,
        message: decrypt(msg.message),
        timestamp: msg.timestamp
      }));

      res.json({ messages });
    });
  });
});


app.post('/send-request', authenticateToken, (req, res) => {
  const senderId = req.user.id;
  const { receiver_id, message } = req.body;

  if (!receiver_id || !message) {
    return res.status(400).json({ success: false, message: 'Empfänger und Nachricht sind erforderlich.' });
  }

  // Erst: Hole die group_id des Empfängers (Fahrers)
  const getGroupQuery = 'SELECT group_id FROM users WHERE id = ?';

  con.query(getGroupQuery, [receiver_id], (err, results) => {
    if (err || results.length === 0) {
      console.error('❌ Fehler beim Abrufen der group_id:', err);
      return res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Gruppen-ID.' });
    }

    const group_id = results[0].group_id;

    if (!group_id) {
      return res.status(400).json({ success: false, message: 'Der Empfänger hat keine gültige Gruppe.' });
    }

    // Jetzt: Speichere die Anfrage
    const insertQuery = `
      INSERT INTO requests (sender_id, receiver_id, group_id, message)
      VALUES (?, ?, ?, ?)
    `;

    con.query(insertQuery, [senderId, receiver_id, group_id, message], (err2, result) => {
      if (err2) {
        console.error('❌ Fehler beim Einfügen der Anfrage:', err2);
        return res.status(500).json({ success: false, message: 'Fehler bei der Datenbankoperation.' });
      }

      res.status(201).json({
        success: true,
        message: 'Anfrage erfolgreich gesendet.',
        request_id: result.insertId
      });
    });
  });
});


app.get('/group-info', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT 
      u.id, u.firstname, u.lastname, u.mail, u.group_id,
      ccr.seats, ccr.location, ccr.postcode, ccr.f_id
    FROM users u
    LEFT JOIN carpoolingcarsregistered ccr ON u.id = ccr.user_id
    WHERE u.group_id = (SELECT group_id FROM users WHERE id = ?)
  `;

  con.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Fehler beim Laden der Gruppe.' });

    res.json({ success: true, data: results, currentUserId: userId });
  });
});



app.post('/leave-carpool', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Erst prüfen, ob der User selbst Fahrer (Besitzer der Gruppe) ist
  const checkDriverQuery = 'SELECT * FROM carpoolingcarsregistered WHERE user_id = ?';
  con.query(checkDriverQuery, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Fehler bei der Überprüfung.' });
    }

    if (result.length > 0) {
      return res.status(403).json({ success: false, message: 'Fahrer kann die Gruppe nicht verlassen.' });
    }

    // Wenn kein Fahrer, dann group_id auf NULL setzen
    const updateQuery = 'UPDATE users SET group_id = NULL WHERE id = ?';
    con.query(updateQuery, [userId], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ success: false, message: 'Fehler beim Verlassen.' });
      }
      res.json({ success: true });
    });
  });
});




app.post('/remove-from-group', authenticateToken, (req, res) => {
  const { userIdToRemove } = req.body;
  const currentUserId = req.user.id;

  if (!userIdToRemove) {
    return res.status(400).json({ success: false, message: 'User-ID fehlt' });
  }

  // Verhindern, dass man sich selbst entfernt (optional)
  if (userIdToRemove === currentUserId) {
    return res.status(400).json({ success: false, message: 'Du kannst dich nicht selbst entfernen' });
  }

  const query = 'UPDATE users SET group_id = NULL WHERE id = ?';
  con.query(query, [userIdToRemove], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Fehler beim Entfernen aus der Gruppe' });
    }
    res.json({ success: true });
  });
});


//TODO: message mit anzeigen bei anfragen
// APIs anbinden
// Bugfix menu für admins


app.get('/group-members', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // 1. group_id vom aktuellen User holen
  const getGroupIdQuery = 'SELECT group_id FROM users WHERE id = ?';
  con.query(getGroupIdQuery, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ success: false, message: 'User nicht gefunden' });
    }

    const groupId = results[0].group_id;

    // 2. alle User mit der gleichen group_id holen
    const getGroupMembersQuery = 'SELECT id, firstname, lastname, mail FROM users WHERE group_id = ?';
    con.query(getGroupMembersQuery, [groupId], (err2, members) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Gruppenmitglieder' });
      }

      res.json({ success: true, data: members });
    });
  });
});





app.get('/my-requests', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT r.request_id, r.message, u.firstname, u.lastname, u.id AS sender_id
    FROM requests r
    JOIN users u ON r.sender_id = u.id
    WHERE r.receiver_id = ?
  `;

  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen der Anfragen:', err);
      return res.status(500).json({ success: false, message: 'Fehler bei der Datenbankoperation.' });
    }

    res.status(200).json({ success: true, data: results });
  });
});



app.get('/check-group', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT group_id FROM users WHERE id = ?';
  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Fehler beim Überprüfen der Gruppenzugehörigkeit:', err);
      return res.status(500).json({ success: false, message: 'Serverfehler.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
    }

    const isInGroup = results[0].group_id !== null;
    res.json({ success: true, inGroup: isInGroup });
  });
});


app.post('/handle-request', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { request_id, sender_id, action } = req.body;

  if (!request_id || !sender_id || !action) {
    return res.status(400).json({ success: false, message: 'Ungültige Daten.' });
  }

  if (action === 'accept') {
    const getGroupQuery = 'SELECT group_id FROM users WHERE id = ?';
    con.query(getGroupQuery, [userId], (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ success: false });

      const groupId = results[0].group_id;
      const updateUserQuery = 'UPDATE users SET group_id = ? WHERE id = ?';
      con.query(updateUserQuery, [groupId, sender_id], (err2) => {
        if (err2) return res.status(500).json({ success: false });

        // ALLE Anfragen dieses Mitfahrers löschen
        const deleteAllRequestsQuery = 'DELETE FROM requests WHERE sender_id = ?';
        con.query(deleteAllRequestsQuery, [sender_id], (err3) => {
          if (err3) return res.status(500).json({ success: false });

          res.json({ success: true });
        });
      });
    });
  } else if (action === 'decline') {
    const deleteQuery = 'DELETE FROM requests WHERE request_id = ?';
    con.query(deleteQuery, [request_id], (err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    });
  }
});







app.post('/update-visibility', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { visible } = req.body;

  if (typeof visible !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Ungültiger Wert für Sichtbarkeit.' });
  }

  const updateQuery = 'UPDATE carpoolingcarsregistered SET joinable = ? WHERE user_id = ?';
  con.query(updateQuery, [visible ? 1 : 0, userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Fehler beim Speichern.' });
    }
    res.json({ success: true });
  });
});




app.get('/get-car-data', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT f_id, seats, postcode, location 
    FROM carpoolingcarsregistered 
    WHERE user_id = ?
  `;
  con.query(query, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ success: false, message: 'Fehler oder keine Fahrzeugdaten gefunden.' });
    }
    res.json({ success: true, data: results[0] });
  });
});



app.post('/update-car-data', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { f_id, seats, postcode, location } = req.body;

  const query = `
    UPDATE carpoolingcarsregistered 
    SET f_id = ?, seats = ?, postcode = ?, location = ?
    WHERE user_id = ?
  `;
  con.query(query, [f_id, seats, postcode, location, userId], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren.' });
    }
    res.json({ success: true });
  });
});




app.get('/get-visibility', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT joinable FROM carpoolingcarsregistered WHERE user_id = ?';
  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Fehler beim Abrufen.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Nutzer nicht gefunden.' });
    }

    res.json({ success: true, visible: results[0].joinable === 1 });
  });
});







app.get('/is-driver', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT driver_agreed_terms FROM users WHERE id = ?';
  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen des Fahrerstatus:', err);
      return res.status(500).json({ success: false, message: 'Fehler beim Abrufen.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Nutzer nicht gefunden.' });
    }

    const isDriver = results[0].driver_agreed_terms === 1;
    res.json({ success: true, isDriver });
  });
});



app.post('/delete-group', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // 1. Aktuelle group_id vom Nutzer holen
  const groupQuery = 'SELECT group_id FROM users WHERE id = ?';

  con.query(groupQuery, [userId], (err, groupResult) => {
    if (err || groupResult.length === 0 || !groupResult[0].group_id) {
      return res.status(400).json({ success: false, message: 'Gruppe nicht gefunden.' });
    }

    const groupId = groupResult[0].group_id;

    // 2. Nutzer aus der Gruppe entfernen & Fahrer zurücksetzen
    const resetUsersQuery = `
      UPDATE users 
      SET group_id = NULL, 
          driver_agreed_terms = CASE WHEN id = ? THEN 0 ELSE driver_agreed_terms END
      WHERE group_id = ?
    `;

    con.query(resetUsersQuery, [userId, groupId], (err1) => {
      if (err1) {
        console.error('❌ Fehler beim Entfernen der Nutzer aus der Gruppe:', err1);
        return res.status(500).json({ success: false, message: 'Fehler beim Entfernen der Nutzer.' });
      }

      // 3. Auto löschen
      const deleteCarQuery = `DELETE FROM carpoolingcarsregistered WHERE user_id = ?`;

      con.query(deleteCarQuery, [userId], (err2) => {
        if (err2) {
          console.error('❌ Fehler beim Löschen des Autos:', err2);
          return res.status(500).json({ success: false, message: 'Fehler beim Löschen des Autos.' });
        }

        // 4. Zugehörige Chats löschen
        const deleteChatsQuery = `DELETE FROM chats WHERE group_id = ?`;

        con.query(deleteChatsQuery, [groupId], (err3) => {
          if (err3) {
            console.error('❌ Fehler beim Löschen der Chats:', err3);
            return res.status(500).json({ success: false, message: 'Fehler beim Löschen der Chats.' });
          }

          // 5. Gruppe löschen
          const deleteGroupQuery = `DELETE FROM groups WHERE group_id = ?`;

          con.query(deleteGroupQuery, [groupId], (err4) => {
            if (err4) {
              console.error('❌ Fehler beim Löschen der Gruppe:', err4);
              return res.status(500).json({ success: false, message: 'Fehler beim Löschen der Gruppe.' });
            }

            res.json({ success: true, message: 'Gruppe, Chats und Auto erfolgreich gelöscht.' });
          });
        });
      });
    });
  });
});








app.post('/register-car', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { f_id, seats, postcode, location } = req.body;

  if (!f_id || !seats || !postcode || !location) {
    return res.status(400).json({ success: false, message: "Alle Felder sind erforderlich." });
  }

  // 1. Neue Gruppe erstellen mit Owner-ID
  const createGroupQuery = `INSERT INTO groups VALUES (null, ? , null, null)`;

  con.query(createGroupQuery, [userId], (err, groupResult) => {
    if (err) {
      console.error('❌ Fehler beim Erstellen der Gruppe:', err);
      return res.status(500).json({ success: false, message: 'Gruppe konnte nicht erstellt werden.' });
    }

    const newGroupId = groupResult.insertId;

    // 2. Fahrzeug registrieren
    const insertCarQuery = `
      INSERT INTO carpoolingcarsregistered (ccr_id, user_id, f_id, seats, location, postcode, created_at)
      VALUES (NULL, ?, ?, ?, ?, ?, NULL)
    `;

    con.query(insertCarQuery, [userId, f_id, seats, location, postcode], (err2, result) => {
      if (err2) {
        console.error('❌ Fehler beim Einfügen des Fahrzeugs:', err2);
        return res.status(500).json({ success: false, message: 'Fahrzeug konnte nicht registriert werden.' });
      }

      // 3. Nutzer aktualisieren
      const updateUserQuery = `
        UPDATE users
        SET driver_agreed_terms = 1, group_id = ?
        WHERE id = ?
      `;

      con.query(updateUserQuery, [newGroupId, userId], (err3) => {
        if (err3) {
          console.error('❌ Fehler beim Aktualisieren des Users:', err3);
          return res.status(500).json({ success: false, message: 'User konnte nicht aktualisiert werden.' });
        }

        res.status(201).json({
          success: true,
          message: 'Fahrzeug und Gruppe erfolgreich registriert.',
          groupId: newGroupId,
          insertId: result.insertId
        });
      });
    });
  });
});






app.get('/search-carpools', (req, res) => {
  con.query('SELECT * FROM carpoolingcarsregistered', (err, results) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen der Daten:', err);
      return res.status(500).json({ message: 'Fehler beim Abrufen der Daten' });
    }
    res.json({ success: true, data: results });
  });
});








app.post('/agree-passenger-terms', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'UPDATE users SET passenger_agreed_terms = 1 WHERE id = ?';

  con.query(query, [userId], (err, result) => { // <-- result statt results
    if (err) {
      console.error('❌ Fehler beim Aktualisieren von passenger_agreed_terms:', err);
      return res.status(500).json({ message: 'Datenbankfehler' });
    }

    // Optional: prüfen, ob ein Benutzer aktualisiert wurde
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.json({ message: '✅ passenger_agreed_terms erfolgreich aktualisiert.' });
  });
});


app.get('/check-agreed-terms', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT driver_agreed_terms FROM users WHERE id = ?';
  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ DB-Fehler:', err);
      return res.status(500).json({ message: 'Interner Serverfehler' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.json({ driver_agreed_terms: results[0].driver_agreed_terms });
  });
});







app.get('/get-passenger-terms', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT passenger_agreed_terms FROM users WHERE id = ?';

  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen:', err);
      return res.status(500).json({ message: 'Fehler beim Abrufen' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.json({ passenger_agreed_terms: results[0].passenger_agreed_terms });
  });
});







//admin menu rolle updaten
app.post('/update-role', authenticateToken, (req, res) => {
  const { username, new_r_id } = req.body;

  console.log("📥 Anfrage zum Rollenwechsel erhalten:", username, new_r_id);

  // Eingabe prüfen
  if (!username || !new_r_id) {
    return res.status(400).json({ success: false, message: 'Benutzername und neue Rolle sind erforderlich.' });
  }

  // SQL-Query zum Aktualisieren der Rolle
  const query = 'UPDATE users SET r_id = ? WHERE username = ?';

  con.query(query, [new_r_id, username], (err, results) => {
    if (err) {
      console.error("❌ Fehler beim Update der Rolle:", err);
      return res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren der Rolle.' });
    }

    // Überprüfen, ob Zeilen betroffen sind
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
    }

    console.log(`✅ Rolle für Benutzer "${username}" erfolgreich aktualisiert auf r_id = ${new_r_id}`);
    res.json({ success: true, message: 'Rolle erfolgreich geändert.' });
  });
});













const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Wenn der Server gestartet wird
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server läuft auf http://0.0.0.0:${port}`);
});





io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Token aus auth holen

  if (!token) {
    return next(new Error("Kein Token, Verbindung abgelehnt"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ JWT Fehler:", err.message);
      return next(new Error("Ungültiger Token"));
    }

    socket.user = user; // Token-Daten speichern
    next();
  });
});


// Socket.IO-Verbindung und Events
io.on('connection', (socket) => {
  console.log('🔌 Neuer Client verbunden:', socket.id);

  





// Hole die group_id aus der DB, basierend auf dem `user_id`

socket.on('joinGroup', () => {
    const userId = socket.user.id;

    const query = 'SELECT group_id FROM users WHERE ID = ?';
    con.query(query, [userId], (err, results) => {
      if (err) {
        console.error('❌ Fehler beim Abrufen der group_id:', err);
        return;
      }

      if (results.length === 0) {
        console.log('⚠️ Kein User mit dieser ID gefunden.');
        return;
      }

      const groupId = results[0].group_id;

      socket.join(`group_${groupId}`);
      console.log(`👥 Socket ${socket.id} ist Gruppe ${groupId} beigetreten`);
    });
});





  // Nachricht senden
socket.on('sendMessage', (data) => {
  const { groupId, senderId, message } = data;

  // Hole Vor- und Nachnamen des Senders
  const nameQuery = 'SELECT firstname, lastname FROM users WHERE id = ?';
  con.query(nameQuery, [senderId], (err, result) => {
    if (err) {
      console.error('❌ Fehler beim Abrufen des Namens:', err);
      return;
    }

    if (result.length === 0) {
      console.warn('⚠️ Kein Benutzer gefunden mit dieser ID:', senderId);
      return;
    }

    const fullName = `${result[0].firstname} ${result[0].lastname}`;

    // Nachricht an Gruppe senden
    io.to(`group_${groupId}`).emit('receiveMessage', {
      senderId,
      senderName: fullName,
      message,
      timestamp: Date.now()
    });

    // Optional: Nachricht in DB speichern
    const encryptedMessage = encrypt(message);

    const insertQuery = 'INSERT INTO chats (group_id, sender_id, message, timestamp) VALUES (?, ?, ?, ?)';
    con.query(insertQuery, [groupId, senderId, encryptedMessage, new Date()], (err) => {
      if (err) {
        console.error('❌ Fehler beim Speichern der Nachricht:', err);
      }
    });
  });
});


  // Client trennt sich
  socket.on('disconnect', () => {
    console.log('❎ Client getrennt:', socket.id);
  });
});
