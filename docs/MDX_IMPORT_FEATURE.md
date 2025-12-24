# MDX Import Feature - Quick Guide

**Status:** ✅ Implemented & Working

---

## 🎯 What It Does

The **MDX Import** feature lets you upload a pre-formatted `.mdx` file with frontmatter, and it automatically fills out the entire "Add Book" form for you!

### Perfect for Your Workflow!

Since you already have MDX files prepared with frontmatter, you can now:

1. **Upload your MDX file** → All fields auto-filled ✨
2. **Review/edit** if needed
3. **Upload cover, audio, PDF**
4. **Click "Create Book"** → Done!

---

## 📍 Where to Find It

Go to: **`/admin/books/new`** (Add New Book page)

At the very top of the form, you'll see:

```
┌────────────────────────────────────────────────┐
│  📄 Importa MDX Esistente                      │
│  Hai già un file .mdx con frontmatter?         │
│  Caricalo qui per auto-compilare il form       │
│                                                 │
│  [Click to select .mdx file]                   │
└────────────────────────────────────────────────┘
```

---

## 🚀 How to Use It

### **Step 1: Prepare Your MDX File**

Make sure your `.mdx` file has frontmatter like this:

```yaml
---
title: "Le Armi della Persuasione"
slug: "le-armi-della-persuasione"
author: "Robert Cialdini"
year: 1984
level: "base"
pvCategory: "psicologia-consumatore"
tags: ["psicologia", "persuasione", "decisioni"]
rating: 4.9
readingTimeFull: "8 ore"
readingTimeSystem: "45 minuti"
excerpt: "I 6 principi della persuasione che influenzano ogni decisione umana"
amazonLink: "https://amazon.it/..."
---

# Introduzione

Il contenuto del libro va qui...

## I 6 Principi

### 1. Reciprocità
...
```

### **Step 2: Go to Add Book Page**

1. Navigate to `/admin`
2. Enter your password
3. Click "Gestione Libri"
4. Click "Aggiungi Nuovo Libro"

### **Step 3: Upload Your MDX**

1. At the top of the form, click **"Click to select .mdx file"**
2. Choose your `.mdx` file
3. **✨ Magic happens!** All form fields auto-fill with your frontmatter data

You'll see a green success message:

```
✅ MDX importato con successo!
I campi del form sono stati compilati automaticamente.
Verifica e modifica se necessario.
```

### **Step 4: Review & Adjust**

- All fields below are now filled in
- Scroll through and verify everything looks good
- Edit any field if needed (they're all editable!)

### **Step 5: Upload Files**

Now upload your assets:

- **Cover Image** (required): Upload `cialdini.jpg`
- **Audio** (optional): Upload `cialdini.mp3`
- **PDF** (optional): Upload `cialdini.pdf`

### **Step 6: Create Book**

Click **"Crea Libro"** at the bottom → Book is created!

---

## 🎨 What Gets Auto-Filled

The importer extracts these fields from your frontmatter:

| Frontmatter Field | Form Field | Notes |
|-------------------|------------|-------|
| `title` | Titolo Libro | Required |
| `author` | Autore | Required |
| `level` | Livello | base/intermedio/avanzato |
| `year` | Anno Pubblicazione | Optional |
| `rating` | Rating | Defaults to 4.5 |
| `pvCategory` | Categoria PV | Required |
| `tags` | Tags | Array → comma-separated |
| `readingTimeFull` | Tempo Integrale | Required |
| `readingTimeSystem` | Tempo Sistema PV | Required |
| `excerpt` | Excerpt | Falls back to metaDescription |
| `amazonLink` | Link Amazon | Optional |
| Content (below `---`) | Contenuto MDX | The full body |

---

## 💡 Tips & Tricks

### **Tip 1: Tags Handling**

The importer handles tags flexibly:

```yaml
# Array format (preferred)
tags: ["marketing", "strategia", "posizionamento"]
# → Becomes: "marketing, strategia, posizionamento"

# String format (also works)
tags: "marketing, strategia"
# → Stays: "marketing, strategia"
```

### **Tip 2: Fallback for Excerpt**

If you don't have `excerpt`, it uses `metaDescription`:

```yaml
# Option 1:
excerpt: "Brief description..."

# Option 2 (fallback):
metaDescription: "SEO description used as excerpt"
```

### **Tip 3: Amazon Link Variations**

Supports both naming conventions:

```yaml
# Either:
amazonLink: "https://amazon.it/..."

# Or:
amazon_link: "https://amazon.it/..."
```

### **Tip 4: Edit After Import**

After importing, **all fields remain editable**! So you can:

- Fix typos
- Adjust ratings
- Update descriptions
- Modify content

Then submit when ready.

### **Tip 5: Re-Import**

You can re-upload a different MDX file anytime to replace all fields. The form will update with the new data.

---

## 🔄 Complete Workflow Comparison

### **Old Way (Manual Entry)**

```
1. Go to /admin/books/new
2. Type title manually
3. Type author manually
4. Select level
5. Type category
6. Type tags
7. Type reading times
8. Type description
9. Paste/type content
10. Upload cover
11. Upload audio
12. Upload PDF
13. Submit
⏱️ Time: ~10 minutes
```

### **New Way (MDX Import)** ✨

```
1. Go to /admin/books/new
2. Upload .mdx file → ALL FIELDS AUTO-FILLED!
3. Quick review (optional edits)
4. Upload cover
5. Upload audio (optional)
6. Upload PDF (optional)
7. Submit
⏱️ Time: ~3 minutes
```

**70% time savings!** 🎉

---

## 📝 Example: Full Workflow

Let's add "Thinking, Fast and Slow" by Daniel Kahneman:

### **1. Prepare MDX File**

Create `kahneman-thinking-fast-slow.mdx`:

```yaml
---
title: "Thinking, Fast and Slow"
slug: "thinking-fast-and-slow"
author: "Daniel Kahneman"
year: 2011
level: "base"
pvCategory: "psicologia-decisionale"
tags: ["psicologia", "decisioni", "bias cognitivi"]
rating: 4.8
readingTimeFull: "12 ore"
readingTimeSystem: "60 minuti"
excerpt: "Come funzionano i due sistemi di pensiero che guidano le nostre decisioni"
amazonLink: "https://amazon.it/thinking-fast-slow"
---

# Introduzione

Daniel Kahneman, premio Nobel per l'economia, rivela...

## Sistema 1: Pensiero Veloce

Il Sistema 1 opera automaticamente...

## Sistema 2: Pensiero Lento

Il Sistema 2 richiede sforzo e concentrazione...

[... rest of content ...]
```

### **2. Go to Admin**

```
http://localhost:3000/admin
→ Enter password
→ Click "Gestione Libri"
→ Click "Aggiungi Nuovo Libro"
```

### **3. Import MDX**

Click the file selector, choose `kahneman-thinking-fast-slow.mdx`

**Result:** Form instantly fills with:
- ✅ Title: "Thinking, Fast and Slow"
- ✅ Author: "Daniel Kahneman"
- ✅ Level: "base"
- ✅ Category: "psicologia-decisionale"
- ✅ Tags: "psicologia, decisioni, bias cognitivi"
- ✅ Rating: 4.8
- ✅ Reading Full: "12 ore"
- ✅ Reading PV: "60 minuti"
- ✅ Excerpt: "Come funzionano..."
- ✅ Content: Full MDX body
- ✅ Year: 2011
- ✅ Amazon Link: URL

### **4. Upload Assets**

- Cover: `kahneman.jpg`
- Audio: `kahneman.mp3` (optional)
- PDF: `kahneman.pdf` (optional)

### **5. Submit**

Click "Crea Libro"

### **6. Result**

```
✨ Book created at:
http://localhost:3000/libri/thinking-fast-and-slow

Automatically saved to:
- /content/books/thinking-fast-and-slow.mdx
- /public/covers/thinking-fast-and-slow.jpg
- /public/audio/thinking-fast-and-slow.mp3
- /public/downloads/thinking-fast-and-slow.pdf
- Supabase Storage (all buckets)

Appears in:
- Homepage (if top-rated)
- /percorsi/base
- /admin/books
```

---

## 🐛 Troubleshooting

### **Issue: "No fields filled after upload"**

**Cause:** MDX file missing frontmatter
**Fix:** Add `---` delimiters at top and bottom of frontmatter

```yaml
---
title: "Book Title"
author: "Author Name"
---

Content here...
```

### **Issue: "Some fields empty"**

**Cause:** Frontmatter field names don't match
**Fix:** Use exact field names (case-sensitive):

```yaml
# Correct:
title: "Title"
author: "Author"
pvCategory: "category"
readingTimeFull: "5 ore"
readingTimeSystem: "35 minuti"

# Incorrect:
Title: "Title"  ❌
Author: "Author"  ❌
category: "category"  ❌
readingTime: "5 ore"  ❌
```

### **Issue: "Tags not showing"**

**Cause:** Tags not in array or comma-separated
**Fix:** Use one of these formats:

```yaml
# Good:
tags: ["tag1", "tag2", "tag3"]
tags: "tag1, tag2, tag3"

# Bad:
tags: tag1 tag2 tag3  ❌
```

### **Issue: "Parsing error"**

**Cause:** Invalid YAML syntax
**Fix:** Check for:
- Missing quotes around strings with colons
- Proper indentation
- No tabs (use spaces)
- Closed quotes/brackets

---

## ✨ Benefits

### **For You (Admin)**

- ⚡ **70% faster** book creation
- ✅ **No retyping** – paste once, use forever
- 🎯 **Less errors** – copy-paste from source
- 🔄 **Reusable** – keep MDX files as templates

### **For Your Workflow**

- 📝 **Write once** – create MDX locally
- 🔧 **Version control** – git commit your MDX files
- 🚀 **Batch prepare** – create multiple MDX files offline
- 📤 **Upload later** – when ready, bulk upload

---

## 🎓 Best Practices

### **1. Keep MDX Files Organized**

```
your-local-folder/
├── mdx-books/
│   ├── cialdini-persuasione.mdx
│   ├── kahneman-thinking.mdx
│   ├── kotler-marketing.mdx
│   └── ...
└── covers/
    ├── cialdini.jpg
    ├── kahneman.jpg
    └── ...
```

### **2. Use Consistent Naming**

```
File name: cialdini-le-armi-della-persuasione.mdx
Slug in frontmatter: "le-armi-della-persuasione"
Cover file: le-armi-della-persuasione.jpg
```

### **3. Validate Before Upload**

Check your MDX:
- ✅ Frontmatter properly delimited
- ✅ All required fields present
- ✅ Valid YAML syntax
- ✅ Content formatted in Markdown

### **4. Keep Backups**

Your MDX files are your source of truth:
- Commit to git
- Keep local copies
- Version as needed

---

## 📚 Related Documentation

- [PHASE_1_MIGRATION_COMPLETE.md](PHASE_1_MIGRATION_COMPLETE.md) - Dynamic book loading system
- [PHASE_2_ADMIN_BOOK_MANAGEMENT.md](PHASE_2_ADMIN_BOOK_MANAGEMENT.md) - Complete admin system
- [README.md](../README.md) - Main project documentation

---

## Summary

The **MDX Import** feature is the perfect blend of your two workflow preferences:

- ✅ Keep writing MDX files (your preferred format)
- ✅ Use the nice admin interface (unified upload)
- ✅ Auto-fill forms (no retyping)
- ✅ Quick review and upload assets
- ✅ One-click creation

**Best of both worlds!** 🎉
