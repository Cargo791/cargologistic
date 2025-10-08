window.addEventListener("scroll", () => {
  const nav = document.querySelector(".ghost");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});


const form = document.getElementById("trackingForm");
const resultDiv = document.getElementById("trackingResult");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const trackingId = document.getElementById("trackingId").value.trim();
  resultDiv.innerHTML = `<p class="text-gray-600">Tracking package...</p>`;

  try {
    const response = await fetch("https://cargoship.onrender.com/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingId }),
    });

    const data = await response.json();

    if (response.ok) {
      // Determine progress percent
      let percentage = 50;
      let statusColor = "bg-blue-500";

      if (data.progressStage === "picked_up") percentage = 25;
      else if (data.progressStage === "in_transit") percentage = 60;
      else if (data.progressStage === "out_for_delivery") percentage = 85;
      else if (data.progressStage === "delivered") {
        percentage = 100;
        statusColor = "bg-green-500";
      }

      resultDiv.innerHTML = `
        <div class="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl transition-all duration-700">
          
          <!-- Progress bar -->
          <div class="relative w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div id="progressBar" 
                 class="${statusColor} h-4 rounded-full transition-all duration-[2000ms]" 
                 style="width: 0%;">
            </div>
          </div>
          <p class="text-sm text-gray-600 text-right mb-4">${percentage}% complete</p>

          <!-- Shipment Info -->
          <h2 class="text-lg font-bold text-gray-800 mb-3">Shipment Details</h2>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Current Location:</strong> ${data.location}</p>
          <p><strong>ETA:</strong> ${data.eta}</p>

          <hr class="my-4">

          <h3 class="text-md font-semibold text-gray-700 mb-2">Sender</h3>
          <p><strong>Name:</strong> ${data.senderName}</p>
          <p><strong>Email:</strong> ${data.senderEmail}</p>
          <p><strong>Phone:</strong> ${data.senderPhone}</p>
          <p><strong>Address:</strong> ${data.senderAddress}</p>

          <hr class="my-4">

          <h3 class="text-md font-semibold text-gray-700 mb-2">Receiver</h3>
          <p><strong>Name:</strong> ${data.receiverName}</p>
          <p><strong>Email:</strong> ${data.receiverEmail}</p>
          <p><strong>Phone:</strong> ${data.receiverPhone}</p>
          <p><strong>Address:</strong> ${data.receiverAddress}</p>

          <hr class="my-4">

          <h3 class="text-md font-semibold text-gray-700 mb-2">Package Info</h3>
          <p><strong>Description:</strong> ${data.packageDescription}</p>
          <p><strong>Weight:</strong> ${data.packageWeight} kg</p>

          <hr class="my-6">

          <!-- Timeline -->
          <div class="flex justify-between items-center text-sm font-medium text-gray-600">
            <div class="flex flex-col items-center">
              <div class="w-4 h-4 rounded-full mb-1 ${data.progressStage === 'picked_up' || data.progressStage !== 'picked_up' ? 'bg-green-500' : 'bg-gray-300'}"></div>
              Picked Up
            </div>
            <div class="flex-1 h-[2px] bg-gray-300 mx-2"></div>
            <div class="flex flex-col items-center">
              <div class="w-4 h-4 rounded-full mb-1 ${['in_transit','out_for_delivery','delivered'].includes(data.progressStage) ? 'bg-green-500' : 'bg-gray-300'}"></div>
              In Transit
            </div>
            <div class="flex-1 h-[2px] bg-gray-300 mx-2"></div>
            <div class="flex flex-col items-center">
              <div class="w-4 h-4 rounded-full mb-1 ${['out_for_delivery','delivered'].includes(data.progressStage) ? 'bg-green-500' : 'bg-gray-300'}"></div>
              Out for Delivery
            </div>
            <div class="flex-1 h-[2px] bg-gray-300 mx-2"></div>
            <div class="flex flex-col items-center">
              <div class="w-4 h-4 rounded-full mb-1 ${data.progressStage === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}"></div>
              Delivered
            </div>
          </div>
        </div>
      `;

      // Animate progress bar
      setTimeout(() => {
        document.getElementById("progressBar").style.width = percentage + "%";
      }, 300);
    } else {
      resultDiv.innerHTML = `<div class="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">${data.message}</div>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<div class="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">Error connecting to API</div>`;
  }
});
