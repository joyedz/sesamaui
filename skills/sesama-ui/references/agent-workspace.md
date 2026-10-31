# Agent and Conversation Workspaces

Sesama UI includes dedicated conversational and AI workflow components for building intelligent assistants, multi-turn dialogues, tool execution inspectability, and file attachments.

## Public Conversational Components

Import the canonical components from `src/index.mjs`:

```js
import {
  message,
  composer,
  agentRun,
  toolCall,
  fileCard,
  fileAttachment,
  tree,
  treeSection,
  mount
} from './src/index.mjs';
```

## Assembly Guidelines

### 1. Page Layout
- Wrap conversational views in `pageLayout(content, { variant: 'conversation' })`. This enforces the standard 768px reading column (720px readable area) for optimal reading comfort.
- In `appShell`, place the conversation stream in `content` and the `composer` in `footer` (or anchored at the bottom).

### 2. Message Bubbles (`message`)
- `role`: `'user'`, `'assistant'`, or `'system'`.
- `content`: Message markdown or HTML string. Assistant messages render cleanly without heavy background boxes; user messages use the brand-tinted bubble.
- `avatar`: Optional avatar markup or configuration.
- `timestamp`: Formatted time string.
- `status`: Optional status indicator (`'streaming'`, `'complete'`, `'error'`).
- `actions`: Optional array or HTML of quick-action buttons (e.g. copy, retry, edit).

### 3. Composer Input (`composer`)
- `placeholder`: Initial input placeholder text.
- `value`: Initial text content.
- `tools`: Optional array of tool or skill chips.
- `attachments`: Array of draft `fileCard` or `fileAttachment` items.
- `models`: Optional select component or dropdown for model switching.
- `sendDisabled`: Boolean flag.
- Controller behavior:
  - Supports multiline auto-expansion up to a configurable maximum height.
  - While generating or streaming, Send transforms into a Stop button.
  - Automatically resets after dispatching send.

### 4. Agent Runs and Tool Calls (`agentRun`, `toolCall`)
- `agentRun({ name, status, duration, steps, tokens })`: Collapsible execution log summarizing multi-step agent actions.
- `toolCall({ tool, input, output, status, duration })`: Detailed, expandable inspect window showing parameters and returned values.

### 5. File Cards & Attachments (`fileCard`, `fileAttachment`)
- Handles previewing files (images, audio, video, code, PDFs, documents).
- `removable`: Boolean flag rendering a delete/remove button.
- Expands image and text previews inline when clicked.
