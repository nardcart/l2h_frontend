# AI Implementation Prompt

Copy and paste this prompt along with the EDITOR_IMPLEMENTATION_SPEC.md document to have an AI implement the blog editor:

---

## Prompt for AI

```
I need you to implement a blog editor with TipTap based on the specification document I'm providing.

REQUIREMENTS:
1. Read the entire EDITOR_IMPLEMENTATION_SPEC.md document carefully
2. Implement ALL components exactly as specified
3. Use the EXACT code provided for each component
4. Ensure all features work correctly:
   - H1 to H6 headings (all 6 levels)
   - Links (insert, edit, remove)
   - Image upload (file picker + drag & drop + URL)
   - Video embed (YouTube + Vimeo)
   - Text formatting (bold, italic, underline, etc.)
   - Lists (bullet, numbered)
   - Text alignment (left, center, right, justify)
   - Character count
   - Undo/Redo

5. Follow the exact extension configuration shown in the document
6. Use the correct commands for each feature
7. Implement all dialog components (LinkDialog, ImageUploadDialog, VideoEmbedDialog)
8. Add all CSS styles as specified
9. Include proper error handling and validation
10. Test each feature using the test cases provided

CRITICAL POINTS:
- StarterKit MUST be configured with: heading: { levels: [1, 2, 3, 4, 5, 6] }
- Link extension MUST have: openOnClick: false
- Image extension MUST have: allowBase64: true
- Use editor.chain().focus().toggleHeading({ level: X }).run() for headings
- Use editor.isActive('heading', { level: X }) for active state

DELIVERABLES:
1. All 5 component files (RichTextEditor, EditorToolbar, LinkDialog, ImageUploadDialog, VideoEmbedDialog)
2. CSS file with editor styles
3. TypeScript interfaces for props
4. Working demo showing all features

Please start by creating the main RichTextEditor component with proper TipTap configuration, then build the other components.

[PASTE EDITOR_IMPLEMENTATION_SPEC.md CONTENT HERE]
```

---

## Alternative Shorter Prompt (If Token Limit)

```
Implement a TipTap blog editor with these working features:

MUST WORK:
- H1-H6 headings (configure StarterKit with levels: [1,2,3,4,5,6])
- Links (use Link extension with openOnClick: false)
- Image upload (drag & drop, file picker, URL)
- Video embed (YouTube, Vimeo - use iframe embeds)
- Text formatting (bold, italic, underline, strike)
- Lists and alignment

CRITICAL FIXES:
1. Headings: StarterKit.configure({ heading: { levels: [1,2,3,4,5,6] } })
2. Links: Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank' } })
3. Images: Image.configure({ inline: false, allowBase64: true })
4. Videos: Extract ID from URL, use responsive iframe wrapper

Create 5 components:
1. RichTextEditor (main editor)
2. EditorToolbar (formatting buttons)
3. LinkDialog (link insertion)
4. ImageUploadDialog (image upload)
5. VideoEmbedDialog (video embed)

Use exact commands:
- editor.chain().focus().toggleHeading({ level: 1 }).run()
- editor.chain().focus().setLink({ href: url }).run()
- editor.chain().focus().setImage({ src: url }).run()

[Reference EDITOR_IMPLEMENTATION_SPEC.md for full details]
```

---

## Quick Test Prompt (After Implementation)

```
Test the editor implementation:

1. Click H1 button - should apply Heading 1
2. Click H2 while H1 active - should change to Heading 2
3. Select text, click Link button, add URL - should create link
4. Click Image button, upload file - should insert image
5. Click Video button, paste YouTube URL - should embed video

Verify:
- All 6 heading buttons work
- Links open in new tab
- Images are responsive
- Videos are responsive (16:9 aspect ratio)
- Character count updates
- Undo/Redo works

Fix any issues found.
```

---

## Usage Instructions

### Option 1: Full Implementation
1. Open `EDITOR_IMPLEMENTATION_SPEC.md`
2. Copy entire contents
3. Use "Prompt for AI" above
4. Paste spec document after the prompt
5. Submit to AI (Claude, GPT-4, etc.)

### Option 2: Quick Implementation
1. Use "Alternative Shorter Prompt"
2. Reference spec document for details
3. Iterate on specific features as needed

### Option 3: Fix Existing Editor
1. Identify which features aren't working
2. Copy relevant sections from spec (e.g., "Issue 1: Headings Not Working")
3. Give to AI with: "Fix my editor using this guidance"

---

## Example Conversation Flow

**You:** [Paste full prompt + spec]

**AI:** I'll implement the blog editor with all features. Let me start with the RichTextEditor component...

**You:** Great! Now test if H1-H6 buttons work

**AI:** Testing... [provides test results]

**You:** H3 button not working. Check the configuration.

**AI:** Found the issue. The StarterKit wasn't configured with all heading levels. Fixed.

**You:** Perfect! Now test image upload.

**AI:** Image upload working with drag & drop, file picker, and URL options.

**You:** Test video embed with this URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ

**AI:** Video embedded successfully and is responsive.

---

## Tips for Best Results

1. **Be Specific:** Reference exact section numbers from the spec
2. **Test Incrementally:** Test each feature as it's implemented
3. **Use Examples:** Provide example URLs, files for testing
4. **Check Active States:** Verify buttons show active state when formatting applied
5. **Test Edge Cases:** Try invalid URLs, large files, etc.

---

**Created:** October 5, 2025  
**For Use With:** EDITOR_IMPLEMENTATION_SPEC.md  
**Compatible AI:** Claude (Sonnet/Opus), GPT-4, Gemini, etc.

