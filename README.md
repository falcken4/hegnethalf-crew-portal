AI_STUDIO_CHECK
Dev test – preview deploy virker.
# Crew Planlægger App (Event v0)

En optimeret, mobil-først PWA til crew-medlemmer. Appen henter data direkte fra Google Sheets og gemmer det lokalt (offline-first).

## Hvordan jeg publicerer faner til CSV

For at appen kan læse dine Google Sheets, skal hver fane publiceres til webbet som CSV:
1.  **Gå til Filer -> Del -> Udgiv på nettet**.
2.  I dialogboksen: Vælg det specifikke ark (f.eks. "Overblik") i den første dropdown.
3.  Vælg **Kommaseparerede værdier (.csv)** i den anden dropdown.
4.  Tryk **Udgiv**. Kopier URL'en og indsæt den i din `.env` fil.

## Indsæt CSV links (.env)

Opret en `.env` fil (brug `.env.example` som skabelon) og udfyld:
```bash
VITE_OVERBLIK_CSV_URL="link-her"
VITE_INFO_CSV_URL="link-her"
VITE_TASKDESC_CSV_URL="link-her"
VITE_VAGTER_CSV_URL="valgfrit-link"
```

## Sikkerhed & Privatliv
- **Kolonnerne** "Kommentar", "Email", "Tlf" og lignende bliver automatisk fjernet fra koden før de når UI'en.
- Navne bliver forkortet til "Fornavn E." i alle lister.
- Der gemmes intet på serveren; alt data lever i Google Sheets og brugerens browser cache.

## Build & Deploy

For at udrulle appen:
1.  Kør `npm install` for at installere pakker.
2.  Kør `npm run build` for at generere produktions-filer i `dist/`.
3.  Upload indholdet af `dist/` til din foretrukne host (Vercel, Netlify, Firebase Hosting, eller en almindelig Apache/Nginx server).

Appen fungerer som en statisk side, så den kan hostes hvor som helst.
