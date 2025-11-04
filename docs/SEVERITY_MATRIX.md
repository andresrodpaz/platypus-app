# Severity Matrix - Platypus QA Lab

## Purpose
This document defines bug severity levels with clear criteria, examples, and the platypus's brutally honest commentary.

---

## Severity Levels

### Critical (P0)
**Definition**: System crash, data loss, security vulnerability, or complete failure of core functionality.

**Impact**: 
- Application unusable
- Data corruption or loss
- Security breach
- Revenue impact
- Affects all users

**Response Time**: Immediate (< 4 hours)  
**Fix Timeline**: < 24 hours

**Examples**:
- Application crashes on startup
- Database connection fails completely
- User data deleted or corrupted
- XSS or SQL injection vulnerability
- Payment processing broken

**Platypus Says**: "The API exploded into a thousand JSONs. No workaround (unless you want to cry). Drop everything and fix this NOW."

**Real Example from Platypus QA Lab**:
- None found (thankfully)

---

### High (P1)
**Definition**: Major feature completely broken with no reasonable workaround. Significant impact on user experience.

**Impact**:
- Core feature unusable
- Affects majority of users
- Workaround difficult or impractical
- Business impact
- User frustration high

**Response Time**: Same day (< 8 hours)  
**Fix Timeline**: < 3 days

**Examples**:
- API requests fail for all endpoints
- Bug reporter won't save bugs
- Analytics dashboard shows no data
- Navigation completely broken
- Dark mode doesn't work at all

**Platypus Says**: "This is bad. Like, 'wake up the on-call engineer' bad. Users are probably rage-clicking right now."

**Real Example from Platypus QA Lab**:
- BUG-001: API Request Fails with Empty URL (FIXED)
- BUG-008: Bug Dashboard Stats Don't Update (FIXED)

---

### Medium (P2)
**Definition**: Feature partially broken or significant inconvenience. Workaround exists but is annoying.

**Impact**:
- Feature works but with issues
- Affects some users
- Workaround available
- Moderate user frustration
- Business impact minimal

**Response Time**: Within 2 days  
**Fix Timeline**: < 7 days

**Examples**:
- Response time occasionally shows negative value
- Local storage exceeds quota with large responses
- AI analysis times out on slow networks
- Charts render slowly with lots of data
- Some preset APIs don't load

**Platypus Says**: "Annoying but survivable. Like a mosquito at 3 AM. You can live with it, but you'd rather not."

**Real Example from Platypus QA Lab**:
- BUG-003: Response Time Occasionally Shows Negative Value
- BUG-004: Local Storage Exceeds Quota
- BUG-007: AI Analysis Endpoint Timeout

---

### Low (P3)
**Definition**: Minor issue, cosmetic problem, or edge case. Minimal impact on functionality.

**Impact**:
- Cosmetic or minor functional issue
- Affects few users
- Easy workaround
- Low user frustration
- No business impact

**Response Time**: Within 1 week  
**Fix Timeline**: < 14 days (or next release)

**Examples**:
- Dark mode contrast slightly off
- Tooltip overlaps on mobile
- Typo in error message
- Icon alignment off by 2px
- Humorous comments repeat too often

**Platypus Says**: "Barely a bug. More like a feature with commitment issues. Fix it when you're bored."

**Real Example from Platypus QA Lab**:
- BUG-002: Dark Mode Contrast Issue on Badges
- BUG-005: Chart Tooltips Overlap on Mobile
- BUG-006: Humorous Comments Repeat Frequently

---

## Severity vs Priority Matrix

Severity and priority are different:
- **Severity**: Technical impact (how broken is it?)
- **Priority**: Business urgency (how soon must we fix it?)

| Severity | Priority | Example |
|----------|----------|---------|
| Critical | P0 | App crashes - fix immediately |
| High | P1 | Core feature broken - fix this sprint |
| Medium | P2 | Partial functionality - fix next sprint |
| Low | P3 | Cosmetic issue - fix when convenient |

**Special Cases**:
- High severity, low priority: Edge case that rarely occurs
- Low severity, high priority: Typo on homepage before big launch

**The platypus says**: "Just because it's not broken doesn't mean it's not urgent. And just because it's broken doesn't mean anyone cares."

---

## Decision Tree

Use this flowchart to determine severity:

\`\`\`
Does it crash the app or lose data?
├─ YES → CRITICAL
└─ NO → Continue

Is a core feature completely unusable?
├─ YES → HIGH
└─ NO → Continue

Is there a workaround?
├─ NO → HIGH
├─ YES, but difficult → MEDIUM
└─ YES, easy → Continue

Is it just cosmetic or minor?
├─ YES → LOW
└─ NO → MEDIUM
\`\`\`

---

## Severity Assessment Checklist

When reporting a bug, ask yourself:

### Critical Checklist
- [ ] Does it crash the application?
- [ ] Does it cause data loss or corruption?
- [ ] Is there a security vulnerability?
- [ ] Can users not access the application at all?
- [ ] Is payment or critical business function broken?

**If ANY are YES → CRITICAL**

### High Checklist
- [ ] Is a core feature completely broken?
- [ ] Does it affect most users?
- [ ] Is there no reasonable workaround?
- [ ] Does it block other work?
- [ ] Is user frustration very high?

**If 3+ are YES → HIGH**

### Medium Checklist
- [ ] Is a feature partially broken?
- [ ] Does it affect some users?
- [ ] Is there a workaround (even if annoying)?
- [ ] Is it more than just cosmetic?
- [ ] Would users notice and complain?

**If 3+ are YES → MEDIUM**

### Low Checklist
- [ ] Is it purely cosmetic?
- [ ] Does it affect very few users?
- [ ] Is there an easy workaround?
- [ ] Would most users not notice?
- [ ] Is it a nice-to-have fix?

**If 3+ are YES → LOW**

---

## Common Mistakes

### Over-Severity
**Mistake**: Marking everything as Critical  
**Reality**: If everything is critical, nothing is  
**Platypus Says**: "Calm down. A typo is not the end of the world."

### Under-Severity
**Mistake**: Marking data loss as Low  
**Reality**: Users will riot  
**Platypus Says**: "If users lose their data, they lose their minds. This is Critical."

### Confusing Severity and Priority
**Mistake**: "It's not urgent, so it's Low severity"  
**Reality**: Severity is technical impact, priority is business urgency  
**Platypus Says**: "A critical bug in a feature nobody uses is still critical. It's just not urgent."

---

## Severity Examples by Feature

### API Playground
| Issue | Severity | Reasoning |
|-------|----------|-----------|
| All requests fail | Critical | Core feature completely broken |
| One preset doesn't work | Medium | Workaround: use other presets |
| Response time display wrong | Low | Doesn't affect functionality |
| Button color off | Low | Purely cosmetic |

### Bug Reporter
| Issue | Severity | Reasoning |
|-------|----------|-----------|
| Can't save any bugs | Critical | Core feature broken |
| Status update doesn't work | High | Major feature broken |
| Filter doesn't work | Medium | Workaround: scroll through list |
| Badge color wrong | Low | Cosmetic only |

### Analytics Dashboard
| Issue | Severity | Reasoning |
|-------|----------|-----------|
| Dashboard won't load | Critical | Feature completely broken |
| Charts show wrong data | High | Data integrity issue |
| Chart renders slowly | Medium | Performance issue with workaround |
| Legend text small | Low | Minor UI issue |

---

## Severity Escalation

When to escalate severity:

### Escalate UP if:
- Issue affects more users than initially thought
- Workaround doesn't actually work
- Business impact higher than expected
- Security implications discovered
- Data loss risk identified

### Escalate DOWN if:
- Easy workaround found
- Affects fewer users than thought
- Business impact minimal
- Fix is trivial

**The platypus says**: "Don't be afraid to change severity. New information means new assessment. Just don't cry wolf."

---

## Severity SLA (Service Level Agreement)

| Severity | Response Time | Resolution Time | Updates |
|----------|---------------|-----------------|---------|
| Critical | 1 hour | 24 hours | Every 2 hours |
| High | 4 hours | 3 days | Daily |
| Medium | 1 day | 7 days | Every 3 days |
| Low | 3 days | 14 days | Weekly |

**Note**: These are targets, not guarantees. The platypus understands that sometimes things take longer.

---

## Final Wisdom from the Platypus

"Severity is not about how much YOU care. It's about how much it BREAKS. 

A typo on the homepage is Low severity, even if the CEO is screaming. 
A data loss bug in a rarely-used feature is Critical, even if nobody's noticed yet.

Be honest. Be accurate. Be consistent. And for the love of APIs, don't mark everything as Critical just to get attention.

The platypus is watching. And judging."

---

**Document Version**: 1.0  
**Last Updated**: January 25, 2025  
**Reviewed By**: QA Team & The Platypus  
**Next Review**: Quarterly or when severity definitions need updating
