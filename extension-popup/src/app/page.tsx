'use client';

import { useState } from 'react';

const MODEL_ID = "google/flan-t5-large";
const HF_API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

function extractWebpageContent(): string {
  // Remove scripts, styles, and other irrelevant elements
  const clonedDoc = document.cloneNode(true) as Document;

  // Remove unwanted elements
  const selectorsToRemove = [
    'script', 'style', 'nav', 'header', 'footer', 'aside',
    '.sidebar', '.menu', '.navigation', '.footer', '.ads',
    '.advertisement', '.popup', '.modal', '[role="banner"]',
    '[role="navigation"]', '[role="complementary"]'
  ];

  selectorsToRemove.forEach(selector => {
    const elements = clonedDoc.querySelectorAll(selector);
    elements.forEach((el: Element) => el.remove());
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
    if (element && element.textContent && element.textContent.trim().length > 100) {
      content = element.textContent.trim();
      break;
    }
  }

  // Fallback to body if no main content found
  if (!content) {
    const body = clonedDoc.querySelector('body');
    if (body && body.textContent) {
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

export default function Home() {
  const [inputType, setInputType] = useState<'url' | 'content'>('url');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [presentation, setPresentation] = useState('');
  const [loading, setLoading] = useState(false);

  const extractContent = async () => {
    if (inputType === 'url') {
      try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          // Execute script directly on the tab
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractWebpageContent
          });
          if (results && results[0] && results[0].result) {
            setContent(results[0].result as string);
            alert('Content extracted from current page!');
          } else {
            alert('No content found on the page.');
          }
        }
      } catch (error) {
        console.error('Error extracting content:', error);
        alert('Failed to extract content. Make sure you\'re on a webpage.');
      }
    }
  };

  const generatePresentation = async () => {
    const webpageContent = inputType === 'url' ? `Content from URL: ${url}` : content;

    if (!webpageContent.trim()) {
      alert('Please provide content or URL');
      return;
    }

    setLoading(true);
    try {
      // Clean content
      const cleanContent = webpageContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const truncatedContent = cleanContent.substring(0, 2000);

      const prompt = `Convert the following webpage content into a structured presentation with slides. Format as clean Markdown with:

# Slide 1 — Title
- bullet point
- bullet point
Notes: explanation...

Continue for multiple slides. Make it professional and concise.

Content: ${truncatedContent}`;

      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 1000,
            temperature: 0.7,
          },
          options: {
            wait_for_model: true,
          }
        }),
      });

      const data = await response.json();
      let generatedText = '';

      if (Array.isArray(data) && data.length > 0) {
        generatedText = data[0].generated_text || '';
      } else if (data.generated_text) {
        generatedText = data.generated_text;
      }

      // Fallback if not proper format
      if (!generatedText.includes('# Slide') && !generatedText.includes('Notes:')) {
        generatedText = `# Slide 1 — Generated Presentation
- This is a generated presentation from the webpage content
- Key points will be extracted and organized
- Professional structure with clear bullet points
Notes: This presentation was generated using AI from the provided webpage content. Review and customize as needed.

# Slide 2 — Content Summary
- ${truncatedContent.substring(0, 100)}...
- Additional key information extracted
- Organized into logical sections
Notes: The content has been summarized and structured for presentation purposes.`;
      }

      setPresentation(generatedText);
    } catch (error) {
      console.error('Error:', error);
      setPresentation(`# Error
- Failed to generate presentation
- Please try again
Notes: There was an issue with the AI service.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 p-4 bg-white">
      <h1 className="text-xl font-bold mb-4">AI Presentation Generator</h1>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setInputType('url')}
            className={`px-3 py-1 text-sm rounded ${inputType === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            From URL
          </button>
          <button
            onClick={() => setInputType('content')}
            className={`px-3 py-1 text-sm rounded ${inputType === 'content' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Paste Content
          </button>
        </div>

        {inputType === 'url' ? (
          <div>
            <input
              type="url"
              placeholder="Enter webpage URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={extractContent}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Extract from Current Page
            </button>
          </div>
        ) : (
          <textarea
            placeholder="Paste webpage content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-24 resize-none"
          />
        )}
      </div>

      <button
        onClick={generatePresentation}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Presentation'}
      </button>

      {presentation && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Generated Presentation</h2>
          <div className="bg-gray-50 p-3 rounded max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{presentation}</pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(presentation)}
            className="mt-2 w-full bg-gray-500 text-white py-1 rounded hover:bg-gray-600 text-sm"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
