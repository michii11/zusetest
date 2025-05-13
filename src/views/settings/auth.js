export async function login(username, password) {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fehler beim Login:", errorText);
      throw new Error(errorText || "Falsche Anmeldedaten oder Serverfehler");
    }

    const data = await response.json();

    // Überprüfen, ob Token und r_id existieren
    if (data.token && data.r_id !== undefined) {
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("r_id", JSON.stringify(data.r_id)); // Speichere r_id sicher als String

      return { success: true, message: "Login erfolgreich!" };
    } else {
      return { success: false, message: "Fehlende Daten im Server-Response" };
    }
  } catch (error) {
    console.error("Fehler beim Login:", error.message);
    return { success: false, message: error.message };
  }
}
