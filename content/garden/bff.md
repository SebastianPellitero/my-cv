---
title: BFF and React.
description: The best friend for a complex frontend.
stage: evergreen
created: 2026-11-18
---

> **Stub:** placeholder content, to be rewritten.

A BFF (not best friend forever, but backend for frontend or maybe its the best friend of the frontend who knows) is a way to rearrange what the backend is exposing and delegating some management of the data from the frontend to something else, and this is the "something else". So the server has a new layer called BFF, it can be written in Javascript but also in other backend languages, and the idea is that.

If i have a page that calls for example 3 or 4 endpoints, instead of doing the 4 rest API and then check what should i do to show that data, i give that responsibility to BFF calling it one time (for example per page/view) and the BFF is in charge of calling this many endpoints and shaping the data in such a way that the frontend is only responsible to showing what is being called.

#### So who is responsible for what in this BFF, frontend or backend, division?  

Well now that BFF is in charge of shaping the data for the view, it can also manage the frontend parts of paginations, formatting and also error messages, as well as session and auth handling like cookies and token refresh. Leaving the backend to expose the heavy lifting, api with business logic and validations.

Because it is an extra layer, it has to be maintained so it's a trade off of how much different information you need in one place vs if it's a simple thing maybe BFF is not for your view.