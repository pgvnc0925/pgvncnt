# Guida Completa: Setup MCP Servers per Claude Code in VS Code

## Panoramica
Questa guida ti permetterà di installare e configurare MCP (Model Context Protocol) servers che funzioneranno perfettamente con Claude Code all'interno di VS Code, partendo da zero.

## ⚠️ Prerequisiti Essenziali

### 1. Installazioni Base Richieste
```bash
# Node.js (versione 18 o superiore)
node --version  # Deve essere >= 18.0.0

# npm (incluso con Node.js)
npm --version

# Python (per alcuni MCP servers)
python3 --version  # Consigliato >= 3.8

# uvx (per Semgrep e altri tools Python)
pip install uvx
```

### 2. Verifica VS Code e Claude Code
- VS Code installato
- Estensione "Claude Dev" installata da Anthropic
- Account Claude con accesso a Claude Code

---

## 🎯 Installazione Step-by-Step

### FASE 1: Preparazione dell'Ambiente

#### Step 1.1: Configura npm per installazioni globali (macOS)
```bash
# Crea directory per npm globale
mkdir ~/.npm-global

# Configura npm per usare questa directory
npm config set prefix '~/.npm-global'

# Aggiungi al PATH (aggiungi al tuo ~/.zshrc o ~/.bash_profile)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

**Possibili Problemi:**
- **Problema**: Permessi negati durante npm install -g
- **Soluzione**: Usa il setup npm-global sopra, mai `sudo npm install`

#### Step 1.2: Localizza la Directory di Configurazione Claude Desktop
```bash
# Su macOS controlla questi percorsi in ordine:
ls -la "$HOME/Library/Application Support/Claude/"
ls -la "$HOME/.config/claude-desktop/"

# Il file che cerchi è: claude_desktop_config.json
```

**Possibili Problemi:**
- **Problema**: Directory non esiste
- **Soluzione**: Crea la directory: `mkdir -p "$HOME/Library/Application Support/Claude/"`

---

### FASE 2: Installazione MCP Servers Essenziali

#### Step 2.1: Memory Server (Sempre Funzionante)
```bash
# Questo si installa automaticamente, non serve azione
# Verifica: dovrebbe già funzionare in Claude Code
```

#### Step 2.2: Semgrep Server (Analisi Sicurezza)
```bash
# Installa Semgrep
pip install semgrep

# Installa il server MCP
pip install semgrep-mcp

# Testa l'installazione
uvx semgrep-mcp --version
```

**Possibili Problemi:**
- **Problema**: `uvx: command not found`
- **Soluzione**: `pip install uvx` o usa `python -m semgrep_mcp`

#### Step 2.3: ref-tools Server (Documentazione)
```bash
# Installa globalmente
npm install -g ref-tools-mcp

# Verifica installazione e percorso
which ref-tools-mcp
ref-tools-mcp --help
```

**Possibili Problemi:**
- **Problema**: `command not found` dopo installazione
- **Soluzione**: Verifica PATH npm globale (Step 1.1)

#### Step 2.4: Supabase Server (Database)
```bash
# Questo usa npx, non serve installazione preventiva
# Verifica solo che npx funzioni
npx --version
```

---

### FASE 3: Configurazione Claude Desktop

#### Step 3.1: Crea il File di Configurazione
```bash
# Naviga alla directory corretta
cd "$HOME/Library/Application Support/Claude/"

# Crea backup se esiste già
cp claude_desktop_config.json claude_desktop_config.json.backup 2>/dev/null || true
```

#### Step 3.2: Configurazione Base Funzionante
Crea/modifica il file `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "semgrep": {
      "command": "uvx",
      "args": ["semgrep-mcp"],
      "env": {
        "SEMGREP_APP_TOKEN": "TUO_TOKEN_QUI_OPZIONALE"
      }
    },
    "ref-tools": {
      "command": "/Users/TOUZERNAME/.npm-global/bin/ref-tools-mcp",
      "env": {
        "REF_API_KEY": "TUO_API_KEY_QUI"
      }
    }
  }
}
```

**⚠️ IMPORTANTE**: Sostituisci `TOUZERNAME` con il tuo username! Usa `whoami` per verificarlo.

#### Step 3.3: Trova i Path Corretti
```bash
# Trova il tuo username
whoami

# Verifica path ref-tools
which ref-tools-mcp

# Se il path è diverso, usa quello che ti restituisce `which`
```

---

### FASE 4: Configurazioni Avanzate

#### Step 4.1: Aggiungere Supabase (se hai un progetto)
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--read-only",
        "--project-ref=TUO_PROJECT_REF"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "TUO_ACCESS_TOKEN"
      }
    }
  }
}
```

#### Step 4.2: Aggiungere Server Custom
Per server personalizzati, usa sempre:
- **Path assoluti** invece di comandi nel PATH
- **node** per file JavaScript se hai problemi con symlink
- **Variabili d'ambiente** per API keys

Esempio per server custom:
```json
{
  "custom-server": {
    "command": "node",
    "args": ["/path/assoluto/al/tuo/server.js"],
    "env": {
      "API_KEY": "chiave_segreta",
      "PORT": "3001"
    }
  }
}
```

---

### FASE 5: Testing e Debugging

#### Step 5.1: Riavvia VS Code
```bash
# Chiudi completamente VS Code
# Riapri VS Code
# Apri il tuo progetto
```

#### Step 5.2: Testa Ogni Server
In Claude Code in VS Code, prova:

```
# Testa Memory
memory:search_nodes query: "test"

# Testa Semgrep  
semgrep --version

# Testa ref-tools
ref-tools:ref_search_documentation query: "javascript"

# Testa Supabase (se configurato)
supabase:list_tables
```

#### Step 5.3: Debugging Comune

**Problema**: Server non risponde
```bash
# Verifica che il comando funzioni standalone
/Users/tuousername/.npm-global/bin/ref-tools-mcp --help

# Se fallisce, reinstalla
npm uninstall -g ref-tools-mcp
npm install -g ref-tools-mcp
```

**Problema**: Path non trovato
```bash
# Trova il path corretto
find /Users/$(whoami) -name "ref-tools-mcp" 2>/dev/null

# Usa il path restituito nella configurazione
```

**Problema**: Symlink non funziona
```json
// Invece di:
"command": "/path/to/symlink"

// Usa:
"command": "node",
"args": ["/path/to/actual/file.js"]
```

---

## 🔧 Configurazioni Specifiche per Progetto

### Per Progetti con Supabase
```json
{
  "mcpServers": {
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "semgrep": { "command": "uvx", "args": ["semgrep-mcp"] },
    "ref-tools": { "command": "/Users/username/.npm-global/bin/ref-tools-mcp" },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase", "--project-ref=PROJECT_REF"],
      "env": { "SUPABASE_ACCESS_TOKEN": "TOKEN" }
    }
  }
}
```

### Per Progetti con Database Locale
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/db"
      }
    }
  }
}
```

---

## 📋 Checklist Finale

- [ ] Node.js >= 18 installato
- [ ] npm globale configurato correttamente
- [ ] uvx installato per Python tools
- [ ] Directory Claude Desktop localizzata
- [ ] File claude_desktop_config.json creato/aggiornato
- [ ] Path assoluti verificati per tutti i server
- [ ] VS Code riavviato
- [ ] Ogni server testato individualmente
- [ ] Backup della configurazione funzionante salvato

---

## 🆘 Risoluzione Problemi Avanzata

### Debugging Dettagliato
```bash
# Verifica configurazione
cat "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Testa ogni server manualmente
uvx semgrep-mcp --version
/Users/$(whoami)/.npm-global/bin/ref-tools-mcp --help

# Verifica permessi
ls -la "$HOME/Library/Application Support/Claude/"
```

### Reset Completo
```bash
# Backup e reset configurazione
cp "$HOME/Library/Application Support/Claude/claude_desktop_config.json" ~/backup_config.json
rm "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Reinstalla server problematici
npm uninstall -g ref-tools-mcp
npm install -g ref-tools-mcp
pip uninstall semgrep-mcp
pip install semgrep-mcp
```

---

## 🎯 Best Practices Collaudate

1. **Usa sempre path assoluti** per server npm custom
2. **Evita `sudo`** per installazioni npm
3. **Testa server standalone** prima di configurarli
4. **Fai backup** delle configurazioni funzionanti
5. **Usa variabili d'ambiente** per credenziali
6. **Riavvia sempre VS Code** dopo modifiche config
7. **Documenta le API keys** necessarie per ogni server

Questa guida è basata su test reali e problemi risolti. Ogni step è stato verificato e funziona con Claude Code in VS Code.