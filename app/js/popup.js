window.onload = function () {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "popup_open" });
  });

  document.getElementsByClassName("analyze-button")[0].onclick = function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "analyze_site" });
    });
  };

  document.getElementsByClassName("link")[0].onclick = function () {
    chrome.tabs.create({
      url: document.getElementsByClassName("link")[0].getAttribute("href"),
    });
  };
};

// Function to update the pie chart
function updatePieChart(dpArray) {
  // Get the container element for the chart
  const chartContainer = document.getElementById('darkPatternChart');

  // Create a new div element for the chart
  const chartDiv = document.createElement('div');
  chartDiv.id = 'apexChart';
  chartContainer.appendChild(chartDiv);

  // Prepare data for ApexCharts
  const chartData = {
    labels: [
      'Sneaking',
      'Urgency',
      'Misdirection',
      'Social Proof',
      'Scarcity',
      'Obstruction',
      'Forced Action',
      'Other',
    ],
    series: dpArray,
  };

  // Configure ApexCharts
  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: chartData.labels,
    series: chartData.series,
    colors: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4CAF50',
      '#FF9800',
      '#9C27B0',
      '#607D8B',
      '#BDBDBD', // Color for 'Other'
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  // Initialize and render the ApexCharts
  const apexChart = new ApexCharts(chartDiv, chartOptions);
  apexChart.render();
}


// Listen for messages from content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'update_current_count') {
    document.getElementsByClassName('number')[0].textContent = request.count;
    updatePieChart(request.dpArray);
  }
});
