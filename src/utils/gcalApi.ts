// src/utils/gcalApi.ts
// Llama a tu WebApp de Apps Script para crear el evento en tu Calendar
// Devuelve el JSON de Apps Script o lanza un Error con detalle.

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwxLAeb-SGNonmyW8jY2enyjYKoUYbEiwZO4n3ZLEAdE4L0TgODjab15rZrWvZCVdaA/exec"; // ← pega AQUÍ tu /exec

type Payload = {
  summary: string;
  description: string;
  startISO: string;  
  endISO: string;     
  timeZone: string;   
  attendees: string[]; 
};

export async function createCalendarEvent(body: Payload): Promise<any> {
  // Logs útiles para ver EXACTAMENTE lo que envías
  console.log("GAS_URL", WEBAPP_URL);
  console.log("GAS_BODY", body);

  const res = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log("GAS_RAW", res.status, text);

  let json: any;
  try { json = JSON.parse(text); }
  catch {
    throw new Error(`HTTP ${res.status} no-json: ${text}`);
  }

  if (!res.ok) {
    // Error HTTP (502, 404, etc)
    throw new Error(`HTTP ${res.status}: ${json?.error || text}`);
  }
  if (!json?.ok) {

    throw new Error(json?.error || "Error desconocido de Apps Script");
  }

  return json; 
}
