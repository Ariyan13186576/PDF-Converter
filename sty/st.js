
    document.getElementById('imageInput').addEventListener('change', previewImages);
    document.getElementById('convertButton').addEventListener('click', convertToPDF);

    function previewImages(event) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';
        const files = event.target.files;

        for (const file of files) {
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100px';
                    img.style.margin = '5px';
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload only image files (JPEG, JPG, PNG).');
            }
        }
    }

    async function convertToPDF() {
        if (!window.jspdf) {
            alert('jsPDF library is not loaded. Ensure the library is included.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const files = document.getElementById('imageInput').files;

        if (!files.length) {
            alert('Please upload at least one image.');
            return;
        }

        const pdf = new jsPDF();

        for (let i = 0; i < files.length; i++) {
            await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = new Image();
                    img.onload = function () {
                        const width = pdf.internal.pageSize.getWidth();
                        const height = (img.height * width) / img.width;
                        if (i > 0) pdf.addPage();
                        pdf.addImage(img, 'JPEG', 0, 0, width, height);
                        resolve();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(files[i]);
            });
        }

        pdf.save('Nazmus Sakib.pdf');
    }
