# Run Modal Workflow

This tool allows agents to execute heavy compute workflows on Modal's serverless infrastructure. It supports three types of workflows:

## Supported Workflow Types

### `issue`
Executes a GitHub issue-related workflow on Modal containers.
- **Required**: `repo` (GitHub repository in owner/repo format), `issueNumber`
- Example: Process and analyze a GitHub issue with ML models

### `pr`
Executes a GitHub pull request-related workflow on Modal containers.
- **Required**: `repo` (GitHub repository in owner/repo format), `prNumber`
- Example: Analyze PR changes and run CI/CD checks

### `notebook`
Executes a Jupyter notebook workflow on Modal containers.
- **Required**: `notebookPath` (path to the .ipynb file)
- Example: Run data science notebooks with GPU acceleration

## Parameters

- `workflowType`: Choose from 'issue', 'pr', or 'notebook'
- `repo`: GitHub repository (owner/repo) - required for 'issue' and 'pr' workflows
- `issueNumber`: GitHub issue number - required for 'issue' workflow
- `prNumber`: GitHub PR number - required for 'pr' workflow
- `notebookPath`: Path to Jupyter notebook file - required for 'notebook' workflow
- `parameters`: Optional additional parameters for the workflow

## Execution Details

- Workflows run on Modal's serverless infrastructure with CPU/GPU support
- Includes built-in timeout protection (5 minutes)
- Real-time status updates via streaming UI notifications
- Returns structured execution results including duration and output

## Use Cases

- Heavy data processing and model training
- GPU-accelerated machine learning tasks
- Large-scale CI/CD operations
- Scientific computing and analysis
- Long-running background processes

The tool integrates with Modal's MCP (Modal Control Protocol) for secure and monitored execution.