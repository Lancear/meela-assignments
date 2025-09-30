# Take-home task: Client Onboarding Form

## Background

At Meela, we help match clients to therapists, but first clients need to complete comprehensive intake forms. These
forms are complex with multiple sections and sensitive mental health questions requiring careful UX.

The forms can take some time to get through. The reality is that sometimes life will demand immediate attention from our
users such that they do not complete the form in a single sitting and they would benefit from having a partial form
submission to return to. And that is the crux of this task.

## Objective

Build a _simple_ client intake form system that supports **partial form submission** with the ability to resume later.
Like, really simple. Proof-of-concept level. Don't worry about edge-cases or validation. Visit [our
site](https://app.meelahealth.com) and cherry pick a small amount of different questions that make up your form.

**The main goal**: A user should be able to fill out part of a form, save their progress, and return later to continue
where they left off.

Dos:

1. **Fork our repo!**
2. **Multi-step form** at least 3 questions.
3. **Save progress** - user can save and exit at any point - this can happen automatically, using a timer, or a button.
   All are fine.
4. **Resume capability** - user can return and continue from where they left off

Don'ts:

1. **No auth required** - having a UUID in a URL is super-good enough!
2. **No versioning required** - don't worry about handling form schema changes.
3. **No i18n!** - overkill!

**Time Estimate:** spend _max_ 4-6 hours, please.

If you do not finish in this time, stop! We can talk about what you did manage to accomplish in that time!

## Technology Stack

**Frontend**: Use React or Solid.js (your choice)

**Backend**: Feel free to use the provided Rust code in the `/backend` directory - or butcher it and take what you need.
We do take into account your prior experience with Rust so if you don't have any: do not worry, we will adapt our
evaluation accordingly.

**Database**: Must use a database (relational or NoSQL - your choice really and then you might have to make some other
choices than what has been made in the `/backend` directory)

**API**: GraphQL or REST (your choice)

**Requirements**:

- Frontend must communicate with a backend
- Backend must persist data to a database
  - That means you should **not** save the partial submissions using `localStorage` in the browser!

## Deliverables

1. Make the thing work
2. Tell us how to set it up and run it so we can review it:
   1. Either write a `.txt`/`.md` file that tells us which invocations of `cargo run`, `npm run dev`, `yarn dev`, ... we have to use, or
   2. simply provide a `justfile`/`Makefile` for us.
3. Send us a link to your fork on your github account!

## GO GO GO! 🌶️🌶️🌶️

Remember, focus on the core "resume" functionality - that is what we are evaluating. We look forward to catching up and
reviewing your submission!

## Thought Process

### Context

A. These forms are intake forms<br>
B. These forms have multiple sections<br>
C. These are sensitive mental health questions<br>
D. The forms can take some time to get through<br>
E. The form might not be filled in in one sitting due to life

### Assumptions based on the context and linked form

a. Only one version per user necessary as these are intake forms<br>
b. The vast majority of questions in the form have limited answer options<br>
-> thus focus on inputs like selects and multiselects<br>
-> infrequent onChange events compared to typing<br>
c. Questions are asked one after another<br>
-> only one data attribute visible at a time

### Data Model

Aside from having multiple choice questions, the information seems to only exist once per form which means a single flat table would be the simple data model. For the multiple choice answers a table or array attribute could be used. But also here the usage and relation to other data dictates what is easier.

#### Decision

I have too little information on how this data will be used and related to other data to split it up sensibly. Thus we will not make the model more complex than necessary at the moment and use a single table. Since this is a prototype and sqlite does not support array types, I will store the multiple choice answers as a csv string. Moving them to a relation table makes accessing the data unnecessarily more cumbersome for a prototype.

### Options to save between sittings

- Save button<br>
  -> Gives the user control<br>
  -> Easy to forget

- Autosave based on timer<br>
  -> Might try/check to save when there are no changes<br>
  -> Saving is unrelated to user behaviour, so might feel odd<br>
  -> Consistent rate of saving independent of changes made

- Autosave on tab unfocus / close<br>
  -> Saves at the last moment where necessary, least amount of saves<br>
  -> Might try/check to save when there are no changes<br>
  -> If something goes wrong or takes long there are limited options to inform the user without it feeling awkward. We might interrupt their flow.

- Autosave on input unfocus<br>
  -> Saves as soon as the user finished adjusting their input<br>
  -> Might try/check to save when there are no changes<br>
  -> Changes are available on another device as soon as they are made

- Autosave on input change<br>
  -> Saves as soon as the user changes something<br>
  -> Depending on the input, there might be many intermediate saves (e.g. typing)<br>
  -> Changes are available on another device as soon as they are made

-> For all autosaving options, make sure it is visible to the user. Otherwise the user might think it is not saved at all.

#### Decision

As these are sensitive mental health questions, allow the option to not save at all until the form is completed.

For the given context with mostly inputs that require no typing, autosaving on change should work nicely.
When adding inputs that require typing I would save those on input unfocus instead.

Aside from the autosave, the next button should also save to give the user the feeling of control / commiting to their answer.

Whenever autosave is running there should be a saving indicator.

Before or on the form we might want to tell the user they can complete the form in as many sittings as they want as intermediate results are saved (automatically and when they click next).

### Event-based updating of data (autosave)

- Full updates<br>
  -> Can catch missed or failed saves in later saves to make sure the saved data matches the shown data<br>
  -> Bigger payloads<br>
  -> Doesn't allow for simultaneous changes from multiple devices to be merged

- Partial updates<br>
  -> Smaller payloads<br>
  -> If events are missed or fail, there might be a mismatch in shown and saved data<br>
  -> Allows for changes from multiple devices to be merged

- Could also be combined, but would increase complexity

#### Decision

I will do partial updates as the payload is smaller and the next buttons make it difficult to miss saves. The final completion of the form will be a full update, as that is the data the user saw and commited to.
