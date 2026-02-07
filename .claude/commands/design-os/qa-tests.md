# QA Test Case Generator

You are helping the user generate comprehensive QA test cases for their product. These test cases cover the main user flows and edge cases for each section, providing a testing blueprint for QA validation.

## Step 1: Check Prerequisites

First, verify that the required product files exist:

1. Read `/product/product-overview.md` to understand the product
2. Read `/product/product-roadmap.md` to get the list of sections
3. Read any existing section specs at `/product/sections/*/spec.md`

If the product overview is missing:

"Before generating test cases, you'll need to establish your product vision. Please run `/product-vision` first."

If the roadmap is missing:

"Before generating test cases, you'll need to define your product roadmap. Please run `/product-roadmap` first."

Stop here if prerequisites are missing.

## Step 2: Explain the Process

"Let's generate QA test cases for **[Product Name]**.

I'll create test cases covering:
- **Critical** — Core functionality that must work (login, primary actions)
- **High** — Key user flows that affect daily usage
- **Medium** — Important features and secondary flows
- **Low** — Edge cases and nice-to-have validations

I'll generate test cases for each of your sections:
[List sections from roadmap]

Should I focus on any specific sections first, or generate tests for all sections?"

Wait for their response.

## Step 3: Analyze Each Section

For each section that has a spec, analyze:

1. Read the section spec at `/product/sections/[section-id]/spec.md`
2. Identify the user flows listed
3. Identify the UI requirements listed
4. Consider common edge cases and error states

If a section doesn't have a spec yet, note it and generate basic test cases based on the roadmap description.

## Step 4: Generate Test Cases

For each section, generate test cases following this pattern:

"Here are the test cases for **[Section Title]**:

**TC-001: [Test Title]** (Critical)
- Section: [Section Name]
- Steps:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- Expected: [What should happen]

**TC-002: [Test Title]** (High)
...

Should I adjust any of these test cases, or add more for specific scenarios?"

Use AskUserQuestion to refine.

### Test Case Coverage Guidelines

For each section, aim to cover:

1. **Happy path** — The main user flow works as expected (Critical)
2. **Empty states** — What happens when there's no data (High)
3. **Error handling** — Invalid inputs, failed operations (High)
4. **Boundary conditions** — Max items, long text, special characters (Medium)
5. **Navigation** — Can the user get to and from this section (Medium)
6. **Responsive behavior** — Works on mobile and desktop (Low)
7. **Loading states** — Appropriate feedback during operations (Low)

## Step 5: Generate Coverage Summary

After creating all test cases, provide a coverage summary:

"**Coverage Summary:**

Total test cases: [N]
- Critical: [N] tests
- High: [N] tests
- Medium: [N] tests
- Low: [N] tests

Sections covered: [N]/[Total sections]
- [Section 1]: [N] tests
- [Section 2]: [N] tests

Any gaps you'd like me to address?"

## Step 6: Present Final Test Suite and Confirm

Present the complete test suite for approval:

"Here's your complete QA test suite with [N] test cases across [N] sections.

Ready to save?"

## Step 7: Create the File

Once approved, create the file at `/product/qa-tests/qa-tests.md` with this exact format:

```markdown
# QA Test Cases

## Coverage Summary
[Summary paragraph describing what's covered, total test count, and any known gaps]

## Test Cases

### TC-001: [Test Title]
**Section:** [Section Name]
**Priority:** critical
**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Expected Result:** [What should happen when the test passes]

### TC-002: [Test Title]
**Section:** [Section Name]
**Priority:** high
**Steps:**
1. [Step 1]
2. [Step 2]
**Expected Result:** [What should happen when the test passes]

[Add more test cases as needed]
```

**Important:**
- Test IDs must follow the `TC-XXX` format (e.g., TC-001, TC-002)
- Priority must be one of: `critical`, `high`, `medium`, `low`
- Steps must be numbered (1., 2., 3.)
- Each test case must have Section, Priority, Steps, and Expected Result fields
- The format must match exactly for the app to parse it correctly

## Step 8: Confirm Completion

Let the user know:

"I've created your QA test suite at `/product/qa-tests/qa-tests.md`.

**Summary:**
- [N] total test cases
- [N] critical, [N] high, [N] medium, [N] low priority
- Covering [N] sections

These test cases provide a comprehensive testing blueprint. You can use them for:
- Manual QA testing during development
- Writing automated tests (unit, integration, E2E)
- Acceptance criteria for each section

To regenerate or update test cases, run `/qa-tests` again."

## Important Notes

- Generate at least 3-5 test cases per section
- Always include at least one critical test per section (happy path)
- Include empty state and error handling tests for each section
- Test steps should be specific and actionable — not vague
- Expected results should be observable and verifiable
- Use section names from the roadmap, not arbitrary names
- Number test cases sequentially across all sections (TC-001, TC-002, etc.)
- Keep test cases focused — one test per scenario, not mega-tests
- Consider cross-section interactions where applicable
