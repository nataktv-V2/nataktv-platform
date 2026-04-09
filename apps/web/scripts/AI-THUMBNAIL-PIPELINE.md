# AI Thumbnail Pipeline — Microsoft Designer

## One-liner for future sessions:
**"Run the AI thumbnail pipeline from AI-THUMBNAIL-PIPELINE.md for [video names]"**

## Flow:
1. Get video title + YouTube thumbnail + category from DB
2. Generate AI prompt: "Vertical 9:16 thumbnail for Indian drama/OTT. Title: [TITLE]. Scene: attractive Indian woman, dramatic lighting, Bollywood-style, vibrant colors, cinematic, no text in image"
3. Open Microsoft Designer (designer.microsoft.com/image-creator) in browser
4. Paste prompt → Generate
5. Pick best result → Download
6. Use Sharp to add: title text (Impact font) + "NATAK TV" branding + gradient overlay + vignette
7. Show user for approval
8. If approved → save to /thumbnails/generated/ and update DB
9. If not → refine prompt and repeat from step 3

## Prompt template:
```
Vertical 9:16 portrait thumbnail for Indian OTT streaming app.
Title: "{TITLE}"
Category: {CATEGORY}
Scene: {SCENE_DESCRIPTION}
Style: Cinematic Bollywood poster, dramatic lighting, rich vibrant colors,
attractive Indian woman as main subject, emotional expression,
high contrast, professional photography look.
NO TEXT in the image. NO watermarks. Clean cinematic shot only.
```

## Scene descriptions per video (customize per title context):
- Romance → woman in traditional outfit, intimate mood, warm colors
- Drama → intense emotional scene, golden/amber tones
- Comedy → bright colorful, fun expressions, neon pop colors
- Crime → dark moody, noir lighting, teal/green tones
- Horror → dark purple, eerie atmosphere

## Post-processing (Sharp):
- Resize to 2160x3840 (9:16)
- Add title text in Impact font at top
- Add accent color bar under title
- Add "NATAK TV" branding bottom-left
- Add vignette + gradient overlays
- Save as JPEG quality 92

## Files:
- Generated thumbnails: `public/thumbnails/generated/{videoId}.jpg`
- Pipeline script: `scripts/generate-thumbnails.cjs` (FLUX version)
- Post-processor: `scripts/thumbnail-pipeline-v2.mjs` (overlay version)
