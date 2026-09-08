# EchoSoul — Feature Specification

## 1. Home
Primary CTA: **Talk to EchoSoul**. Secondary entry points: text, voice, Just Listen, Today's Plan. Do not overload the home screen with every feature.

## 2. Conversation
- streaming assistant response
- visible listening/processing state
- voice interruption
- language-aware interaction
- support-mode action chips after the listening phase
- session end state: save/forget + next experience

## 3. Just Listen
When enabled, EchoSoul prioritizes acknowledgement, reflection, gentle questions, and presence. It must not repeatedly redirect to productivity or planning unless the user asks.

## 4. Emotional context
Fields: primary emotion, secondary emotions, situation, trigger, core thought, need, intensity 0–10, support mode, people, places, goals/commitments, unresolved thread, positive movement, safety state.

## 5. Memory
Types: moment, preference, relationship context, recurring theme, goal, progress, important fact. Every memory has provenance, confidence, sensitivity, user visibility, edit/delete controls, and lifecycle metadata.

## 6. Novel
Views:
- Chapters
- Moments
- People
- Themes
- Turning Points
- Growth
- Saved Words
- Scenes

Facts and AI reflections are visually and structurally separate. Reflections can be corrected.

## 7. Find My Words
Input: current emotional context + language + author preference + genre + intensity. Retrieval service returns authentic works. UI shows the original language, author, title, source, rights status, and reason for match. No AI-generated quotation may appear in the authentic-result slot.

## 8. The Page You Needed
Finds a legally displayable excerpt or source reference from a book/work. When full passage display is not licensed, show metadata and a lawful short excerpt or direct the user to the source.

## 9. Literary animation
The display is intentionally not a static quote card. Use a paper-like canvas, realistic pen/ink reveal, preserved line breaks, subtle camera movement, optional paper texture, and optional read-aloud.

### Rendering constraints
- source text is immutable;
- no spelling correction by the renderer;
- no word substitution;
- no truncation without explicit UI indication;
- source credit remains visible or one tap away;
- animation timing must handle punctuation, line breaks, and long lines naturally.

## 10. Creative scene
Before generation: show “I would show this as…” with the proposed narrative. User can edit, accept, or cancel. Default to symbolic treatment to avoid inventing factual events.

## 11. Animation
Lightweight short visual sequence suitable for immediate comfort. Can accompany selected literature or a user's moment.

## 12. Video
Variable duration. Pipeline: concept -> storyboard -> generation job -> progress -> preview -> save. Media generation is asynchronous and retriable.

## 13. Reflection
Examples: repeated theme, changed belief, evidence of progress, unresolved conflict. Phrase as observation, not diagnosis.

## 14. Plan
Default recommendation: one next action + optional today/tomorrow steps. User can request full detail.

## 15. Goals and habits
Created by user or explicitly confirmed. Never silently create a commitment from casual conversation.

## 16. Privacy and controls
The user can see whether a session is private, whether a memory was stored, and what can be deleted. Every memory has an accessible “Why is this remembered?” explanation.

## 17. Premium
Feature gating is entitlement-based, not scattered hard-coded checks. Server validates entitlements. Safety, privacy, deletion, and basic support cannot be disabled by plan.
