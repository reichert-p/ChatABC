# ChatABC

## Beschreibung
ChatABC ist ein P2P Chat Programm, das über WebIRC kommuniziert.
Bei ChatABC steht nicht die effizienz, sondern das Erlebnis und die Entschleunigung bei der Nachrichtenerstellung im Vordergrund.
Dieses Dokument wurde nicht mit ChatABC erstellt.

## Deployment
ChatABC kann auf zwei Arten deployed werden.
Entweder über Docker oder manuell.
### Docker 
1. Docker installieren
2. Docker Compose installieren
3. `docker-compose up -d`


### Manuell
1. Dependencies installieren
   1. `cd backend`
   2. `npm install`
2. Website hosten (z.B. mit Nginx)  
    1. Static Files aus dem Ordner `frontend` hosten  
    2. Kommunikation mit dem Backend über Websocket auf Port 3000 erlauben
3. Backend starten
   1. `cd backend`
   2. `npm start`

## Herausforderungen

### User Interface

  - Tasten müssen einzeln detektiert und entsprechend einzeln generiert werden
  - Verständnis des Phaser Frameworks 
  - Gestaltung stellt sich als langwieriger Prozess heraus

### Kommunikation

 - Ziemlich viele Schritte für Kommunikationsaufbau notwendig
 - komplexe Sitzungsverwaltung auf Serverseite

## Einschränkungen

 - automatisches Matching zwei freier Clients
 - keine Löschfunktion getippter Tasten
 - Eingabe des Namens über angeschlossene Tastatur
 - Kein eigener Stun Server implementiert (Google Stun Server verwendet)
