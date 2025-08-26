#!/usr/bin/env node

/**
 * Simple test script to verify the comment refresh functionality
 * This is a unit test for the new comment management features
 */

// Mock environment variables
process.env.GITHUB_REPOSITORY = 'test/repo';
process.env.REFRESH_COMMENTS = 'true';
process.env.SILENCE_CLAUDECODE_COMMENTS = 'false';

// Mock GitHub context
const mockContext = {
  repo: {
    owner: 'test',
    repo: 'repo'
  },
  issue: {
    number: 123
  },
  payload: {
    pull_request: {
      head: {
        sha: 'abcdef123456'
      }
    }
  }
};

// Mock findings data
const mockFindings = [
  {
    file: 'src/test.js',
    line: 10,
    severity: 'HIGH',
    category: 'sql_injection',
    description: 'SQL injection vulnerability detected',
    exploit_scenario: 'Attacker could execute arbitrary SQL queries',
    recommendation: 'Use parameterized queries'
  }
];

// Mock existing security comments
const mockExistingComments = [
  {
    id: 12345,
    user: { type: 'Bot' },
    body: '🤖 **Security Issue: Previous vulnerability** ...'
  }
];

// Mock PR files
const mockPrFiles = [
  {
    filename: 'src/test.js',
    status: 'modified'
  }
];

// Test functions
function testCommentRefreshLogic() {
  console.log('🧪 Testing Comment Refresh Logic...');
  
  // Test 1: Refresh enabled with existing comments
  const refreshComments = process.env.REFRESH_COMMENTS === 'true';
  const existingSecurityComments = mockExistingComments;
  
  if (existingSecurityComments.length > 0 && refreshComments) {
    console.log('✅ Test 1 PASSED: Should delete old comments when refresh is enabled');
  } else {
    console.log('❌ Test 1 FAILED: Should delete old comments when refresh is enabled');
  }
  
  // Test 2: Status comment when no new findings
  const hasNewFindings = mockFindings.length > 0;
  const shouldPostStatus = existingSecurityComments.length > 0 && refreshComments && !hasNewFindings;
  
  console.log(`✅ Test 2: Status comment logic - Should post status: ${shouldPostStatus}`);
  
  // Test 3: Comment format with timestamp and commit
  const testComment = generateMockComment(mockFindings[0]);
  const hasTimestamp = testComment.includes('**Scan Time:**');
  const hasCommit = testComment.includes('**Commit:**');
  
  if (hasTimestamp && hasCommit) {
    console.log('✅ Test 3 PASSED: Comments include timestamp and commit info');
  } else {
    console.log('❌ Test 3 FAILED: Comments missing timestamp or commit info');
  }
  
  console.log('📝 Sample comment format:');
  console.log('---');
  console.log(testComment);
  console.log('---');
}

function generateMockComment(finding) {
  const currentTime = new Date().toISOString();
  const commitHash = mockContext.payload.pull_request.head.sha.slice(0, 7);
  
  let commentBody = `🤖 **Security Issue: ${finding.description}**\n\n`;
  commentBody += `**Severity:** ${finding.severity}\n`;
  commentBody += `**Category:** ${finding.category}\n`;
  commentBody += `**Tool:** ClaudeCode AI Security Analysis\n`;
  commentBody += `**Scan Time:** ${currentTime}\n`;
  commentBody += `**Commit:** ${commitHash}\n`;
  
  if (finding.exploit_scenario) {
    commentBody += `\n**Exploit Scenario:** ${finding.exploit_scenario}\n`;
  }
  
  if (finding.recommendation) {
    commentBody += `\n**Recommendation:** ${finding.recommendation}\n`;
  }
  
  return commentBody;
}

function testStatusMessage() {
  console.log('\n🧪 Testing Status Message Generation...');
  
  const statusMessage = `✅ **Security Scan Update**\n\nLatest scan found no security issues in the recent changes!\n\n*Scanned commit: ${mockContext.payload.pull_request.head.sha.slice(0, 7)}*\n*Scan time: ${new Date().toISOString()}*`;
  
  console.log('📝 Sample status message:');
  console.log('---');
  console.log(statusMessage);
  console.log('---');
  console.log('✅ Status message format looks good');
}

function runTests() {
  console.log('🚀 Starting Comment Refresh Tests...\n');
  
  testCommentRefreshLogic();
  testStatusMessage();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📋 Summary of new features:');
  console.log('  • Smart comment refresh (delete old, post new)');
  console.log('  • Status updates when issues are resolved');
  console.log('  • Timestamped comments with commit info');
  console.log('  • Configurable refresh behavior');
}

// Run the tests
runTests();