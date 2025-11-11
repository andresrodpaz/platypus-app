# Test Cases for Platypus QA Lab 🧪

Hey there! Welcome to our test case documentation. We've organized everything to make testing smooth and straightforward. Each test case follows a simple structure so you always know what to expect.

## How to Read These Test Cases

Each test includes:
- **ID & Title**: Quick reference for what we're testing
- **Priority**: How critical this is (Critical → High → Medium → Low)
- **Type**: What kind of test (Functional, UI, Integration, etc.)
- **What you need first**: Any setup before you start
- **Steps**: What to do, broken down clearly
- **What should happen**: Expected results
- **Status**: Track your progress as you test

---

## 🎮 API Playground Tests

### TC-001: Send a GET Request to a Valid Endpoint
**Priority**: Critical | **Type**: Functional

**Before you start**: Make sure the app is loaded and you can access the playground page.

**Here's what to do**:
1. Head over to the /playground page
2. Click on the "GitHub User" preset button
3. Hit that "Send Request" button
4. Sit back and wait for the magic to happen

**What you should see**: 
- The request completes without any issues
- A status code of 200 pops up
- Response time is displayed
- The JSON response looks nice and formatted
- You get a fun, humorous comment about the response

**Status**: ✅ **PASS** - Everything worked perfectly!

---

### TC-002: Try Sending a Request to an Invalid URL
**Priority**: High | **Type**: Functional

**Before you start**: Just have the app loaded and ready.

**Here's what to do**:
1. Navigate to /playground
2. Type in something clearly wrong like "not-a-valid-url"
3. Click "Send Request" and see what happens

**What you should see**: 
- A friendly error message appears (no crashes!)
- The app handles it gracefully
- You can easily try again with a proper URL

**Status**: ✅ **PASS** - Error handling works great!

---

### TC-003: Test All the Preset APIs
**Priority**: High | **Type**: Functional

**Before you start**: App loaded and ready to go.

**Here's what to do**:
1. Go to /playground
2. Click through each preset button one by one (GitHub, Pokemon, Dog, NASA, JSONPlaceholder)
3. Send a request for each one
4. Check out the responses

**What you should see**: 
- Each preset loads up the right URL
- All requests complete successfully (though status codes might vary)
- Each response gets its own witty comment

**Status**: ✅ **PASS** - All presets work beautifully!

---

### TC-004: Send a POST Request with JSON Data
**Priority**: Medium | **Type**: Functional

**Before you start**: App is loaded.

**Here's what to do**:
1. Navigate to /playground
2. Change the method to "POST"
3. Enter this URL: "https://jsonplaceholder.typicode.com/posts"
4. In the body field, paste: `{"title": "Test", "body": "Content", "userId": 1}`
5. Click "Send Request"

**What you should see**: 
- Your request goes through with the JSON body
- Status 201 comes back (that's "created"!)
- The response shows your newly created resource

**Status**: ✅ **PASS** - POST request sent successfully!

---

### TC-005: Check the Response Time Display
**Priority**: Medium | **Type**: Functional

**Before you start**: App loaded.

**Here's what to do**:
1. Send any valid API request
2. Look for the response time badge

**What you should see**: 
- Response time shows up in milliseconds
- The number makes sense (under 10 seconds)
- The badge looks good and is easy to read

**Status**: ✅ **PASS** - Response time displays correctly!

---

### TC-006: Watch the AI Analysis Work Its Magic
**Priority**: High | **Type**: Integration

**Before you start**: App loaded.

**Here's what to do**:
1. Send an API request
2. Wait a moment for the AI analysis to show up

**What you should see**: 
- AI analysis appears after the response loads
- There's a humorous comment (because why not?)
- Technical notes are included when relevant
- Shows the personality type of the response

**Status**: ✅ **PASS** - AI analysis working perfectly!

---

## 🐛 Bug Reporter Tests

### TC-007: Create Your First Bug Report
**Priority**: Critical | **Type**: Functional

**Before you start**: App is loaded and ready.

**Here's what to do**:
1. Navigate to /bugs
2. Click the "Report Bug" button
3. Fill everything out:
   - Title: "Test Bug"
   - Description: "This is a test bug"
   - Endpoint: "https://api.test.com/endpoint"
   - Severity: "High"
4. Click "Submit Bug Report"

**What you should see**: 
- A nice success message pops up
- The dialog closes automatically after a couple seconds
- Your bug shows up in the dashboard
- The bug counter goes up by one

**Status**: ✅ **PASS** - Bug creation works flawlessly!

---

### TC-008: Try Submitting an Empty Bug Report
**Priority**: High | **Type**: Functional

**Before you start**: Open the bug report dialog.

**Here's what to do**:
1. Click "Report Bug"
2. Don't fill in anything
3. Try to submit it anyway

**What you should see**: 
- Form validation stops you from submitting
- Required fields are clearly marked
- You can't submit until everything's filled in

**Status**: ✅ **PASS** - Validation working as expected!

---

### TC-009: Update a Bug's Status
**Priority**: High | **Type**: Functional

**Before you start**: Make sure you have at least one bug already created.

**Here's what to do**:
1. Go to /bugs
2. Find a bug that's marked as "Open"
3. Click on its status dropdown
4. Select "Fixed"

**What you should see**: 
- Status updates right away
- Dashboard statistics refresh
- The bug moves to the right filter category

**Status**: ✅ **PASS** - Status updates work smoothly!

---

### TC-010: Delete a Bug Report
**Priority**: Medium | **Type**: Functional

**Before you start**: Have at least one bug in the system.

**Here's what to do**:
1. Navigate to /bugs
2. Click the delete icon on any bug
3. Confirm you really want to delete it

**What you should see**: 
- A confirmation dialog asks if you're sure
- The bug disappears from the list
- Bug count goes down
- Changes are saved to local storage

**Status**: ✅ **PASS** - Deletion works perfectly!

---

### TC-011: Filter Bugs by Severity
**Priority**: Medium | **Type**: Functional

**Before you start**: Create several bugs with different severity levels.

**Here's what to do**:
1. Navigate to /bugs
2. Use the severity filter and select "Critical"

**What you should see**: 
- Only critical bugs show up in the list
- The count reflects the filtered results
- Other bugs are hidden but not deleted

**Status**: ✅ **PASS** - Severity filter working great!

---

### TC-012: Filter Bugs by Status
**Priority**: Medium | **Type**: Functional

**Before you start**: Have bugs with various statuses (Open, Fixed, etc.).

**Here's what to do**:
1. Go to /bugs
2. Select "Fixed" from the status filter

**What you should see**: 
- Only fixed bugs appear
- This filter works independently from the severity filter
- You can combine both filters if needed

**Status**: ✅ **PASS** - Status filter works independently!

---

## 📊 Analytics Dashboard Tests

### TC-013: View Analytics with No Test Data
**Priority**: Medium | **Type**: UI

**Before you start**: Fresh app with no test data created yet.

**Here's what to do**:
1. Navigate to /analytics

**What you should see**: 
- Friendly empty state messages
- No crashes or weird errors
- Charts show helpful "No data" placeholders
- Maybe a funny message about not having run any tests yet

**Status**: ✅ **PASS** - Empty state looks good!

---

### TC-014: View Analytics with Real Data
**Priority**: High | **Type**: Functional

**Before you start**: Create some test data first (send requests, report bugs).

**Here's what to do**:
1. Generate test data by sending requests and creating bugs
2. Navigate to /analytics

**What you should see**: 
- All metrics show accurate values
- Charts render beautifully with your data
- Success rate is calculated correctly
- A humorous message that reflects your testing performance

**Status**: ✅ **PASS** - Analytics display correctly!

---

### TC-015: Check the Status Code Distribution Chart
**Priority**: Medium | **Type**: Functional

**Before you start**: Send requests that return different status codes.

**Here's what to do**:
1. Send some requests with 200, 404, and 500 responses
2. Go to /analytics
3. Look at the pie chart

**What you should see**: 
- Chart accurately shows the distribution
- Percentages total 100%
- Different colors for different categories
- Hovering shows detailed tooltips

**Status**: ✅ **PASS** - Pie chart renders perfectly!

---

### TC-016: Check the Response Time Trend Chart
**Priority**: Medium | **Type**: Functional

**Before you start**: Send at least 10 API requests.

**Here's what to do**:
1. Navigate to /analytics
2. Check out the line chart

**What you should see**: 
- Chart displays your last 10 requests
- Response times are plotted accurately
- X-axis shows test numbers
- Y-axis shows time in milliseconds

**Status**: ✅ **PASS** - Trend chart working great!

---

## 🎨 UI/UX Tests

### TC-017: Navigate Around the App
**Priority**: High | **Type**: UI

**Before you start**: App is loaded.

**Here's what to do**:
1. Click each navigation link
2. Make sure each page loads properly
3. Check that the active page is highlighted

**What you should see**: 
- All pages are accessible
- Current page is clearly highlighted in the nav
- No broken links anywhere
- Smooth, pleasant transitions between pages

**Status**: ✅ **PASS** - Navigation works smoothly!

---

### TC-018: Toggle Between Light and Dark Mode
**Priority**: Medium | **Type**: UI

**Before you start**: App is loaded.

**Here's what to do**:
1. Click the theme toggle button
2. Check that dark mode applies correctly
3. Toggle back to light mode

**What you should see**: 
- Theme switches smoothly without flashing
- All colors update properly
- Text remains readable (good contrast)
- Your preference is remembered when you reload

**Status**: ✅ **PASS** - Theme toggle works perfectly!

---

### TC-019: Test on Mobile Screens
**Priority**: High | **Type**: UI

**Before you start**: Load the app in a mobile viewport (375x667 pixels).

**Here's what to do**:
1. Resize your browser to mobile size
2. Navigate through all the pages
3. Try out all the interactive features

**What you should see**: 
- Layout adapts nicely to mobile
- Everything is still accessible
- No annoying horizontal scrolling
- Buttons and links are easy to tap

**Status**: ✅ **PASS** - Mobile responsive design looks great!

---

### TC-020: Test on Tablet Screens
**Priority**: Medium | **Type**: UI

**Before you start**: Load the app in a tablet viewport (768x1024 pixels).

**Here's what to do**:
1. Resize your browser to tablet size
2. Navigate through all pages

**What you should see**: 
- Layout uses appropriate tablet breakpoints
- Content is readable and well-organized
- Charts render at a good size

**Status**: ✅ **PASS** - Tablet view working well!

---

## 💾 Data Persistence Tests

### TC-021: Check Local Storage After Sending a Request
**Priority**: Critical | **Type**: Integration

**Before you start**: App is loaded.

**Here's what to do**:
1. Send an API request
2. Open your browser's DevTools
3. Look at the localStorage

**What you should see**: 
- Your request is saved to localStorage
- Data structure looks correct
- Timestamp is included

**Status**: ✅ **PASS** - Data persists correctly!

---

### TC-022: Reload and Check If Data Persists
**Priority**: Critical | **Type**: Integration

**Before you start**: Have some requests already stored in localStorage.

**Here's what to do**:
1. Reload the entire application
2. Go to /analytics

**What you should see**: 
- All your previous requests load back
- Analytics show the saved data
- Nothing gets lost in the reload

**Status**: ✅ **PASS** - Data survives reload!

---

### TC-023: Test the 100 Request Limit
**Priority**: Medium | **Type**: Functional

**Before you start**: App is loaded.

**Here's what to do**:
1. Send 101 API requests (yeah, it's a lot!)
2. Check localStorage

**What you should see**: 
- Only the last 100 requests are stored
- The oldest one gets removed automatically
- No storage overflow errors pop up

**Status**: ✅ **PASS** - Storage limit works as expected!

---

## ⚠️ Error Handling Tests

### TC-024: What Happens When Network Is Down
**Priority**: High | **Type**: Functional

**Before you start**: App loaded, then disable your network connection.

**Here's what to do**:
1. Turn off your network connection
2. Try to send an API request

**What you should see**: 
- A clear error message appears
- You're informed about the network issue
- The app doesn't crash or freeze

**Status**: ✅ **PASS** - Network error handled gracefully!

---

### TC-025: Handle CORS Errors Gracefully
**Priority**: Medium | **Type**: Functional

**Before you start**: App is loaded.

**Here's what to do**:
1. Enter a URL that will trigger a CORS error
2. Send the request

**What you should see**: 
- CORS error is caught properly
- You get a user-friendly error message
- Maybe a helpful suggestion to use CORS-enabled APIs

**Status**: ✅ **PASS** - CORS errors handled well!

---

## ⚡ Performance Tests

### TC-026: Measure Page Load Time
**Priority**: Medium | **Type**: Performance

**Before you start**: Use a production build of the app.

**Here's what to do**:
1. Clear your browser cache
2. Load the application
3. Measure how long until it's fully interactive

**What you should see**: 
- Page loads in under 3 seconds
- No resources blocking the load
- Smooth, seamless rendering

**Status**: ✅ **PASS** - Load time is excellent!

---

### TC-027: Check Chart Rendering Speed
**Priority**: Low | **Type**: Performance

**Before you start**: Have 100 requests stored.

**Here's what to do**:
1. Navigate to /analytics
2. Time how long it takes for charts to render

**What you should see**: 
- Charts appear in under 1 second
- No UI freezing or stuttering
- Animations are smooth

**Status**: ✅ **PASS** - Charts render quickly!

---

## 📈 Test Execution Summary

**Total Test Cases**: 27  
**Executed**: 27 (100%)  
**Passed**: ✅ 27  
**Failed**: ❌ 0  
**Blocked**: 🚫 0

### Breakdown by Priority:
- 🔴 **Critical**: 5/5 passed
- 🟠 **High**: 9/9 passed
- 🟡 **Medium**: 12/12 passed
- 🟢 **Low**: 1/1 passed

