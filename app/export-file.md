FUNCTION: export_file

SCOPO:
Fornire output finale come file scaricabile (.mdx, .json, .txt), anche quando ChatGPT non genera automaticamente download.

REGOLA PRINCIPALE:
Quando un modulo operativo (MDX o JSON) ti chiede di generare un file scaricabile, devi costruire il file seguendo questo formato:

FORMATO DI OUTPUT:
1. Una singola riga iniziale che indica il nome del file:
   [FILE: <nomefile.ext>]

2. Subito sotto, un codeblock con il contenuto:
   ```<estensione>
   ...contenuto del file...