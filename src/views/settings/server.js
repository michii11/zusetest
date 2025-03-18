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
app.post("/login-page", (req, res) => {
  const { username, password } = req.body;

  // Benutzer in der Datenbank suchen
  const query = "SELECT * FROM users WHERE USERNAME = ? AND PASSWORD = ?";
  
  con.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Fehler bei der Datenbankabfrage:", err);
      return res.status(500).send("Datenbankfehler");
    }

    if (results.length === 0) {
      return res.status(401).send("Falsche Anmeldedaten");
    }

    // Benutzer gefunden, JWT erstellen
    const user = results[0]; // Der erste Benutzer aus den Ergebnissen
    const token = jwt.sign(
      { id: user.USER_ID, username: user.USERNAME },  // Payload
      process.env.JWT_SECRET,  // Geheimnis aus der .env-Datei
      { expiresIn: "1h" } // Ablaufzeit des Tokens
    );

    // Token zurückgeben
    res.json({ token });
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
