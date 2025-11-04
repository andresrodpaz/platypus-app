# Test Cases - Platypus QA Lab

## Test Case Format
- **TC-ID**: Unique test case identifier
- **Title**: Brief description
- **Priority**: Critical / High / Medium / Low
- **Type**: Functional / UI / Integration / E2E
- **Preconditions**: Setup required
- **Steps**: Detailed test steps
- **Expected Result**: What should happen
- **Actual Result**: What actually happened (filled during execution)
- **Status**: Pass / Fail / Blocked / Not Executed

---

## API Playground Test Cases

### TC-001: Send GET Request to Valid Endpoint
- **Priority**: Critical
- **Type**: Functional
- **Preconditions**: Application loaded, playground page accessible
- **Steps**:
  1. Navigate to /playground
  2. Select "GitHub User" preset
  3. Click "Send Request" button
  4. Wait for response
- **Expected Result**: 
  - Request completes successfully
  - Status code 200 displayed
  - Response time shown
  - JSON response formatted and displayed
  - Humorous comment generated
- **Status**: Not Executed

### TC-002: Send Request to Invalid URL
- **Priority**: High
- **Type**: Functional
- **Preconditions**: Application loaded
- **Steps**:
  1. Navigate to /playground
  2. Enter invalid URL: "not-a-valid-url"
  3. Click "Send Request"
- **Expected Result**: 
  - Error message displayed
  - No crash or undefined behavior
  - User can retry with valid URL
- **Status**: Not Executed

### TC-003: Test All Preset APIs
- **Priority**: High
- **Type**: Functional
- **Preconditions**: Application loaded
- **Steps**:
  1. Navigate to /playground
  2. Click each preset button (GitHub, Pokemon, Dog, NASA, JSONPlaceholder)
  3. Send request for each
  4. Verify responses
- **Expected Result**: 
  - All presets load correct URLs
  - All requests complete (may have different status codes)
  - Appropriate humorous comments generated for each
- **Status**: Not Executed

### TC-004: POST Request with JSON Body
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: Application loaded
- **Steps**:
  1. Navigate to /playground
  2. Select method "POST"
  3. Enter URL: "https://jsonplaceholder.typicode.com/posts"
  4. Enter body: `{"title": "Test", "body": "Content", "userId": 1}`
  5. Click "Send Request"
- **Expected Result**: 
  - Request sent with body
  - Status 201 received
  - Response includes created resource
- **Status**: Not Executed

### TC-005: Response Time Display
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: Application loaded
- **Steps**:
  1. Send any valid API request
  2. Check response time badge
- **Expected Result**: 
  - Response time displayed in milliseconds
  - Time is reasonable (< 10000ms)
  - Badge visible and formatted correctly
- **Status**: Not Executed

### TC-006: AI Analysis Generation
- **Priority**: High
- **Type**: Integration
- **Preconditions**: Application loaded
- **Steps**:
  1. Send API request
  2. Wait for AI analysis to appear
- **Expected Result**: 
  - AI analysis loads after response
  - Contains humorous comment
  - Includes technical note (if applicable)
  - Shows personality type
- **Status**: Not Executed

---

## Bug Reporter Test Cases

### TC-007: Create New Bug Report
- **Priority**: Critical
- **Type**: Functional
- **Preconditions**: Application loaded
- **Steps**:
  1. Navigate to /bugs
  2. Click "Report Bug" button
  3. Fill in all fields:
     - Title: "Test Bug"
     - Description: "This is a test bug"
     - Endpoint: "https://api.test.com/endpoint"
     - Severity: "High"
  4. Click "Submit Bug Report"
- **Expected Result**: 
  - Success message displayed
  - Dialog closes after 2 seconds
  - Bug appears in dashboard
  - Bug count incremented
- **Status**: Not Executed

### TC-008: Bug Report Validation
- **Priority**: High
- **Type**: Functional
- **Preconditions**: Bug report dialog open
- **Steps**:
  1. Click "Report Bug"
  2. Leave all fields empty
  3. Try to submit
- **Expected Result**: 
  - Form validation prevents submission
  - Required field indicators shown
  - User cannot submit incomplete form
- **Status**: Not Executed

### TC-009: Update Bug Status
- **Priority**: High
- **Type**: Functional
- **Preconditions**: At least one bug exists
- **Steps**:
  1. Navigate to /bugs
  2. Find a bug with status "Open"
  3. Click status dropdown
  4. Select "Fixed"
- **Expected Result**: 
  - Status updates immediately
  - Dashboard stats update
  - Bug moved to appropriate filter category
- **Status**: Not Executed

### TC-010: Delete Bug Report
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: At least one bug exists
- **Steps**:
  1. Navigate to /bugs
  2. Click delete icon on a bug
  3. Confirm deletion in dialog
- **Expected Result**: 
  - Confirmation dialog appears
  - Bug removed from list
  - Bug count decremented
  - Local storage updated
- **Status**: Not Executed

### TC-011: Filter Bugs by Severity
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: Multiple bugs with different severities exist
- **Steps**:
  1. Navigate to /bugs
  2. Select "Critical" from severity filter
- **Expected Result**: 
  - Only critical bugs displayed
  - Bug count reflects filtered results
  - Other bugs hidden
- **Status**: Not Executed

### TC-012: Filter Bugs by Status
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: Multiple bugs with different statuses exist
- **Steps**:
  1. Navigate to /bugs
  2. Select "Fixed" from status filter
- **Expected Result**: 
  - Only fixed bugs displayed
  - Filter works independently of severity filter
- **Status**: Not Executed

---

## Analytics Dashboard Test Cases

### TC-013: View Analytics with No Data
- **Priority**: Medium
- **Type**: UI
- **Preconditions**: Fresh application, no test data
- **Steps**:
  1. Navigate to /analytics
- **Expected Result**: 
  - Empty state messages displayed
  - No errors or crashes
  - Charts show "No data" placeholders
  - Humorous message about no tests
- **Status**: Not Executed

### TC-014: View Analytics with Test Data
- **Priority**: High
- **Type**: Functional
- **Preconditions**: Multiple API requests and bugs exist
- **Steps**:
  1. Create test data (send requests, report bugs)
  2. Navigate to /analytics
- **Expected Result**: 
  - All metrics display correct values
  - Charts render with data
  - Success rate calculated correctly
  - Humorous message reflects performance
- **Status**: Not Executed

### TC-015: Status Code Distribution Chart
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: Multiple API requests with different status codes
- **Steps**:
  1. Send requests with 200, 404, 500 responses
  2. Navigate to /analytics
  3. View pie chart
- **Expected Result**: 
  - Chart shows correct distribution
  - Percentages add up to 100%
  - Colors distinguish categories
  - Tooltip shows details on hover
- **Status**: Not Executed

### TC-016: Response Time Trend Chart
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: At least 10 API requests sent
- **Steps**:
  1. Navigate to /analytics
  2. View line chart
- **Expected Result**: 
  - Chart shows last 10 requests
  - Response times plotted correctly
  - X-axis shows test numbers
  - Y-axis shows time in ms
- **Status**: Not Executed

---

## UI/UX Test Cases

### TC-017: Navigation Between Pages
- **Priority**: High
- **Type**: UI
- **Preconditions**: Application loaded
- **Steps**:
  1. Click each navigation link
  2. Verify page loads
  3. Check active state highlighting
- **Expected Result**: 
  - All pages accessible
  - Active page highlighted in nav
  - No broken links
  - Smooth transitions
- **Status**: Not Executed

### TC-018: Dark Mode Toggle
- **Priority**: Medium
- **Type**: UI
- **Preconditions**: Application loaded
- **Steps**:
  1. Click theme toggle button
  2. Verify dark mode applied
  3. Toggle back to light mode
- **Expected Result**: 
  - Theme switches smoothly
  - All colors update correctly
  - No contrast issues
  - Preference persists on reload
- **Status**: Not Executed

### TC-019: Responsive Design - Mobile
- **Priority**: High
- **Type**: UI
- **Preconditions**: Application loaded on mobile viewport (375x667)
- **Steps**:
  1. Resize browser to mobile size
  2. Navigate through all pages
  3. Test all interactions
- **Expected Result**: 
  - Layout adapts to mobile
  - All features accessible
  - No horizontal scroll
  - Touch targets adequate size
- **Status**: Not Executed

### TC-020: Responsive Design - Tablet
- **Priority**: Medium
- **Type**: UI
- **Preconditions**: Application loaded on tablet viewport (768x1024)
- **Steps**:
  1. Resize browser to tablet size
  2. Navigate through all pages
- **Expected Result**: 
  - Layout uses tablet breakpoints
  - Content readable and accessible
  - Charts render appropriately
- **Status**: Not Executed

---

## Data Persistence Test Cases

### TC-021: Local Storage - Save Request
- **Priority**: Critical
- **Type**: Integration
- **Preconditions**: Application loaded
- **Steps**:
  1. Send API request
  2. Open browser DevTools
  3. Check localStorage
- **Expected Result**: 
  - Request saved to localStorage
  - Data structure correct
  - Timestamp included
- **Status**: Not Executed

### TC-022: Local Storage - Retrieve Requests
- **Priority**: Critical
- **Type**: Integration
- **Preconditions**: Requests exist in localStorage
- **Steps**:
  1. Reload application
  2. Navigate to /analytics
- **Expected Result**: 
  - Previous requests loaded
  - Analytics reflect saved data
  - No data loss
- **Status**: Not Executed

### TC-023: Local Storage - 100 Request Limit
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: Application loaded
- **Steps**:
  1. Send 101 API requests
  2. Check localStorage
- **Expected Result**: 
  - Only last 100 requests stored
  - Oldest request removed
  - No storage overflow errors
- **Status**: Not Executed

---

## Error Handling Test Cases

### TC-024: Network Error Handling
- **Priority**: High
- **Type**: Functional
- **Preconditions**: Application loaded, network disabled
- **Steps**:
  1. Disable network connection
  2. Try to send API request
- **Expected Result**: 
  - Error message displayed
  - User informed of network issue
  - Application remains stable
- **Status**: Not Executed

### TC-025: CORS Error Handling
- **Priority**: Medium
- **Type**: Functional
- **Preconditions**: Application loaded
- **Steps**:
  1. Enter URL that blocks CORS
  2. Send request
- **Expected Result**: 
  - CORS error caught
  - User-friendly error message
  - Suggestion to use CORS-enabled APIs
- **Status**: Not Executed

---

## Performance Test Cases

### TC-026: Page Load Time
- **Priority**: Medium
- **Type**: Performance
- **Preconditions**: Production build
- **Steps**:
  1. Clear cache
  2. Load application
  3. Measure time to interactive
- **Expected Result**: 
  - Page loads in < 3 seconds
  - No blocking resources
  - Smooth rendering
- **Status**: Not Executed

### TC-027: Chart Rendering Performance
- **Priority**: Low
- **Type**: Performance
- **Preconditions**: 100 requests in storage
- **Steps**:
  1. Navigate to /analytics
  2. Measure chart render time
- **Expected Result**: 
  - Charts render in < 1 second
  - No UI freezing
  - Smooth animations
- **Status**: Not Executed

---

**Total Test Cases**: 27
**Critical**: 5 | **High**: 9 | **Medium**: 12 | **Low**: 1

**The platypus has reviewed these test cases and finds them... acceptable. Barely.**
