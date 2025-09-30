
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById('woundChart').getContext('2d');

  new Chart(ctx, {
    type: 'line', // still "line"
    data: window.chartData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Wound Healing Progress (Area Graph)'
        }
      },
      elements: {
        line: {
          tension: 0.3 // optional, makes the line curved
        }
      }
    }
  });
});
