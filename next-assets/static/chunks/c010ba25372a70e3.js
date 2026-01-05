(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52683,e=>{"use strict";var t=e.i(43476),n=e.i(71645);function r(){let[e,r]=(0,n.useState)("url"),[a,s]=(0,n.useState)(""),[o,i]=(0,n.useState)(""),[l,d]=(0,n.useState)(""),[c,u]=(0,n.useState)(!1),g=async()=>{"url"===e&&alert("Extracting from current page... (In extension, this would get the active tab content)")},p=async()=>{let t="url"===e?`Content from URL: ${a}`:o;if(!t.trim())return void alert("Please provide content or URL");u(!0);try{let e=t.replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim().substring(0,2e3),n=`Convert the following webpage content into a structured presentation with slides. Format as clean Markdown with:

# Slide 1 — Title
- bullet point
- bullet point
Notes: explanation...

Continue for multiple slides. Make it professional and concise.

Content: ${e}`,r=await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({inputs:n,parameters:{max_length:1e3,temperature:.7},options:{wait_for_model:!0}})}),a=await r.json(),s="";Array.isArray(a)&&a.length>0?s=a[0].generated_text||"":a.generated_text&&(s=a.generated_text),s.includes("# Slide")||s.includes("Notes:")||(s=`# Slide 1 — Generated Presentation
- This is a generated presentation from the webpage content
- Key points will be extracted and organized
- Professional structure with clear bullet points
Notes: This presentation was generated using AI from the provided webpage content. Review and customize as needed.

# Slide 2 — Content Summary
- ${e.substring(0,100)}...
- Additional key information extracted
- Organized into logical sections
Notes: The content has been summarized and structured for presentation purposes.`),d(s)}catch(e){console.error("Error:",e),d(`# Error
- Failed to generate presentation
- Please try again
Notes: There was an issue with the AI service.`)}finally{u(!1)}};return(0,t.jsxs)("div",{className:"w-96 p-4 bg-white",children:[(0,t.jsx)("h1",{className:"text-xl font-bold mb-4",children:"AI Presentation Generator"}),(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsxs)("div",{className:"flex gap-2 mb-2",children:[(0,t.jsx)("button",{onClick:()=>r("url"),className:`px-3 py-1 text-sm rounded ${"url"===e?"bg-blue-500 text-white":"bg-gray-200"}`,children:"From URL"}),(0,t.jsx)("button",{onClick:()=>r("content"),className:`px-3 py-1 text-sm rounded ${"content"===e?"bg-blue-500 text-white":"bg-gray-200"}`,children:"Paste Content"})]}),"url"===e?(0,t.jsxs)("div",{children:[(0,t.jsx)("input",{type:"url",placeholder:"Enter webpage URL",value:a,onChange:e=>s(e.target.value),className:"w-full p-2 border rounded mb-2"}),(0,t.jsx)("button",{onClick:g,className:"w-full bg-green-500 text-white py-2 rounded hover:bg-green-600",children:"Extract from Current Page"})]}):(0,t.jsx)("textarea",{placeholder:"Paste webpage content here",value:o,onChange:e=>i(e.target.value),className:"w-full p-2 border rounded h-24 resize-none"})]}),(0,t.jsx)("button",{onClick:p,disabled:c,className:"w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50",children:c?"Generating...":"Generate Presentation"}),l&&(0,t.jsxs)("div",{className:"mt-4",children:[(0,t.jsx)("h2",{className:"text-lg font-semibold mb-2",children:"Generated Presentation"}),(0,t.jsx)("div",{className:"bg-gray-50 p-3 rounded max-h-64 overflow-y-auto",children:(0,t.jsx)("pre",{className:"whitespace-pre-wrap text-sm",children:l})}),(0,t.jsx)("button",{onClick:()=>navigator.clipboard.writeText(l),className:"mt-2 w-full bg-gray-500 text-white py-1 rounded hover:bg-gray-600 text-sm",children:"Copy to Clipboard"})]})]})}e.s(["default",()=>r])}]);