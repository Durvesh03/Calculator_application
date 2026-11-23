# Integration UI Tests

| ID | Steps | Expected result |
|---|---|---|
| I1 | 1. Use `browser_navigate` to `http://127.0.0.1:5173/`. 2. Click `2`. 3. Click `+`. 4. Click `3`. 5. Click `=`. 6. Use `browser_snapshot`. | Display value is `5`. |
| I2 | 1. Use `browser_navigate` to `http://127.0.0.1:5173/`. 2. Click `9`. 3. Click `−`. 4. Click `4`. 5. Click `=`. 6. Use `browser_snapshot`. | Display value is `5`. |
| I3 | 1. Use `browser_navigate` to `http://127.0.0.1:5173/`. 2. Click `6`. 3. Click `×`. 4. Click `7`. 5. Click `=`. 6. Use `browser_snapshot`. | Display value is `42`. |
| I4 | 1. Use `browser_navigate` to `http://127.0.0.1:5173/`. 2. Click `8`. 3. Click `÷`. 4. Click `2`. 5. Click `=`. 6. Use `browser_snapshot`. | Display value is `4`. |
| I5 | 1. Use `browser_navigate` to `http://127.0.0.1:5173/`. 2. Click `C`. 3. Click `1`. 4. Click `.`. 5. Click `5`. 6. Click `+`. 7. Click `2`. 8. Click `.`. 9. Click `5`. 10. Click `=`. 11. Use `browser_snapshot`. | Display value is `4`. |
| I6 | 1. Use `browser_navigate` to `http://127.0.0.1:5173/`. 2. Click `5`. 3. Click `+`. 4. Click `×`. 5. Click `3`. 6. Click `=`. 7. Use `browser_snapshot`. | Display value is `15` because the operator replacement changes `+` to `×`. |
| I7 | 1. Use `browser_navigate` to `http://127.0.0.1:5173/`. 2. Click `2`. 3. Click `+`. 4. Click `3`. 5. Click `+`. 6. Use `browser_snapshot`. | Display value is `5` after the intermediate chained calculation. |
