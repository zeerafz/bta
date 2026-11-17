(function recommendationScenes() {
  "use strict";

  const { visual, canvas, label, circle, path, cyan, muted, ink, red } = window.DeckDiagrams;
  const candidates = [
    { id: "A", title: "Goal replay", length: 20, similarity: ".91", score: .87, rank: 1 },
    { id: "B", title: "Free-kick tips", length: 32, similarity: ".89", score: .94, rank: 0 },
    { id: "C", title: "Match recap", length: 58, similarity: ".88", score: .72, rank: 3 },
    { id: "D", title: "Skills drill", length: 25, similarity: ".86", score: .81, rank: 2 },
    { id: "E", title: "Fan reaction", length: 15, similarity: ".84", score: .63, rank: 4 }
  ];
  const pitch = `<svg class="football-thumb" viewBox="0 0 70 48" aria-hidden="true"><rect x="1" y="1" width="68" height="46" rx="5" fill="#153b39" stroke="#66e7f255"/><path d="M35 1v46M1 13h12v22H1m68-22H57v22h12" fill="none" stroke="#8be4ab77"/><circle cx="35" cy="24" r="10" fill="none" stroke="#8be4ab77"/><circle cx="43" cy="19" r="5" fill="#edf3fb"/><path d="m43 16 3 2-1 3h-4l-1-3z" fill="#153b39"/></svg>`;
  function card(candidate, score = false) {
    return `<div class="football-card" data-candidate="${candidate.id}"><span class="candidate-id">${candidate.id}</span>${pitch}<span class="candidate-title">${candidate.title}</span>${score ? `<strong class="candidate-score">${candidate.score.toFixed(2)}</strong>` : ""}</div>`;
  }
  window.DeckRecommendations = { candidates, card };
  const button = (action, title) => `<button class="demo-button" type="button" data-action="${action}">${title}</button>`;
  const status = '<span class="sr-only demo-status" aria-live="polite" aria-atomic="true"></span>';
  function announce(root, text) { root.querySelector(".demo-status").textContent = text; }

  visual.feedPipeline = () => `<div class="demo pipeline-demo" data-step="0">
    <div class="pipeline-stages">
      <article class="pipeline-stage stage-understand">
        <span class="step-label">01 · UNDERSTAND</span><h3>Understand the video</h3>
        <div class="modalities"><span>${pitch}Frames</span><span><b class="sound-wave">▂ ▆ ▃ █ ▂</b>Speech</span><span><b class="caption-icon">CC</b>Captions</span></div>
        <div class="flow-down">↓</div><div class="model-tile">Multimodal Transformer</div><div class="flow-down">↓</div>
        <div class="vector-strip"><span>Video vector</span><code>[.2, .8, …]</code></div>
        <p class="optional-head">Optional classification head <span>→ Football</span></p>
      </article>
      <span class="pipeline-link link-one" aria-hidden="true">→</span>
      <article class="pipeline-stage stage-retrieve" inert aria-hidden="true">
        <span class="step-label">02 · RETRIEVE</span><h3>Retrieve candidates</h3>
        <div class="interest-chip">◇ Viewer interest vector<br><small>Recent football viewing</small></div>
        <div class="flow-down">↓</div><div class="model-tile">ANN search <small>Find nearby video vectors</small></div>
        <div class="flow-down">↓</div><div class="five-mini">${candidates.map(c => `<span>${c.id}</span>`).join("")}</div>
        <p>5 candidate videos <small>Illustrative count</small></p>
      </article>
      <span class="pipeline-link link-two" aria-hidden="true">→</span>
      <article class="pipeline-stage stage-rank" inert aria-hidden="true">
        <span class="step-label">03 · RANK</span><h3>Rank the candidates</h3>
        <div class="model-tile rank-model">MLP <small>Score each video for this viewer</small></div>
        <div class="flow-down">↓</div><div class="pipeline-order">${[...candidates].sort((a,b) => a.rank-b.rank).slice(0,3).map((c,i)=>`<div><b>${i+1}</b><span>${c.title}</span></div>`).join("")}<small>…then the remaining two</small></div>
        <p>Highest score plays first</p>
      </article>
    </div>
    <div class="demo-controls">${button("pipeline-next", "Reveal retrieval →")}${button("pipeline-reset", "Replay")}</div>${status}
  </div>`;

  function initPipeline(root) {
    let step = 0;
    const next = root.querySelector('[data-action="pipeline-next"]');
    function show(value) {
      step = value;
      root.dataset.step = step;
      root.querySelectorAll(".pipeline-stage").forEach((stage, i) => {
        stage.inert = i > step;
        stage.setAttribute("aria-hidden", String(i > step));
      });
      next.textContent = ["Reveal retrieval →", "Reveal ranking →", "All 3 stages revealed"][step];
      next.disabled = step === 2;
      announce(root, ["Stage 1. A multimodal Transformer turns frames, speech, and captions into a video vector. An optional head assigns a Football tag.", "Stage 2. ANN uses the viewer’s interest vector to retrieve five candidates. Five is illustrative.", "Stage 3. An MLP scores each video for this viewer and orders the candidates."][step]);
    }
    next.addEventListener("click", () => show(Math.min(step + 1, 2)));
    root.querySelector('[data-action="pipeline-reset"]').addEventListener("click", () => show(0));
    show(0);
  }

  // A small, deterministic catalog makes every brute-force distance comparison visible.
  const query = { x: 290, y: 206 };
  const coordinates = [[88,74],[166,310],[685,91],[584,302],[732,340],[91,237],[431,65],[542,145],[214,89],[650,231],[370,344],[754,175],[174,193],[458,260],[331,104],[512,352],[102,357],[595,55],[256,301],[727,47],[414,174],[641,365],[216,237],[482,91],[311,222],[265,181],[326,177],[290,252],[247,225],[540,238]];
  const videoPoints = coordinates.map(([x,y], id) => ({ x,y,id, distance: Math.hypot(x-query.x,y-query.y) }));
  const closest = [...videoPoints].sort((a,b) => a.distance - b.distance).slice(0,5);
  function knnChart() {
    return canvas(820,420,
      `<rect x="30" y="25" width="760" height="365" rx="14" fill="#0b1420" stroke="#34475f"/>` +
      path("M30 390H790M30 25V390", "#60718a") +
      '<g class="knn-measurements"></g>' +
      videoPoints.map(p => circle(p.x,p.y,5,p.distance<100 ? "#8be4ab" : "#aab5c4", "none", `class="knn-dot" data-point="${p.id}"`)).join("") +
      '<g class="knn-neighbors"></g>' +
      `<path d="M0-11L11 0 0 11-11 0z" transform="translate(${query.x} ${query.y})" fill="${cyan}" stroke="#fff" stroke-width="2"/>` +
      label("Viewer", query.x-25,query.y-48,{cls:"small",color:cyan,align:"end"}) +
      label("Simplified vector dimension 1",410,415,{cls:"tiny",color:muted}) +
      label("2",16,32,{cls:"tiny",color:muted}),
      "Simplified 2D vectors. Thirty video dots and a cyan diamond for a viewer interested in football.");
  }
  visual.exactKnn = () => `<div class="demo knn-demo" data-phase="ready">
    <div class="knn-layout"><div class="knn-plot">${knnChart()}</div>
      <div class="knn-explanation"><span class="step-label">EXACT · BRUTE FORCE</span>
        <h3>Check every video</h3><div class="knn-count"><strong>0</strong><span> / ${videoPoints.length} distances</span></div>
        <p class="knn-message">Measure from the viewer to each dot.</p>
        <div class="k-definition"><b>k = 5</b><span>Return five neighbors</span></div>
        <div class="plot-key"><span>● Video vector</span><span>◇ Viewer’s interests: football</span></div>
      </div>
    </div>
    <p class="scale-question">How can we find nearby videos when the catalog has billions of items?</p>
    <div class="demo-controls">${button("knn-play", "Measure every distance")}${button("knn-reset", "Reset")}</div>${status}
  </div>`;
  function initExactKnn(root) {
    let timer;
    let measured = 0;
    const measurements = root.querySelector(".knn-measurements");
    const neighbors = root.querySelector(".knn-neighbors");
    const play = root.querySelector('[data-action="knn-play"]');
    const message = root.querySelector(".knn-message");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function reset() {
      clearTimeout(timer);
      measured = 0;
      measurements.innerHTML = "";
      neighbors.innerHTML = "";
      root.dataset.phase = "ready";
      root.querySelector(".knn-count strong").textContent = "0";
      root.querySelectorAll(".knn-dot").forEach(dot => dot.classList.remove("is-measured"));
      play.disabled = false;
      play.textContent = "Measure every distance";
      message.textContent = "Measure from the viewer to each dot.";
      announce(root, "Ready. Each dot is a video vector. The diamond represents the viewer’s football interests.");
    }
    function measure() {
      // Stop work when the presenter navigates away during a scan.
      if (!root.isConnected) return;
      const p = videoPoints[measured];
      measurements.insertAdjacentHTML("beforeend", path(`M${query.x} ${query.y}L${p.x} ${p.y}`, cyan,1.3,`class="distance-ray" style="--delay:0ms"`));
      root.querySelector(`[data-point="${p.id}"]`).classList.add("is-measured");
      measured += 1;
      root.querySelector(".knn-count strong").textContent = measured;
      message.textContent = `Video ${measured}: distance ${p.distance.toFixed(1)} (plot units)`;
      if (measured < videoPoints.length) {
        timer = setTimeout(measure, reducedMotion ? 0 : 110);
      } else {
        root.dataset.phase = "complete";
        neighbors.innerHTML = closest.map((p,i) => circle(p.x,p.y,12,"none",cyan,'stroke-width="3" class="candidate-dot"') +
          label(String(i+1),p.x+18,p.y-9,{cls:"tiny",color:ink,align:"start"})).join("");
        message.textContent = "Every dot checked. The 5 closest are highlighted.";
        play.disabled = false;
        play.textContent = "Replay search";
        announce(root, "All 30 distances measured. The five closest videos are highlighted. k equals five means return five neighbors. How can we do this for billions of items? ANN reduces the search work.");
      }
    }
    play.addEventListener("click", () => {
      reset();
      root.dataset.phase = "scanning";
      play.disabled = true;
      play.textContent = "Measuring…";
      announce(root, "Measuring the distance to every video, one at a time.");
      measure();
    });
    root.querySelector('[data-action="knn-reset"]').addEventListener("click", reset);
    reset();
  }

  function networkChart() {
    const layers = [{ x:40, ys:[65,145,225] },{ x:230, ys:[35,105,175,245] },{ x:425, ys:[65,145,225] },{ x:615, ys:[145] }];
    const edges = layers.slice(0,-1).map((layer,i) => `<g class="network-edges layer-${i}">${layer.ys.map(y => layers[i+1].ys.map(y2 => path(`M${layer.x} ${y}L${layers[i+1].x} ${y2}`, "#66e7f260",2)).join("")).join("")}</g>`).join("");
    const nodes = layers.map((layer,i) => `<g class="network-nodes layer-${i}">${layer.ys.map(y => circle(layer.x,y,i===3 ? 30 : 14,"#152e37",i===3 ? red : cyan,'stroke-width="2"')).join("")}</g>`).join("");
    return canvas(675,305, edges+nodes+
      label("Inputs",40,292,{cls:"small",color:muted}) + label("Hidden 1",230,292,{cls:"small",color:muted}) + label("Hidden 2",425,292,{cls:"small",color:muted}) + label("Score",615,292,{cls:"small",color:muted}) +
      `<g class="network-output">${label("0.87",615,153,{cls:"node-title",color:ink})}</g>`,
      "A fully connected neural network with three inputs, two hidden layers with four and three neurons, and one output score of 0.87.");
  }
  visual.mlpRanking = () => `<div class="demo mlp-demo" data-phase="candidates">
    <div class="rank-content">
      <div class="rank-intake">
        <div class="intake-cards">${candidates.map(c=>card(c)).join("")}</div>
        <span class="intake-arrow" aria-hidden="true">→</span><div class="model-tile intake-model">MLP<small>One score per viewer + video</small></div>
        <p>ANN finds candidates. The MLP decides their order.</p>
      </div>
      <div class="rank-detail" hidden>
        <div class="candidate-focus">${card(candidates[0])}<span>Zoom into candidate A</span></div>
        <div class="network-detail"><div class="network-inputs"><span class="step-label">EXAMPLE INPUTS</span>
          <div>Recent watch history <b>Football interest: 0.90</b></div>
          <div>Video length <b>20 seconds</b></div>
          <div>Similarity score <b>0.91</b></div><small>Numeric features →</small>
        </div><div class="network-visual">${networkChart()}<p>Fully connected hidden layers</p></div></div>
        <p class="score-caption">Illustrative score for this viewer: <b>0.87</b></p>
      </div>
      <div class="rank-results" hidden>
        <div class="results-heading"><span class="step-label">SAME MLP · EACH VIEWER–VIDEO PAIR</span><h3 class="results-title">Five videos, five scores</h3><p>All scores are illustrative</p></div>
        <div class="scored-cards">${candidates.map((c,i) => `<div class="scored-row" data-id="${c.id}" style="--position:${i};--delay:${i*160}ms"><span class="rank-place">${i+1}</span>${card(c,true)}<span class="winner-label">Highest score · Play next</span></div>`).join("")}</div>
      </div>
    </div>
    <div class="demo-controls">${button("mlp-next", "Send into MLP →")}${button("mlp-reset", "Replay")}</div>${status}
  </div>`;
  function initMlpRanking(root) {
    let step = 0;
    const next = root.querySelector('[data-action="mlp-next"]');
    const intake = root.querySelector(".rank-intake");
    const model = intake.querySelector(".intake-model");
    const detail = root.querySelector(".rank-detail");
    const results = root.querySelector(".rank-results");
    function show(value) {
      step = value;
      root.dataset.phase = ["candidates", "entering", "network", "scored", "sorted"][step];
      intake.hidden = step > 1;
      detail.hidden = step !== 2;
      results.hidden = step < 3;
      next.textContent = ["Send into MLP →", "Zoom into one video →", "Score all five →", "Sort by score ↓", "Highest score first"][step];
      next.disabled = step === 4;
      root.querySelector(".results-title").textContent = step === 4 ? "Free-kick tips goes first" : "Five videos, five scores";
      root.querySelectorAll(".scored-row").forEach((row,i) => {
        const c = candidates[i];
        row.style.setProperty("--position", step === 4 ? c.rank : i);
        row.querySelector(".rank-place").textContent = step === 4 ? c.rank+1 : i+1;
        row.classList.toggle("top-ranked", step === 4 && c.rank === 0);
      });
      announce(root, ["Five football candidates A through E from ANN enter the ranking stage.", "The five cards move into the MLP. It scores each viewer–video pair.", "Zoom into A, Goal replay. Watch history, video length, and similarity are numeric inputs to fully connected hidden layers. The illustrative output score is 0.87.", "All five illustrative scores: A 0.87, B 0.94, C 0.72, D 0.81, E 0.63.", "Sorted highest to lowest: B, A, D, C, E. Free-kick tips with score 0.94 goes first."][step]);
    }
    next.addEventListener("click", () => {
      if (step === 0) {
        const target = model.getBoundingClientRect();
        const scale = target.width / model.offsetWidth;
        intake.querySelectorAll(".football-card").forEach((element) => {
          const card = element.getBoundingClientRect();
          element.style.setProperty("--mlp-dx", `${(target.left + target.width / 2 - card.left - card.width / 2) / scale}px`);
          element.style.setProperty("--mlp-dy", `${(target.top + target.height / 2 - card.top - card.height / 2) / scale}px`);
        });
      }
      show(Math.min(step + 1, 4));
    });
    root.querySelector('[data-action="mlp-reset"]').addEventListener("click", () => show(0));
    show(0);
  }
  Object.assign(window.DeckDemos, { feedPipeline: initPipeline, exactKnn: initExactKnn, mlpRanking: initMlpRanking });
})();
