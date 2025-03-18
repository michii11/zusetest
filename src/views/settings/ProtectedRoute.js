// ProtectedRoute.js
export async function checkAuth() {
    const token = localStorage.getItem("jwt");
  
    if (!token) {
      // Falls kein Token vorhanden, leitet zu Login weiter
      window.location.href = "/login";
      return false;
    }
  
    try {
      // Sende eine Anfrage an den Server, um das Token zu verifizieren
      const response = await fetch("http://localhost:3000/check-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,  // Sende das Token im Header
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Wenn das Token gültig ist, gebe "true" zurück
        return true;
      } else {
        // Wenn das Token ungültig ist, leite den Benutzer zum Login weiter
        console.log("Token ungültig oder abgelaufen:", data.message);
        window.location.href = "/login";
        return false;
      }
    } catch (error) {
      console.error("Fehler bei der Token-Verifizierung:", error);
      window.location.href = "/login";
      return false;
    }
  }
  