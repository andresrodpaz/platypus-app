# Bug Reports - Platypus QA Lab

## Bug Report Format
- **Bug ID**: Unique identifier
- **Title**: Brief description
- **Severity**: Critical / High / Medium / Low
- **Priority**: P0 / P1 / P2 / P3
- **Status**: Open / In Progress / Fixed / Won't Fix
- **Reported By**: Tester name
- **Reported Date**: Date found
- **Environment**: Browser, OS, version
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots/Evidence**: Visual proof
- **Workaround**: Temporary solution (if any)
- **Notes**: Additional context

---

## Severity Definitions (with Platypus Commentary)

### Critical
**Definition**: Application crash, data loss, security vulnerability, core feature completely broken.
**Platypus Says**: "The API exploded into a thousand JSONs. No workaround (unless you want to cry)."

### High
**Definition**: Major feature broken, significant impact on user experience, no reasonable workaround.
**Platypus Says**: "This is bad. Like, 'wake up the on-call engineer' bad."

### Medium
**Definition**: Feature partially broken, workaround exists, moderate impact on users.
**Platypus Says**: "Annoying but survivable. Like a mosquito at 3 AM."

### Low
**Definition**: Minor issue, cosmetic problem, minimal impact, nice-to-have fix.
**Platypus Says**: "Barely a bug. More like a feature with commitment issues."

---

## Sample Bug Reports

### BUG-001: API Request Fails with Empty URL
- **Severity**: High
- **Priority**: P1
- **Status**: Fixed
- **Reported By**: QA Team
- **Reported Date**: 2025-01-15
- **Environment**: Chrome 120, macOS 14
- **Steps to Reproduce**:
  1. Navigate to /playground
  2. Leave URL field empty
  3. Click "Send Request"
- **Expected Behavior**: Validation error message appears, request not sent
- **Actual Behavior**: Application attempts to send request, throws unhandled error
- **Screenshots**: [Error console screenshot]
- **Workaround**: Always enter a URL before clicking send
- **Notes**: Need to add form validation before API call
- **Fix**: Added URL validation check before fetch call

### BUG-002: Dark Mode Contrast Issue on Bug Severity Badges
- **Severity**: Low
- **Priority**: P3
- **Status**: Open
- **Reported By**: UX Team
- **Reported Date**: 2025-01-16
- **Environment**: Firefox 121, Windows 11
- **Steps to Reproduce**:
  1. Enable dark mode
  2. Navigate to /bugs
  3. Observe severity badges
- **Expected Behavior**: Badges have sufficient contrast (WCAG AA compliant)
- **Actual Behavior**: Yellow "Medium" badge text hard to read on dark background
- **Screenshots**: [Badge contrast screenshot]
- **Workaround**: Use light mode
- **Notes**: Need to adjust badge colors for dark mode, consider using darker yellow or different color

### BUG-003: Response Time Occasionally Shows Negative Value
- **Severity**: Medium
- **Priority**: P2
- **Status**: In Progress
- **Reported By**: QA Team
- **Reported Date**: 2025-01-17
- **Environment**: Safari 17, macOS 14
- **Steps to Reproduce**:
  1. Send multiple rapid API requests
  2. Observe response time values
  3. Occasionally see negative numbers
- **Expected Behavior**: Response time always positive number in milliseconds
- **Actual Behavior**: Rarely shows negative values like "-5ms"
- **Screenshots**: [Negative time screenshot]
- **Workaround**: Refresh and try again
- **Notes**: Likely timing issue with performance.now() calls, investigate race condition

### BUG-004: Local Storage Exceeds Quota with Large Responses
- **Severity**: Medium
- **Priority**: P2
- **Status**: Open
- **Reported By**: QA Team
- **Reported Date**: 2025-01-18
- **Environment**: Chrome 120, Windows 11
- **Steps to Reproduce**:
  1. Send requests to APIs with very large responses (>1MB)
  2. Repeat 50+ times
  3. Check browser console
- **Expected Behavior**: Graceful handling of storage limits
- **Actual Behavior**: QuotaExceededError thrown, app crashes
- **Screenshots**: [Console error screenshot]
- **Workaround**: Clear local storage manually
- **Notes**: Need to implement storage size check and cleanup strategy

### BUG-005: Chart Tooltips Overlap on Mobile
- **Severity**: Low
- **Priority**: P3
- **Status**: Open
- **Reported By**: Mobile Testing Team
- **Reported Date**: 2025-01-19
- **Environment**: Chrome Mobile, Android 13
- **Steps to Reproduce**:
  1. Open app on mobile device
  2. Navigate to /analytics
  3. Tap on chart data points
- **Expected Behavior**: Tooltips display clearly without overlap
- **Actual Behavior**: Tooltips extend beyond screen, overlap with other elements
- **Screenshots**: [Mobile tooltip screenshot]
- **Workaround**: View on desktop
- **Notes**: Recharts tooltip positioning needs mobile-specific configuration

### BUG-006: Humorous Comments Repeat Too Frequently
- **Severity**: Low
- **Priority**: P3
- **Status**: Won't Fix
- **Reported By**: User Feedback
- **Reported Date**: 2025-01-20
- **Environment**: All browsers
- **Steps to Reproduce**:
  1. Send 10 requests with 200 status
  2. Observe comments
- **Expected Behavior**: Varied humorous comments
- **Actual Behavior**: Same comment appears 3-4 times in a row
- **Screenshots**: N/A
- **Workaround**: None needed
- **Notes**: Random selection from limited pool. Could implement "recently used" tracking, but low priority. The platypus says: "Repetition is the soul of comedy... or something."

### BUG-007: AI Analysis Endpoint Timeout on Slow Networks
- **Severity**: Medium
- **Priority**: P2
- **Status**: Open
- **Reported By**: QA Team
- **Reported Date**: 2025-01-21
- **Environment**: Chrome 120, Throttled 3G network
- **Steps to Reproduce**:
  1. Throttle network to Slow 3G
  2. Send API request
  3. Wait for AI analysis
- **Expected Behavior**: AI analysis loads or shows timeout message
- **Actual Behavior**: Infinite loading state, no timeout handling
- **Screenshots**: [Loading spinner screenshot]
- **Workaround**: Use faster network
- **Notes**: Need to add timeout to AI analysis fetch call (suggest 10s)

### BUG-008: Bug Dashboard Stats Don't Update After Status Change
- **Severity**: High
- **Priority**: P1
- **Status**: Fixed
- **Reported By**: QA Team
- **Reported Date**: 2025-01-22
- **Environment**: All browsers
- **Steps to Reproduce**:
  1. Navigate to /bugs
  2. Change bug status from "Open" to "Fixed"
  3. Observe stats cards at top
- **Expected Behavior**: Stats update immediately to reflect new status
- **Actual Behavior**: Stats remain unchanged until page refresh
- **Screenshots**: [Stale stats screenshot]
- **Workaround**: Refresh page
- **Notes**: Missing state update trigger after status change
- **Fix**: Added loadBugs() call after updateBugStatus()

---

## Bug Statistics

| Severity | Open | In Progress | Fixed | Won't Fix | Total |
|----------|------|-------------|-------|-----------|-------|
| Critical | 0 | 0 | 0 | 0 | 0 |
| High | 0 | 0 | 2 | 0 | 2 |
| Medium | 3 | 1 | 0 | 0 | 4 |
| Low | 3 | 0 | 0 | 1 | 4 |
| **Total** | **6** | **1** | **2** | **1** | **10** |

## Bug Trends
- **Week 1**: 10 bugs reported
- **Week 2**: 3 bugs fixed, 2 new bugs reported
- **Current Open**: 7 bugs

**The platypus's verdict**: "Not bad for a QA lab. I've seen worse. Barely."

---

## Known Issues (Not Bugs, Just... Quirks)

1. **Platypus Personality Inconsistency**: Sometimes optimistic, sometimes sarcastic. This is a feature, not a bug.
2. **Humor Engine Randomness**: Comments are random. If you get the same one twice, blame probability, not the code.
3. **Third-Party API Reliability**: We can't control if NASA's API is down. That's on NASA.
4. **Local Storage Limits**: Browsers have limits. We're not magicians.

**Remember**: Every bug is an opportunity to write a sarcastic comment. The platypus approves.
