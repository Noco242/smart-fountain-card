# Smart Fountain Card

Eine minimalistische Custom Card für Home Assistant, inspiriert vom beliebten "Bubble Card" Design. Perfekt für Wandbrunnen oder Wasserfälle.

![Screenshot](Link-zu-deinem-Screenshot.png)

## Features
* 💧 **Animiertes Icon:** Ein minimalistischer Wasserfluss, der sich nach unten bewegt, wenn der Brunnen aktiv ist.
* 🎨 **Bubble Card Design:** Passt sich optisch mit einer festen Höhe von 50px perfekt in Dashboards mit Bubble Cards ein.
* 🖱️ **Visueller Editor:** Volle Unterstützung für die Home Assistant UI (kein YAML nötig).

## Installation über HACS (Empfohlen)

1. Öffne Home Assistant und gehe zu **HACS**.
2. Klicke oben rechts auf die drei Punkte und wähle **Benutzerdefinierte Repositories** (Custom repositories).
3. Füge die URL dieses Repositories ein: `https://github.com/Noco242/smart-fountain-card`
4. Wähle als Kategorie: **Lovelace**.
5. Klicke auf Hinzufügen.
6. Suche in HACS nach "Smart Fountain Card" und lade sie herunter.
7. **Wichtig:** Lade dein Dashboard neu!

## Konfiguration

Füge die Karte einfach über den visuellen Editor auf deinem Dashboard hinzu und wähle die Entität (Steckdose) für deinen Brunnen aus.

Alternativ über YAML:
```yaml
type: custom:smart-fountain-card
entity: switch.dein_brunnen
name: Wandbrunnen
