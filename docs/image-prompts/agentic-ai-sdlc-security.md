# Image prompts: Agentic AI and secure software delivery

These prompts are intended for generating the placeholder images referenced by
`src/content/blog/agentic-ai-sdlc-security.md`. The visual direction follows The
Construct: restrained editorial diagrams, warm white space, thin black rules,
quiet gray typography, and one controlled accent colour. Avoid cyberpunk stock
art, glowing circuitry, photorealistic hackers, excessive gradients, and generic
shield imagery.

## 1. Direct versus indirect prompt injection

```text
Use case: infographic-diagram
Asset type: horizontal inline blog diagram, 16:9
Primary request: Explain the difference between direct prompt injection and indirect prompt injection in an AI-assisted software development workflow.
Scene/background: warm white editorial background with generous negative space, a precise technical diagram with thin black connector lines and restrained grid alignment.
Composition/framing: two equal columns separated by a fine vertical rule. Left column shows an attacker speaking directly to an AI agent. Right column shows an attacker placing malicious instructions inside an external issue or Markdown document, which a developer then asks the agent to read. End both columns at an AI agent, but make the right-hand path visually more indirect and harder to notice.
Style/medium: premium monochrome technical editorial illustration, flat vector-like forms, no 3D, no people except simple abstract silhouettes, no decorative clutter.
Lighting/mood: calm, analytical, slightly tense; the danger should come from the flow and labels rather than dramatic effects.
Color palette: ink black #161616, warm white #FFFFFF, muted gray #6B7280, one restrained signal red #C2413B for malicious content, one muted blue #4967A8 for trusted workflow elements.
Text (verbatim): "DIRECT PROMPT INJECTION"; "Attacker"; "User message"; "AI agent"; "INDIRECT PROMPT INJECTION"; "Attacker"; "Poisoned issue / document"; "Developer asks agent to read"; "AI agent"; "The attacker never needs to talk to the agent"
Constraints: render every label exactly as written, with clear legible sans-serif typography; keep arrows directional and unambiguous; make the right-hand attack path visibly enter through data treated as context; no logos, no watermark, no fake brand names.
Avoid: neon cyberpunk, skulls, glowing brains, hacker hoodies, UI screenshots, dense paragraphs, tiny unreadable text, sensational red everywhere.
```

Suggested output filename: `/images/direct-vs-indirect-prompt-injection.png`

## 2. Promptware Kill Chain

```text
Use case: infographic-diagram
Asset type: horizontal inline blog diagram, 16:9
Primary request: Visualize a Promptware Kill Chain in an AI-assisted software delivery environment, showing how poisoned context can move through an agent into CI/CD impact and where defensive controls can interrupt the chain.
Scene/background: warm white editorial background with a subtle paper-like texture, thin black rules, generous margins, and a clean left-to-right flow.
Composition/framing: six connected stages in one horizontal sequence with compact numbered nodes: 1 Initial access, 2 Goal hijacking, 3 Reconnaissance, 4 Persistence, 5 Lateral movement, 6 Impact. Use a continuous black line for the attack path. Under the path, place small blue interruption markers labelled "Gateway", "Scoped identity", "Sandbox", "Approval", and "Circuit breaker". Show the final impact reaching a simplified CI/CD runner and repository, without depicting real secrets or destructive commands.
Style/medium: refined technical editorial infographic, flat vector geometry, restrained typography, architectural diagram language, no 3D, no photorealism.
Lighting/mood: precise and watchful, serious but not theatrical.
Color palette: ink black #161616, warm white #FFFFFF, muted gray #6B7280, signal red #C2413B only for the malicious path and final impact, muted blue #4967A8 for defensive interruption points.
Text (verbatim): "PROMPTWARE KILL CHAIN"; "1 INITIAL ACCESS"; "2 GOAL HIJACKING"; "3 RECONNAISSANCE"; "4 PERSISTENCE"; "5 LATERAL MOVEMENT"; "6 IMPACT"; "Gateway"; "Scoped identity"; "Sandbox"; "Approval"; "Circuit breaker"; "CI/CD runner"; "Repository"
Constraints: exact spelling and capitalization for every label; every stage must be readable at blog inline size; make the defensive controls look like interruption points, not a second unrelated diagram; no logos, no watermark, no exploit payload text, no real credentials.
Avoid: skulls, flames, red-and-black hacker aesthetics, terminal screenshots, tiny text, excessive arrows, generic lock-and-shield clip art.
```

Suggested output filename: `/images/promptware-kill-chain.png`

## 3. Optional cover image

```text
Use case: stylized-concept
Asset type: blog cover image, wide 16:9
Primary request: A restrained editorial illustration about an AI agent connected to the software delivery architecture around it.
Scene/background: warm white background with a sparse architectural network of repository, CI/CD runner, document, database, and tool nodes connected by fine lines to one central abstract agent node.
Subject: a central geometric agent node with a subtle split between trusted workflow paths and one red malicious path entering through an ordinary document.
Style/medium: premium flat editorial illustration with a technical architecture feel, crisp vector-like geometry, understated and suitable for a software security blog.
Composition/framing: central subject slightly left of centre, generous negative space on the right, no text in the image, no interface screenshot.
Lighting/mood: quiet, analytical, alert rather than dramatic.
Color palette: ink black #161616, warm white #FFFFFF, muted gray #6B7280, muted blue #4967A8, a single restrained signal red #C2413B.
Constraints: no logos, no watermark, no readable words, no people, no hacker clichés, no neon, no glowing circuitry.
Avoid: generic AI robot, humanoid assistant, photorealistic server room, shield icon, skull, excessive gradients, stock illustration style.
```

Suggested output filename: `/images/agentic-ai-sdlc-security-cover.png`
