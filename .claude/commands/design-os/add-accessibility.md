# Add Accessibility

You are helping the user analyze and document accessibility for a section of their product. This will analyze existing screen designs and generate a WCAG-based accessibility checklist and recommendations.

## Step 1: Check Prerequisites

First, identify the target section and verify that `spec.md`, `data.json`, `types.ts`, and screen designs all exist.

Read `/product/product-roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple sections, use the AskUserQuestion tool to ask which section the user wants to analyze for accessibility.

Then verify all required files exist:

- `product/sections/[section-id]/spec.md`
- `product/sections/[section-id]/data.json`
- `product/sections/[section-id]/types.ts`
- At least one screen design component in `src/sections/[section-id]/`

If spec.md doesn't exist:

"I don't see a specification for **[Section Title]** yet. Please run `/shape-section` first to define the section's requirements."

If data.json or types.ts don't exist:

"I don't see sample data for **[Section Title]** yet. Please run `/sample-data` first to create sample data and types."

If no screen designs exist:

"I don't see any screen designs for **[Section Title]** yet. Please run `/design-screen` first to create screen designs, then come back to analyze accessibility."

Stop here if any file is missing.

## Step 2: Analyze Screen Designs

Read all screen design components from `src/sections/[section-id]/components/*.tsx` and the preview wrappers from `src/sections/[section-id]/*.tsx`.

For each screen design component, analyze:

### WCAG Level A (Basic Requirements)
- **Semantic HTML**: Are proper HTML elements used (button, nav, main, etc.)?
- **Alt Text**: Are images provided with meaningful alt attributes?
- **Form Labels**: Are all form inputs properly labeled?
- **Keyboard Navigation**: Can all interactive elements be reached via keyboard?
- **Focus Indicators**: Are focus states visible?
- **Page Titles**: Are meaningful titles provided?
- **Language**: Is the page language declared?

### WCAG Level AA (Standard Requirements)
- **Color Contrast**: Do text colors meet 4.5:1 contrast ratio (3:1 for large text)?
- **Text Resizing**: Can text be resized up to 200% without loss of functionality?
- **Multiple Ways**: Are there multiple ways to navigate (if applicable)?
- **Headings**: Are headings used in a logical hierarchy?
- **Focus Order**: Does the focus order make sense?
- **Error Identification**: Are form errors clearly identified?
- **Labels**: Are labels associated with inputs (not just placeholder text)?

### WCAG Level AAA (Enhanced Requirements)
- **Enhanced Contrast**: Do text colors meet 7:1 contrast ratio (4.5:1 for large text)?
- **Sign Language**: Is sign language interpretation provided (if applicable)?
- **Extended Audio**: Is extended audio description provided (if applicable)?
- **Context-Sensitive Help**: Is help available when needed?

### Additional Analysis
- **ARIA Labels**: Are ARIA labels used appropriately where needed?
- **ARIA Roles**: Are ARIA roles used correctly?
- **ARIA States**: Are ARIA states (aria-expanded, aria-selected, etc.) used properly?
- **Skip Links**: Are skip navigation links provided?
- **Error Messages**: Are error messages accessible and descriptive?
- **Loading States**: Are loading states announced to screen readers?
- **Empty States**: Are empty states clearly communicated?

## Step 3: Generate Accessibility Report

Create a comprehensive accessibility report in markdown format. The report should include:

### Overview Section
- Summary of overall accessibility status
- Number of screen designs analyzed
- High-level compliance status (Level A, AA, AAA)
- Priority issues that need immediate attention

### WCAG Compliance Checklist

Organize findings by WCAG level:

**Level A (Basic)**
- [ ] Semantic HTML structure
- [ ] Image alt text
- [ ] Form labels
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Page titles
- [ ] Language declaration

**Level AA (Standard)**
- [ ] Color contrast (4.5:1 for normal text, 3:1 for large text)
- [ ] Text resizing (up to 200%)
- [ ] Heading hierarchy
- [ ] Focus order
- [ ] Error identification
- [ ] Input labels

**Level AAA (Enhanced)**
- [ ] Enhanced contrast (7:1 for normal text, 4.5:1 for large text)
- [ ] Context-sensitive help

### Screen-Specific Recommendations

For each screen design, provide:
- Screen name
- Specific issues found
- Recommendations for fixes
- Priority level (High, Medium, Low)

### Action Items

Create a prioritized list of action items:
- **High Priority**: Issues that block basic accessibility
- **Medium Priority**: Issues that improve accessibility significantly
- **Low Priority**: Enhancements and optimizations

## Step 4: Create the Accessibility File

Create the file at `product/sections/[section-id]/accessibility.md` with this exact format:

```markdown
# Accessibility Report for [Section Title]

## Overview

[2-3 sentence summary of accessibility status]

**Analysis Date:** [Current date]
**Screen Designs Analyzed:** [Number]
**Overall Compliance:** [Level A / AA / AAA status]

## WCAG Compliance Checklist

### Level A (Basic Requirements)

- [ ] Semantic HTML structure
- [ ] Image alt text provided
- [ ] Form inputs properly labeled
- [ ] Keyboard navigation functional
- [ ] Focus indicators visible
- [ ] Page titles meaningful
- [ ] Language declared

### Level AA (Standard Requirements)

- [ ] Color contrast meets 4.5:1 (normal text) / 3:1 (large text)
- [ ] Text resizable up to 200%
- [ ] Logical heading hierarchy
- [ ] Focus order makes sense
- [ ] Form errors clearly identified
- [ ] Input labels associated (not just placeholders)

### Level AAA (Enhanced Requirements)

- [ ] Enhanced contrast meets 7:1 (normal text) / 4.5:1 (large text)
- [ ] Context-sensitive help available

## Screen-Specific Recommendations

### [Screen Name 1]

**Issues Found:**
- [Issue description with specific component/location]
- [Another issue]

**Recommendations:**
- [Specific fix recommendation]
- [Another recommendation]

**Priority:** [High/Medium/Low]

### [Screen Name 2]

[Repeat for each screen design]

## Action Items

### High Priority
1. [Action item]
2. [Action item]

### Medium Priority
1. [Action item]
2. [Action item]

### Low Priority
1. [Action item]
2. [Action item]

## Notes

[Any additional context or considerations]
```

## Step 5: Confirm and Next Steps

Let the user know:

"I've analyzed the accessibility of **[Section Title]** and created an accessibility report:

**Report Created:**
- `product/sections/[section-id]/accessibility.md` - WCAG compliance checklist and recommendations

**Summary:**
- Analyzed [X] screen design(s)
- Overall compliance: [Status]
- [X] high priority issues identified
- [X] medium priority issues identified
- [X] low priority enhancements suggested

**Key Findings:**
- [Highlight 1-2 most important findings]

**Next Steps:**
- Review the accessibility report in the section page
- Address high priority issues in your screen designs
- Run `/add-accessibility` again after making changes to update the report
- When all sections are complete, run `/export-product` to generate the complete export package"

## Important Notes

- Be thorough but practical - focus on actionable recommendations
- Prioritize issues that have the biggest impact on accessibility
- Provide specific code examples when suggesting fixes
- Reference WCAG guidelines when appropriate
- Consider both automated checks and manual review insights
- The report should be useful for developers implementing the designs
- Update the report format if the user requests changes

