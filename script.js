const MAX_LINES_PER_LOAD = 15000; // TO PREVENT THE BROWSER TO STOP BECAUSE OF LARGE FILES & MEMORY

function handleFileInputChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileContents = document.getElementById("fileContents");
  const loader = document.getElementById("loader");
  const searchInput = document.getElementById("searchInput");
  const noDataMessage = document.getElementById("noDataMessage");

  loader.style.display = "block";
  fileContents.innerHTML = "";
  noDataMessage.style.display = "none";
  searchInput.style.display = "block";

  let offset = 0;
  let entryCount = 0;
  let allLines = [];

  function readChunk() {
    const slice = file.slice(offset, offset + MAX_LINES_PER_LOAD);
    const reader = new FileReader();

    reader.onload = function (event) {
      const text = event.target.result;
      const lines = text.split("\n");

      allLines = allLines.concat(lines);

      const query = searchInput.value.toLowerCase();
      const filteredLines = filterLines(query);

      if (filteredLines.length === 0) {
        noDataMessage.style.display = "block";
      } else {
        noDataMessage.style.display = "none";
      }

      const fragment = document.createDocumentFragment();
      filteredLines.forEach((line) => {
        if (line.trim() !== "") {
          const parts = line.trim().split(",");
          const formattedLine = `${entryCount + 1}) ${parts[0]} ${
            parts[1]
          } | ${parts[2]},${parts[3]},${parts[4]} | ${parts[5]} | ${
            parts[6]
          }`;
          const entry = document.createElement("div");
          entry.className = "formatted-entry";
          entry.innerHTML = `<p>${formattedLine}</p>`;
          fragment.appendChild(entry);
          entryCount++;
        }
      });

      fileContents.appendChild(fragment);
      offset += MAX_LINES_PER_LOAD;

      if (offset < file.size) {
        loader.style.display = "none";
      } else {
        loader.style.display = "none";
      }
    };

    reader.readAsText(slice);
  }

  function filterLines(query) {
    const queryWords = query.split(" ").filter((word) => word.trim() !== "");

    return allLines.filter((line) => {
      const lineLowerCase = line.toLowerCase();
      return queryWords.every((word) => lineLowerCase.includes(word));
    });
  }

  readChunk();

  fileContents.addEventListener("scroll", function () {
    if (
      fileContents.scrollTop + fileContents.clientHeight >=
      fileContents.scrollHeight
    ) {
      readChunk();
    }
  });

  let searchTimeout;

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
      const query = searchInput.value.toLowerCase();
      const filteredLines = filterLines(query);

      if (filteredLines.length === 0) {
        noDataMessage.style.display = "block";
      } else {
        noDataMessage.style.display = "none";
      }

      fileContents.innerHTML = "";
      const fragment = document.createDocumentFragment();
      filteredLines.forEach((line) => {
        if (line.trim() !== "") {
          const parts = line.trim().split(",");
          const formattedLine = `${entryCount + 1}) ${parts[0]} ${
            parts[1]
          } | ${parts[2]},${parts[3]},${parts[4]} | ${parts[5]} | ${
            parts[6]
          }`;
          const entry = document.createElement("div");
          entry.className = "formatted-entry";
          entry.innerHTML = `<p>${formattedLine}</p>`;
          fragment.appendChild(entry);
          entryCount++;
        }
      });
      fileContents.appendChild(fragment);
    }, 300);
  });
}

const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", handleFileInputChange);
