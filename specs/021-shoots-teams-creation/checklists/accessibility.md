# Accessibility Checklist: Teams Creation

**Feature**: Teams Creation (021-shoots-teams-creation)  
**Date**: October 20, 2025

**Target**: WCAG 2.1 Level AA compliance

---

## Keyboard Navigation

- [ ] All interactive elements keyboard accessible
- [ ] Tab order follows logical reading order
- [ ] Focus visible on all interactive elements
- [ ] Focus trap works in modals/dialogs
- [ ] Escape key closes modals/dialogs
- [ ] Enter key submits forms
- [ ] Arrow keys navigate lists/menus
- [ ] Skip links provided for main content
- [ ] No keyboard traps in any component

## Screen Reader Support

### Semantic HTML

- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Landmarks used (main, nav, aside, footer)
- [ ] Lists use proper list markup (ul, ol, li)
- [ ] Tables use proper table markup with headers
- [ ] Forms use fieldset and legend where appropriate
- [ ] Buttons use `<button>` not `<div>` with click handlers

### ARIA Labels

- [ ] Form inputs have associated labels
- [ ] Icon buttons have aria-label
- [ ] Complex widgets have aria-describedby
- [ ] Live regions announce dynamic updates
- [ ] Loading states announced with aria-live
- [ ] Error messages announced with aria-live="assertive"
- [ ] Success messages announced with aria-live="polite"
- [ ] Modal dialogs have aria-modal="true"
- [ ] Expandable sections have aria-expanded

### Screen Reader Testing

- [ ] Tested with NVDA (Windows)
- [ ] Tested with JAWS (Windows)
- [ ] Tested with VoiceOver (macOS/iOS)
- [ ] All content readable by screen readers
- [ ] Navigation makes sense when linearized
- [ ] Form errors clearly announced
- [ ] Real-time updates announced appropriately

## Visual Accessibility

### Color Contrast

- [ ] Text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Interactive elements meet contrast requirements
- [ ] Focus indicators meet contrast requirements
- [ ] Error states don't rely solely on color
- [ ] Success states don't rely solely on color
- [ ] Disabled states clearly distinguishable

### Text & Typography

- [ ] Base font size at least 16px
- [ ] Line height at least 1.5 for body text
- [ ] Text can be resized to 200% without breaking
- [ ] No horizontal scrolling at 200% zoom
- [ ] Sufficient spacing between interactive elements
- [ ] Text not justified (easier to read)

### Visual Indicators

- [ ] Focus indicators visible and clear (2px minimum)
- [ ] Active/selected states clearly indicated
- [ ] Required fields marked with asterisk + label
- [ ] Error states shown with icon + text
- [ ] Loading states shown with spinner + text
- [ ] Disabled states clearly communicated

## Forms & Inputs

- [ ] All inputs have visible labels
- [ ] Labels positioned consistently
- [ ] Placeholder text not used as labels
- [ ] Error messages associated with inputs
- [ ] Error messages specific and helpful
- [ ] Required fields clearly marked
- [ ] Input types match data (email, tel, etc.)
- [ ] Autocomplete attributes set appropriately
- [ ] Form validation doesn't rely on color alone

## Interactive Elements

### Buttons & Links

- [ ] Buttons and links clearly distinguishable
- [ ] Link purpose clear from text or context
- [ ] No "click here" or "read more" without context
- [ ] Buttons have descriptive text
- [ ] Icon-only buttons have aria-label
- [ ] Touch targets at least 44x44px
- [ ] Adequate spacing between touch targets

### Modals & Dialogs

- [ ] Focus moves to modal when opened
- [ ] Focus trapped within modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger on close
- [ ] Modal has accessible name (aria-labelledby)
- [ ] Background content inert (aria-hidden)

### Notifications & Alerts

- [ ] Success messages announced politely
- [ ] Error messages announced assertively
- [ ] Notifications dismissible
- [ ] Notifications don't auto-dismiss too quickly
- [ ] Notifications don't block content

## Motion & Animation

- [ ] Respects prefers-reduced-motion
- [ ] No auto-playing animations
- [ ] Animations can be paused/stopped
- [ ] No flashing content (seizure risk)
- [ ] Smooth scrolling optional
- [ ] Transitions enhance, not hinder usability

## Mobile Accessibility

- [ ] Touch targets at least 44x44px
- [ ] Gestures have keyboard alternatives
- [ ] Pinch-to-zoom not disabled
- [ ] Orientation changes supported
- [ ] Content reflows at different viewport sizes
- [ ] No horizontal scrolling required

## Content Accessibility

- [ ] Headings describe content accurately
- [ ] Language attribute set on page
- [ ] Page titles descriptive and unique
- [ ] Instructions don't rely on sensory characteristics
- [ ] Time limits can be extended/disabled
- [ ] No content flashes more than 3 times per second

## Testing Tools & Methods

- [ ] Automated testing with axe DevTools
- [ ] Automated testing with Lighthouse
- [ ] Manual keyboard navigation testing
- [ ] Screen reader testing (NVDA/JAWS/VoiceOver)
- [ ] Color contrast checked with tools
- [ ] Zoom testing up to 200%
- [ ] Mobile accessibility testing
- [ ] User testing with people with disabilities

## Documentation

- [ ] Accessibility features documented
- [ ] Known issues documented with workarounds
- [ ] Keyboard shortcuts documented
- [ ] Alternative access methods documented
