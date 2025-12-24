# CTA System - Quick Reference

## Quick Syntax Guide

| CTA Type | Marker | Parameters |
|----------|--------|------------|
| Newsletter | `{{CTA:newsletter}}` | None |
| Unlock | `{{CTA:unlock}}` | None (auto uses bookSlug) |
| Upgrade PRO | `{{CTA:upgrade-pro}}` | None |
| Buy Book | `{{CTA:buy-book}}` | None (needs amazonLink in frontmatter) |
| Related Books | `{{CTA:related-books}}` | ⚠️ Coming soon |
| Tools | `{{CTA:tools}}` | None (auto uses bookSlug) |
| Next Book | `{{CTA:next-book}}` | ⚠️ Coming soon |
| Download | `{{CTA:download:Title:Desc:URL:ButtonText}}` | 4-5 params |

---

## Example MDX with CTAs

```markdown
---
title: "Book Title"
author: "Author Name"
slug: "book-slug"
amazonLink: "https://amazon.it/book"
---

# Introduction

Content here...

{{CTA:newsletter}}

## Main Content

More content...

{{CTA:unlock}}

## Advanced Topics

Deep dive...

{{CTA:tools}}

## Conclusion

Summary...

{{CTA:buy-book}}
```

---

## Recommended Patterns

### Pattern 1: Email Growth
```
30% → {{CTA:newsletter}}
End → {{CTA:download:Bonus:Free checklist:/downloads/file.pdf}}
```

### Pattern 2: Free Account Conversion
```
25% → {{CTA:newsletter}}
60% → {{CTA:unlock}}
End → {{CTA:tools}}
```

### Pattern 3: PRO Conversion
```
30% → {{CTA:newsletter}}
50% → {{CTA:unlock}}
80% → {{CTA:upgrade-pro}}
```

### Pattern 4: Affiliate Sales
```
30% → {{CTA:newsletter}}
70% → {{CTA:unlock}}
90% → {{CTA:buy-book}}
```

---

## Important Notes

✅ **Backward Compatible**: No markers = auto newsletter at 30% (old behavior)

✅ **Multiple CTAs**: Add as many as you want, wherever you want

✅ **Required Data**:
- `{{CTA:buy-book}}` needs `amazonLink` in frontmatter
- `{{CTA:download:...}}` needs all 4 parameters minimum

⚠️ **Not Yet Available**:
- `{{CTA:related-books}}` - Coming soon
- `{{CTA:next-book}}` - Coming soon

---

## Common Mistakes

❌ `{CTA:newsletter}` - Single braces
❌ `{{CTA newsletter}}` - No colon
❌ `{{ CTA:newsletter }}` - Spaces inside braces
❌ `{{cta:newsletter}}` - Lowercase CTA

✅ `{{CTA:newsletter}}` - Correct!

---

## Quick Start

1. Add markers to your MDX file
2. Upload via `/admin/books/new`
3. CTAs appear automatically where markers are placed
4. Done!

For full documentation, see [FLEXIBLE_CTA_SYSTEM.md](FLEXIBLE_CTA_SYSTEM.md)
