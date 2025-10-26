# Quick Start Guide - AI-Powered PDF Query Assistant

## 🚀 Live Application

**Access the app here**: [https://agentic-a3b9d052.vercel.app](https://agentic-a3b9d052.vercel.app)

## ⚠️ Important Setup Note

To use the application, you need to configure an OpenAI API key. The application requires this to generate embeddings for semantic search.

### Option 1: Use the Deployed Version (Requires Admin)
The Vercel deployment needs the `OPENAI_API_KEY` environment variable to be set in the project settings.

### Option 2: Run Locally (Recommended for Testing)

1. **Clone and Install**
```bash
git clone <repository-url>
cd pdf-query-assistant
npm install
```

2. **Add Your OpenAI API Key**
```bash
# Create .env.local file
echo "OPENAI_API_KEY=sk-your-key-here" > .env.local
```

3. **Run the Application**
```bash
npm run dev
```

4. **Open in Browser**
Navigate to http://localhost:3000

## 📖 How to Use

### Step 1: Upload a PDF
1. Open the application
2. Drag and drop a PDF file or click to browse
3. Select a PDF (max 50MB, 20+ pages work great)
4. Click "Upload and Process"
5. Wait a few seconds for processing

### Step 2: Ask Questions
1. Type your question in the search box
2. Click "Search" or press Enter
3. View results with:
   - Exact text from the PDF
   - Page number where it was found
   - Relevance score
   - Surrounding context

### Example Questions to Try

**For Academic Papers:**
- "What is the main hypothesis?"
- "Describe the methodology"
- "What were the key findings?"
- "Define [specific term]"

**For Technical Documents:**
- "How do I configure the system?"
- "What are the prerequisites?"
- "Explain the algorithm"
- "What are the performance metrics?"

**For Lecture Notes:**
- "What is photosynthesis?"
- "Explain Newton's laws"
- "Define recursion"
- "What are the key points about [topic]?"

## 🎯 Tips for Best Results

1. **Be Specific**: The more specific your question, the better the results
2. **Use Keywords**: Include key terms from the document
3. **Try Variations**: If results aren't perfect, rephrase your question
4. **Check Page Numbers**: Results show exact page references for verification

## 🔧 Technical Requirements

### For Users
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- PDF files (text-based, not scanned images)

### For Developers
- Node.js 18+
- npm or yarn
- OpenAI API key
- Basic knowledge of Next.js (optional)

## 🆘 Troubleshooting

### "Failed to process query"
- **Solution**: Check that OpenAI API key is configured
- Make sure the API key has credits available

### "Upload failed"
- **Solution**: Check file size (<50MB) and format (must be PDF)
- Ensure PDF contains extractable text (not scanned images)

### "No results found"
- **Solution**: Try rephrasing your question
- Check if the topic exists in the document
- Try using exact keywords from the document

### Slow Response
- **Solution**: Normal for first query (embeddings generation)
- Subsequent queries on same document are faster
- Check your internet connection

## 📊 Features at a Glance

✅ **Exact Text Extraction** - No paraphrasing or summarization
✅ **Page References** - Always know where the answer came from
✅ **Fast Search** - Results in <10 seconds
✅ **Smart Matching** - Hybrid keyword + semantic search
✅ **Context Display** - See surrounding text for clarity
✅ **Large Documents** - Handles 20+ page PDFs easily
✅ **Beautiful UI** - Modern, responsive interface

## 🔐 Privacy & Security

- ✅ PDFs processed in-memory (not stored permanently)
- ✅ Documents cleared on session end
- ✅ API keys stored securely in environment variables
- ✅ No data sharing between users

## 🤝 Need Help?

- Check the [full documentation](PROJECT_DOCUMENTATION.md)
- Review the code in the repository
- Open an issue for bugs or feature requests

## 📈 Performance Expectations

| Document Size | Processing Time | Query Time |
|--------------|----------------|------------|
| 10 pages     | ~2 seconds     | ~3 seconds |
| 20 pages     | ~3 seconds     | ~5 seconds |
| 50 pages     | ~5 seconds     | ~8 seconds |

*Times may vary based on document complexity and server load*

## 🎉 Example Workflow

1. **Upload** a research paper on machine learning
2. **Ask** "What is the definition of gradient descent?"
3. **Get** exact text from page 12: "Gradient descent is an optimization algorithm..."
4. **Verify** by checking the page number reference
5. **Continue** asking more questions about the same document

---

**Ready to get started?** Visit [https://agentic-a3b9d052.vercel.app](https://agentic-a3b9d052.vercel.app) and upload your first PDF!
