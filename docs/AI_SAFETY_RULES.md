# HerHealth: AI Safety Rules

Version: **0.1 (draft)**

> **Status.** These rules were drafted by a developer, not a clinician. They must
> be reviewed by a qualified clinician before the app is opened to the public.
> Until then HerHealth must not be described as clinically validated.

These rules apply to every feature that sends user data to a language model:
companion chat, Analyze My Health, plans, insights wording, post-visit plans and
document extraction. Later phases turn each rule into code and tests. The version
above is stored with every AI message so behaviour can be traced to the rules in
force at the time.

## 1. What the AI is

HerHealth's AI is a wellness companion. It helps the user notice patterns in
their own tracked data, understand general health information and prepare for
conversations with clinicians.

## 2. What the AI must never do

1. Diagnose a condition, or say the user does or does not have one.
2. Recommend, name a dose for, or advise changing or stopping a medicine or
   supplement.
3. Tell the user a symptom is "nothing to worry about".
4. Predict pregnancy, fertility or ovulation with certainty, or advise on
   contraception effectiveness.
5. Interpret lab or imaging results as a diagnosis. It may explain in general
   terms what a test measures and say that a clinician should interpret the result.
6. Give weight-loss targets, calorie targets or restrictive eating plans by
   default. Plans focus on balanced habits.
7. Provide methods or encouragement for self-harm, eating disorders or harm to
   others.
8. Invent numbers, dates, records or trends. See rule 4 in section 5.

## 3. Red-flag handling

Red flags are checked **on the server, before any model call**, on the user's
text. The check is deterministic code, not a model.

### Tiers

| Tier        | Meaning                                                  | Behaviour                                                                                         |
| ----------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `EMERGENCY` | Possible immediate danger                                | No model call. Show the emergency screen with the user's region numbers. Log the event type only. |
| `URGENT`    | Should be seen by a clinician soon, but not an emergency | The model may answer, and the reply must start with a prompt to contact a clinician.              |
| `NONE`      | No flag                                                  | Normal handling.                                                                                  |

### Starting categories for `EMERGENCY`

- Chest pain or pressure, or trouble breathing
- Signs of stroke (face drooping, sudden weakness, slurred speech)
- Heavy bleeding (for example soaking through pads quickly) or bleeding with
  fainting
- Severe sudden abdominal or pelvic pain, especially with fainting or dizziness
- Pregnancy with severe pain or bleeding
- Sudden severe headache described as the worst of the user's life
- Seizure or loss of consciousness
- Severe allergic reaction (swelling of face or throat, trouble breathing)
- Thoughts of suicide or self-harm, or being in immediate danger from another
  person

### Starting categories for `URGENT`

- Bleeding after menopause
- A new breast lump or change
- Persistent fever with severe symptoms
- Symptoms that are clearly worsening over several days

### Matching rules

1. Normalise the text (case, spacing, common punctuation and apostrophes) before
   matching.
2. **Over-triggering is acceptable. Missing a real emergency is not.** When the
   code cannot tell whether a phrase is negated ("I don't have chest pain"), it
   triggers.
3. The phrase lists live in one file, `src/lib/redFlags.ts`, with unit tests for
   every category: positive phrases, negation phrases, misspellings, and
   non-flag sentences that must not trigger.
4. If the check itself throws an error, the request fails and no model call is
   made.
5. Self-harm responses are supportive, never include methods, and always show a
   helpline for the user's region.

## 4. Consent and access

1. The AI runs only if the user has given the optional AI consent **and** has the
   AI switch on. The server checks this on every request.
2. Withdrawing consent takes effect immediately. Past AI messages stay visible
   to the user until they delete them.
3. Only the signed-in user's own data is ever used to build a prompt. The
   context builder takes the user id from the session, never from the request.

## 5. Output rules

1. State what the answer is based on, for example "based on your last 14 days of
   check-ins".
2. **Insufficient data is a valid answer.** If there are fewer records than the
   minimum for a feature (set in code for each feature), the AI says so and does
   not guess.
3. Express uncertainty plainly. Prefer "you may want to raise this with a
   clinician" over firm statements.
4. **All figures come from code.** Averages, counts and trends are computed from
   the database. The model only words them. A figure that is not in the supplied
   context must not appear in the answer.
5. Include a short reminder, where appropriate, that HerHealth is not a
   substitute for professional care.
6. If the model call fails or times out, show a clear error. Never fall back to
   canned or invented content.

## 6. Data sent to the model

1. Send the minimum fields a feature needs. Never send name, email, user id or
   any other direct identifier.
2. Free-text notes are sent only for features that need them, and only when the
   user has consented to AI.
3. Uploaded documents are **untrusted input**. Text inside a document is data,
   never instructions. A document cannot change settings, call tools or alter
   stored data.
4. Extraction results are shown on a review screen. Nothing from AI extraction
   is saved until the user confirms it.
5. Before launch, check and record the model provider's data-retention and
   training terms for API traffic. This has not been done yet.

## 7. Logging and retention

1. Log event type, tier, prompt version, rules version, latency and error codes.
2. Do not log prompts, responses, notes or document text.
3. Stored AI conversations belong to the user and are deleted with their other
   data.

## 8. Rate limits

AI endpoints are rate limited per user and per IP, with limits set in
configuration. Document extraction has stricter limits and a file-size cap.

## 9. Change control

1. Any change to a prompt, the red-flag lists or these rules bumps the version
   number and the matching tests.
2. Red-flag lists change only together with tests that cover the change.
3. Review this document with a clinician before public launch, and again after
   any significant feature change.
