document.addEventListener("DOMContentLoaded", () => {
  const projectContainer = document.getElementById("projects");
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = "Loading...";
  projectContainer.appendChild(loader);

  // Fetch project data from a JSON file
  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch projects.");
      }
      return response.json();
    })
    .then((projects) => {
      loader.remove(); // Remove the loader after fetching
      projects.forEach((project) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${project.image}" alt="${project.name}">
          <h3>${project.name}</h3>
          <p><strong>&nbsp;Language:</strong> ${project.language}</p>
          <p><strong>&nbsp;Tools:</strong> ${project.tools}</p>
          <button onclick="downloadFile('${project.zipFile}')">Download</button>
        `;
        projectContainer.appendChild(card);
      });
    })
    .catch((error) => {
      loader.remove();
      showPopup("Sorry! Failed to load projects. Please try again later.");
      console.error("Error loading projects:", error);
    });
});

function downloadFile(fileUrl) {
  const isGitHubUrl = fileUrl.includes("github.com");

  if (isGitHubUrl) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop(); // Extract the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showPopup("Successfully Downloaded!");
  } else {
    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("File not found.");
        }
        return response.blob();
      })
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileUrl.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showPopup("Successfully Downloaded!");
      })
      .catch((error) => {
        showPopup("Sorry! Unable to download the file.");
        console.error("Download error:", error);
      });
  }
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("fade-out");
    popup.addEventListener("transitionend", () => popup.remove());
  }, 2000);
}

// EmailJS Integration

(function(){
  emailjs.init({
    publicKey: "1Y5JFAYIamVv5ezPe",
  });
})();



document.getElementById('contactForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = {
    from_name: document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    mobile: document.getElementById('mobile').value,
    project_title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    tools: document.getElementById('tools').value,
  };
  console.log('Form Data:', formData);

  emailjs.send('service_noi9z4c', 'template_l5iy4sv', formData)
    .then((response) => {
      console.log('SUCCESS!', response);
      showPopup('Form submitted successfully! We will get back to you shortly.');
    })
    .catch((error) => {
      console.error('FAILED...', error);
      showPopup('Something went wrong. Please try again later.');
    });
});

