# AI Presentation Generator - Chrome Extension

A Chrome extension that converts webpage content into structured presentations using AI, built with React/Next.js.

## Features

- **Webpage Content Extraction**: Automatically extracts meaningful content from web pages
- **AI-Powered Generation**: Uses Hugging Face API to generate structured presentations
- **React/Next.js UI**: Modern popup interface with easy-to-use controls
- **MCP Server Integration**: Includes a Model Context Protocol server for additional AI integration
- **Chrome Extension v3**: Built with Manifest V3 for modern browser compatibility

## Output Format

Generates presentations in clean Markdown format:

```
# Slide 1 — Title
- Key point 1
- Key point 2
Notes: Explanation of the slide content.

# Slide 2 — Overview
- Additional points
- More details
Notes: Speaker notes for presentation.
```

## Installation

### Chrome Extension

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this project directory
5. The extension icon should appear in the toolbar

### MCP Server (for Cline integration)

The project includes an MCP server that can be used with Cline or other MCP-compatible clients.

1. Navigate to the MCP server directory: `cd /Users/etelligens/Documents/Cline/MCP/presentation-generator`
2. Build the server: `npm run build`
3. The server is already configured in Cline settings

## Usage

1. Click the extension icon while on any webpage
2. Choose "From URL" tab to extract content from the current page, or "Paste Content" to input custom text
3. Click "Extract from Current Page" to get webpage content
4. Click "Generate Presentation" to create the AI-powered presentation
5. Copy the generated Markdown using the "Copy to Clipboard" button

## Architecture

- **Extension Popup**: Built with Next.js and React, statically exported for extension compatibility
- **Content Script**: Extracts webpage content by removing ads/navigation and focusing on main content
- **Background Script**: Handles extension lifecycle
- **MCP Server**: Provides AI presentation generation tool using Hugging Face free inference API
- **AI Model**: Uses `google/flan-t5-large` via Hugging Face Inference API (free, no API key required)

## Development

### Building the Extension

```bash
# Build the Next.js popup
cd extension-popup
npm run build

# Copy built files to root
cd ..
cp extension-popup/out/index.html popup.html
cp -r extension-popup/out/_next next-assets

# Update paths in popup.html
sed -i '' 's|/_next/|/next-assets/|g' popup.html
```

### Building the MCP Server

```bash
cd /Users/etelligens/Documents/Cline/MCP/presentation-generator
npm install
npm run build
```

## Permissions

The extension requires:
- `activeTab`: Access current tab for content extraction
- `storage`: Store user preferences
- `scripting`: Execute content extraction scripts
- `host_permissions`: Access Hugging Face API

## Notes

- Uses free AI resources (Hugging Face), may have rate limits
- Content Security Policy allows inline scripts for Next.js compatibility
- Built for Chrome Manifest V3
- MCP server provides additional integration options

## License

MIT License
