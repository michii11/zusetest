import express from 'express';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

// Laden der Umgebungsvariablen aus der .env-Datei
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // CORS erlauben, falls du mit einer anderen Domain kommunizierst

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

// Route für das Login und das Erstellen eines JWT
  // Benutzer in der Datenbank suchen
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Benutzer in der Datenbank suchen und r_id abrufen
  const query = "SELECT ID, USERNAME, R_ID, password FROM users WHERE USERNAME = ? AND PASSWORD = ?";

  con.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Fehler bei der Datenbankabfrage:", err);
      return res.status(500).send("Datenbankfehler");
    }

    if (results.length === 0) {
      return res.status(401).send("Falsche Anmeldedaten");
    }

    // Benutzer gefunden
    const user = results[0];

    // JWT mit r_id erstellen
    const token = jwt.sign(
      { id: user.USER_ID, username: user.USERNAME, r_id: user.R_ID },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Token und r_id zurückgeben
    res.json({ token, r_id: user.R_ID });
  });
});






// Authentifizierungs-Middleware für geschützte Routen
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(403).send("Kein Token, Zugriff verweigert");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Ungültiges Token");
    }
    req.user = user;  // Benutzerinformationen für spätere Verwendung
    next();  // Weitermachen mit der Anfrage
  });
}

// Beispiel für eine geschützte Route
app.get("/protected", authenticateToken, (req, res) => {
  res.send(`Hallo ${req.user.username}, du hast Zugriff auf diese Route!`);
});

// Server starten
app.listen(port, '0.0.0.0', () => {
  console.log(`Server läuft auf http://0.0.0.0:${port}`);
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
