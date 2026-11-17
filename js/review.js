(function review() {
  "use strict";

  const { visual } = window.DeckDiagrams;
  const demos = window.DeckDemos;
  const letters = "ABCD";

  const analysis = [
    ["Which method examines app code without running the app?",
      ["Dynamic analysis", "Static analysis", "Video ranking", "Ad targeting"], 1],
    ["What can a network trace show?",
      ["The app’s icon", "The language its code is written in", "A request sent by the app", "Which video the viewer enjoyed"], 2],
    ["What does retrieval do in a video feed?",
      ["Finds a shortlist of videos", "Puts the shortlist in order", "Plays the next video", "Records how long you watched"], 0],
    ["What does ranking do with the shortlist?",
      ["Collects videos from the whole library", "Records how long you watch", "Downloads the app", "Puts the videos in order"], 3],
    ["Which feature did we calculate from the AI clip?",
      ["The title of this talk", "The percentage of a video you watched", "The model’s final prediction", "The app’s permission screen"], 1]
  ];

  const privacy = [
    ["Which action could help explain why you saw an ad for rings?",
      ["Turning down the volume", "Charging your phone", "Searching online for rings", "Changing the screen brightness"], 2],
    ["Does seeing an ad after a conversation prove the app used your microphone?",
      ["Yes, if the ad appeared quickly", "Yes, if you saw the ad twice", "Yes, if the app has mic permission", "No, the ad alone doesn’t prove it"], 3],
    ["Where are videos ranked when an app uses server ranking?",
      ["On the server", "On your phone", "In your Wi-Fi router", "In your phone’s settings"], 0],
    ["What can stay on your phone with on-device ranking?",
      ["The entire video library", "Your viewing history", "The server’s logs", "Other viewers’ data"], 1],
    ["Where can you control an app’s access to your microphone?",
      ["Display settings", "Volume controls", "App permissions", "Battery settings"], 2]
  ];

  const references = [
    ["App analysis", [
      ["OWASP", "Mobile Security Testing Guide", "https://mas.owasp.org/MASTG/techniques/"],
      ["Android Open Source Project", "Android Runtime and DEX", "https://source.android.com/docs/core/runtime"],
      ["Oracle", "The javac compiler", "https://docs.oracle.com/en/java/javase/25/docs/specs/man/javac.html"],
      ["JADX and Frida", "Decompilation and runtime inspection", "https://github.com/skylot/jadx", "https://frida.re/docs/home/"]
    ]],
    ["Recommendations", [
      ["TikTok", "How TikTok recommends content", "https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content"],
      ["Google for Developers", "Recommendation systems", "https://developers.google.com/machine-learning/recommendation/overview/types"],
      ["Faiss", "Similarity search documentation", "https://faiss.ai/"],
      ["ByteDance", "Monolith recommendation system", "https://arxiv.org/abs/2209.07663"]
    ]],
    ["Ads and privacy", [
      ["Federal Trade Commission", "Cross-Device Tracking report", "https://www.ftc.gov/reports/cross-device-tracking-federal-trade-commission-staff-report-january-2017"],
      ["Federal Trade Commission", "CMG Active Listening complaint", "https://www.ftc.gov/system/files/ftc_gov/pdf/2423029c4838cmgfinalcomplaint.pdf"],
      ["Proceedings on Privacy Enhancing Technologies", "Panoptispy study", "https://petsymposium.org/popets/2018/popets-2018-0030.php"],
      ["Android Developers", "Microphone and camera access indicators", "https://developer.android.com/training/permissions/explaining-access"]
    ]]
  ];

  function addQuiz(name, questions, start) {
    const selected = Array(questions.length).fill(null);

    visual[name] = () => `<div class="quiz-sheet">
      <div class="quiz-list">${questions.map(([question, choices], index) => {
        const number = start + index;
        return `<section class="quiz-question" data-question="${index}" aria-labelledby="quiz-question-${number}">
          <h3 id="quiz-question-${number}"><span>${String(number).padStart(2, "0")}</span>${question}</h3>
          <div class="quiz-options">${choices.map((choice, option) => `<button type="button" data-answer="${option}" aria-pressed="false">
            <span class="quiz-letter">${letters[option]}</span><span>${choice}</span>
          </button>`).join("")}</div>
        </section>`;
      }).join("")}</div>
      <div class="quiz-footer">
        <span class="quiz-score"></span>
        <span class="quiz-feedback" role="status"></span>
        <button class="panel-button quiz-reset" type="button">Reset answers</button>
      </div>
    </div>`;

    demos[name] = (root) => {
      const rows = [...root.querySelectorAll(".quiz-question")];
      const feedback = root.querySelector(".quiz-feedback");

      function renderSelections() {
        let correct = 0;
        rows.forEach((row, index) => {
          const answer = questions[index][2];
          row.querySelectorAll("button").forEach((button, option) => {
            const pressed = selected[index] === option;
            button.setAttribute("aria-pressed", String(pressed));
            if (pressed) {
              button.dataset.result = option === answer ? "correct" : "incorrect";
              if (option === answer) correct++;
            } else {
              delete button.dataset.result;
            }
          });
        });
        root.querySelector(".quiz-score").textContent = `${correct} / ${questions.length} correct`;
      }

      root.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.classList.contains("quiz-reset")) {
          selected.fill(null);
          feedback.textContent = "Answers cleared.";
        } else {
          const index = Number(button.closest(".quiz-question").dataset.question);
          selected[index] = Number(button.dataset.answer);
          feedback.textContent = selected[index] === questions[index][2]
            ? `Question ${start + index} is correct.`
            : `Try another answer for question ${start + index}.`;
        }
        renderSelections();
      });

      renderSelections();
    };
  }

  addQuiz("quizAnalysis", analysis, 1);
  addQuiz("quizPrivacy", privacy, 6);

  visual.references = () => `<div class="reference-grid">${references.map(([heading, items]) =>
    `<section class="reference-group"><h3>${heading}</h3><ul>${items.map(([source, title, url, extra]) =>
      `<li><span>${source}</span><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>${extra
        ? `<a href="${extra}" target="_blank" rel="noopener noreferrer">Frida documentation</a>` : ""}</li>`
    ).join("")}</ul></section>`
  ).join("")}</div>`;
})();
