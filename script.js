const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const resultText = document.getElementById("result");

const segments = [
    "$50,000 Shopping Spree 🛍️", "$10,000 Instant Cash 💵", "$1,000 Casino Chips 🎲", 
    "Luxury Dinner for Two 🍽️", "Free Spa & Wellness Treatment 💆‍♂️", "Brand New Sports Car 🚗💨", 
    "Dinner & Drinks with Casino Owner", "VIP Casino Experience 🎲", "3 FREE SPIN", 
    "$500 Bonus Money", "Free Hotel Stay (2 Nights, 5-Star) 🏨", "iPhone 16 Pro Max 📱"
];

// New colors: alternating green and white
const colors = ["#28a745", "#ffffff", "#28a745", "#ffffff", "#28a745", "#ffffff", "#28a745", "#ffffff", "#28a745", "#ffffff", "#28a745", "#ffffff"];

let startAngle = 0;
const arc = (2 * Math.PI) / segments.length;
let isSpinning = false;
let currentRotation = 0;

// Function to Draw the Wheel
function drawWheel(rotationAngle = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    for (let i = 0; i < segments.length; i++) {
        const angle = startAngle + i * arc;
        
        // Draw segment with new colors
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + arc);
        ctx.fill();
        ctx.stroke();

        // Draw centered text with new color
        drawSegmentText(segments[i], angle + arc / 2);
    }
    ctx.restore();
}

// Function to Draw Text Inside Each Segment
function drawSegmentText(text, angle) {
    ctx.save();
    ctx.fillStyle = "#006400";  // Dark green text color for contrast on white segments
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const radius = canvas.width / 2.5; // Position text inside segment
    const x = canvas.width / 2 + Math.cos(angle) * radius;
    const y = canvas.height / 2 + Math.sin(angle) * radius;

    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    
    // Break text into multiple lines if it's too long
    const words = text.split(" ");
    let line = "";
    let lines = [];
    
    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let testWidth = ctx.measureText(testLine).width;
        
        if (testWidth > 80 && line.length > 0) { // Limit width per line
            lines.push(line);
            line = words[i] + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line); // Push last line

    let textY = -((lines.length - 1) * 8); // Adjust vertical spacing
    for (let j = 0; j < lines.length; j++) {
        ctx.fillText(lines[j], 0, textY);
        textY += 16; // Move to next line
    }

    ctx.restore();
}

// Draw Wheel on Load
drawWheel();

// Spin Function
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    let randomRotation = Math.floor(3600 + Math.random() * 360); // Random spin
    let duration = 5000;
    let startTime = performance.now();

    function animate(time) {
        let elapsedTime = time - startTime;
        if (elapsedTime < duration) {
            let easeOut = 1 - Math.pow(1 - elapsedTime / duration, 3);
            currentRotation = easeOut * randomRotation;
            drawWheel(currentRotation * (Math.PI / 180)); // Convert degrees to radians
            requestAnimationFrame(animate);
        } else {
            currentRotation = randomRotation;
            drawWheel(currentRotation * (Math.PI / 180));

            setTimeout(() => {
                isSpinning = false;
                const index = Math.floor(((currentRotation % 360) / 360) * segments.length);
                resultText.innerText = "You won: " + segments[segments.length - index - 1];
                // After the spin finishes, show the receipt
                showReceipt(segments[segments.length - index - 1]);
            }, 1000); // Delay to ensure spin finishes first
        }
    }

    requestAnimationFrame(animate);
}

// Function to show the receipt
function showReceipt(winningPrize) {
    let mobileNumber = localStorage.getItem("mobileNumber");
    let reference = "REF" + Math.floor(100000 + Math.random() * 900000); // Generate random reference number

    document.getElementById("receiptMobile").innerText = mobileNumber;
    document.getElementById("referenceNumber").innerText = reference;
    document.getElementById("receiptPrize").innerText = winningPrize;

    // Display the receipt modal
    document.getElementById("receipt").style.display = "block";

    // Disable the spin button after the receipt is displayed
    document.getElementById("spin-btn").disabled = true;
    document.getElementById("spin-btn").style.backgroundColor = "#cccccc"; // Optional: change button color to indicate it's disabled
}

// Close receipt
function closeReceipt() {
    document.getElementById("receipt").style.display = "none";
}

spinBtn.addEventListener("click", spinWheel);
