/**
 * designer.js
 * Handles the T-Shirt customization logic using Canvas.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('design-canvas');
    const ctx = canvas.getContext('2d');
    const tshirtContainer = document.getElementById('tshirt-preview-box');

    // State
    let uploadedImage = null;
    let customText = '';
    let textColor = '#ffffff';
    let shirtColor = '#ffffff';

    // Resize canvas to match container (simple approach)
    // In a real app we'd handle resizing more robustly
    canvas.width = 200;
    canvas.height = 300;

    // Event Listeners
    document.getElementById('tshirt-color').addEventListener('input', (e) => {
        shirtColor = e.target.value;
        tshirtContainer.style.backgroundColor = shirtColor;
    });

    document.getElementById('image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    uploadedImage = img;
                    drawBadge(); // Re-draw
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('custom-text').addEventListener('input', (e) => {
        customText = e.target.value;
        drawBadge();
    });

    document.getElementById('text-color').addEventListener('input', (e) => {
        textColor = e.target.value;
        drawBadge();
    });

    document.getElementById('add-design-btn').addEventListener('click', () => {
        saveDesign();
    });

    function drawBadge() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Image
        if (uploadedImage) {
            // Scale to fit center
            const aspect = uploadedImage.width / uploadedImage.height;
            const w = 150;
            const h = w / aspect;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2 - 20;
            ctx.drawImage(uploadedImage, x, y, w, h);
        }

        // Draw Text
        if (customText) {
            ctx.fillStyle = textColor;
            ctx.font = "20px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(customText, canvas.width / 2, canvas.height - 30);
        }
    }

    function saveDesign() {
        // In a real app, we'd save the canvas dataURL
        // For this prototype, we mock adding a custom product

        // Create a unique mockup image from the canvas + container ? 
        // Just simulating it by creating a custom product in cart.

        Store.addToCart({
            productId: 'custom-' + Date.now(),
            name: 'Custom Design',
            price: 60.00,
            image: 'assets/images/tee1.png', // Fallback
            isCustom: true,
            variant: {
                color: shirtColor,
                size: document.getElementById('size-select').value,
                customPreview: canvas.toDataURL() // Save the design
            },
            quantity: 1
        });

        alert('Custom Design Added to Cart!');
        // Redirect or update UI
        window.location.href = 'cart.html';
    }

    // Initial draw
    drawBadge();
});
