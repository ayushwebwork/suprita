// ========================================
// Cloudinary Configuration
// ========================================

const CLOUD_NAME = "pmcoybqz";
const UPLOAD_PRESET = "sainathpreset";

let resumeUploaded = false;

// ========================================
// Elements
// ========================================

const form = document.getElementById("careerForm");

const uploadZone = document.getElementById("uploadZone");
const fileInput = document.getElementById("resume");

const resumeUrl = document.getElementById("resume_url");

const progress = document.getElementById("uploadProgress");
const progressBar = document.getElementById("uploadBar");

const resumeName = document.getElementById("resumeName");

// ========================================
// Click Upload
// ========================================

uploadZone.addEventListener("click", () => fileInput.click());

// ========================================
// File Selected
// ========================================

fileInput.addEventListener("change", function () {

    if (this.files.length)
        uploadResume(this.files[0]);

});

// ========================================
// Drag & Drop
// ========================================

uploadZone.addEventListener("dragover", function (e) {

    e.preventDefault();
    uploadZone.classList.add("dragging");

});

uploadZone.addEventListener("dragleave", function () {

    uploadZone.classList.remove("dragging");

});

uploadZone.addEventListener("drop", function (e) {

    e.preventDefault();

    uploadZone.classList.remove("dragging");

    const file = e.dataTransfer.files[0];

    if (file)
        uploadResume(file);

});

// ========================================
// Upload Resume
// ========================================

function uploadResume(file) {

    const allowedTypes = [

        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    ];

    if (!allowedTypes.includes(file.type)) {

        alert("Only PDF, DOC and DOCX files are allowed.");

        return;

    }

    if (file.size > 10 * 1024 * 1024) {

        alert("Maximum file size is 10 MB.");

        return;

    }

    progress.classList.remove("d-none");

    progressBar.style.width = "0%";
    progressBar.innerHTML = "0%";

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();

    xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`
    );

    xhr.upload.addEventListener("progress", function (e) {

        if (e.lengthComputable) {

            const percent = Math.round((e.loaded / e.total) * 100);

            progressBar.style.width = percent + "%";
            progressBar.innerHTML = percent + "%";

        }

    });

    xhr.onload = function () {

        if (xhr.status === 200) {

            const response = JSON.parse(xhr.responseText);

            resumeUploaded = true;

            resumeUrl.value = response.secure_url;

            progressBar.innerHTML = "Uploaded ✓";

            uploadZone.classList.add("uploaded");

            resumeName.classList.remove("d-none");

            resumeName.querySelector("span").innerHTML = file.name;

        }
        else {

            resumeUploaded = false;

            progress.classList.add("d-none");

            alert("Resume upload failed.");

        }

    };

    xhr.onerror = function () {

        resumeUploaded = false;

        progress.classList.add("d-none");

        alert("Upload failed. Please try again.");

    };

    xhr.send(formData);

}

// ========================================
// Form Submit
// ========================================

form.addEventListener("submit", function (e) {

    if (!resumeUploaded) {

        e.preventDefault();

        alert("Please upload your resume before submitting.");

        return;

    }

});