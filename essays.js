 function getEssays() {
    const data = localStorage.getItem("essays");
    return data ? JSON.parse(data) : {};
  }

  function saveEssays(essays) {
    localStorage.setItem("essays", JSON.stringify(essays));
  }

  function saveEssay() {
    const title = document.getElementById("essayTitle").value.trim();
    const body = document.getElementById("essayInput").value.trim();
    if (!title || !body) {
      document.getElementById("status").textContent = "Title and essay body are required.";
      return;
    }

    const essays = getEssays();
    essays[title] = body;
    saveEssays(essays);

    document.getElementById("status").textContent = "Essay saved!";
    updateEssayList();
    clearInputFields();
  }

  function loadEssay(title) {
    const essays = getEssays();
    document.getElementById("essayTitle").value = title;
    document.getElementById("essayInput").value = essays[title];
    document.getElementById("status").textContent = `Loaded: "${title}"`;
  }

  function deleteEssay(title) {
    if (confirm(`Delete essay titled "${title}"?`)) {
      const essays = getEssays();
      delete essays[title];
      saveEssays(essays);
      updateEssayList();
      document.getElementById("status").textContent = `Deleted: "${title}"`;

      // Clear fields if the deleted essay was loaded
      const currentTitle = document.getElementById("essayTitle").value.trim();
      if (currentTitle === title) {
        clearInput();
      }
    }
  }

  function clearInputFields() {
    document.getElementById("essayTitle").value = "";
    document.getElementById("essayInput").value = "";
  }

  function clearInput() {
    clearInputFields();
    document.getElementById("status").textContent = "";
  }

  function updateEssayList() {
    const listContainer = document.getElementById("listContainer");
    const essays = getEssays();

    listContainer.innerHTML = "";
    Object.keys(essays).forEach(title => {
      const wrapper = document.createElement("div");
      wrapper.className = "essay-title";

      const titleSpan = document.createElement("span");
      titleSpan.textContent = title;
      titleSpan.style.cursor = "pointer";
      titleSpan.onclick = () => loadEssay(title);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.style.background = "#ffcccc";
      deleteBtn.style.color = "#900";
      deleteBtn.style.border = "none";
      deleteBtn.style.borderRadius = "5px";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.onclick = (e) => {
        e.stopPropagation(); // Don't trigger loadEssay
        deleteEssay(title);
      };

      wrapper.appendChild(titleSpan);
      wrapper.appendChild(deleteBtn);
      listContainer.appendChild(wrapper);
    });
  }

  function filterEssays() {
    const filter = document.getElementById("searchInput").value.toLowerCase();
    const items = document.querySelectorAll(".essay-title");

    items.forEach(item => {
      const match = item.textContent.toLowerCase().includes(filter);
      item.classList.toggle("hidden", !match);
    });
  }

  // Initialize
  updateEssayList();