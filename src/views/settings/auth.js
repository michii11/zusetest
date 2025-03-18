// auth.js
export async function login(username, password) {
  try {
    // Sende POST-Anfrage mit den Anmeldedaten an den Server
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Wenn die Antwort nicht OK ist, dann fehlerhaften Server-Status ausgeben
    if (!response.ok) {
      const errorText = await response.text(); // Text statt JSON lesen
      console.error("Fehler beim Login:", errorText);  // Fehler aus dem Response
      throw new Error(errorText || "Falsche Anmeldedaten oder Serverfehler");
    }

    const data = await response.json();

    // Überprüfen, ob das Token zurückgegeben wurde
    if (data.token) {
      // Speichere das JWT im Local Storage
      localStorage.setItem("jwt", data.token);
      return { success: true, message: "Login erfolgreich!" };
    } else {
      return { success: false, message: "Fehler beim Abrufen des Tokens" };
    }
  } catch (error) {
    console.error("Fehler beim Login:", error.message);  // Fehler im Catch-Block
    return { success: false, message: error.message };
  }
}
