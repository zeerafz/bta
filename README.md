# Behind the Algorithm

A 48-slide English presentation about reverse engineering, recommendation systems, and digital privacy. It explores Android app analysis, video ranking, ad targeting, and on-device personalization. The deck closes with two five-question quizzes, a Q&A slide, and clickable references.

[Open the presentation on GitHub Pages](https://zeerafz.github.io/bta/)

## Run locally

Download or clone the full project, then open `index.html` in a modern browser such as Chrome or Edge. The presentation works offline. You can also run `python -m http.server 8000` in the project folder and open the address shown in the terminal.

| Action | Control |
| --- | --- |
| Next slide | Right Arrow, Space, Enter, or swipe left |
| Previous slide | Left Arrow or swipe right |
| First or last slide | Home or End |
| Fullscreen | F or the fullscreen button. Press Esc to exit. |
| Slide overview | O or the grid button. Select a slide to jump to it. |
| Speaker notes | N or the notes button. This opens notes over the presentation. |
| Separate presenter window | P or **Open presenter window**. Move it to your own screen and share the main presentation window. |
| Share a slide | Copy the address after opening the slide, for example `#slide-27`. |

The toolbar also has buttons for mouse and touch navigation. When a button has focus, Enter and Space activate it. If your browser blocks the presenter window, allow the pop-up or use the notes panel. The diagrams are easiest to read with a phone held in landscape. Demo controls also appear below the slide on a portrait phone.

## Live demos

- **26 · TikTok-style pipeline.** Reveal video understanding, ANN retrieval, and MLP ranking one stage at a time. This architecture and its five-candidate count are illustrative.
- **27 · Exact k-NN.** Measure all 30 distances, then highlight the exact five closest in a simplified 2D map. Reset or replay the scan.
- **28 · Approximate nearest neighbor walkthrough.** Step from the football query through cell selection, distance comparisons, and the five returned candidates. Check exact reveals the nearby video the two-cell search missed.
- **29 · MLP ranking.** Send the five football candidates into the model, zoom into a fully connected network, reveal their illustrative scores, and sort the cards.
- **30 · Approximate nearest neighbor search.** Pick a topic and compare approximate and exact search. The starting AI query shows how scanning only part of the index can miss a nearby match. Both modes use the same 304 synthetic points.
- **32 · Learning from interactions.** Finish or skip a video to see an interest score change. Reset restores the starting scores.
- **34 · Ranking.** Switch priority between completion and sharing to see the same candidates reorder.
- **45–46 · Quizzes.** Choose answers to see immediate feedback.

All slides keep their 16:9 landscape layout. On a phone held upright, demo controls appear below the slide; turning the phone sideways gives the slides more room.

## GitHub Pages

The project publishes from the root of `main`. To deploy a copy, upload the project contents, including `.nojekyll`, to the root of your repository. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and **/(root)**, and save. Use **Visit site** after the deployment finishes. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Speaker notes are hidden in the presentation by default and available in the published source.

## Project files

- `index.html` and `presenter.html` open the presentation and the separate notes window.
- `css/main.css` controls the layout, scaling, and motion.
- `js/slides-data.js` contains the slide titles and notes.
- `js/diagrams.js` contains the SVG artwork. `js/demos.js` implements the original interactive demos. `js/recommendation.js` adds the pipeline, exact k-NN, and MLP walkthroughs.
- `js/app.js` and `js/presenter.js` handle navigation and keep the windows in sync.
- `js/review.js` contains the quizzes and references.
- `assets/images/` contains the three ImageGen illustrations. [Cover](assets/images/cover.webp) · [Ring ad](assets/images/conversation.webp) · [Closing illustration](assets/images/reflection.webp)
- [Sources and evidence limits](SOURCES.md) lists the references behind the slides and the claims that remain open.
