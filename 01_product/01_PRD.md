# EchoSoul — Product Requirements Document

## 1. Vision
Create an emotional companion that makes a person feel understood without pretending to be human or a clinician. The product combines listening, responsible memory, authentic literature retrieval, cinematic presentation, optional creative media, and practical next steps.

## 2. Problem
Current AI emotional experiences commonly become advice dumps, generic motivation, poor long-term memory, or static text. EchoSoul focuses on the moment first, then lets the person choose the experience they need.

## 3. Core promise
When a user says something difficult, EchoSoul should be able to:
- listen properly;
- understand the emotional context without diagnosing;
- remember meaningful context responsibly;
- find a real literary work that expresses the moment;
- present the selected words beautifully in their original language;
- turn the moment into an optional visual scene/animation/video;
- give one realistic next step when useful;
- remember progress over time.

## 4. Target users
Broad consumer audience. Initial high-value use cases include everyday loneliness, heartbreak, disappointment, overthinking, uncertainty, motivation problems, friendship/relationship tension, life transitions, academic/work pressure, and reflective journaling.

## 5. Core user journey
1. Open Home.
2. Talk or type.
3. EchoSoul listens and responds naturally.
4. Context + safety are evaluated.
5. Relevant approved memories may influence the response.
6. After the listening exchange, present optional actions:
   - Find My Words
   - Find a Book/Page
   - Make an Animation
   - Make a Scene
   - Make a Video
   - Give Perspective
   - Give Me a Plan
   - Just Stay Here
7. User chooses.
8. Result is displayed.
9. User can save/forget.
10. A meaningful moment can enter the user's private novel.

## 6. Functional requirements
### Conversation
- text chat
- voice input/output
- interruptible TTS
- Just Listen mode
- adaptive conversational tone
- session summary
- explicit post-listening feature chooser

### Emotional/context understanding
Store structured, non-diagnostic state: emotion, situation, trigger, core thought, need, intensity, desired support mode, people/entities, unresolved threads, positive movement, and safety state.

### Memory
- meaningful memory candidates, not every message
- automatic detection + user confirmation controls
- memory edit/delete
- private session
- relevance ranking
- sensitivity gate
- old-memory surfacing only when useful/safe
- facts and reflections stored separately

### Novel
Present approved life memories as chapters, moments, people, turning points, themes, saved words, scenes, and growth evidence. Generated connective text must not invent facts.

### Literature
- authentic source text only for retrieval results
- original language preserved
- public-domain or explicitly licensed corpus
- verified provenance
- author and work metadata
- user author filter
- semantic + metadata retrieval
- user feedback loop
- excerpt display constrained by rights

### Literary animation
- paper-like canvas
- handwriting/ink reveal
- original line breaks
- exact source text
- variable timing
- optional spoken reading
- save to Words/Moment

### Creative
- user-triggered image/animation/video creation after listening
- pre-generation interpretation/storyboard preview
- symbolic visuals by default unless literal reenactment is requested
- async jobs and retries
- media saved to moment when user approves

### Practical guidance
- adaptive style
- small actions first
- daily plan feature
- goals and habits
- no generic massive checklist by default

### Privacy
- private session
- do-not-remember
- review/edit/delete memory
- delete conversation
- delete account/data
- export data
- transparent memory status

### Premium
Free: core conversation, basic memory, limited literature/animation/planning.
Premium: larger memory capacity, advanced creative media, richer voice, expanded personal patterns, premium/partner literature where rights allow.
Safety support is never gated.

## 7. Non-goals
- diagnosis
- therapy replacement
- emergency-service replacement
- manipulative dependency
- pretending AI is conscious/human
- fake quotations
- unauthorized copyrighted text

## 8. Success metrics
Product: activation, 7/30-day return, session satisfaction, memory acceptance/edit/delete rates, literature save rate, creative completion rate, plan completion, retention.
Quality: literary relevance, source integrity, false-memory rate, unwanted-memory surfacing, safety recall, response latency, generation failure rate.

## 9. Product principles for hard cases
When uncertain, prefer listening and a small clarifying question over a confident interpretation. When a user asks for authentic poetry, retrieval wins over generation. When safety risk appears, safety wins over creative output.
