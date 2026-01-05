// Content script to extract webpage content for presentation generation

function extractWebpageContent() {
  // Remove scripts, styles, and other irrelevant elements
  const clonedDoc = document.cloneNode(true);

  // Remove unwanted elements
  const selectorsToRemove = [
    'script', 'style', 'nav', 'header', 'footer', 'aside',
    '.sidebar', '.menu', '.navigation', '.footer', '.ads',
    '.advertisement', '.popup', '.modal', '[role="banner"]',
    '[role="navigation"]', '[role="complementary"]'
  ];

  selectorsToRemove.forEach(selector => {
    const elements = clonedDoc.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  // Extract main content
  let content = '';

  // Try to find main content areas
  const mainSelectors = [
    'main', 'article', '.content', '.post', '.entry',
    '[role="main"]', '.main-content', '#content', '#main'
  ];

  for (const selector of mainSelectors) {
    const element = clonedDoc.querySelector(selector);
    if (element && element.textContent.trim().length > 100) {
      content = element.textContent.trim();
      break;
    }
  }

  // Fallback to body if no main content found
  if (!content) {
    const body = clonedDoc.querySelector('body');
    if (body) {
      content = body.textContent.trim();
    }
  }

  // Clean up the content
  content = content
    .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
    .replace(/[\n\r]+/g, ' ')  // Replace newlines with space
    .trim();

  // Limit length for API
  return content.substring(0, 5000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractWebpageContent();
    sendResponse({ content: content });
  }
});
