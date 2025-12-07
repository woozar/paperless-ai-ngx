# Berechtigungen und Zugriffsrechte

Dieses Dokument beschreibt, welche Berechtigungen für welche Aktionen erforderlich sind.

## Benutzerrollen

| Rolle   | Beschreibung                                                               |
| ------- | -------------------------------------------------------------------------- |
| `ADMIN` | Vollzugriff auf alle Funktionen inkl. Benutzerverwaltung und Einstellungen |
| `USER`  | Standard-Benutzer mit Zugriff auf eigene und geteilte Ressourcen           |

## Freigabeberechtigungen

| Berechtigung | Beschreibung                        |
| ------------ | ----------------------------------- |
| `READ`       | Nur-Lesen Zugriff auf die Ressource |
| `WRITE`      | Lesen und Bearbeiten der Ressource  |

## Navigationsmenü

| Menüpunkt        | Erforderliche Rolle             |
| ---------------- | ------------------------------- |
| Dashboard        | Alle authentifizierten Benutzer |
| Paperless Server | Alle authentifizierten Benutzer |
| KI Anbieter      | Alle authentifizierten Benutzer |
| KI Bots          | Alle authentifizierten Benutzer |
| Benutzer         | Nur `ADMIN`                     |
| Einstellungen    | Nur `ADMIN`                     |

## Paperless Server (Instanzen)

| Aktion                | Owner           | WRITE | READ |
| --------------------- | --------------- | ----- | ---- |
| Liste anzeigen        | ✅              | ✅    | ✅   |
| Details anzeigen      | ✅              | ✅    | ✅   |
| Erstellen             | ✅ (nur eigene) | -     | -    |
| Bearbeiten            | ✅              | ✅    | ❌   |
| Löschen               | ✅              | ❌    | ❌   |
| Dokumente importieren | ✅              | ✅    | ✅   |
| Freigaben verwalten   | ✅              | ❌    | ❌   |

## KI Anbieter

| Aktion              | Owner           | WRITE | READ |
| ------------------- | --------------- | ----- | ---- |
| Liste anzeigen      | ✅              | ✅    | ✅   |
| Details anzeigen    | ✅              | ✅    | ✅   |
| Erstellen           | ✅ (nur eigene) | -     | -    |
| Bearbeiten          | ✅              | ✅    | ❌   |
| Löschen             | ✅              | ❌    | ❌   |
| Freigaben verwalten | ✅              | ❌    | ❌   |

## KI Bots

| Aktion              | Owner           | WRITE | READ |
| ------------------- | --------------- | ----- | ---- |
| Liste anzeigen      | ✅              | ✅    | ✅   |
| Details anzeigen    | ✅              | ✅    | ✅   |
| Erstellen           | ✅ (nur eigene) | -     | -    |
| Bearbeiten          | ✅              | ✅    | ❌   |
| Löschen             | ✅              | ❌    | ❌   |
| Freigaben verwalten | ✅              | ❌    | ❌   |

## Benutzer (nur ADMIN)

| Aktion                | ADMIN |
| --------------------- | ----- |
| Liste anzeigen        | ✅    |
| Erstellen             | ✅    |
| Bearbeiten            | ✅    |
| Löschen (Soft Delete) | ✅    |
| Wiederherstellen      | ✅    |

## Einstellungen (nur ADMIN)

| Aktion     | ADMIN |
| ---------- | ----- |
| Anzeigen   | ✅    |
| Bearbeiten | ✅    |

## UI-Verhalten

### Buttons in Tabellen

| Button      | Sichtbar wenn            |
| ----------- | ------------------------ |
| Teilen      | Owner UND ADVANCED Modus |
| Importieren | Immer (bei Zugriff)      |
| Bearbeiten  | Owner oder WRITE         |
| Löschen     | Nur Owner                |

### Hinweise

- **Owner** hat immer vollen Zugriff auf seine eigenen Ressourcen
- **Geteilte Ressourcen** erscheinen in der Liste zusammen mit eigenen Ressourcen
- **Buttons werden ausgeblendet** wenn der Benutzer keine Berechtigung hat (nicht deaktiviert)
