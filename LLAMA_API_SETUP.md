# Llama API Integration Setup

This guide will help you integrate Meta's Llama API with your ASU AI Portal project.

## Prerequisites

1. **Node.js** (version 16 or higher) - ✅ Already installed
2. **Llama API Access** - You'll need to get this

## Getting Your Llama API Key

### Step 1: Access the Llama Developer Portal
Visit [https://llama.developer.meta.com](https://llama.developer.meta.com)

### Step 2: Sign Up and Join Waitlist
- Create an account on the portal
- Join the waitlist for API access (this may take some time)
- Wait for approval email

### Step 3: Generate API Key
- Once approved, navigate to your dashboard
- Go to the "API Keys" section
- Create a new API key
- **Important**: Your key will start with `LLM|` followed by a long string

## Testing Your API Key

Before adding the key to the main application, test it with our test script:

```bash
# Make sure you're in the project directory
cd /Users/danielennis/ai-apps/rebrand-create-ai/example/figma-mcp-test

# Test your API key (replace with your actual key)
node test-llama-api.js LLM|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If successful, you'll see:
```
✅ API call successful!
Response: [The AI's response to your test prompt]
```

## Adding the API Key to the Application

### Step 1: Open the Application
- The app should be running at http://localhost:3000
- If not running, start it with: `npm start`

### Step 2: Navigate to Provider Keys
- Click on **Settings** in the sidebar
- Click on **Provider Keys**
- Find the **Meta Llama API Key** field

### Step 3: Enter and Save
- Paste your Llama API key (starts with `LLM|`)
- Click **Save**
- The key is stored locally in your browser

## Using Llama Models

**Note**: The new Llama 4 models are natively multimodal, supporting both text and image inputs. This opens up possibilities for image-based AI interactions in your projects.

### Step 1: Create a New Project
- Click **Create new** or use a template
- In the project editor, select **Meta** as the provider

### Step 2: Choose a Model
Available Llama models:
- **Llama 4 Maverick 17B (128 Experts)** - Industry-leading multimodal model with 128 experts, optimized for fast responses and low cost
- **Llama 4 Scout 17B (16 Experts)** - Class-leading multimodal model with superior text and visual intelligence

### Step 3: Configure and Test
- Set your system instructions
- Adjust temperature and output tokens
- Use the **Build** button to test your AI
- Use the **Chat** interface to interact

## Troubleshooting

### API Key Issues
- **Format**: Ensure your key starts with `LLM|`
- **Access**: Verify you have API access (not just waitlist)
- **Quota**: Check if you have sufficient credits

### Common Errors
- **401 Unauthorized**: Invalid or expired API key
- **403 Forbidden**: Insufficient permissions or quota
- **429 Too Many Requests**: Rate limit exceeded

### Getting Help
- Check the [Llama API Documentation](https://llama.developer.meta.com/docs/)
- Review your API usage in the developer portal
- Ensure your account is properly activated

## Security Notes

- **Never commit API keys** to version control
- **Keys are stored locally** in your browser's localStorage
- **Clear browser data** to remove stored keys
- **Rotate keys regularly** for security

## Next Steps

Once your Llama API is working:
1. **Test different models** to find the best fit
2. **Experiment with prompts** and system instructions
3. **Explore RAG features** with your knowledge base
4. **Share projects** with collaborators
5. **Monitor usage** in the Llama developer portal

---

**Need help?** Check the main README.md for general project information or run the test script to verify your setup.