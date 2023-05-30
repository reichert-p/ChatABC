# ChatABC

## Beschreibung
ChatABC ist ein P2P Chat Programm, das über WebIRC kommuniziert.
Bei ChatABC steht nicht die effizienz, sondern das Erlebnis und die Entschleunigung bei der Nachrichtenerstellung im Vordergrund.  
Disclaimer: Dieses Dokument wurde nicht mit ChatABC erstellt.

## Deployment
ChatABC kann auf zwei Arten deployed werden.
Entweder über Docker oder manuell.
### Docker 
1. Docker installieren
2. Docker Compose installieren
3. `docker-compose up -d` im Root-Verzeichnis ausführen


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

---
## Funktionsweise
ChatABC basiert auf dem WebRTC-Protokoll, das eine direkte Peer-to-Peer-Kommunikation zwischen den Clients ermöglicht. Beim Starten der Anwendung wird eine Verbindung zwischen den Clients hergestellt, um die Kommunikation zu ermöglichen. Die Clients können mithilfe der "interaktiven" Eingabe Textnachrichten eingeben und in Echtzeit an ihre Chat-Partner senden.

Die Kommunikation erfolgt über Websockets, die eine bidirektionale Kommunikation ermöglichen. Der Server verwaltet die Verbindungen zwischen den Clients, leitet Nachrichten (für den Verbindungsaufbau) weiter und aktualisiert den Status der Clients.

Um eine Chat-Sitzung zu starten, kann ein Benutzer eine Anfrage an einen anderen verfügbaren Benutzer senden (Aktuell wird hierbei der erste verfügbare Partner automatisch ausgewählt). Wenn der angefragte Benutzer die Anfrage annimmt (zurzeit auch automatisch), wird eine direkte Peer-to-Peer-Verbindung zwischen den beiden Benutzern hergestellt, und sie können miteinander chatten.

Für die Verwendung ist ein WebRTC Stack erforderlich. Dies umfasst die korrekte Konfiguration von STUN- und TURN-Servern, um NAT-Traversal zu ermöglichen und die Kommunikation zwischen den Clients in verschiedenen Netzwerken zu unterstützen. Im gegebenen Code ist der Google STUN-Server als Standard konfiguriert.

---

## Herausforderungen
Bei der Entwicklung von ChatABC wurden verschiedene Herausforderungen identifiziert:
### User Interface

  - Tasten müssen einzeln detektiert und entsprechend einzeln generiert werden
  - Verständnis des Phaser Frameworks 
  - Gestaltung stellt sich als langwieriger Prozess heraus

### Kommunikation

 - Die Einrichtung und Verwaltung der Kommunikation zwischen den Clients erfordert eine sorgfältige Planung und Implementierung. Dies umfasst die Behandlung von Peer-to-Peer-Verbindungen, das Austauschen von Signalisierungsnachrichten und die Verwaltung von Sitzungen.

---
## Einschränkungen

 - automatisches Matching zwei freier Clients
 - keine Löschfunktion getippter Tasten
 - Eingabe des Namens über angeschlossene Tastatur
 - Es wurde kein eigener STUN-Server implementiert. Stattdessen wird standardmäßig der Google STUN-Server verwendet, um NAT-Traversal zu ermöglichen.

--- 
## Weiterentwicklungsmöglichkeiten
ChatABC kann weiterentwickelt werden, um zusätzliche Funktionen und Verbesserungen hinzuzufügen. Einige potenzielle Bereiche für die Weiterentwicklung sind:

- Verbesserung der Benutzeroberfläche und des Benutzererlebnisses, z. B. durch Hinzufügen von Emojis, Unterstützung für Bilder oder Dateien oder Anpassungsoptionen für die Tastatur.
- Implementierung von weiteren Chat-Funktionen wie Benutzerstatus, Benutzerliste, private Nachrichten oder Gruppenchats.
- Implementierung von Verschlüsselung und Sicherheitsmaßnahmen, um die Privatsphäre der Benutzer zu schützen.
- Skalierung der Anwendung für eine größere Benutzerzahl und Optimierung der Leistung.
- Verbesserung der Codequalität, Hinzufügen von Tests und Refactoring zur Vereinfachung der Wartung und Weiterentwicklung.  
- Verwendung eines eigenen STUN-Servers, um die Abhängigkeit von Google zu reduzieren.

Diese Liste ist nicht abschließend und dient lediglich als Inspiration für mögliche zukünftige Entwicklungen von ChatABC.