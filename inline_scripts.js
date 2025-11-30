
        // Create floating particles for cyber effect
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random properties
                const size = Math.random() * 5 + 1;
                const posX = Math.random() * 100;
                const delay = Math.random() * 15;
                const duration = Math.random() * 10 + 15;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.animationDelay = `${delay}s`;
                particle.style.animationDuration = `${duration}s`;
                
                particlesContainer.appendChild(particle);
            }
        }
        
        // Initialize particles
        createParticles();
        
        const fileInput = document.getElementById('fileInput');
        const uploadedFilesList = document.getElementById('uploadedFilesList');
        const resultBox = document.getElementById('downloadResult');
        const createButton = document.getElementById('createWebsiteBtn');
        const linkElement = document.getElementById('websiteLink');
        const linkTextElement = document.getElementById('websiteLinkText');
        const messageElement = document.getElementById('message');
        const toggleCodeBtn = document.getElementById('toggleCodeBtn');
        const codeEditorSection = document.getElementById('codeEditorSection');
        const codeTabs = document.querySelectorAll('.code-tab');
        const htmlEditor = document.getElementById('htmlEditor');
        const cssEditor = document.getElementById('cssEditor');
        const jsEditor = document.getElementById('jsEditor');
        const saveCodeBtn = document.getElementById('saveCodeBtn');
        const clearCodeBtn = document.getElementById('clearCodeBtn');

        // Event listener to show file names when selected
        fileInput.addEventListener('change', () => {
            const files = fileInput.files;
            uploadedFilesList.innerHTML = '';
            
            if (files.length > 0) {
                let listHtml = '<strong>Uploaded Files:</strong><br>';
                for (let i = 0; i < files.length; i++) {
                    listHtml += `<i class="fas fa-file" style="margin-right: 5px; color: var(--primary);"></i>${files[i].name}<br>`;
                }
                uploadedFilesList.innerHTML = listHtml;
            }
            // Clear message/result when files are changed
            messageElement.textContent = '';
            resultBox.style.display = 'none';
        });

        // Add drag and drop functionality
        const fileUploadBox = document.querySelector('.file-upload-box');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadBox.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadBox.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadBox.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            fileUploadBox.style.borderColor = 'var(--primary)';
            fileUploadBox.style.boxShadow = '0 0 20px var(--primary)';
        }
        
        function unhighlight() {
            fileUploadBox.style.borderColor = 'rgba(0, 255, 255, 0.5)';
            fileUploadBox.style.boxShadow = 'none';
        }
        
        fileUploadBox.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            
            // Trigger change event
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }

        // Toggle code editor visibility
        toggleCodeBtn.addEventListener('click', () => {
            if (codeEditorSection.style.display === 'block') {
                codeEditorSection.style.display = 'none';
                toggleCodeBtn.innerHTML = '<i class="fas fa-code" style="margin-right: 8px;"></i>Add Code Manually';
            } else {
                codeEditorSection.style.display = 'block';
                toggleCodeBtn.innerHTML = '<i class="fas fa-times" style="margin-right: 8px;"></i>Hide Code Editor';
            }
        });

        // Code tab switching
        codeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                codeTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all editors
                htmlEditor.style.display = 'none';
                cssEditor.style.display = 'none';
                jsEditor.style.display = 'none';
                
                // Show the selected editor
                const tabType = tab.getAttribute('data-tab');
                document.getElementById(`${tabType}Editor`).style.display = 'block';
            });
        });

        // Save code button
        saveCodeBtn.addEventListener('click', () => {
            const htmlCode = htmlEditor.value;
            const cssCode = cssEditor.value;
            const jsCode = jsEditor.value;
            
            if (htmlCode || cssCode || jsCode) {
                messageElement.textContent = "Code saved successfully!";
                messageElement.style.color = "var(--primary)";
                
                // Store code in localStorage
                const siteName = document.getElementById('sitename').value.trim();
                if (siteName) {
                    if (htmlCode) localStorage.setItem(`site_${siteName}_index.html`, htmlCode);
                    if (cssCode) localStorage.setItem(`site_${siteName}_style.css`, cssCode);
                    if (jsCode) localStorage.setItem(`site_${siteName}_script.js`, jsCode);
                }
            } else {
                messageElement.textContent = "No code to save!";
                messageElement.style.color = "var(--accent)";
            }
            
            setTimeout(() => {
                messageElement.textContent = '';
            }, 3000);
        });

        // Clear code button
        clearCodeBtn.addEventListener('click', () => {
            htmlEditor.value = '';
            cssEditor.value = '';
            jsEditor.value = '';
            messageElement.textContent = "Code editor cleared!";
            messageElement.style.color = "var(--accent)";
            
            setTimeout(() => {
                messageElement.textContent = '';
            }, 3000);
        });

        async function createWebsite() {
            // Reset message and hide previous result
            messageElement.textContent = '';
            resultBox.style.display = 'none';

            const name = document.getElementById('sitename').value.trim();
            const files = fileInput.files;
            
            // Validation checks
            if (!name) {
                messageElement.textContent = "Please enter your website name!";
                return;
            }
            if (files.length === 0 && !htmlEditor.value) {
                messageElement.textContent = "Please choose at least one file to upload (.html, .css, or .js) or add code manually!";
                return;
            }
            if (name.includes(' ') || !/^[a-zA-Z0-9_-]+$/.test(name)) {
                messageElement.textContent = "Website name can only contain letters, numbers, hyphens (-) and underscores (_), and no spaces.";
                return;
            }

            const hasHtmlFile = Array.from(files).some(file => file.name.endsWith('.html'));
            if (!hasHtmlFile && !htmlEditor.value) {
                messageElement.textContent = "Please include at least one HTML file (e.g., index.html) or add HTML code manually.";
                return;
            }

            messageElement.textContent = "Processing and saving files... Please wait.";
            createButton.disabled = true;

            try {
                // Process and save all uploaded files
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileContent = await file.text();
                    localStorage.setItem(`site_${name}_${file.name}`, fileContent);
                }
                
                // If manual code was added, save it too
                if (htmlEditor.value) {
                    localStorage.setItem(`site_${name}_index.html`, htmlEditor.value);
                }
                if (cssEditor.value) {
                    localStorage.setItem(`site_${name}_style.css`, cssEditor.value);
                }
                if (jsEditor.value) {
                    localStorage.setItem(`site_${name}_script.js`, jsEditor.value);
                }
                
                const link = window.location.origin + "/view.html?site=" + encodeURIComponent(name);

                // Update the success box
                linkTextElement.textContent = link;
                linkElement.href = link;
                
                // --- Display Success ---
                // 1. Clear processing message
                messageElement.textContent = ''; 
                
                // 2. Show the success box below the button (Correct placement)
                resultBox.style.display = 'block';

            } catch (error) {
                console.error("Website creation error:", error);
                messageElement.textContent = "An error occurred during file processing. Please try again.";
            } finally {
                createButton.disabled = false;
            }
        }
        
        // Attach the createWebsite function to the button
        createButton.addEventListener('click', createWebsite);
    