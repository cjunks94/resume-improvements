# Accessibility Guide

This document outlines the accessibility features implemented on cjunker.dev and how to test them.

## WCAG 2.1 Level AA Compliance

This site aims to meet WCAG 2.1 Level AA standards. Based on comprehensive research (see `web-accessibility-research-report.md`), we've implemented the following accessibility features:

## Implemented Features

### Quick Wins (Phase 1 - Completed)

#### 1. Language Declaration ✓
- HTML lang attribute set to "en"
- Helps screen readers load correct pronunciation rules
- WCAG 3.1.1 (Level A)

#### 2. Skip Navigation Link ✓
- Allows keyboard users to bypass navigation
- Visible only when focused (first Tab press)
- WCAG 2.4.1 (Level A)
- **Test**: Press Tab on page load, press Enter to skip to main content

#### 3. Semantic HTML ✓
- Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ARIA label on navigation: `aria-label="Main navigation"`
- Logical heading hierarchy (h1 → h2 → h3)
- Screen readers can navigate by landmarks

#### 4. Keyboard Navigation ✓
- All interactive elements accessible via Tab/Shift+Tab
- Visible focus indicators (3px solid outline, 2px offset)
- Focus indicator contrast meets WCAG 2.4.7 (Level AA)
- **Test**: Navigate site with keyboard only (unplug mouse)

#### 5. Enhanced Navigation Header ✓
- Improved opacity with backdrop-filter
- Better readability when scrolling over content
- Addresses Issue #6

#### 6. ARIA Labels ✓
- Emoji icons have `aria-label` attributes
- Navigation has descriptive label
- External links have `rel="noopener noreferrer"`

### Not Applicable

#### Images
- Site uses only emoji characters with aria-label attributes
- No `<img>` tags currently present
- If images are added in future: All must have descriptive alt text

## Testing

### Automated Testing

```bash
# Run all tests
npm test

# Run accessibility-specific tests
npm run test:a11y

# Run linters
npm run lint
```

### Manual Testing

#### Keyboard Navigation Test
1. Unplug mouse or don't use trackpad
2. Press Tab to navigate through all interactive elements
3. Verify visible focus indicator at all times
4. Press Enter/Space to activate links/buttons
5. Shift+Tab to navigate backwards

#### Screen Reader Testing (Optional)
- **Windows**: NVDA (free) - https://www.nvaccess.org/
- **Mac**: VoiceOver (built-in) - Press Cmd+F5
- **Test**: Navigate through page, verify all content is announced

#### Color Contrast
- All text meets minimum 4.5:1 contrast ratio
- Large text meets 3:1 contrast ratio
- **Tool**: WebAIM Contrast Checker - https://webaim.org/resources/contrastchecker/

### Browser Testing Tools

Install these browser extensions for instant feedback:

1. **axe DevTools** (Chrome/Firefox/Edge)
   - Open DevTools (F12) → axe DevTools tab
   - Click "Scan ALL of my page"
   - Fix all Critical and Serious issues

2. **WAVE** (Chrome/Firefox)
   - Click WAVE icon in toolbar
   - Review Errors (red), Alerts (yellow), Features (green)

## Accessibility Checklist

Use this checklist when adding new features:

- [ ] All interactive elements have visible focus indicators
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- [ ] No information conveyed by color alone
- [ ] All images have descriptive alt text (or `alt=""` for decorative)
- [ ] Form inputs have associated `<label>` elements (if adding forms)
- [ ] Link text is descriptive (avoid "click here")
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] Page has one `<h1>` element
- [ ] One `<main>` landmark per page
- [ ] Navigation uses `<nav>` with `aria-label`
- [ ] Skip link is first focusable element
- [ ] No keyboard traps
- [ ] Tab order follows visual layout

## CI/CD Integration

Accessibility tests run automatically on every pull request via GitHub Actions.

### Local Testing Before Commit

```bash
# 1. Serve the site locally
npm run serve

# 2. In another terminal, run accessibility tests
npm run test:a11y

# 3. Fix any reported issues
# 4. Run linters
npm run lint

# 5. Commit when all tests pass
```

## Resources

### Official Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [W3C ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Extension](https://wave.webaim.org/extension/)
- [Pa11y Documentation](https://github.com/pa11y/pa11y)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Learning Resources
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Coffee - Quick Wins](https://a11y.coffee/quick-wins/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Known Issues

None currently. All Phase 1 critical accessibility fixes have been implemented.

## Future Enhancements (Phase 2)

See `web-accessibility-research-report.md` for comprehensive roadmap.

Planned improvements:
- Lighthouse CI integration (automated scoring)
- Quarterly full manual audits
- WCAG 2.2 compliance (9 additional criteria)
- Accessibility statement page
- Dark mode with accessible contrast ratios

## Questions or Issues?

If you encounter an accessibility barrier on this site:
1. Open an issue at: https://github.com/cjunks94/resume-improvements/issues
2. Label it with "bug" and "accessibility"
3. Describe the barrier and assistive technology used

---

**Last Updated**: November 2025
**WCAG Compliance**: Working toward 2.1 Level AA
**Testing Tools**: Pa11y-CI (axe-core), HTMLHint, Stylelint
